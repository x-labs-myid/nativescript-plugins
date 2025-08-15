import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedPhoneNumberField } from '@demo/shared';
import { PhoneNumberField } from '@x-labs-myid/phone-number-field';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  const demoModel = new DemoModel();
  page.bindingContext = demoModel;

  // Set up page loaded event to get field reference
  page.on('loaded', () => {
    demoModel.onPageLoaded(page);
  });
}

export class DemoModel extends DemoSharedPhoneNumberField {
  private _phoneNumberField: PhoneNumberField;

  // Definisi properti eksplisit untuk TypeScript
  phoneNumber: string;
  countryCode: string;
  autoValidate: boolean;
  showCountryPicker: boolean;
  isValid: boolean;
  validationMessage: string;
  selectedCountryName: string;
  formattedNumber: string;
  testResults: string;

  // Tambahkan property untuk informasi detail
  phoneNumberDetailInfo: string;

  constructor() {
    super();
    this.initializeDemo();
  }

  // Method to get field reference after page is loaded
  onPageLoaded(page: Page) {
    // Find the PhoneNumberField in the page
    this._phoneNumberField = page.getViewById('phoneNumberField') as PhoneNumberField;

    if (this._phoneNumberField) {
      console.log('PhoneNumberField reference obtained successfully');

      // Set up event listeners
      this._phoneNumberField.on('textChange', (args) => this.onTextChange(args));
      this._phoneNumberField.on('validationChange', (args) => this.onValidationChange(args));
      this._phoneNumberField.on('countryCodeChange', (args) => this.onCountryCodeChange(args));
    } else {
      console.error('Could not find PhoneNumberField in page');
    }
  }

  private initializeDemo() {
    this.set('phoneNumber', '');
    this.set('countryCode', 'ID');
    this.set('autoValidate', true);
    this.set('showCountryPicker', true);
    this.set('isValid', false);
    this.set('validationMessage', 'Enter a phone number');
    this.set('selectedCountryName', 'Indonesia');
    this.set('formattedNumber', '');
    this.set('testResults', '');
    this.set('phoneNumberDetailInfo', ''); // Tambahkan ini

    // Temporarily disable auto masking to fix RTL issue
    if (this._phoneNumberField) {
      this._phoneNumberField.autoMask = false;
    }
  }

  // Event Handlers
  onTextChange(args: any) {
    const phoneNumber = args.value || args.object.text;
    this.set('phoneNumber', phoneNumber);

    // Update informasi detail nomor telepon
    this.updatePhoneNumberDetailInfo();

    if (this._phoneNumberField && this.get('autoValidate')) {
      try {
        const result = this._phoneNumberField.validatePhoneNumber();
        this.updateValidationStatus(result);
      } catch (error) {
        console.error('Validation error:', error);
        this.updateValidationStatus({ isValid: false, errorMessage: 'Validation failed' });
      }
    }
  }

  // Tambahkan method untuk update informasi detail
  private updatePhoneNumberDetailInfo() {
    if (this._phoneNumberField) {
      const detailInfo = this._phoneNumberField.getPhoneNumberDetailInfo();

      if (detailInfo) {
        const infoText = `Number: ${detailInfo.number}\n` + `Country: ${detailInfo.country}\n` + `National: ${detailInfo.national}\n` + `International: ${detailInfo.international}\n` + `URI: ${detailInfo.uri}\n` + `Type: ${detailInfo.type}\n` + `Possible: ${detailInfo.possible}\n` + `Valid: ${detailInfo.valid}`;

        this.set('phoneNumberDetailInfo', infoText);
      } else {
        this.set('phoneNumberDetailInfo', '');
      }
    }
  }

  onValidationChange(args: any) {
    this.updateValidationStatus(args.validation || args);
  }

  onCountryCodeChange(args: any) {
    const countryCode = args.countryCode || args.value;
    this.set('countryCode', countryCode);

    // Update country name
    const countries = {
      ID: 'Indonesia',
      US: 'United States',
      GB: 'United Kingdom',
    };
    this.set('selectedCountryName', countries[countryCode] || countryCode);

    // Revalidate if auto validate is enabled
    if (this._phoneNumberField && this.get('autoValidate')) {
      try {
        const result = this._phoneNumberField.validatePhoneNumber();
        this.updateValidationStatus(result);
      } catch (error) {
        console.error('Validation error on country change:', error);
      }
    }
  }

