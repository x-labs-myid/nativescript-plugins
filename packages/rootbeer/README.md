# @x-labs-myid/rootbeer

A NativeScript plugin for detecting rooted/jailbroken devices. This plugin wraps the popular [RootBeer](https://github.com/scottyab/rootbeer) Android library and provides equivalent functionality for iOS.

## Installation

```bash
npm install @x-labs-myid/rootbeer
```

## Usage

### TypeScript

```typescript
import { Rootbeer } from '@x-labs-myid/rootbeer';

const rootbeer = new Rootbeer();

// Basic root/jailbreak check
rootbeer.isRooted().then(isRooted => {
  if (isRooted) {
    console.log('Device appears to be rooted/jailbroken');
  } else {
    console.log('Device appears to be clean');
  }
});

// Detailed checks
rootbeer.performDetailedChecks().then(result => {
  console.log('Is rooted:', result.isRooted);
  console.log('Individual checks:', result.checks);
});

// Check for specific binary
rootbeer.checkForBinary('su').then(found => {
  console.log('Su binary found:', found);
});
```

### JavaScript

```javascript
const { Rootbeer } = require('@x-labs-myid/rootbeer');

const rootbeer = new Rootbeer();

rootbeer.isRooted().then(function(isRooted) {
  if (isRooted) {
    console.log('Device appears to be rooted/jailbroken');
  } else {
    console.log('Device appears to be clean');
  }
});
```

## API

### Methods

#### `isRooted(): Promise<boolean>`
Performs a comprehensive check to determine if the device is rooted (Android) or jailbroken (iOS).

#### `isRootedWithBusyBoxCheck(): Promise<boolean>`
Same as `isRooted()` but includes BusyBox detection on Android. On iOS, this is equivalent to `isRooted()`.

#### `performDetailedChecks(): Promise<RootbeerCheckResult>`
Returns detailed information about individual root/jailbreak detection checks.

#### `checkForBinary(binaryName: string): Promise<boolean>`
Checks for the presence of a specific binary file.

### Types

```typescript
interface RootbeerCheckResult {
  isRooted: boolean;
  checks: {
    checkRootManagementApps?: boolean;
    checkPotentiallyDangerousApps?: boolean;
    checkRootCloakingApps?: boolean;
    checkTestKeys?: boolean;
    checkForDangerousProps?: boolean;
    checkForBusyBoxBinary?: boolean;
    checkForSuBinary?: boolean;
    checkSuExists?: boolean;
    checkForRWSystem?: boolean;
  };
}
```

## Platform Differences

### Android
- Uses the RootBeer library for comprehensive root detection
- Checks for root management apps, dangerous apps, su binaries, etc.
- Includes native checks that are harder to bypass

### iOS
- Implements jailbreak detection using file system checks
- Looks for common jailbreak files and applications
- Checks for system partition write access
- Tests for Cydia and other jailbreak tools

## Security Considerations

⚠️ **Important**: Root/jailbreak detection is not foolproof. Determined users can bypass these checks. This plugin should be used as part of a broader security strategy, not as the sole security measure.

For more robust security on Android, consider using Google Play Integrity API in addition to this plugin.

## License

Apache License Version 2.0
