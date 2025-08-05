import { RootbeerCommon, RootbeerCheckResult } from './common';
import { Utils } from '@nativescript/core';

declare const com: any;

export class Rootbeer extends RootbeerCommon {
  private rootBeer: any;

  constructor() {
    super();
    this.rootBeer = new com.scottyab.rootbeer.RootBeer(Utils.android.getApplicationContext());
  }

  /**
   * Checks if the device is rooted
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  isRooted(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.rootBeer.isRooted();
        resolve(result);
      } catch (error) {
        console.error('Rootbeer isRooted error:', error);
        resolve(false);
      }
    });
  }

  /**
   * Checks if the device is rooted with BusyBox check included
   * @returns Promise<boolean> - true if device appears to be rooted
   */
  isRootedWithBusyBoxCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.rootBeer.isRootedWithBusyBoxCheck();
        resolve(result);
      } catch (error) {
        console.error('Rootbeer isRootedWithBusyBoxCheck error:', error);
        resolve(false);
      }
    });
  }

  /**
   * Performs detailed root checks and returns individual results
   * @returns Promise<RootbeerCheckResult> - detailed check results
   */
  performDetailedChecks(): Promise<RootbeerCheckResult> {
    return new Promise((resolve) => {
      try {
        // Menggunakan method yang benar-benar tersedia di RootBeer 0.1.1
        const checks = {
          checkTestKeys: this.safeCheck(() => this.rootBeer.checkTestKeys()),
          checkForDangerousProps: this.safeCheck(() => this.rootBeer.checkForDangerousProps()),
          checkForBusyBoxBinary: this.safeCheck(() => this.rootBeer.checkForBinary('busybox')),
          checkForSuBinary: this.safeCheck(() => this.rootBeer.checkForBinary('su')),
          checkSuExists: this.safeCheck(() => this.rootBeer.checkSuExists()),
          checkForRWSystem: this.safeCheck(() => this.rootBeer.checkForRWPaths()),
          // Method yang mungkin tidak tersedia di versi 0.1.1
          checkRootManagementApps: this.safeCheck(() => {
            // Fallback manual check untuk root management apps
            return this.checkForRootApps();
          }),
          checkPotentiallyDangerousApps: this.safeCheck(() => {
            // Fallback manual check untuk dangerous apps
            return this.checkForDangerousApps();
          }),
          checkRootCloakingApps: this.safeCheck(() => {
            // Fallback manual check untuk root cloaking apps
            return this.checkForCloakingApps();
          }),
        };

        const isRooted = this.rootBeer.isRooted();

        resolve({
          isRooted,
          checks,
        });
      } catch (error) {
        console.error('Rootbeer performDetailedChecks error:', error);
        resolve({
          isRooted: false,
          checks: {},
        });
      }
    });
  }

  /**
   * Checks for specific binary
   * @param binaryName - name of binary to check
   * @returns Promise<boolean> - true if binary is found
   */
  checkForBinary(binaryName: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.rootBeer.checkForBinary(binaryName);
        resolve(result);
      } catch (error) {
        console.error('Rootbeer checkForBinary error:', error);
        resolve(false);
      }
    });
  }

  /**
   * Safe method execution with error handling
   */
  private safeCheck(checkFunction: () => boolean): boolean {
    try {
      return checkFunction();
    } catch (error) {
      console.warn('Check method not available or failed:', error);
      return false;
    }
  }

  /**
   * Manual check for root management apps
   */
  private checkForRootApps(): boolean {
    try {
      const packageManager = Utils.android.getApplicationContext().getPackageManager();
      const rootApps = ['com.noshufou.android.su', 'com.noshufou.android.su.elite', 'eu.chainfire.supersu', 'com.koushikdutta.superuser', 'com.thirdparty.superuser', 'com.yellowes.su', 'com.topjohnwu.magisk', 'com.kingroot.kinguser', 'com.kingo.root', 'com.smedialink.oneclickroot', 'com.zhiqupk.root.global', 'com.alephzain.framaroot'];

      for (const app of rootApps) {
        try {
          packageManager.getPackageInfo(app, 0);
          return true; // App found
        } catch (e) {
          // App not found, continue
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Manual check for potentially dangerous apps
   */
  private checkForDangerousApps(): boolean {
    try {
      const packageManager = Utils.android.getApplicationContext().getPackageManager();
      const dangerousApps = ['com.devadvance.rootcloak', 'com.devadvance.rootcloakplus', 'de.robv.android.xposed.installer', 'com.saurik.substrate', 'com.zachspong.temprootremovejb', 'com.amphoras.hidemyroot', 'com.amphoras.hidemyrootadfree', 'com.formyhm.hiderootPremium', 'com.formyhm.hideroot'];

      for (const app of dangerousApps) {
        try {
          packageManager.getPackageInfo(app, 0);
          return true; // App found
        } catch (e) {
          // App not found, continue
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Manual check for root cloaking apps
   */
  private checkForCloakingApps(): boolean {
    try {
      const packageManager = Utils.android.getApplicationContext().getPackageManager();
      const cloakingApps = ['com.devadvance.rootcloak', 'com.devadvance.rootcloakplus', 'com.koushikdutta.rommanager', 'com.koushikdutta.rommanager.license', 'com.dimonvideo.luckypatcher', 'com.chelpus.lackypatch', 'com.ramdroid.appquarantine', 'com.ramdroid.appquarantinepro'];

      for (const app of cloakingApps) {
        try {
          packageManager.getPackageInfo(app, 0);
          return true; // App found
        } catch (e) {
          // App not found, continue
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
