import { View, Property, EventData, booleanConverter, CssProperty, Style } from '@nativescript/core';
import { parsePhoneNumber, AsYouType, CountryCode } from 'libphonenumber-js';

export interface PhoneNumberValidationResult {
  isValid: boolean;
  formattedNumber?: string;
  nationalNumber?: string;
  internationalNumber?: string;
  countryCode?: CountryCode;
  errorMessage?: string;
}

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  dialCode: string;
}

// Properties
export const textProperty = new Property<PhoneNumberFieldCommon, string>({
  name: 'text',
  defaultValue: '',
  valueChanged: (target, oldValue, newValue) => {
    (target as any).onTextChanged(oldValue, newValue);
  },
});

export const countryCodeProperty = new Property<PhoneNumberFieldCommon, CountryCode>({
  name: 'countryCode',
  defaultValue: 'ID' as CountryCode,
  valueChanged: (target, oldValue, newValue) => {
    (target as any).onCountryCodeChanged(oldValue, newValue);
  },
});

export const placeholderProperty = new Property<PhoneNumberFieldCommon, string>({
  name: 'placeholder',
  defaultValue: 'Enter phone number',
});

export const autoValidateProperty = new Property<PhoneNumberFieldCommon, boolean>({
  name: 'autoValidate',
  defaultValue: true,
  valueConverter: booleanConverter,
});

export const showCountryPickerProperty = new Property<PhoneNumberFieldCommon, boolean>({
  name: 'showCountryPicker',
  defaultValue: true,
  valueConverter: booleanConverter,
});

export const autoMaskProperty = new Property<PhoneNumberFieldCommon, boolean>({
  name: 'autoMask',
  defaultValue: true,
  valueConverter: booleanConverter,
});

export const maxLengthProperty = new Property<PhoneNumberFieldCommon, number>({
  name: 'maxLength',
  defaultValue: 0,
});

export abstract class PhoneNumberFieldCommon extends View {
  public static textProperty = textProperty;
  public static countryCodeProperty = countryCodeProperty;
  public static placeholderProperty = placeholderProperty;
  public static autoValidateProperty = autoValidateProperty;
  public static showCountryPickerProperty = showCountryPickerProperty;
  public static autoMaskProperty = autoMaskProperty;
  public static maxLengthProperty = maxLengthProperty;

  private _asYouType: AsYouType;

  constructor() {
    super();
    this._asYouType = new AsYouType(this.countryCode);
  }

  // Property getters/setters - Fixed to use new property system
  get text(): string {
    return this._getValue(PhoneNumberFieldCommon.textProperty);
  }
  set text(value: string) {
    this._setValue(PhoneNumberFieldCommon.textProperty, value);
  }

  get countryCode(): CountryCode {
    return this._getValue(PhoneNumberFieldCommon.countryCodeProperty);
  }
  set countryCode(value: CountryCode) {
    this._setValue(PhoneNumberFieldCommon.countryCodeProperty, value);
  }

  get placeholder(): string {
    return this._getValue(PhoneNumberFieldCommon.placeholderProperty);
  }
  set placeholder(value: string) {
    this._setValue(PhoneNumberFieldCommon.placeholderProperty, value);
  }

  get autoValidate(): boolean {
    return this._getValue(PhoneNumberFieldCommon.autoValidateProperty);
  }
  set autoValidate(value: boolean) {
    this._setValue(PhoneNumberFieldCommon.autoValidateProperty, value);
  }

  get showCountryPicker(): boolean {
    return this._getValue(PhoneNumberFieldCommon.showCountryPickerProperty);
  }
  set showCountryPicker(value: boolean) {
    this._setValue(PhoneNumberFieldCommon.showCountryPickerProperty, value);
  }

  get autoMask(): boolean {
    return this._getValue(PhoneNumberFieldCommon.autoMaskProperty);
  }
  set autoMask(value: boolean) {
    this._setValue(PhoneNumberFieldCommon.autoMaskProperty, value);
  }

  get maxLength(): number {
    return this._getValue(PhoneNumberFieldCommon.maxLengthProperty);
  }
  set maxLength(value: number) {
    this._setValue(PhoneNumberFieldCommon.maxLengthProperty, value);
  }

  // Auto masking functionality
  public applyMask(input: string): string {
    if (!this.autoMask || !input) return input;

    try {
      // Bersihkan input dari karakter non-digit
      const cleanInput = input.replace(/\D/g, '');

      // Jika input kosong, return kosong
      if (!cleanInput) return '';

      // Reset AsYouType instance
      this._asYouType.reset();
      this._asYouType = new AsYouType(this.countryCode);

      // Apply masking character by character untuk kontrol yang lebih baik
      let result = '';
      for (let i = 0; i < cleanInput.length; i++) {
        const char = cleanInput[i];
        const formatted = this._asYouType.input(char);
        if (formatted) {
          result = formatted;
        }
      }

      return result || cleanInput;
    } catch (error) {
      console.error('Masking error:', error);
      return input;
    }
  }

