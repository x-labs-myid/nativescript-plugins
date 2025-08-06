import { Observable } from '@nativescript/core';

export interface RootbeerCheckResult {
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

export abstract class RootbeerCommon extends Observable {
  /**
   * Performs a basic root check
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  abstract isRooted(): Promise<boolean>;

  /**
   * Checks if the device is rooted with BusyBox check included
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  abstract isRootedWithBusyBoxCheck(): Promise<boolean>;

  /**
   * Performs detailed root checks and returns individual results
   * @returns Promise<RootbeerCheckResult> - detailed check results
   */
  abstract performDetailedChecks(): Promise<RootbeerCheckResult>;

  /**
   * Checks if any apps for managing root access (like SuperSU or Magisk) are installed
   * @returns Promise<boolean> - true if root management apps are detected
   */
  abstract checkRootManagementApps(): Promise<boolean>;

  /**
   * Checks if any apps known for facilitating root access are installed
   * @returns Promise<boolean> - true if potentially dangerous apps are detected
   */
  abstract checkPotentiallyDangerousApps(): Promise<boolean>;

  /**
   * Detects apps that can cloak or hide root access from detection tools
   * @returns Promise<boolean> - true if root cloaking apps are detected
   */
  abstract checkRootCloakingApps(): Promise<boolean>;

  /**
   * Verifies if the device's firmware is signed with Android's test keys
   * @returns Promise<boolean> - true if test keys are detected
   */
  abstract checkTestKeys(): Promise<boolean>;

  /**
   * Checks for dangerous properties that indicate this may not be a genuine Android device
   * @returns Promise<boolean> - true if dangerous properties are detected
   */
  abstract checkForDangerousProps(): Promise<boolean>;

  /**
   * Checks if the BusyBox binary is present, commonly used in rooted devices
   * @returns Promise<boolean> - true if BusyBox binary is found
   */
  abstract checkForBusyBoxBinary(): Promise<boolean>;

  /**
   * Checks for the presence of the su binary, typically used to elevate privileges
   * @returns Promise<boolean> - true if su binary is found
   */
  abstract checkForSuBinary(): Promise<boolean>;

  /**
   * Another check for the existence of the su binary, via 'which su'
   * @returns Promise<boolean> - true if su binary exists
   */
  abstract checkSuExists(): Promise<boolean>;

  /**
   * Verifies if the /system partition is mounted as read-write, a sign of rooting
   * @returns Promise<boolean> - true if /system partition is RW
   */
  abstract checkForRWSystem(): Promise<boolean>;

  /**
   * Checks for specific binary
   * @param binaryName - name of binary to check
   * @returns Promise<boolean> - true if binary is found
   */
  abstract checkForBinary(binaryName: string): Promise<boolean>;
}
