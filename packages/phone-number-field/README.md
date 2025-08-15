# @x-labs-myid/phone-number-field

A NativeScript plugin for phone number input field with validation and country code selection using [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js). Inspired by [react-phone-number-input](https://www.npmjs.com/package/react-phone-number-input).

## Platforms

- Android
- iOS (Not available)

## Features

- 📱 Phone number validation using libphonenumber-js
- 🌍 Country code picker with flag support
- ✅ Real-time validation with customizable error messages
- 🎨 Customizable styling (colors, borders, button appearance)
- 📋 Auto-formatting as you type
- 🔧 TypeScript support
- 📊 Detailed phone number information (type, country, formatting)
- 🎯 Event-driven architecture

## Installation

```bash
npm install @x-labs-myid/phone-number-field
```

## Usage

### TypeScript Example

#### XML Layout
```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" 
  xmlns:pnf="@x-labs-myid/phone-number-field">
    
  <StackLayout class="p-20">
    <pnf:PhoneNumberField 
      text="{{ phoneNumber }}" 
      countryCode="{{ countryCode }}"
      placeholder="Enter phone number"
      autoValidate="{{ autoValidate }}"
      showCountryPicker="{{ showCountryPicker }}"
      textChange="{{ onTextChange }}"
      validationChange="{{ onValidationChange }}"
      countryCodeChange="{{ onCountryCodeChange }}"
      class="custom-phone-input m-10"/>
  </StackLayout>

</Page>
```

``` javascript
  context.set('phoneNumber', '');
  context.set('countryCode', 'ID');
  context.set('autoValidate', true);
  context.set('showCountryPicker', true);

  onTextChange(args: any) {
    const phoneNumber = args.value || args.object.text;
    console.log('Phone number: ', phoneNumber);
  }

  onValidationChange(args: any) {
    console.log('Validation: ', args.validation || args);
  }

  onCountryCodeChange(args: any) {
    const countryCode = args.countryCode || args.value;
    console.log('Country code: ', countryCode);
  }
```

``` scss
.custom-phone-input {
  background-color: #f8f9fa;
  border-radius: 8;
  padding: 30;
  font-size: 16;
  margin: 10;
  // Menggunakan accent-color CSS property
  accent-color: #ffffff;

  // Kustomisasi tombol country picker
  country-button-background-color: blue; // Hijau
  country-button-text-color: #ffffff; // Putih
  country-button-border-radius: 5; // Border radius 12dp
  country-button-padding: 5; // Padding 12dp
}
```

## API Reference

### Properties

| Property | Type | Default Value | Description | Function in Plugin |
|----------|------|---------------|-------------|--------------------|
| `phoneNumber` | `string` | `''` | Stores the input phone number value | Binds phone number data with input field, enabling two-way binding |
| `countryCode` | `CountryCode` | `'ID'` | Country code for phone number validation | Determines the country for correct phone number format validation |
| `autoValidate` | `boolean` | `true` | Enable/disable automatic validation | Validates phone number in real-time as user types |
| `showCountryPicker` | `boolean` | `true` | Show/hide country picker button | Controls visibility of country picker button with country flag |

### Event Handlers

| Event Handler | Parameter | Description | Function in Plugin |
|---------------|-----------|-----------|--------------------|  
| `onTextChange(args)` | `args.value` or `args.object.text` | Called when phone number text changes | Captures input changes, updates model data, and triggers automatic validation if enabled |
| `onValidationChange(args)` | `args.validation` or `args` | Called when validation status changes | Receives validation result (valid/invalid) and error message to display to user |
| `onCountryCodeChange(args)` | `args.countryCode` or `args.value` | Called when country code changes | Captures country code change from picker, updates country name, and triggers re-validation |

## Sample Phone Numbers for Testing

- **Indonesian Mobile**: `081234567890` or `+62 812 3456 7890`
- **US Mobile**: `5551234567` or `+1 555 123 4567`
- **UK Mobile**: `7911123456` or `+44 7911 123456`
- **Invalid**: `123` (too short)

## Requirements

- NativeScript 8.0+
- iOS 10.0+
- Android API Level 21+

## Dependencies

- `libphonenumber-js`: Phone number parsing and validation
- `@nativescript/core`: NativeScript core modules

## License

Apache License Version 2.0