  private updateValidationStatus(result: any) {
    if (!result) return;

    this.set('isValid', result.isValid);
    this.set('validationMessage', result.errorMessage || (result.isValid ? 'Valid phone number' : 'Invalid phone number'));

    // Update formatted number if available
    if (result.formattedNumber) {
      this.set('formattedNumber', result.formattedNumber);
    }
  }

  // Settings Actions - Fixed to actually update the field
  toggleAutoValidate() {
    const current = this.autoValidate;
    const newValue = !current;
    this.autoValidate = newValue;

    if (this._phoneNumberField) {
      this._phoneNumberField.autoValidate = newValue;
    }
  }

  toggleCountryPicker() {
    const current = this.showCountryPicker;
    const newValue = !current;
    this.showCountryPicker = newValue;

    if (this._phoneNumberField) {
      this._phoneNumberField.showCountryPicker = newValue;
    }
  }

  // Country Selection - Fixed to update the field
  setIndonesia() {
    this.countryCode = 'ID';
    this.selectedCountryName = 'Indonesia';
    if (this._phoneNumberField) {
      this._phoneNumberField.countryCode = 'ID';
    }
  }

  setUSA() {
    this.countryCode = 'US';
    this.selectedCountryName = 'United States';
    if (this._phoneNumberField) {
      this._phoneNumberField.countryCode = 'US';
    }
  }

  setUK() {
    this.countryCode = 'GB';
    this.selectedCountryName = 'United Kingdom';
    if (this._phoneNumberField) {
      this._phoneNumberField.countryCode = 'GB';
    }
  }

  // Test Actions - Fixed to work with field reference
  manualValidation() {
    if (this._phoneNumberField) {
      try {
        const result = this._phoneNumberField.validatePhoneNumber();
        this.updateValidationStatus(result);
        console.log('Manual validation result:', result);
      } catch (error) {
        console.error('Manual validation error:', error);
        this.updateValidationStatus({ isValid: false, errorMessage: 'Validation failed' });
      }
    } else {
      console.error('PhoneNumberField not available for validation');
    }
  }

  formatNumber() {
    if (this._phoneNumberField) {
      try {
        const formatted = this._phoneNumberField.formatPhoneNumber('INTERNATIONAL');
        this.formattedNumber = formatted;
        console.log('Formatted number:', formatted);
      } catch (error) {
        console.error('Format error:', error);
        this.formattedNumber = 'Format failed';
      }
    } else {
      console.error('PhoneNumberField not available for formatting');
    }
  }

  clearField() {
    this.phoneNumber = '';
    this.formattedNumber = '';
    this.validationMessage = 'Enter a phone number';
    this.isValid = false;

    if (this._phoneNumberField) {
      this._phoneNumberField.text = '';
    }
  }

  // Sample Numbers - Fixed to use this.set() consistently
  setIndonesianMobile() {
    const phoneNumber = '081234567890';
    this.set('countryCode', 'ID');
    this.set('phoneNumber', phoneNumber);
    this.set('selectedCountryName', 'Indonesia');

    if (this._phoneNumberField) {
      this._phoneNumberField.countryCode = 'ID';
      this._phoneNumberField.text = phoneNumber;
    }
  }

  setUSMobile() {
    const phoneNumber = '5551234567';
    this.set('countryCode', 'US');
    this.set('phoneNumber', phoneNumber);
    this.set('selectedCountryName', 'United States');

    if (this._phoneNumberField) {
      this._phoneNumberField.countryCode = 'US';
      this._phoneNumberField.text = phoneNumber;
    }
  }

  setInvalidNumber() {
    const phoneNumber = '123';
    this.set('phoneNumber', phoneNumber);

    if (this._phoneNumberField) {
      this._phoneNumberField.text = phoneNumber;
    }
  }

  setInternationalNumber() {
    const phoneNumber = '+62 812 3456 7890';
    this.set('phoneNumber', phoneNumber);

    if (this._phoneNumberField) {
      this._phoneNumberField.text = phoneNumber;
    }
  }
}
