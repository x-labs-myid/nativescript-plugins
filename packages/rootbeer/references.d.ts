/// <reference path="../../references.d.ts" />

// RootBeer Android Library Type Definitions berdasarkan dokumentasi resmi
declare namespace com {
  namespace scottyab {
    namespace rootbeer {
      class RootBeer {
        constructor(context: android.content.Context);

        // Basic checks
        isRooted(): boolean;
        isRootedWithBusyBoxCheck(): boolean;

        // Java checks - sesuai dokumentasi GitHub
        checkRootManagementApps(): boolean;
        checkPotentiallyDangerousApps(): boolean;
        checkRootCloakingApps(): boolean;
        checkTestKeys(): boolean;
        checkForDangerousProps(): boolean;
        checkForBusyBoxBinary(): boolean;
        checkForSuBinary(): boolean;
        checkSuExists(): boolean;
        checkForRWPaths(): boolean; // Ubah dari checkForRWSystem ke checkForRWPaths
        checkForBinary(binaryName: string): boolean;
      }
    }
  }
}
