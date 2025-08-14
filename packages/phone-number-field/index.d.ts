import { PhoneNumberFieldCommon, PhoneNumberValidationResult, CountryInfo } from './common';
import { CountryCode } from 'libphonenumber-js';

export declare class PhoneNumberField extends PhoneNumberFieldCommon {
  /**
   * Gets or sets the phone number text
   */
  text: string;

  /**
   * Gets or sets the country code (e.g., 'ID', 'US', 'GB')
   */
  countryCode: CountryCode;

  /**
   * Gets or sets the placeholder text
   */
  placeholder: string;

  /**
   * Gets or sets whether to automatically validate on text change
   */
  autoValidate: boolean;

  /**
   * Gets or sets whether to show country picker button
   */
  showCountryPicker: boolean;

  /**
   * Validates the current phone number
   */
  validatePhoneNumber(): PhoneNumberValidationResult;

  /**
   * Gets list of available countries
   */
  getAvailableCountries(): CountryInfo[];

  /**
   * Sets the country code
   */
  setCountryCode(countryCode: CountryCode): void;

  /**
   * Sets the phone number text
   */
  setText(text: string): void;

  /**
   * Formats the current phone number
   */
  formatPhoneNumber(format?: 'NATIONAL' | 'INTERNATIONAL'): string;
}

export { PhoneNumberValidationResult, CountryInfo } from './common';
export { CountryCode } from 'libphonenumber-js';
