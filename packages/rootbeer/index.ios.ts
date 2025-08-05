import { RootbeerCheckResult, RootbeerCommon } from './common';

export class Rootbeer extends RootbeerCommon {
  isRootedWithBusyBoxCheck(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  performDetailedChecks(): Promise<RootbeerCheckResult> {
    throw new Error('Method not implemented.');
  }
  checkForBinary(binaryName: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async isRooted(): Promise<boolean> {
    return false;
  }
}
