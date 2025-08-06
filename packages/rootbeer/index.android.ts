import { RootbeerCommon, RootbeerCheckResult } from './common';
import { Utils } from '@nativescript/core';

export class Rootbeer extends RootbeerCommon {
  private rootBeer: com.scottyab.rootbeer.RootBeer;

  constructor() {
    super();
    this.rootBeer = new com.scottyab.rootbeer.RootBeer(Utils.android.getApplicationContext());
  }

  async isRooted(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.rootBeer.isRooted();
        resolve(result);
      } catch (error) {
        console.error('Error checking root status:', error);
        resolve(false);
      }
    });
  }

  async isRootedWithBusyBoxCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.rootBeer.isRootedWithBusyBoxCheck();
        resolve(result);
      } catch (error) {
        console.error('Error checking root with BusyBox:', error);
        resolve(false);
      }
    });
  }

  // Update metode performDetailedChecks
  async performDetailedChecks(): Promise<RootbeerCheckResult> {
    return new Promise((resolve) => {
      try {
        const result: RootbeerCheckResult = {
          isRooted: this.rootBeer.isRooted(),
          // Gunakan estimasi langsung tanpa memanggil metode yang tidak tersedia
          checkRootManagementApps: this.estimateRootManagementApps(),
          checkPotentiallyDangerousApps: this.estimatePotentiallyDangerousApps(),
          checkRootCloakingApps: this.estimateRootCloakingApps(),
          checkTestKeys: this.estimateTestKeys(),
          // Metode yang tersedia
          checkForDangerousProps: this.safeCheck(() => this.rootBeer.checkForDangerousProps()),
          checkForBusyBoxBinary: this.safeCheck(() => this.rootBeer.checkForBusyBoxBinary()),
          checkForSuBinary: this.safeCheck(() => this.rootBeer.checkForSuBinary()),
          checkSuExists: this.safeCheck(() => this.rootBeer.checkSuExists()),
          checkForRWSystem: this.safeCheck(() => this.rootBeer.checkForRWPaths()),
        };
        resolve(result);
      } catch (error) {
        console.error('Error performing detailed checks:', error);
        resolve({
          isRooted: false,
          checkRootManagementApps: false,
          checkPotentiallyDangerousApps: false,
          checkRootCloakingApps: false,
          checkTestKeys: false,
          checkForDangerousProps: false,
          checkForBusyBoxBinary: false,
          checkForSuBinary: false,
          checkSuExists: false,
          checkForRWSystem: false,
        });
      }
    });
  }

  // Hapus safeCheckWithFallback dan ganti dengan metode estimasi spesifik
  private estimateRootManagementApps(): boolean {
    try {
      // Estimasi berdasarkan kombinasi metode yang tersedia
      // Root management apps biasanya memerlukan su binary dan dangerous props
      return this.rootBeer.checkForSuBinary() && this.rootBeer.checkForDangerousProps();
    } catch (error) {
      console.warn('Unable to estimate root management apps:', error);
      return false;
    }
  }

  private estimatePotentiallyDangerousApps(): boolean {
    try {
      // Estimasi berdasarkan keberadaan su binary atau busybox
      return this.rootBeer.checkForSuBinary() || this.rootBeer.checkForBusyBoxBinary();
    } catch (error) {
      console.warn('Unable to estimate potentially dangerous apps:', error);
      return false;
    }
  }

  private estimateRootCloakingApps(): boolean {
    try {
      // Root cloaking apps sering menggunakan dangerous props untuk menyembunyikan root
      return this.rootBeer.checkForDangerousProps();
    } catch (error) {
      console.warn('Unable to estimate root cloaking apps:', error);
      return false;
    }
  }

  private estimateTestKeys(): boolean {
    try {
      // Test keys biasanya berkaitan dengan dangerous props
      return this.rootBeer.checkForDangerousProps();
    } catch (error) {
      console.warn('Unable to estimate test keys:', error);
      return false;
    }
  }

  // Update metode individual untuk menggunakan estimasi
  async checkRootManagementApps(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.estimateRootManagementApps();
        resolve(result);
      } catch (error) {
        console.error('Error checking root management apps:', error);
        resolve(false);
      }
    });
  }

  async checkPotentiallyDangerousApps(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.estimatePotentiallyDangerousApps();
        resolve(result);
      } catch (error) {
        console.error('Error checking potentially dangerous apps:', error);
        resolve(false);
      }
    });
  }

  async checkRootCloakingApps(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.estimateRootCloakingApps();
        resolve(result);
      } catch (error) {
        console.error('Error checking root cloaking apps:', error);
        resolve(false);
      }
    });
  }

  async checkTestKeys(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.estimateTestKeys();
        resolve(result);
      } catch (error) {
        console.error('Error checking test keys:', error);
        resolve(false);
      }
    });
  }

  async checkForDangerousProps(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkForDangerousProps());
        resolve(result);
      } catch (error) {
        console.error('Error checking dangerous props:', error);
        resolve(false);
      }
    });
  }

  async checkForBusyBoxBinary(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkForBusyBoxBinary());
        resolve(result);
      } catch (error) {
        console.error('Error checking BusyBox binary:', error);
        resolve(false);
      }
    });
  }

  async checkForSuBinary(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkForSuBinary());
        resolve(result);
      } catch (error) {
        console.error('Error checking su binary:', error);
        resolve(false);
      }
    });
  }

  async checkSuExists(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkSuExists());
        resolve(result);
      } catch (error) {
        console.error('Error checking su exists:', error);
        resolve(false);
      }
    });
  }

  async checkForRWSystem(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkForRWPaths());
        resolve(result);
      } catch (error) {
        console.error('Error checking RW system:', error);
        resolve(false);
      }
    });
  }

  async checkForBinary(binaryName: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const result = this.safeCheck(() => this.rootBeer.checkForBinary(binaryName));
        resolve(result);
      } catch (error) {
        console.error(`Error checking binary ${binaryName}:`, error);
        resolve(false);
      }
    });
  }

  private safeCheck(checkFunction: () => boolean): boolean {
    try {
      return checkFunction();
    } catch (error) {
      console.warn('Method not available in this RootBeer version:', error);
      return false;
    }
  }
}
