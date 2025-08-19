export * from './common';
export * from './index.android';
export * from './index.ios';

// Explicit exports to ensure availability
export { FloatingTabBarCommon, TabItem, FloatingTabItem, IconHelper, FloatingTabBarConfig, ScrollConnection, FloatingTabBarState } from './common';

// XML element declarations
declare global {
  module '@nativescript/core' {
    interface HtmlView {
      FloatingTabBar: typeof import('./index.android').FloatingTabBar;
      TabItem: typeof import('./common').TabItem;
    }
  }
}
