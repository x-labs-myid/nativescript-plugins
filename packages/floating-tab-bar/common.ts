import { Observable, EventData, View, Color, ContentView, Frame, Image } from '@nativescript/core';

// Updated FloatingTabBarConfig interface dengan properti baru dari compose-floating-tab-bar
export interface FloatingTabBarConfig {
  tabBarBackgroundColor?: string; // Renamed to avoid conflict
  borderRadius?: number;
  cornerRadius?: number; // Alias untuk borderRadius
  elevation?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  padding?:
    | {
        horizontal?: number;
        vertical?: number;
      }
    | number; // Support single number value
  margin?:
    | {
        horizontal?: number;
        vertical?: number;
      }
    | number; // Support single number value
  // Properti baru untuk compose-floating-tab-bar behavior
  isInline?: boolean;
  scrollBehavior?: 'onScrollDown' | 'onScrollUp' | 'never' | 'always';
  animationDuration?: number;
  tabBarHeight?: number;
  expandedHeight?: number;
  inlineHeight?: number;
}

// Enhanced ScrollConnection interface
export interface ScrollConnection {
  onScrollChanged?: (offset: number) => void;
  onScrollStateChanged?: (state: string) => void;
  // Tambahan untuk compose-floating-tab-bar
  scrollThreshold?: number;
  enableScrollConnection?: boolean;
}

// Enhanced FloatingTabBarState interface
export interface FloatingTabBarState {
  isInline: boolean;
  selectedTabKey: string;
  isAnimating: boolean;
  scrollOffset: number;
  // Tambahan state properties
  isExpanded: boolean;
  canTransition: boolean;
  lastScrollDirection: 'up' | 'down' | 'none';
}

// Tab Item sebagai View yang dapat menampung konten
export class TabItem extends ContentView {
  private _title: string = '';
  private _icon: string = '';
  private _iconClass: string = '';
  private _isStandalone: boolean = false;
  private _badge: string | number = '';
  private _badgeColor: string = '';
  private _enabled: boolean = true;
  private _key: string = '';

  constructor() {
    super();
    this._key = this.generateUniqueKey();
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.notifyPropertyChange('title', value);
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
    this.notifyPropertyChange('icon', value);
  }

  get iconClass(): string {
    return this._iconClass;
  }

  set iconClass(value: string) {
    this._iconClass = value;
    this.notifyPropertyChange('iconClass', value);
  }

  get isStandalone(): boolean {
    return this._isStandalone;
  }

  set isStandalone(value: boolean) {
    this._isStandalone = value;
    this.notifyPropertyChange('isStandalone', value);
  }

  get badge(): string | number {
    return this._badge;
  }

  set badge(value: string | number) {
    this._badge = value;
    this.notifyPropertyChange('badge', value);
  }

  get badgeColor(): string {
    return this._badgeColor;
  }

  set badgeColor(value: string) {
    this._badgeColor = value;
    this.notifyPropertyChange('badgeColor', value);
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.notifyPropertyChange('enabled', value);
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
    this.notifyPropertyChange('key', value);
  }

  private generateUniqueKey(): string {
    return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Method untuk mendapatkan data tab untuk floating tab bar
  getTabData(): FloatingTabItem {
    return {
      key: this.key,
      title: this.title,
      icon: this.icon,
      iconClass: this.iconClass,
      isStandalone: this.isStandalone,
      badge: this.badge,
      badgeColor: this.badgeColor,
      enabled: this.enabled,
      content: this.content,
    };
  }
}

// Updated FloatingTabItem Interface
export interface FloatingTabItem {
  key: string;
  title?: string;
  icon?: string;
  iconClass?: string; // CSS class untuk font icon
  isStandalone?: boolean;
  badge?: string | number;
  badgeColor?: string;
  enabled?: boolean;
  content?: View; // Konten tab (bisa Layout atau Frame)
}

// Icon Helper untuk mendukung berbagai format icon
export class IconHelper {
  static createIconImage(iconSource: string, iconClass?: string): Image {
    const image = new Image();

    if (iconSource.startsWith('font://')) {
      // Font icon
      image.src = iconSource;
      if (iconClass) {
        image.className = iconClass;
      }
    } else if (iconSource.startsWith('res://')) {
      // Resource icon (Android)
      image.src = iconSource;
    } else if (iconSource.startsWith('sys://')) {
      // System icon (iOS SF Symbols)
      image.src = iconSource;
    } else if (iconSource.startsWith('http://') || iconSource.startsWith('https://')) {
      // URL icon
      image.src = iconSource;
    } else if (iconSource.startsWith('~/')) {
      // Asset icon
      image.src = iconSource;
    } else {
      // Assume it's a font icon character
      image.src = `font://${iconSource}`;
      if (iconClass) {
        image.className = iconClass;
      }
    }

    return image;
  }
}

// Main FloatingTabBar class yang extends ContentView untuk XML support
export abstract class FloatingTabBarCommon extends ContentView {
  protected _tabItems: TabItem[] = [];
  protected _tabs: FloatingTabItem[] = [];
  protected _selectedTabKey: string = '';
  protected _state: FloatingTabBarState;
  protected _config: FloatingTabBarConfig = {};