  // Validation
  public validatePhoneNumber(): PhoneNumberValidationResult {
    try {
      if (!this.text || this.text.trim() === '') {
        return {
          isValid: false,
          errorMessage: 'Nomor telepon harus diisi',
        };
      }

      const phoneNumber = parsePhoneNumber(this.text, this.countryCode);

      if (!phoneNumber) {
        return {
          isValid: false,
          errorMessage: 'Format nomor telepon tidak valid',
        };
      }

      const isValid = phoneNumber.isValid();

      return {
        isValid,
        formattedNumber: isValid ? phoneNumber.format('INTERNATIONAL') : undefined,
        nationalNumber: isValid ? phoneNumber.format('NATIONAL') : undefined,
        internationalNumber: isValid ? phoneNumber.format('INTERNATIONAL') : undefined,
        countryCode: phoneNumber.country,
        errorMessage: isValid ? undefined : 'Nomor telepon tidak valid untuk negara yang dipilih',
      };
    } catch (error) {
      return {
        isValid: false,
        errorMessage: 'Error validasi nomor telepon: ' + error.message,
      };
    }
  }

  // Country management
  public getAvailableCountries(): CountryInfo[] {
    return [
      // Asia
      { code: 'ID' as CountryCode, name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
      { code: 'SG' as CountryCode, name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
      { code: 'MY' as CountryCode, name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
      { code: 'TH' as CountryCode, name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
      { code: 'VN' as CountryCode, name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
      { code: 'PH' as CountryCode, name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
      { code: 'JP' as CountryCode, name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
      { code: 'KR' as CountryCode, name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
      { code: 'CN' as CountryCode, name: 'China', flag: '🇨🇳', dialCode: '+86' },
      { code: 'IN' as CountryCode, name: 'India', flag: '🇮🇳', dialCode: '+91' },
      { code: 'PK' as CountryCode, name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
      { code: 'BD' as CountryCode, name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
      { code: 'LK' as CountryCode, name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
      { code: 'MM' as CountryCode, name: 'Myanmar', flag: '🇲🇲', dialCode: '+95' },
      { code: 'KH' as CountryCode, name: 'Cambodia', flag: '🇰🇭', dialCode: '+855' },
      { code: 'LA' as CountryCode, name: 'Laos', flag: '🇱🇦', dialCode: '+856' },
      { code: 'BN' as CountryCode, name: 'Brunei', flag: '🇧🇳', dialCode: '+673' },
      { code: 'TW' as CountryCode, name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
      { code: 'HK' as CountryCode, name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
      { code: 'MO' as CountryCode, name: 'Macau', flag: '🇲🇴', dialCode: '+853' },

      // Middle East
      { code: 'AE' as CountryCode, name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
      { code: 'SA' as CountryCode, name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
      { code: 'QA' as CountryCode, name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
      { code: 'KW' as CountryCode, name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
      { code: 'BH' as CountryCode, name: 'Bahrain', flag: '🇧🇭', dialCode: '+973' },
      { code: 'OM' as CountryCode, name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
      { code: 'JO' as CountryCode, name: 'Jordan', flag: '🇯🇴', dialCode: '+962' },
      { code: 'LB' as CountryCode, name: 'Lebanon', flag: '🇱🇧', dialCode: '+961' },
      { code: 'IL' as CountryCode, name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
      { code: 'TR' as CountryCode, name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
      { code: 'IR' as CountryCode, name: 'Iran', flag: '🇮🇷', dialCode: '+98' },
      { code: 'IQ' as CountryCode, name: 'Iraq', flag: '🇮🇶', dialCode: '+964' },

      // Europe
      { code: 'GB' as CountryCode, name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
      { code: 'DE' as CountryCode, name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
      { code: 'FR' as CountryCode, name: 'France', flag: '🇫🇷', dialCode: '+33' },
      { code: 'IT' as CountryCode, name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
      { code: 'ES' as CountryCode, name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
      { code: 'NL' as CountryCode, name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
      { code: 'BE' as CountryCode, name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
      { code: 'CH' as CountryCode, name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
      { code: 'AT' as CountryCode, name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
      { code: 'SE' as CountryCode, name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
      { code: 'NO' as CountryCode, name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
      { code: 'DK' as CountryCode, name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
      { code: 'FI' as CountryCode, name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
      { code: 'PL' as CountryCode, name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
      { code: 'CZ' as CountryCode, name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
      { code: 'HU' as CountryCode, name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
      { code: 'RO' as CountryCode, name: 'Romania', flag: '🇷🇴', dialCode: '+40' },
      { code: 'BG' as CountryCode, name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359' },
      { code: 'GR' as CountryCode, name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
      { code: 'PT' as CountryCode, name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
      { code: 'IE' as CountryCode, name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
      { code: 'RU' as CountryCode, name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
      { code: 'UA' as CountryCode, name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },

      // North America
      { code: 'US' as CountryCode, name: 'United States', flag: '🇺🇸', dialCode: '+1' },
      { code: 'CA' as CountryCode, name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
      { code: 'MX' as CountryCode, name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },

      // South America
      { code: 'BR' as CountryCode, name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
      { code: 'AR' as CountryCode, name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
      { code: 'CL' as CountryCode, name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
      { code: 'CO' as CountryCode, name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
      { code: 'PE' as CountryCode, name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
      { code: 'VE' as CountryCode, name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
      { code: 'EC' as CountryCode, name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
      { code: 'UY' as CountryCode, name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
      { code: 'PY' as CountryCode, name: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
      { code: 'BO' as CountryCode, name: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },

      // Africa
      { code: 'ZA' as CountryCode, name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
      { code: 'NG' as CountryCode, name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
      { code: 'EG' as CountryCode, name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
      { code: 'KE' as CountryCode, name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
      { code: 'GH' as CountryCode, name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
      { code: 'ET' as CountryCode, name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
      { code: 'TZ' as CountryCode, name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
      { code: 'UG' as CountryCode, name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
      { code: 'MA' as CountryCode, name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
      { code: 'DZ' as CountryCode, name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
      { code: 'TN' as CountryCode, name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
      { code: 'LY' as CountryCode, name: 'Libya', flag: '🇱🇾', dialCode: '+218' },

      // Oceania
      { code: 'AU' as CountryCode, name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
      { code: 'NZ' as CountryCode, name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
      { code: 'FJ' as CountryCode, name: 'Fiji', flag: '🇫🇯', dialCode: '+679' },
      { code: 'PG' as CountryCode, name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675' },
    ];
  }

  public setCountryCode(countryCode: CountryCode): void {
    this.countryCode = countryCode;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public formatPhoneNumber(format: 'NATIONAL' | 'INTERNATIONAL' = 'INTERNATIONAL'): string {
    try {
      if (!this.text) return '';

      const phoneNumber = parsePhoneNumber(this.text, this.countryCode);
      return phoneNumber ? phoneNumber.format(format) : this.text;
    } catch (error) {
      return this.text;
    }
  }

  // Event handlers
  // Event handlers
  public onTextChanged(oldValue: string, newValue: string): void {
    // Apply auto masking if enabled
    if (this.autoMask && newValue) {
      const maskedText = this.applyMask(newValue);
      if (maskedText !== newValue) {
        // Prevent infinite loop by checking if text actually changed
        this._setValue(PhoneNumberFieldCommon.textProperty, maskedText);
        return;
      }
    }

    // ... existing code ...
  }

  public onCountryCodeChanged(oldValue: CountryCode, newValue: CountryCode): void {
    this._asYouType = new AsYouType(newValue);

    // Re-apply masking with new country code if auto mask is enabled
    if (this.autoMask && this.text) {
      const maskedText = this.applyMask(this.text);
      if (maskedText !== this.text) {
        this._setValue(PhoneNumberFieldCommon.textProperty, maskedText);
      }
    }

    // Trigger validation if auto validate is enabled
    if (this.autoValidate) {
      const validation = this.validatePhoneNumber();
      this.notify({
        eventName: 'validationChange',
        object: this,
        validation: validation,
      });
    }

    // Notify property change
    this.notify({
      eventName: 'countryCodeChanged',
      object: this,
      oldValue,
      newValue,
    });
  }
}

// Register properties
PhoneNumberFieldCommon.textProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.countryCodeProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.placeholderProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.autoValidateProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.showCountryPickerProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.autoMaskProperty.register(PhoneNumberFieldCommon);
PhoneNumberFieldCommon.maxLengthProperty.register(PhoneNumberFieldCommon);

// Tambahkan CSS property untuk border color
export const borderColorProperty = new CssProperty<Style, string>({
  name: 'borderColor',
  cssName: 'border-color',
  defaultValue: '#007bff',
});

export const accentColorProperty = new CssProperty<Style, string>({
  name: 'accentColor',
  cssName: 'accent-color',
  defaultValue: '#007bff',
});

// Register properties
borderColorProperty.register(Style);
accentColorProperty.register(Style);

// CSS properties untuk kustomisasi tombol country picker
export const countryButtonBackgroundColorProperty = new CssProperty<Style, string>({
  name: 'countryButtonBackgroundColor',
  cssName: 'country-button-background-color',
  defaultValue: '#007bff',
});

export const countryButtonTextColorProperty = new CssProperty<Style, string>({
  name: 'countryButtonTextColor',
  cssName: 'country-button-text-color',
  defaultValue: '#ffffff',
});

export const countryButtonBorderRadiusProperty = new CssProperty<Style, number>({
  name: 'countryButtonBorderRadius',
  cssName: 'country-button-border-radius',
  defaultValue: 6,
});

export const countryButtonPaddingProperty = new CssProperty<Style, number>({
  name: 'countryButtonPadding',
  cssName: 'country-button-padding',
  defaultValue: 8,
});

// Register country button properties
countryButtonBackgroundColorProperty.register(Style);
countryButtonTextColorProperty.register(Style);
countryButtonBorderRadiusProperty.register(Style);
countryButtonPaddingProperty.register(Style);
