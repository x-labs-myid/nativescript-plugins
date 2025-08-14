import { PhoneNumberFieldCommon, accentColorProperty, borderColorProperty, countryButtonBackgroundColorProperty, countryButtonTextColorProperty, countryButtonBorderRadiusProperty, countryButtonPaddingProperty } from './common';
import { TextField } from '@nativescript/core';
import { CountryCode } from 'libphonenumber-js';

export class PhoneNumberField extends PhoneNumberFieldCommon {
  nativeViewProtected: android.widget.LinearLayout;
  private _textField: TextField;
  private _countryButton: android.widget.Button;
  private _editText: android.widget.EditText;
  private _layoutDrawable: android.graphics.drawable.GradientDrawable;

  // Tambahkan property accentColor dan borderColor
  public accentColor: string = '#007bff';
  public borderColor: string = '#dee2e6';

  // Tambahkan property untuk styling tombol country picker
  public countryButtonBackgroundColor: string = '#007bff';
  public countryButtonTextColor: string = '#ffffff';
  public countryButtonBorderRadius: number = 6;
  public countryButtonPadding: number = 8;

  public createNativeView(): android.widget.LinearLayout {
    const context = this._context;
    const layout = new android.widget.LinearLayout(context);
    layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);

    // Apply styling to layout
    const mainLayoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
    mainLayoutParams.setMargins(20, 20, 20, 20);
    layout.setLayoutParams(mainLayoutParams);

    // Set background and border - simpan reference ke drawable
    this._layoutDrawable = new android.graphics.drawable.GradientDrawable();
    this._layoutDrawable.setColor(android.graphics.Color.parseColor('#f8f9fa'));
    this._layoutDrawable.setStroke(8, android.graphics.Color.parseColor(this.borderColor || '#dee2e6')); // Ubah dari 2 menjadi 6
    this._layoutDrawable.setCornerRadius(24);
    layout.setBackground(this._layoutDrawable);
    layout.setPadding(36, 36, 36, 36); // 12dp * 3 = 36px

    // Country picker button styling
    this._countryButton = new android.widget.Button(context);
    this._countryButton.setText(this.countryCode || 'ID');

    // Button styling
    const buttonDrawable = new android.graphics.drawable.GradientDrawable();
    buttonDrawable.setColor(android.graphics.Color.parseColor('#007bff'));
    buttonDrawable.setCornerRadius(18); // 6dp * 3 = 18px
    this._countryButton.setBackground(buttonDrawable);
    this._countryButton.setTextColor(android.graphics.Color.WHITE);
    this._countryButton.setPadding(24, 24, 24, 24); // 8dp * 3 = 24px

    // EditText styling
    this._editText = new android.widget.EditText(this._context);
    this._editText.setTextSize(16);
    this._editText.setPadding(24, 0, 0, 0);

    // Apply accent color from CSS
    this.applyAccentColor();

    // Use TYPE_CLASS_NUMBER instead of TYPE_CLASS_PHONE to avoid RTL issues
    this._editText.setInputType(android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL);

    this._editText.setHint('Enter phone number');

    // CRITICAL: Force LTR direction with multiple approaches
    if (android.os.Build.VERSION.SDK_INT >= 17) {
      this._editText.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
      this._editText.setTextDirection(android.view.View.TEXT_DIRECTION_LTR);
      this._editText.setTextAlignment(android.view.View.TEXT_ALIGNMENT_VIEW_START);
    }

    // Force text alignment and gravity
    this._editText.setGravity(android.view.Gravity.LEFT | android.view.Gravity.CENTER_VERTICAL);

    // IMPORTANT: Set locale to force LTR behavior
    if (android.os.Build.VERSION.SDK_INT >= 24) {
      const localeArray = Array.create(java.util.Locale, 1);
      localeArray[0] = java.util.Locale.US;
      const localeList = new android.os.LocaleList(localeArray);
      this._editText.setTextLocales(localeList);
    } else if (android.os.Build.VERSION.SDK_INT >= 23) {
      this._editText.setTextLocale(java.util.Locale.US);
    }

    // Rename variable untuk EditText layout parameters
    const editTextLayoutParams = new android.widget.LinearLayout.LayoutParams(0, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, 1.0);