  // Properti baru untuk compose-floating-tab-bar (renamed to avoid conflicts)
  private _tabBarBackgroundColor: string = '#FFFFFF';
  private _cornerRadius: number = 25;
  private _shadowColor: string = '#000000';
  private _shadowOpacity: number = 0.1;
  private _shadowRadius: number = 10;
  private _tabBarMargin: number = 16;
  private _tabBarPadding: number = 8;
  private _isInline: boolean = false;
  private _scrollBehavior: string = 'onScrollDown';

  constructor() {
    super();
    this._state = {
      isInline: false,
      selectedTabKey: '',
      isAnimating: false,
      scrollOffset: 0,
      isExpanded: true,
      canTransition: true,
      lastScrollDirection: 'none',
    };
  }

  // Getter dan Setter untuk properti baru (renamed to avoid conflicts)
  get tabBarBackgroundColor(): string {
    return this._tabBarBackgroundColor;
  }

  set tabBarBackgroundColor(value: string) {
    this._tabBarBackgroundColor = value;
    this.notifyPropertyChange('tabBarBackgroundColor', value);
    this.updateAppearance();
  }

  // Support for XML backgroundColor attribute (maps to tabBarBackgroundColor)
  // Hapus bagian ini yang menyebabkan konflik:
  // set backgroundColor(value: string) {
  //   this.tabBarBackgroundColor = value;
  // }
  //
  // get backgroundColor(): string {
  //   return this.tabBarBackgroundColor;
  // }

  get cornerRadius(): number {
    return this._cornerRadius;
  }

  set cornerRadius(value: number) {
    this._cornerRadius = value;
    this.notifyPropertyChange('cornerRadius', value);
    this.updateAppearance();
  }

  get shadowColor(): string {
    return this._shadowColor;
  }

  set shadowColor(value: string) {
    this._shadowColor = value;
    this.notifyPropertyChange('shadowColor', value);
    this.updateAppearance();
  }

  get shadowOpacity(): number {
    return this._shadowOpacity;
  }

  set shadowOpacity(value: number) {
    this._shadowOpacity = value;
    this.notifyPropertyChange('shadowOpacity', value);
    this.updateAppearance();
  }

  get shadowRadius(): number {
    return this._shadowRadius;
  }

  set shadowRadius(value: number) {
    this._shadowRadius = value;
    this.notifyPropertyChange('shadowRadius', value);
    this.updateAppearance();
  }

  get tabBarMargin(): number {
    return this._tabBarMargin;
  }

  set tabBarMargin(value: number) {
    this._tabBarMargin = value;
    this.notifyPropertyChange('tabBarMargin', value);
    this.updateAppearance();
  }

  // Support for XML margin attribute

  get tabBarPadding(): number {
    return this._tabBarPadding;
  }

  set tabBarPadding(value: number) {
    this._tabBarPadding = value;
    this.notifyPropertyChange('tabBarPadding', value);
    this.updateAppearance();
  }

  get isInline(): boolean {
    return this._isInline;
  }

  set isInline(value: boolean) {
    this._isInline = value;
    this._state.isInline = value;
    this.notifyPropertyChange('isInline', value);
    this.updateState();
  }

  get scrollBehavior(): string {
    return this._scrollBehavior;
  }

  set scrollBehavior(value: string) {
    this._scrollBehavior = value;
    this.notifyPropertyChange('scrollBehavior', value);
  }

  get selectedTabKey(): string {
    return this._selectedTabKey;
  }

