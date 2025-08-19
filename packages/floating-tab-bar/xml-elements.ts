import { FloatingTabBar } from './index';
import { TabItem } from './common';

// Register XML elements
export function registerElements() {
  // Register FloatingTabBar
  global.registerElement('FloatingTabBar', () => FloatingTabBar);

  // Register TabItem
  global.registerElement('TabItem', () => TabItem);
}

// Auto-register when module is loaded
registerElements();
