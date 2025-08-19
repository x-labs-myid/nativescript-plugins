import { Observable, EventData, Page, ObservableArray } from '@nativescript/core';
import { DemoSharedFloatingTabBar } from '@demo/shared';
import { FloatingTabBar, TabItem, FloatingTabBarState, ScrollConnection } from '@/floating-tab-bar';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedFloatingTabBar {
  favoriteItems: ObservableArray<any>;
  searchResults: ObservableArray<any>;

  // New properties for enhanced demo
  private _isInlineMode: boolean = false;
  private _scrollBehavior: string = 'onScrollDown';
  private _scrollOffset: number = 0;
  private _tabState: string = 'expanded';
  private _currentState: string = 'Tab bar is in expanded mode';
  private _searchText: string = '';
  private _favoriteCount: number = 3;
  private _tabVisitCount: number = 0;
  private _scrollEventCount: number = 0;
  private _stateChangeCount: number = 0;

  private _scrollBehaviors = ['onScrollDown', 'onScrollUp', 'never', 'always'];
  private _currentBehaviorIndex = 0;

  constructor() {
    super();

    // Initialize favorite items
    this.favoriteItems = new ObservableArray([{ title: 'Item Favorit 1' }, { title: 'Item Favorit 2' }, { title: 'Item Favorit 3' }]);

    // Initialize search results
    this.searchResults = new ObservableArray([]);

    // Set initial scroll behavior
    this._scrollBehavior = this._scrollBehaviors[this._currentBehaviorIndex];
  }

  // Getters for binding
  get isInlineMode(): boolean {
    return this._isInlineMode;
  }

  get scrollBehavior(): string {
    return this._scrollBehavior;
  }

  get scrollOffset(): number {
    return this._scrollOffset;
  }

  get tabState(): string {
    return this._tabState;
  }

  get currentState(): string {
    return this._currentState;
  }

  get currentScrollBehavior(): string {
    return this._scrollBehavior;
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    this._searchText = value;
    this.notifyPropertyChange('searchText', value);
  }

  get favoriteCount(): number {
    return this._favoriteCount;
  }

  get tabVisitCount(): number {
    return this._tabVisitCount;
  }

  get scrollEventCount(): number {
    return this._scrollEventCount;
  }

  get stateChangeCount(): number {
    return this._stateChangeCount;
  }

  // Event handlers
  onTabSelected(args: any) {
    super.onTabSelected(args);
    console.log('Demo - Tab selected:', args.selectedTabKey);

    this._tabVisitCount++;
    this.notifyPropertyChange('tabVisitCount', this._tabVisitCount);

    // Handle tab selection logic here
    switch (args.selectedTabKey) {
      case 'home':
        console.log('Showing home content');
        break;
      case 'search':
        console.log('Showing search content');
        break;
      case 'favorites':
        console.log('Showing favorites content');
        break;
      case 'profile':
        console.log('Showing profile content');
        break;
    }
  }

  onStateChanged(args: any) {
    super.onStateChanged(args);
    console.log('Demo - State changed:', args.state);

    this._stateChangeCount++;
    this.notifyPropertyChange('stateChangeCount', this._stateChangeCount);

    const state: FloatingTabBarState = args.state;

    if (state.isInline) {
      this._tabState = 'inline';
      this._currentState = 'Tab bar is in inline mode';
      console.log('Tab bar is now inline');
    } else {
      this._tabState = 'expanded';
      this._currentState = 'Tab bar is in expanded mode';
      console.log('Tab bar is now expanded');
    }

    this.notifyPropertyChange('tabState', this._tabState);
    this.notifyPropertyChange('currentState', this._currentState);
  }

  onScrollConnection(args: any) {
    super.onScrollConnection(args);
    console.log('Demo - Scroll offset:', args.scrollOffset, 'Direction:', args.direction);

    this._scrollEventCount++;
    this._scrollOffset = args.scrollOffset;

    this.notifyPropertyChange('scrollEventCount', this._scrollEventCount);
    this.notifyPropertyChange('scrollOffset', this._scrollOffset);
  }

  onScrollChanged(args: any) {
    // Handle ScrollView scroll events
    const scrollView = args.object;
    const scrollY = scrollView.verticalOffset;

    // You can connect this to the floating tab bar if needed
    console.log('ScrollView offset:', scrollY);
  }

  // Demo control methods
  toggleInlineMode() {
    this._isInlineMode = !this._isInlineMode;
    this.notifyPropertyChange('isInlineMode', this._isInlineMode);

    this._currentState = this._isInlineMode ? 'Tab bar forced to inline mode' : 'Tab bar returned to auto mode';
    this.notifyPropertyChange('currentState', this._currentState);

    console.log('Toggled inline mode:', this._isInlineMode);
  }

  changeScrollBehavior() {
    this._currentBehaviorIndex = (this._currentBehaviorIndex + 1) % this._scrollBehaviors.length;
    this._scrollBehavior = this._scrollBehaviors[this._currentBehaviorIndex];

    this.notifyPropertyChange('scrollBehavior', this._scrollBehavior);
    this.notifyPropertyChange('currentScrollBehavior', this._scrollBehavior);

    console.log('Changed scroll behavior to:', this._scrollBehavior);
  }

  // Search functionality
  performSearch() {
    if (!this._searchText || this._searchText.trim() === '') {
      this.searchResults.splice(0);
      return;
    }

    // Simulate search results
    const mockResults = [{ title: `Result for "${this._searchText}" - Item 1` }, { title: `Result for "${this._searchText}" - Item 2` }, { title: `Result for "${this._searchText}" - Item 3` }];

    this.searchResults.splice(0);
    mockResults.forEach((result) => this.searchResults.push(result));

    console.log('Performed search for:', this._searchText);
  }

  // Favorites functionality
  addFavorite() {
    const newItem = {
      title: `New Favorite ${this.favoriteItems.length + 1} - ${new Date().toLocaleTimeString()}`,
    };
    this.favoriteItems.push(newItem);

    this._favoriteCount = this.favoriteItems.length;
    this.notifyPropertyChange('favoriteCount', this._favoriteCount);

    console.log('Added new favorite:', newItem.title);
  }

  removeFavorite(args: any) {
    const item = args.object.bindingContext;
    const index = this.favoriteItems.indexOf(item);
    if (index > -1) {
      this.favoriteItems.splice(index, 1);

      this._favoriteCount = this.favoriteItems.length;
      this.notifyPropertyChange('favoriteCount', this._favoriteCount);

      console.log('Removed favorite:', item.title);
    }
  }

  clearFavorites() {
    this.favoriteItems.splice(0);

    this._favoriteCount = 0;
    this.notifyPropertyChange('favoriteCount', this._favoriteCount);

    console.log('Cleared all favorites');
  }

  // Stats functionality
  resetStats() {
    this._tabVisitCount = 0;
    this._scrollEventCount = 0;
    this._stateChangeCount = 0;

    this.notifyPropertyChange('tabVisitCount', this._tabVisitCount);
    this.notifyPropertyChange('scrollEventCount', this._scrollEventCount);
    this.notifyPropertyChange('stateChangeCount', this._stateChangeCount);

    console.log('Reset all stats');
  }
}
