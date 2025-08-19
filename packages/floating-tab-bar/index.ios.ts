import { FloatingTabBarCommon, TabItem, IconHelper } from './common';
import type { FloatingTabItem, ScrollConnection, FloatingTabBarConfig, FloatingTabBarState } from './common';

// Re-export components from common for external use (values vs types)
export { TabItem, IconHelper } from './common';
export type { FloatingTabItem, FloatingTabBarConfig, ScrollConnection, FloatingTabBarState } from './common';

export class FloatingTabBar extends FloatingTabBarCommon {
  createNativeView(): UIView {
    // TODO: Implement iOS native view
    const view = UIView.new();
    return view;
  }

  protected updateTabs(): void {
    // TODO: Implement iOS tab updates
    console.log('iOS updateTabs - not implemented yet');
  }

  protected updateAppearance(): void {
    // TODO: Implement iOS appearance updates
    console.log('iOS updateAppearance - not implemented yet');
  }

  protected updateState(): void {
    // TODO: Implement iOS state updates
    console.log('iOS updateState - not implemented yet');
  }

  protected updateTabSelection(tabKey: string): void {
    // TODO: Implement iOS tab selection
    console.log('iOS updateTabSelection - not implemented yet:', tabKey);
  }
}
