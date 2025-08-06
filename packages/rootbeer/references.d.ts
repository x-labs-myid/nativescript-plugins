/// <reference path="../../references.d.ts" />

// RootBeer Android Library Type Definitions
declare namespace com {
  namespace scottyab {
    namespace rootbeer {
      class RootBeer {
        constructor(context: android.content.Context);
        isRooted(): boolean;
        isRootedWithBusyBoxCheck(): boolean;
        checkRootManagementApps(): boolean;
        checkPotentiallyDangerousApps(): boolean;
        checkRootCloakingApps(): boolean;
        checkTestKeys(): boolean;
        checkForDangerousProps(): boolean;
        checkForBusyBoxBinary(): boolean;
        checkForSuBinary(): boolean;
        checkSuExists(): boolean;
        checkForRWPaths(): boolean;
        checkForBinary(binaryName: string): boolean;
      }
    }
  }
}
