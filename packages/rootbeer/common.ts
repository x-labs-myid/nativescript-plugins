import { Observable } from '@nativescript/core';

export interface RootbeerCheckResult {
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

export abstract class RootbeerCommon extends Observable {
  /**
   * Checks if the device is rooted
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
   * Checks for specific binary
   * @param binaryName - name of binary to check
   * @returns Promise<boolean> - true if binary is found
   */
  abstract checkForBinary(binaryName: string): Promise<boolean>;
}
