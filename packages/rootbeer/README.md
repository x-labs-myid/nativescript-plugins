# @x-labs-myid/rootbeer

A comprehensive NativeScript plugin for detecting rooted/jailbroken devices using the [RootBeer](https://github.com/scottyab/rootbeer) for Android.

## Platforms

- Android
- iOS (Not available)

## Installation

```bash
npm install @x-labs-myid/rootbeer
```

## Usage

### TypeScript

```typescript
import { Rootbeer } from '@x-labs-myid/rootbeer';

const rootbeer = new Rootbeer();

// Basic root check
const isRooted = await rootbeer.isRooted();
console.log('Device is rooted:', isRooted);

// Root check with BusyBox
const isRootedWithBusyBox = await rootbeer.isRootedWithBusyBoxCheck();
console.log('Device is rooted (with BusyBox check):', isRootedWithBusyBox);

// Detailed checks
const detailedResults = await rootbeer.performDetailedChecks();
console.log('Detailed results:', detailedResults);

// Individual checks
const hasRootApps = await rootbeer.checkRootManagementApps();
const hasDangerousApps = await rootbeer.checkPotentiallyDangerousApps();
const hasCloakingApps = await rootbeer.checkRootCloakingApps();
const hasTestKeys = await rootbeer.checkTestKeys();
const hasDangerousProps = await rootbeer.checkForDangerousProps();
const hasBusyBox = await rootbeer.checkForBusyBoxBinary();
const hasSu = await rootbeer.checkForSuBinary();
const suExists = await rootbeer.checkSuExists();
const hasRWSystem = await rootbeer.checkForRWSystem();

// Check for specific binary
const hasCustomBinary = await rootbeer.checkForBinary('customtool');
```

### JavaScript

```javascript
const { Rootbeer } = require('@x-labs-myid/rootbeer');

const rootbeer = new Rootbeer();

// Basic usage
rootbeer.isRooted().then(isRooted => {
    console.log('Device is rooted:', isRooted);
});

// Detailed checks
rootbeer.performDetailedChecks().then(results => {
    console.log('Root management apps:', results.checkRootManagementApps);
    console.log('Dangerous apps:', results.checkPotentiallyDangerousApps);
    console.log('Cloaking apps:', results.checkRootCloakingApps);
    console.log('Test keys:', results.checkTestKeys);
    console.log('Dangerous props:', results.checkForDangerousProps);
    console.log('BusyBox binary:', results.checkForBusyBoxBinary);
    console.log('Su binary:', results.checkForSuBinary);
    console.log('Su exists:', results.checkSuExists);
    console.log('RW System:', results.checkForRWSystem);
});
```

## API Reference

### Methods

#### `isRooted(): Promise<boolean>`
Performs a basic root/jailbreak check.

**Returns:** `Promise<boolean>` - true if device appears to be rooted

#### `isRootedWithBusyBoxCheck(): Promise<boolean>`
Checks if the device is rooted with BusyBox check included.

**Returns:** `Promise<boolean>` - true if device appears to be rooted

#### `performDetailedChecks(): Promise<RootbeerCheckResult>`
Performs all available root detection checks and returns detailed results.

**Returns:** `Promise<RootbeerCheckResult>` - object containing all check results

#### `checkRootManagementApps(): Promise<boolean>`
Checks if any apps for managing root access (like SuperSU or Magisk) are installed.

**Limitations:** May not detect newly developed or less popular root management apps.

**Returns:** `Promise<boolean>` - true if root management apps are detected

#### `checkPotentiallyDangerousApps(): Promise<boolean>`
Checks if any apps known for facilitating root access are installed.

**Limitations:** Limited to a predefined list of apps; cannot detect custom or less-known dangerous apps.

**Returns:** `Promise<boolean>` - true if potentially dangerous apps are detected

#### `checkRootCloakingApps(): Promise<boolean>`
Detects apps that can cloak or hide root access from detection tools.

**Limitations:** Root cloaking apps evolve quickly, potentially bypassing detection mechanisms.

**Returns:** `Promise<boolean>` - true if root cloaking apps are detected

#### `checkTestKeys(): Promise<boolean>`
Verifies if the device's firmware is signed with Android's test keys, which it would be on AOSP or certain emulators.

**Limitations:** Only detects if test keys are used, and may miss rooted devices using production keys.

**Returns:** `Promise<boolean>` - true if test keys are detected

#### `checkForDangerousProps(): Promise<boolean>`
Checks for dangerous properties (ro.debuggable and ro.secure) that indicate this may not be a genuine Android device.

**Limitations:** Can be bypassed if properties are reset or hidden by advanced root cloaking techniques.

**Returns:** `Promise<boolean>` - true if dangerous properties are detected

#### `checkForBusyBoxBinary(): Promise<boolean>`
Checks if the BusyBox binary is present, commonly used in rooted devices.

**Limitations:** Not all rooted devices use BusyBox, and some device manufacturers may leave busybox on the ROM.

**Returns:** `Promise<boolean>` - true if BusyBox binary is found

#### `checkForSuBinary(): Promise<boolean>`
Checks for the presence of the su binary, typically used to elevate privileges.

**Limitations:** Su binaries may be renamed or hidden by root cloaking tools, bypassing detection.

**Returns:** `Promise<boolean>` - true if su binary is found

#### `checkSuExists(): Promise<boolean>`
Another check for the existence of the su binary, via 'which su'.

**Limitations:** Same as checkForSuBinary, can be bypassed by renaming or hiding the binary.

**Returns:** `Promise<boolean>` - true if su binary exists

#### `checkForRWSystem(): Promise<boolean>`
Verifies if the /system partition is mounted as read-write, a sign of rooting.

**Limitations:** Some newer root methods do not require RW access to the /system partition (e.g., systemless root).

**Returns:** `Promise<boolean>` - true if /system partition is RW

#### `checkForBinary(binaryName: string): Promise<boolean>`
Checks for the presence of a specific binary.

**Parameters:**
- `binaryName: string` - name of binary to check

**Returns:** `Promise<boolean>` - true if binary is found

### Types

#### `RootbeerCheckResult`
```typescript
interface RootbeerCheckResult {
  isRooted: boolean;
  checkRootManagementApps: boolean;
  checkPotentiallyDangerousApps: boolean;
  checkRootCloakingApps: boolean;
  checkTestKeys: boolean;
  checkForDangerousProps: boolean;
  checkForBusyBoxBinary: boolean;
  checkForSuBinary: boolean;
  checkSuExists: boolean;
  checkForRWSystem: boolean;
}
```

## Platform Differences

### Android
- Uses the native RootBeer library (com.scottyab:rootbeer-lib:0.1.1)
- All methods are implemented using native Android APIs
- Provides comprehensive root detection capabilities

### iOS
- Implements jailbreak detection using iOS-specific checks
- File system checks for common jailbreak files and directories
- URL scheme checks for jailbreak apps
- Write permission checks for system directories

## Security Considerations

⚠️ **Important:** Root/jailbreak detection should never be the sole security measure. It can be bypassed by:

- Advanced root hiding tools
- Custom ROMs with built-in hiding capabilities
- Xposed modules that hook detection methods
- Manual patching of the detection library

**Best Practices:**
- Use multiple detection methods
- Implement server-side validation
- Use certificate pinning
- Implement runtime application self-protection (RASP)
- Regular security updates

## Example App

See the demo app in the `apps/demo` directory for a complete example of how to use all the plugin features.

## License

Apache-2.0
