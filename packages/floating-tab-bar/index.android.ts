import { FloatingTabBarCommon, FloatingTabItem, ScrollConnection } from './common';

// Re-export components from common for external use
export { TabItem, FloatingTabItem, IconHelper, FloatingTabBarConfig, ScrollConnection } from './common';

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
    const context = this._context || (global as any).android.foregroundActivity;

    // Main container
    this._mainContainer = new android.widget.LinearLayout(context);
    this._mainContainer.setOrientation(android.widget.LinearLayout.VERTICAL);
    this._mainContainer.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT));

    // Content container untuk tab content
    this._contentContainer = new android.widget.FrameLayout(context);
    this._contentContainer.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.MATCH_PARENT));

    // Tab container
    this._tabContainer = new android.widget.LinearLayout(context);
    this._tabContainer.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    this._tabContainer.setGravity(android.view.Gravity.CENTER);

    // Setup tab container appearance
    this.setupTabContainerAppearance();

    // Accessory container
    this._accessoryContainer = new android.widget.FrameLayout(context);
    this._accessoryContainer.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT));

    // Add views to main container
    this._mainContainer.addView(this._contentContainer);
    this._mainContainer.addView(this._accessoryContainer);
    this._mainContainer.addView(this._tabContainer);

    this._isInitialized = true;
    this.updateTabs();
    this.updateAppearance();
    this.updateState();

    return this._mainContainer;
  }

  private setupTabContainerAppearance(): void {
    const context = this._context || (global as any).android.foregroundActivity;

    // Create rounded background
    const drawable = new android.graphics.drawable.GradientDrawable();
    drawable.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
    drawable.setCornerRadius(this.dpToPx(this.cornerRadius));
    drawable.setColor(android.graphics.Color.parseColor(this.tabBarBackgroundColor));

    // Add elevation/shadow
    if (android.os.Build.VERSION.SDK_INT >= 21) {
      this._tabContainer.setElevation(this.dpToPx(this.shadowRadius));
    }

    this._tabContainer.setBackground(drawable);

    // Set padding
    const padding = this.dpToPx(this.tabBarPadding);
    this._tabContainer.setPadding(padding, padding, padding, padding);

    // Set margins
    const layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, this.isInline ? this.dpToPx(48) : this.dpToPx(64));

    const margin = this.dpToPx(this.tabBarMargin);
    layoutParams.setMargins(margin, 0, margin, margin);

    this._tabContainer.setLayoutParams(layoutParams);
  }

  protected updateTabs(): void {
    if (!this._isInitialized || !this._tabContainer) return;

    // Clear existing tabs
    this._tabContainer.removeAllViews();

    // Add tabs from TabItems
    this._tabItems.forEach((tabItem, index) => {
      const tabData = tabItem.getTabData();
      this.createTabView(tabData, index);
    });

    // Update content
    this.updateTabContent();
  }

  protected updateAppearance(): void {
    if (!this._isInitialized) return;
    this.setupTabContainerAppearance();
  }

  protected updateState(): void {
    if (!this._isInitialized) return;

    // Update visual state based on isInline
    this.animateToState(this.isInline);
  }

  protected updateTabSelection(tabKey: string): void {
    if (!this._tabContainer) return;

    // Update visual selection state
    for (let i = 0; i < this._tabContainer.getChildCount(); i++) {
      const tabView = this._tabContainer.getChildAt(i) as android.widget.LinearLayout;
      const tab = this._tabs[i];
      if (tab) {
        this.updateTabSelectionVisual(tabView, tab.key === tabKey);
      }
    }

    // Update content
    this.updateTabContent();
  }

  private createTabView(tab: FloatingTabItem, index: number): void {
    const context = this._context || (global as any).android.foregroundActivity;

    // Tab container
    const tabView = new android.widget.LinearLayout(context);
    tabView.setOrientation(android.widget.LinearLayout.VERTICAL);
    tabView.setGravity(android.view.Gravity.CENTER);
    tabView.setPadding(this.dpToPx(12), this.dpToPx(8), this.dpToPx(12), this.dpToPx(8));

    // Create icon
    if (tab.icon) {
      const iconView = this.createIconView(tab.icon, tab.iconClass);
      if (iconView) {
        tabView.addView(iconView);
      }
    }

    // Create title (if not standalone and not inline)
    if (!tab.isStandalone && tab.title && !this.isInline) {
      const titleView = new android.widget.TextView(context);
      titleView.setText(tab.title);
      titleView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 12);
      titleView.setGravity(android.view.Gravity.CENTER);

      const titleParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
      titleParams.setMargins(0, this.dpToPx(4), 0, 0);
      titleView.setLayoutParams(titleParams);

      tabView.addView(titleView);
    }

    // Add badge if exists
    if (tab.badge) {
      this.addBadgeToTab(tabView, tab.badge, tab.badgeColor);
    }

    // Set click listener
    tabView.setOnClickListener(
      new android.view.View.OnClickListener({
        onClick: () => {
          if (tab.enabled !== false) {
            this.selectedTabKey = tab.key;
          }
        },
      }),
    );

    // Set selection state
    this.updateTabSelectionVisual(tabView, tab.key === this._selectedTabKey);

    // Add to container
    const layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);

    if (index > 0) {
      layoutParams.setMargins(this.dpToPx(8), 0, 0, 0);
    }

    tabView.setLayoutParams(layoutParams);
    this._tabContainer.addView(tabView);
  }

  private createIconView(iconSource: string, iconClass?: string): android.view.View | null {
    const context = this._context || (global as any).android.foregroundActivity;

    if (iconSource.startsWith('font://')) {
      // Font icon
      const textView = new android.widget.TextView(context);
      textView.setText(iconSource.replace('font://', ''));
      textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, this.isInline ? 18 : 20);
      textView.setGravity(android.view.Gravity.CENTER);

      // Apply font family if iconClass is provided
      if (iconClass) {
        try {
          const typeface = android.graphics.Typeface.createFromAsset(context.getAssets(), `fonts/${iconClass}.ttf`);
          textView.setTypeface(typeface);
        } catch (e) {
          console.warn('Font not found for class:', iconClass);
        }
      }

      return textView;
    } else {
      // Use ImageView for other icon types
      const imageView = new android.widget.ImageView(context);
      const iconSize = this.isInline ? 20 : 24;
      imageView.setLayoutParams(new android.widget.LinearLayout.LayoutParams(this.dpToPx(iconSize), this.dpToPx(iconSize)));
      imageView.setScaleType(android.widget.ImageView.ScaleType.CENTER_INSIDE);

      // Load icon based on type
      this.loadIconIntoImageView(imageView, iconSource);

      return imageView;
    }
  }

  private loadIconIntoImageView(imageView: android.widget.ImageView, iconSource: string): void {
    const context = this._context || (global as any).android.foregroundActivity;

    if (iconSource.startsWith('res://')) {
      // Resource icon
      const resourceName = iconSource.replace('res://', '');
      const resourceId = context.getResources().getIdentifier(resourceName, 'drawable', context.getPackageName());
      if (resourceId > 0) {
        imageView.setImageResource(resourceId);
      }
    } else if (iconSource.startsWith('~/')) {
      // Asset icon - would need proper asset loading
      console.warn('Asset icons not fully implemented yet');
    } else if (iconSource.startsWith('http')) {
      // URL icon - would need image loading library
      console.warn('URL icons not fully implemented yet');
    }
  }

  private addBadgeToTab(tabView: android.widget.LinearLayout, badge: string | number, badgeColor?: string): void {
    const context = this._context || (global as any).android.foregroundActivity;

    const badgeView = new android.widget.TextView(context);
    badgeView.setText(badge.toString());
    badgeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 10);
    badgeView.setTextColor(android.graphics.Color.WHITE);
    badgeView.setGravity(android.view.Gravity.CENTER);

    // Badge background
    const drawable = new android.graphics.drawable.GradientDrawable();
    drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL);
    drawable.setColor(android.graphics.Color.parseColor(badgeColor || '#FF0000'));
    badgeView.setBackground(drawable);

    // Badge size
    const size = this.dpToPx(16);
    const layoutParams = new android.widget.LinearLayout.LayoutParams(size, size);
    layoutParams.setMargins(-this.dpToPx(8), -this.dpToPx(4), 0, 0);
    badgeView.setLayoutParams(layoutParams);

    tabView.addView(badgeView);
  }

  private updateTabSelectionVisual(tabView: android.widget.LinearLayout, isSelected: boolean): void {
    const selectedColor = '#007AFF';
    const unselectedColor = '#8E8E93';

    const color = isSelected ? selectedColor : unselectedColor;

    // Update all text views in tab
    for (let i = 0; i < tabView.getChildCount(); i++) {
      const child = tabView.getChildAt(i);
      if (child instanceof android.widget.TextView) {
        child.setTextColor(android.graphics.Color.parseColor(color));
      }
    }
  }

  private updateTabContent(): void {
    if (!this._contentContainer) return;

    // Clear existing content
    this._contentContainer.removeAllViews();

    // Find active tab content
    const activeTabItem = this._tabItems.find((item) => item.key === this._selectedTabKey);
    if (activeTabItem && activeTabItem.content) {
      // Add the content view to container
      const contentView = activeTabItem.content;
      if (contentView.android) {
        this._contentContainer.addView(contentView.android);
      }
    }
  }

  async animateToState(isInline: boolean): Promise<void> {
    if (!this._tabContainer) return;

    return new Promise((resolve) => {
      if (this._currentAnimator) {
        this._currentAnimator.cancel();
      }

      const startHeight = this._tabContainer.getHeight();
      const targetHeight = isInline ? this.dpToPx(48) : this.dpToPx(64);

      this._currentAnimator = android.animation.ValueAnimator.ofInt([startHeight, targetHeight]);
      this._currentAnimator.setDuration(300); // animationDuration

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
        new android.animation.Animator.AnimatorListener({
          onAnimationStart: () => {},
          onAnimationEnd: () => {
            // Update tabs after animation to show/hide titles
            this.updateTabs();
            resolve();
          },
          onAnimationCancel: () => {},
          onAnimationRepeat: () => {},
        }),
      );

      this._currentAnimator.start();
    });
  }

  // Scroll Connection Implementation
  attachScrollConnection(scrollConnection: ScrollConnection): void {
    this._scrollConnection = scrollConnection;

    // Setup scroll listener if onScrollChanged is provided
    if (scrollConnection.onScrollChanged) {
      // This would typically be attached to a ScrollView or RecyclerView
      // For now, we'll store the connection for manual triggering
    }
  }

  detachScrollConnection(): void {
    this._scrollConnection = null;
  }

  // Handle scroll events from external scroll views
  handleScrollEvent(scrollY: number): void {
    if (!this._scrollConnection || !this._scrollConnection.enableScrollConnection) {
      return;
    }

    const threshold = this._scrollConnection.scrollThreshold || 50;
    const deltaY = scrollY - this._lastScrollY;

    if (Math.abs(deltaY) > threshold) {
      const direction = deltaY > 0 ? 'down' : 'up';

      if (direction !== this._scrollDirection) {
        this._scrollDirection = direction;

        // Trigger state change based on scroll behavior
        switch (this.scrollBehavior) {
          case 'onScrollDown':
            if (direction === 'down') {
              this.transitionToInline();
            } else {
              this.transitionToExpanded();
            }
            break;
          case 'onScrollUp':
            if (direction === 'up') {
              this.transitionToInline();
            } else {
              this.transitionToExpanded();
            }
            break;
          case 'always':
            this.transitionToInline();
            break;
          case 'never':
            this.transitionToExpanded();
            break;
        }

        // Notify scroll connection
        if (this._scrollConnection.onScrollChanged) {
          this._scrollConnection.onScrollChanged(scrollY);
        }
      }
    }

    this._lastScrollY = scrollY;
  }
}