  set selectedTabKey(value: string) {
    this._selectedTabKey = value;
    this._state.selectedTabKey = value;
    this.notifyPropertyChange('selectedTabKey', value);
    this.updateTabSelection(value);
  }

  // Event handlers
  public static tabSelectedEvent = 'tabSelected';
  public static stateChangedEvent = 'stateChanged';
  public static scrollConnectionEvent = 'scrollConnection';

  // Add dpToPx utility method
  protected dpToPx(dp: number): number {
    const density = (global as any).android?.content?.res?.displayMetrics?.density || 1;
    return dp * density;
  }

  // Abstract methods yang harus diimplementasikan di platform-specific
  protected abstract updateTabs(): void;
  protected abstract updateAppearance(): void;
  protected abstract updateState(): void;
  protected abstract updateTabSelection(tabKey: string): void;

  // Override untuk menangani child views (TabItem)
  public _addChildFromBuilder(name: string, value: any): void {
    if (value instanceof TabItem) {
      this.addTabItem(value);
    } else {
      super._addChildFromBuilder(name, value);
    }
  }

  // Method untuk menambah TabItem
  addTabItem(tabItem: TabItem): void {
    this._tabItems.push(tabItem);
    this.updateTabsFromItems();
  }

  // Method untuk mengupdate tabs dari TabItem
  private updateTabsFromItems(): void {
    this._tabs = this._tabItems.map((item) => item.getTabData());
    this.updateTabs();
  }

  // Method untuk mendapatkan konten tab yang aktif
  getActiveTabContent(): View | null {
    const activeTab = this._tabs.find((tab) => tab.key === this._selectedTabKey);
    return activeTab?.content || null;
  }

  // Method untuk handle scroll events
  public onScrollChanged(offset: number): void {
    this._state.scrollOffset = offset;

    // Determine scroll direction
    const direction = offset > 0 ? 'down' : 'up';
    this._state.lastScrollDirection = direction;

    // Handle state transition based on scroll behavior
    this.handleScrollTransition(offset, direction);

    // Emit scroll connection event
    this.notify({
      eventName: FloatingTabBarCommon.scrollConnectionEvent,
      object: this,
      scrollOffset: offset,
      direction: direction,
    });
  }

  // Method untuk handle scroll-based state transitions
  private handleScrollTransition(offset: number, direction: 'up' | 'down'): void {
    if (!this._state.canTransition || this._state.isAnimating) {
      return;
    }

    const threshold = 50; // Scroll threshold in pixels

    switch (this._scrollBehavior) {
      case 'onScrollDown':
        if (direction === 'down' && Math.abs(offset) > threshold && !this._state.isInline) {
          this.transitionToInline();
        } else if (direction === 'up' && this._state.isInline) {
          this.transitionToExpanded();
        }
        break;
      case 'onScrollUp':
        if (direction === 'up' && Math.abs(offset) > threshold && !this._state.isInline) {
          this.transitionToInline();
        } else if (direction === 'down' && this._state.isInline) {
          this.transitionToExpanded();
        }
        break;
      case 'never':
        // No automatic transitions
        break;
      case 'always':
        // Always inline
        if (!this._state.isInline) {
          this.transitionToInline();
        }
        break;
    }
  }

  // Method untuk transisi ke inline state
  protected transitionToInline(): void {
    if (this._state.isInline || this._state.isAnimating) {
      return;
    }

    this._state.isAnimating = true;
    this._state.isInline = true;
    this._state.isExpanded = false;

    this.updateState();

    this.notify({
      eventName: FloatingTabBarCommon.stateChangedEvent,
      object: this,
      state: this._state,
    });
  }

  // Method untuk transisi ke expanded state
  protected transitionToExpanded(): void {
    if (!this._state.isInline || this._state.isAnimating) {
      return;
    }

    this._state.isAnimating = true;
    this._state.isInline = false;
    this._state.isExpanded = true;

    this.updateState();

    this.notify({
      eventName: FloatingTabBarCommon.stateChangedEvent,
      object: this,
      state: this._state,
    });
  }

  // Method untuk handle tab selection
  protected onTabSelected(tabKey: string): void {
    this._selectedTabKey = tabKey;
    this._state.selectedTabKey = tabKey;

    this.updateTabSelection(tabKey);

    this.notify({
      eventName: FloatingTabBarCommon.tabSelectedEvent,
      object: this,
      selectedTabKey: tabKey,
    });
  }
}
