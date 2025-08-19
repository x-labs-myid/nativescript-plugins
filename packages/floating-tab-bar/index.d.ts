export * from './common';
export * from './index.android';
export * from './index.ios';

// XML element declarations
declare global {
  module '@nativescript/core' {
    interface HtmlView {
      FloatingTabBar: typeof import('./index.android').FloatingTabBar;
      TabItem: typeof import('./common').TabItem;
    }
  }
}
