import { RootbeerCommon, RootbeerCheckResult } from './common';

export declare class Rootbeer extends RootbeerCommon {
  /**
   * Checks if the device is rooted
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  isRooted(): Promise<boolean>;

  /**
   * Checks if the device is rooted with BusyBox check included
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  isRootedWithBusyBoxCheck(): Promise<boolean>;

  /**
   * Performs detailed root checks and returns individual results
   * @returns Promise<RootbeerCheckResult> - detailed check results
   */
  performDetailedChecks(): Promise<RootbeerCheckResult>;

  /**
   * Checks if any apps for managing root access (like SuperSU or Magisk) are installed
   * Limitations: May not detect newly developed or less popular root management apps
   * @returns Promise<boolean> - true if root management apps are detected
   */
  checkRootManagementApps(): Promise<boolean>;

  /**
   * Checks if any apps known for facilitating root access are installed
   * Limitations: Limited to a predefined list of apps; cannot detect custom or less-known dangerous apps
   * @returns Promise<boolean> - true if potentially dangerous apps are detected
   */
  checkPotentiallyDangerousApps(): Promise<boolean>;

  /**
   * Detects apps that can cloak or hide root access from detection tools
   * Limitations: Root cloaking apps evolve quickly, potentially bypassing detection mechanisms
   * @returns Promise<boolean> - true if root cloaking apps are detected
   */
  checkRootCloakingApps(): Promise<boolean>;

  /**
   * Verifies if the device's firmware is signed with Android's test keys
   * Limitations: Only detects if test keys are used, and may miss rooted devices using production keys
   * @returns Promise<boolean> - true if test keys are detected
   */
  checkTestKeys(): Promise<boolean>;

  /**
   * Checks for dangerous properties (ro.debuggable and ro.secure) that indicate this may not be a genuine Android device
   * Limitations: Can be bypassed if properties are reset or hidden by advanced root cloaking techniques
   * @returns Promise<boolean> - true if dangerous properties are detected
   */
  checkForDangerousProps(): Promise<boolean>;

  /**
   * Checks if the BusyBox binary is present, commonly used in rooted devices
   * Limitations: Not all rooted devices use BusyBox, and some device manufacturers may leave busybox on the ROM
   * @returns Promise<boolean> - true if BusyBox binary is found
   */
  checkForBusyBoxBinary(): Promise<boolean>;

  /**
   * Checks for the presence of the su binary, typically used to elevate privileges
   * Limitations: Su binaries may be renamed or hidden by root cloaking tools, bypassing detection
   * @returns Promise<boolean> - true if su binary is found
   */
  checkForSuBinary(): Promise<boolean>;

  /**
   * Another check for the existence of the su binary, via 'which su'
   * Limitations: Same as checkForSuBinary, can be bypassed by renaming or hiding the binary
   * @returns Promise<boolean> - true if su binary exists
   */
  checkSuExists(): Promise<boolean>;

  /**
   * Verifies if the /system partition is mounted as read-write, a sign of rooting
   * Limitations: Some newer root methods do not require RW access to the /system partition (e.g., systemless root)
   * @returns Promise<boolean> - true if /system partition is RW
   */
  checkForRWSystem(): Promise<boolean>;

  /**
   * Checks for specific binary
   * @param binaryName - name of binary to check
   * @returns Promise<boolean> - true if binary is found
   */
  checkForBinary(binaryName: string): Promise<boolean>;
}

export { RootbeerCheckResult } from './common';
