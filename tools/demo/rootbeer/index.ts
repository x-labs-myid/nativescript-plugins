import { DemoSharedBase } from '../utils';
import { Rootbeer, RootbeerCheckResult } from '../../../packages/rootbeer';

export class DemoSharedRootbeer extends DemoSharedBase {
  private rootbeer: Rootbeer;

  public isRooted = false;
  public isChecking = false;
  public checkResults: RootbeerCheckResult | null = null;
  public detailedResults: string = '';
  public individualResults: { [key: string]: boolean } = {};

  constructor() {
    super();
    this.rootbeer = new Rootbeer();
  }

  async testIt() {
    console.log('Testing basic root detection...');
    this.set('isChecking', true);

    try {
      const isRooted = await this.rootbeer.isRooted();
      this.set('isRooted', isRooted);
      console.log('Device is rooted:', isRooted);
    } catch (error) {
      console.error('Error checking root status:', error);
    } finally {
      this.set('isChecking', false);
    }
  }

  async testWithBusyBox() {
    console.log('Testing root detection with BusyBox...');
    this.set('isChecking', true);

    try {
      const isRooted = await this.rootbeer.isRootedWithBusyBoxCheck();
      this.set('isRooted', isRooted);
      console.log('Device is rooted (with BusyBox):', isRooted);
    } catch (error) {
      console.error('Error checking root with BusyBox:', error);
    } finally {
      this.set('isChecking', false);
    }
  }

  async performDetailedChecks() {
    console.log('Performing detailed root checks...');
    this.set('isChecking', true);

    try {
      const results = await this.rootbeer.performDetailedChecks();
      this.set('checkResults', results);

      const detailedText =
        `
Detailed Root Check Results:

` +
        `Overall Rooted: ${results.isRooted}\n` +
        `Root Management Apps: ${results.checkRootManagementApps}\n` +
        `Potentially Dangerous Apps: ${results.checkPotentiallyDangerousApps}\n` +
        `Root Cloaking Apps: ${results.checkRootCloakingApps}\n` +
        `Test Keys: ${results.checkTestKeys}\n` +
        `Dangerous Props: ${results.checkForDangerousProps}\n` +
        `BusyBox Binary: ${results.checkForBusyBoxBinary}\n` +
        `Su Binary: ${results.checkForSuBinary}\n` +
        `Su Exists: ${results.checkSuExists}\n` +
        `RW System: ${results.checkForRWSystem}`;

      this.set('detailedResults', detailedText);
      console.log(detailedText);
    } catch (error) {
      console.error('Error performing detailed checks:', error);
    } finally {
      this.set('isChecking', false);
    }
  }

  async checkRootManagementApps() {
    console.log('Checking for root management apps...');
    const result = await this.rootbeer.checkRootManagementApps();
    this.updateIndividualResult('Root Management Apps', result);
    console.log('Root management apps detected:', result);
  }

  async checkPotentiallyDangerousApps() {
    console.log('Checking for potentially dangerous apps...');
    const result = await this.rootbeer.checkPotentiallyDangerousApps();
    this.updateIndividualResult('Potentially Dangerous Apps', result);
    console.log('Potentially dangerous apps detected:', result);
  }

  async checkRootCloakingApps() {
    console.log('Checking for root cloaking apps...');
    const result = await this.rootbeer.checkRootCloakingApps();
    this.updateIndividualResult('Root Cloaking Apps', result);
    console.log('Root cloaking apps detected:', result);
  }

  async checkTestKeys() {
    console.log('Checking for test keys...');
    const result = await this.rootbeer.checkTestKeys();
    this.updateIndividualResult('Test Keys', result);
    console.log('Test keys detected:', result);
  }

  async checkForDangerousProps() {
    console.log('Checking for dangerous properties...');
    const result = await this.rootbeer.checkForDangerousProps();
    this.updateIndividualResult('Dangerous Properties', result);
    console.log('Dangerous properties detected:', result);
  }

  async checkForBusyBoxBinary() {
    console.log('Checking for BusyBox binary...');
    const result = await this.rootbeer.checkForBusyBoxBinary();
    this.updateIndividualResult('BusyBox Binary', result);
    console.log('BusyBox binary detected:', result);
  }

  async checkForSuBinary() {
    console.log('Checking for su binary...');
    const result = await this.rootbeer.checkForSuBinary();
    this.updateIndividualResult('Su Binary', result);
    console.log('Su binary detected:', result);
  }

  async checkSuExists() {
    console.log('Checking if su exists...');
    const result = await this.rootbeer.checkSuExists();
    this.updateIndividualResult('Su Exists', result);
    console.log('Su exists:', result);
  }

  async checkForRWSystem() {
    console.log('Checking for RW system...');
    const result = await this.rootbeer.checkForRWSystem();
    this.updateIndividualResult('RW System', result);
    console.log('RW system detected:', result);
  }

  async checkForCustomBinary() {
    console.log('Checking for custom binary...');
    const result = await this.rootbeer.checkForBinary('wget');
    this.updateIndividualResult('Custom Binary (wget)', result);
    console.log('Custom binary (wget) detected:', result);
  }

  private updateIndividualResult(checkName: string, result: boolean) {
    const currentResults = { ...this.get('individualResults') };
    currentResults[checkName] = result;
    this.set('individualResults', currentResults);
  }

  async runAllIndividualChecks() {
    console.log('Running all individual checks...');
    this.set('isChecking', true);

    try {
      await Promise.all([this.checkRootManagementApps(), this.checkPotentiallyDangerousApps(), this.checkRootCloakingApps(), this.checkTestKeys(), this.checkForDangerousProps(), this.checkForBusyBoxBinary(), this.checkForSuBinary(), this.checkSuExists(), this.checkForRWSystem(), this.checkForCustomBinary()]);

      console.log('All individual checks completed');
    } catch (error) {
      console.error('Error running individual checks:', error);
    } finally {
      this.set('isChecking', false);
    }
  }
}