    layout.addView(this._countryButton);
    layout.addView(this._editText, editTextLayoutParams);

    return layout;
  }

  public initNativeView(): void {
    super.initNativeView();

    // Additional RTL prevention settings
    if (this._editText) {
      // Force IME options for LTR
      this._editText.setImeOptions(android.view.inputmethod.EditorInfo.IME_ACTION_DONE | android.view.inputmethod.EditorInfo.IME_FLAG_NO_EXTRACT_UI | android.view.inputmethod.EditorInfo.IME_FLAG_FORCE_ASCII);

      // Additional direction enforcement
      this._editText.setFilters([new android.text.InputFilter.LengthFilter(20)]);

      // Ensure proper text direction
      if (android.os.Build.VERSION.SDK_INT >= 23) {
        this._editText.setBreakStrategy(android.text.Layout.BREAK_STRATEGY_SIMPLE);
      }
    }

    this.setupTextChangeListener();
    this.setupCountryPickerListener();

    // Sync initial values
    if (this.text) {
      this._editText.setText(this.text);
    }

    // Set initial country button with flag and dial code
    const currentCountryCode = this.countryCode || 'ID';
    const countries = this.getAvailableCountries();
    const currentCountry = countries.find((c) => c.code === currentCountryCode);
    if (currentCountry) {
      this._countryButton.setText(`${currentCountry.flag} ${currentCountry.dialCode}`);
    } else {
      this._countryButton.setText(currentCountryCode);
    }
  }

  private setupTextChangeListener(): void {
    const textWatcher = new android.text.TextWatcher({
      beforeTextChanged: (s: any, start: number, count: number, after: number) => {
        console.log('beforeTextChanged:', { start, count, after, text: s.toString() });
      },
      onTextChanged: (s: any, start: number, before: number, count: number) => {
        console.log('onTextChanged:', { start, before, count, text: s.toString() });
        console.log('Selection:', this._editText.getSelectionStart(), this._editText.getSelectionEnd());
      },
      afterTextChanged: (s: any) => {
        const newText = s.toString();
        console.log('afterTextChanged:', newText);

        // CRITICAL: Check if text is being reversed (RTL behavior)
        const cursorPos = this._editText.getSelectionStart();
        console.log('Cursor position:', cursorPos);

        // If cursor is at 0 and we have text, this indicates RTL behavior
        if (cursorPos === 0 && newText.length > 0) {
          console.log('RTL behavior detected, fixing...');

          // Temporarily remove listener
          this._editText.removeTextChangedListener(textWatcher);

          // Force cursor to end
          this._editText.setSelection(newText.length);

          // Re-add listener
          this._editText.addTextChangedListener(textWatcher);
        }

        // Apply auto masking if enabled
        if (this.autoMask) {
          const maskedText = this.applyMask(newText);
          if (maskedText !== newText) {
            console.log('Masking:', { original: newText, masked: maskedText });

            // Calculate proper cursor position
            let newCursorPos = maskedText.length;

            // If we had a valid cursor position, try to maintain it
            if (cursorPos > 0) {
              // Count digits up to cursor position
              let digitCount = 0;
              for (let i = 0; i < Math.min(cursorPos, newText.length); i++) {
                if (/\d/.test(newText[i])) {
                  digitCount++;
                }
              }

              // Find position of nth digit in masked text
              let foundDigits = 0;
              for (let i = 0; i < maskedText.length; i++) {
                if (/\d/.test(maskedText[i])) {
                  foundDigits++;
                  if (foundDigits === digitCount) {
                    newCursorPos = i + 1;
                    break;
                  }
                }
              }
            }

            this._editText.removeTextChangedListener(textWatcher);
            this._editText.setText(maskedText);
            this._editText.setSelection(Math.min(newCursorPos, maskedText.length));
            this._editText.addTextChangedListener(textWatcher);

            this.text = maskedText;
            return;
          }
        }

        this.text = newText;
      },
    });

    this._editText.addTextChangedListener(textWatcher);
  }

  private setupCountryPickerListener(): void {
    this._countryButton.setOnClickListener(
      new android.view.View.OnClickListener({
        onClick: (v: android.view.View) => {
          this.openCountryPicker();
        },
      }),
    );
  }

  private openCountryPicker(): void {
    if (!this.showCountryPicker) return;

    const countries = this.getAvailableCountries().sort((a, b) => a.name.localeCompare(b.name));
    const countryNames = countries.map((c) => `${c.flag} ${c.name} (${c.dialCode})`);

    const builder = new android.app.AlertDialog.Builder(this._context);
    builder.setTitle('Select Country');
    builder.setItems(
      countryNames,
      new android.content.DialogInterface.OnClickListener({
        onClick: (dialog: android.content.DialogInterface, which: number) => {
          const selectedCountry = countries[which];
          // Update property - ini akan otomatis trigger onCountryCodeChanged di common.ts
          this.countryCode = selectedCountry.code;
          this._countryButton.setText(`${selectedCountry.flag} ${selectedCountry.dialCode}`);
          dialog.dismiss();
        },
      }),
    );

    builder.create().show();
  }

  // Override property setters untuk sync dengan native view
  public [PhoneNumberFieldCommon.textProperty.setNative](value: string) {
    if (this._editText) {
      this._editText.setText(value);
    }
  }

  public [PhoneNumberFieldCommon.countryCodeProperty.setNative](value: CountryCode) {
    if (this._countryButton) {
      const countries = this.getAvailableCountries();
      const country = countries.find((c) => c.code === value);
      if (country) {
        this._countryButton.setText(`${country.flag} ${country.dialCode}`);
      } else {
        this._countryButton.setText(value);
      }
    }
  }

  public [PhoneNumberFieldCommon.placeholderProperty.setNative](value: string) {
    if (this._editText) {
      this._editText.setHint(value);
    }
  }

  private applyAccentColor(): void {
    if (android.os.Build.VERSION.SDK_INT >= 21 && this._editText) {
      // Gunakan property langsung, bukan dari style
      const accentColor = this.accentColor || '#007bff';
      const color = android.graphics.Color.parseColor(accentColor);
      const colorStateList = android.content.res.ColorStateList.valueOf(color);
      this._editText.setBackgroundTintList(colorStateList);
    }
  }

  private applyBorderColor(): void {
    if (this._layoutDrawable && this.nativeViewProtected) {
      const borderColor = this.borderColor || '#dee2e6';
      const color = android.graphics.Color.parseColor(borderColor);
      this._layoutDrawable.setStroke(8, color);
      this.nativeViewProtected.setBackground(this._layoutDrawable);
    }
  }

  private applyCountryButtonStyle(): void {
    if (this._countryButton) {
      // Background color dan border radius
      const buttonDrawable = new android.graphics.drawable.GradientDrawable();
      buttonDrawable.setColor(android.graphics.Color.parseColor(this.countryButtonBackgroundColor));
      buttonDrawable.setCornerRadius(this.countryButtonBorderRadius * 3); // Convert dp to px
      this._countryButton.setBackground(buttonDrawable);

      // Text color
      this._countryButton.setTextColor(android.graphics.Color.parseColor(this.countryButtonTextColor));

      // Padding
      const padding = this.countryButtonPadding * 3; // Convert dp to px
      this._countryButton.setPadding(padding, padding, padding, padding);
    }
  }

  // Override style property changes
  public [accentColorProperty.setNative](value: string) {
    this.accentColor = value;
    this.applyAccentColor();
  }

  public [borderColorProperty.setNative](value: string) {
    this.borderColor = value;
    this.applyBorderColor();
  }

  // Handler untuk country button styling
  public [countryButtonBackgroundColorProperty.setNative](value: string) {
    this.countryButtonBackgroundColor = value;
    this.applyCountryButtonStyle();
  }

  public [countryButtonTextColorProperty.setNative](value: string) {
    this.countryButtonTextColor = value;
    this.applyCountryButtonStyle();
  }

  public [countryButtonBorderRadiusProperty.setNative](value: number) {
    this.countryButtonBorderRadius = value;
    this.applyCountryButtonStyle();
  }

  public [countryButtonPaddingProperty.setNative](value: number) {
    this.countryButtonPadding = value;
    this.applyCountryButtonStyle();
  }
} // End of class
