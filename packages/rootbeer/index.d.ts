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
   * Checks for specific binary
   * @param binaryName - name of binary to check
   * @returns Promise<boolean> - true if binary is found
   */
  checkForBinary(binaryName: string): Promise<boolean>;
}

export { RootbeerCheckResult } from './common';
