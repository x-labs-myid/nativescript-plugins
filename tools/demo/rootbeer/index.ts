import { DemoSharedBase } from '../utils';
import { Rootbeer } from '@x-labs-myid/rootbeer';
import { Observable } from '@nativescript/core';

export class DemoSharedRootbeer extends DemoSharedBase {
  private rootbeer: Rootbeer;
  private _isRooted: boolean = false;
  private _isChecking: boolean = false;
  private _checkResults: string = '';
  private _detailedResults: string = '';

  constructor() {
    super();
    this.rootbeer = new Rootbeer();
  }

  get isRooted(): boolean {
    return this._isRooted;
  }

  get isChecking(): boolean {
    return this._isChecking;
  }

  get checkResults(): string {
    return this._checkResults;
  }

  get detailedResults(): string {
    return this._detailedResults;
  }

  async testIt() {
    console.log('Testing rootbeer detection...');
    this._isChecking = true;
    this._checkResults = 'Checking...';
    this.notifyPropertyChange('isChecking', this._isChecking);
    this.notifyPropertyChange('checkResults', this._checkResults);

    try {
      // Basic root check
      const isRooted = await this.rootbeer.isRooted();
      this._isRooted = isRooted;
      this._checkResults = isRooted ? '🚨 Device appears to be ROOTED/JAILBROKEN!' : '✅ Device appears to be CLEAN';

      console.log('Root check result:', isRooted);

      this.notifyPropertyChange('isRooted', this._isRooted);
      this.notifyPropertyChange('checkResults', this._checkResults);
    } catch (error) {
      console.error('Error checking root:', error);
      this._checkResults = '❌ Error checking root status';
      this.notifyPropertyChange('checkResults', this._checkResults);
    } finally {
      this._isChecking = false;
      this.notifyPropertyChange('isChecking', this._isChecking);
    }
  }

  async testWithBusyBox() {
    console.log('Testing rootbeer with BusyBox check...');
    this._isChecking = true;
    this._checkResults = 'Checking with BusyBox...';
    this.notifyPropertyChange('isChecking', this._isChecking);
    this.notifyPropertyChange('checkResults', this._checkResults);

    try {
      const isRooted = await this.rootbeer.isRootedWithBusyBoxCheck();
      this._isRooted = isRooted;
      this._checkResults = isRooted ? '🚨 Device appears to be ROOTED (with BusyBox check)!' : '✅ Device appears to be CLEAN (with BusyBox check)';

      console.log('Root check with BusyBox result:', isRooted);

      this.notifyPropertyChange('isRooted', this._isRooted);
      this.notifyPropertyChange('checkResults', this._checkResults);
    } catch (error) {
      console.error('Error checking root with BusyBox:', error);
      this._checkResults = '❌ Error checking root status with BusyBox';
      this.notifyPropertyChange('checkResults', this._checkResults);
    } finally {
      this._isChecking = false;
      this.notifyPropertyChange('isChecking', this._isChecking);
    }
  }

  async performDetailedChecks() {
    console.log('Performing detailed root checks...');
    this._isChecking = true;
    this._detailedResults = 'Performing detailed checks...';
    this.notifyPropertyChange('isChecking', this._isChecking);
    this.notifyPropertyChange('detailedResults', this._detailedResults);

    try {
      const result = await this.rootbeer.performDetailedChecks();

      let detailedText = `Overall Result: ${result.isRooted ? 'ROOTED/JAILBROKEN' : 'CLEAN'}\n\n`;
      detailedText += 'Individual Checks:\n';

      Object.entries(result.checks).forEach(([key, value]) => {
        const icon = value ? '🚨' : '✅';
        const status = value ? 'DETECTED' : 'NOT DETECTED';
        detailedText += `${icon} ${key}: ${status}\n`;
      });

      this._detailedResults = detailedText;
      this._isRooted = result.isRooted;

      console.log('Detailed check results:', result);

      this.notifyPropertyChange('isRooted', this._isRooted);
      this.notifyPropertyChange('detailedResults', this._detailedResults);
    } catch (error) {
      console.error('Error performing detailed checks:', error);
      this._detailedResults = '❌ Error performing detailed checks';
      this.notifyPropertyChange('detailedResults', this._detailedResults);
    } finally {
      this._isChecking = false;
      this.notifyPropertyChange('isChecking', this._isChecking);
    }
  }

  async checkForSuBinary() {
    console.log('Checking for su binary...');
    this._isChecking = true;
    this._checkResults = 'Checking for su binary...';
    this.notifyPropertyChange('isChecking', this._isChecking);
    this.notifyPropertyChange('checkResults', this._checkResults);

    try {
      const found = await this.rootbeer.checkForBinary('su');
      this._checkResults = found ? '🚨 Su binary FOUND!' : '✅ Su binary NOT FOUND';

      console.log('Su binary check result:', found);
      this.notifyPropertyChange('checkResults', this._checkResults);
    } catch (error) {
      console.error('Error checking for su binary:', error);
      this._checkResults = '❌ Error checking for su binary';
      this.notifyPropertyChange('checkResults', this._checkResults);
    } finally {
      this._isChecking = false;
      this.notifyPropertyChange('isChecking', this._isChecking);
    }
  }

  async checkForBusyBoxBinary() {
    console.log('Checking for busybox binary...');
    this._isChecking = true;
    this._checkResults = 'Checking for busybox binary...';
    this.notifyPropertyChange('isChecking', this._isChecking);
    this.notifyPropertyChange('checkResults', this._checkResults);

    try {
      const found = await this.rootbeer.checkForBinary('busybox');
      this._checkResults = found ? '🚨 BusyBox binary FOUND!' : '✅ BusyBox binary NOT FOUND';

      console.log('BusyBox binary check result:', found);
      this.notifyPropertyChange('checkResults', this._checkResults);
    } catch (error) {
      console.error('Error checking for busybox binary:', error);
      this._checkResults = '❌ Error checking for busybox binary';
      this.notifyPropertyChange('checkResults', this._checkResults);
    } finally {
      this._isChecking = false;
      this.notifyPropertyChange('isChecking', this._isChecking);
    }
  }
}
