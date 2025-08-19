import { Observable } from '@nativescript/core';
import { FloatingTabBar, TabItem } from '@/floating-tab-bar';

export class DemoSharedFloatingTabBar extends Observable {
  testIt() {
    console.log('Testing floating tab bar...');
  }

  onTabSelected(args: any) {
    console.log('Tab selected:', args.selectedTabKey);
  }

  onStateChanged(args: any) {
    console.log('State changed:', args.state);
  }

  onScrollConnection(args: any) {
    console.log('Scroll connection:', args.scrollOffset);
  }
}
