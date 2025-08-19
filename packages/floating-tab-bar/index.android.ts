import { FloatingTabBarCommon, TabItem, IconHelper } from './common';
import type { FloatingTabItem, ScrollConnection, FloatingTabBarConfig, FloatingTabBarState } from './common';

// Re-export components from common for external use (values vs types)
export { TabItem, IconHelper } from './common';
export type { FloatingTabItem, FloatingTabBarConfig, ScrollConnection, FloatingTabBarState } from './common';

export class FloatingTabBar extends FloatingTabBarCommon {
  private _mainContainer: android.widget.LinearLayout; // Renamed to avoid any potential conflicts
  private _tabContainer: android.widget.LinearLayout;
  private _contentContainer: android.widget.FrameLayout;
  private _accessoryContainer: android.widget.FrameLayout;
  private _currentAnimator: android.animation.ValueAnimator;
  private _scrollConnection: ScrollConnection | null = null;
  private _isInitialized = false;
  private _lastScrollY = 0;
  private _scrollDirection: 'up' | 'down' | 'none' = 'none';

  createNativeView(): android.widget.LinearLayout {
    // Create main container
    this._mainContainer = new android.widget.LinearLayout(this._context);
    this._mainContainer.setOrientation(android.widget.LinearLayout.VERTICAL);
    this._mainContainer.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT));

    // Create content container
    this._contentContainer = new android.widget.FrameLayout(this._context);
    this._contentContainer.setLayoutParams(
      new android.widget.LinearLayout.LayoutParams(
        android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
        0,
        1.0, // weight
      ),
    );

    // Create accessory container
    this._accessoryContainer = new android.widget.FrameLayout(this._context);
    this._accessoryContainer.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT));

    // Create tab container
    this._tabContainer = new android.widget.LinearLayout(this._context);
    this._tabContainer.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    this._tabContainer.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT));

    // Setup tab container appearance
    this.setupTabContainerAppearance();

    // Add containers to main container
    this._mainContainer.addView(this._contentContainer);
    this._mainContainer.addView(this._accessoryContainer);
    this._mainContainer.addView(this._tabContainer);

    // Set initialized flag BEFORE calling update methods
    this._isInitialized = true;

    // Initialize tabs and appearance
    this.updateTabs();
    this.updateAppearance();
    this.updateState();

    return this._mainContainer;
  }

  protected updateTabs(): void {
    if (!this._tabContainer || !this._isInitialized) return;

    // Clear existing tabs
    this._tabContainer.removeAllViews();

    // Create tab views
    this._tabs.forEach((tab, index) => {
      this.createTabView(tab, index);
    });

    // Update tab content
    this.updateTabContent();
  }

  private setupTabContainerAppearance(): void {
    if (!this._tabContainer) return;

    // Set background color
    const backgroundColor = android.graphics.Color.parseColor(this.tabBarBackgroundColor);
    this._tabContainer.setBackgroundColor(backgroundColor);

    // Set corner radius
    if (this.cornerRadius > 0) {
      const drawable = new android.graphics.drawable.GradientDrawable();
      drawable.setColor(backgroundColor);
      drawable.setCornerRadius(this.dpToPx(this.cornerRadius));
      this._tabContainer.setBackground(drawable);
    }

    // Set elevation/shadow
    if (android.os.Build.VERSION.SDK_INT >= 21) {
      this._tabContainer.setElevation(this.dpToPx(this.shadowRadius));
    }

    // Set padding
    const padding = this.dpToPx(this.tabBarPadding);
    this._tabContainer.setPadding(padding, padding, padding, padding);

    // Set margin
    const margin = this.dpToPx(this.tabBarMargin);
    const layoutParams = this._tabContainer.getLayoutParams() as android.widget.LinearLayout.LayoutParams;
    layoutParams.setMargins(margin, margin, margin, margin);
    this._tabContainer.setLayoutParams(layoutParams);
  }

  protected updateAppearance(): void {
    this.setupTabContainerAppearance();
  }

  protected updateState(): void {
    if (!this._isInitialized) return;

    // Update visual state based on current state
    this.animateToState(this._state.isInline);
  }

  protected updateTabSelection(tabKey: string): void {
    if (!this._tabContainer) return;

    for (let i = 0; i < this._tabContainer.getChildCount(); i++) {
      const tabView = this._tabContainer.getChildAt(i) as android.widget.LinearLayout;
      const isSelected = this._tabs[i]?.key === tabKey;
      this.updateTabSelectionVisual(tabView, isSelected);
    }
  }

  private createTabView(tab: FloatingTabItem, index: number): void {
    const tabView = new android.widget.LinearLayout(this._context);
    tabView.setOrientation(android.widget.LinearLayout.VERTICAL);
    tabView.setGravity(android.view.Gravity.CENTER);

    const layoutParams = new android.widget.LinearLayout.LayoutParams(
      0,
      android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
      1.0, // equal weight
    );
    tabView.setLayoutParams(layoutParams);

    // Create icon view
    if (tab.icon) {
      const iconView = this.createIconView(tab.icon, tab.iconClass);
      if (iconView) {
        tabView.addView(iconView);
      }
    }

    // Create title view (if not standalone)
    if (!tab.isStandalone && tab.title) {
      const titleView = new android.widget.TextView(this._context);
      titleView.setText(tab.title);
      titleView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 12);
      titleView.setGravity(android.view.Gravity.CENTER);

      const titleParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
      titleParams.topMargin = this.dpToPx(4);
      titleView.setLayoutParams(titleParams);

      tabView.addView(titleView);
    }

    // Add badge if present
    if (tab.badge) {
      this.addBadgeToTab(tabView, tab.badge, tab.badgeColor);
    }

    // Set click listener
    tabView.setOnClickListener(
      new android.view.View.OnClickListener({
        onClick: () => {
          if (tab.enabled !== false) {
            this.selectedTabKey = tab.key;
            this.onTabSelected(tab.key);
          }
        },
      }),
    );

    // Set enabled state
    tabView.setEnabled(tab.enabled !== false);
    tabView.setAlpha(tab.enabled !== false ? 1.0 : 0.5);

    this._tabContainer.addView(tabView);
  }

  private createIconView(iconSource: string, iconClass?: string): android.view.View | null {
    if (iconSource.startsWith('font://')) {
      // Font icon
      const textView = new android.widget.TextView(this._context);
      const iconCode = iconSource.replace('font://', '');
      textView.setText(iconCode);
      textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 24);
      textView.setGravity(android.view.Gravity.CENTER);

      // Apply icon class styling if provided
      if (iconClass) {
        // You can implement custom styling based on iconClass here
        // For example, set different font families or colors
      }

      const layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
      textView.setLayoutParams(layoutParams);

      return textView;
    } else if (iconSource.startsWith('res://')) {
      // Resource icon
      const imageView = new android.widget.ImageView(this._context);
      const resourceName = iconSource.replace('res://', '');
      this.loadIconIntoImageView(imageView, resourceName);

      const layoutParams = new android.widget.LinearLayout.LayoutParams(this.dpToPx(24), this.dpToPx(24));
      imageView.setLayoutParams(layoutParams);
      imageView.setScaleType(android.widget.ImageView.ScaleType.CENTER_INSIDE);

      return imageView;
    } else if (iconSource.startsWith('sys://')) {
      // System icon (iOS style, convert to Android equivalent)
      const imageView = new android.widget.ImageView(this._context);
      // Convert iOS system icon to Android equivalent
      // This is a simplified implementation
      const layoutParams = new android.widget.LinearLayout.LayoutParams(this.dpToPx(24), this.dpToPx(24));
      imageView.setLayoutParams(layoutParams);

      return imageView;
    }

    return null;
  }

  private loadIconIntoImageView(imageView: android.widget.ImageView, iconSource: string): void {
    try {
      const context = this._context;
      const resourceId = context.getResources().getIdentifier(iconSource, 'drawable', context.getPackageName());

      if (resourceId !== 0) {
        imageView.setImageResource(resourceId);
      } else {
        console.warn(`Resource not found: ${iconSource}`);
      }
    } catch (error) {
      console.error('Error loading icon resource:', error);
    }
  }

  private addBadgeToTab(tabView: android.widget.LinearLayout, badge: string | number, badgeColor?: string): void {
    const badgeView = new android.widget.TextView(this._context);
    badgeView.setText(badge.toString());
    badgeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 10);
    badgeView.setTextColor(android.graphics.Color.WHITE);

    // Create circular background
    const drawable = new android.graphics.drawable.GradientDrawable();
    drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL);
    drawable.setColor(android.graphics.Color.parseColor(badgeColor || '#FF0000'));
    badgeView.setBackground(drawable);

    // Set padding
    const padding = this.dpToPx(4);
    badgeView.setPadding(padding, padding, padding, padding);

    // Position badge
    const layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
    badgeView.setLayoutParams(layoutParams);

    tabView.addView(badgeView);
  }

  private updateTabSelectionVisual(tabView: android.widget.LinearLayout, isSelected: boolean): void {
    if (isSelected) {
      tabView.setAlpha(1.0);
      // Add selection indicator or change background
      tabView.setBackgroundColor(android.graphics.Color.parseColor('#E0E0E0'));
    } else {
      tabView.setAlpha(0.7);
      tabView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
    }
  }

  private updateTabContent(): void {
    if (!this._contentContainer) return;

    // Clear existing content
    this._contentContainer.removeAllViews();

    // Find active tab content
    const activeTab = this._tabs.find((tab) => tab.key === this.selectedTabKey);
    if (activeTab && activeTab.content) {
      // Add active tab content to content container
      const contentView = activeTab.content.nativeView as android.view.View;
      if (contentView) {
        this._contentContainer.addView(contentView);
      }
    }
  }

  async animateToState(isInline: boolean): Promise<void> {
    if (!this._tabContainer || !this._isInitialized) return;

    // Cancel any existing animation
    if (this._currentAnimator) {
      this._currentAnimator.cancel();
    }

    const startHeight = this._tabContainer.getHeight();
    const targetHeight = isInline ? this.dpToPx(40) : this.dpToPx(60);

    this._currentAnimator = android.animation.ValueAnimator.ofInt([startHeight, targetHeight]);
    this._currentAnimator.setDuration(300);

    this._currentAnimator.addUpdateListener(
      new android.animation.ValueAnimator.AnimatorUpdateListener({
        onAnimationUpdate: (animator) => {
          const value = animator.getAnimatedValue() as number;
          const layoutParams = this._tabContainer.getLayoutParams();
          layoutParams.height = value;
          this._tabContainer.setLayoutParams(layoutParams);
        },
      }),
    );

    this._currentAnimator.addListener(
      Object.create(android.animation.AnimatorListenerAdapter.prototype, {
        onAnimationEnd: {
          value: () => {
            this._currentAnimator = null;
            // Update state after animation
            this._state.isInline = isInline;
            this._state.isAnimating = false;

            // Notify state change
            this.notify({
              eventName: FloatingTabBarCommon.stateChangedEvent,
              object: this,
              state: this._state,
            });
          },
        },
      }),
    );

    this._state.isAnimating = true;
    this._currentAnimator.start();
  }

  attachScrollConnection(scrollConnection: ScrollConnection): void {
    this._scrollConnection = scrollConnection;
    console.log('Scroll connection attached');
  }

  detachScrollConnection(): void {
    this._scrollConnection = null;
    console.log('Scroll connection detached');
  }

  handleScrollEvent(scrollY: number): void {
    if (!this._scrollConnection || !this._isInitialized) return;

    const direction = scrollY > this._lastScrollY ? 'down' : 'up';
    this._scrollDirection = direction;
    this._lastScrollY = scrollY;

    // Update scroll offset in state
    this._state.scrollOffset = scrollY;
    this._state.lastScrollDirection = direction;

    // Handle scroll-based state transitions
    this.onScrollChanged(scrollY);

    // Notify scroll connection
    if (this._scrollConnection.onScrollChanged) {
      this._scrollConnection.onScrollChanged(scrollY);
    }

    if (this._scrollConnection.onScrollStateChanged) {
      this._scrollConnection.onScrollStateChanged(direction);
    }

    // Notify scroll connection event
    this.notify({
      eventName: FloatingTabBarCommon.scrollConnectionEvent,
      object: this,
      scrollOffset: scrollY,
      direction: direction,
    });
  }
}
