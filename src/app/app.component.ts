import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { FloatingBackButtonComponent } from './shared/components/ui/floating-back-button/floating-back-button.component';

export interface AppState {
  isAuthenticated: boolean;
  currentUser: string | null;
  currentRoute: string;
  sidebarOpen: boolean;
  darkMode: boolean;
  notifications: number;
  systemStatus: 'online' | 'offline' | 'maintenance';
}

@Component({
  selector: 'opena3xx-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBadgeModule,
    FloatingBackButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  appState = signal<AppState>({
    isAuthenticated: false,
    currentUser: null,
    currentRoute: '/',
    sidebarOpen: true,
    darkMode: false,
    notifications: 0,
    systemStatus: 'online'
  });

  // Computed properties
  isOnline = computed(() => this.appState().systemStatus === 'online');
  hasNotifications = computed(() => this.appState().notifications > 0);
  isAuthenticated = computed(() => this.appState().isAuthenticated);
  isSidebarOpen = computed(() => this.appState().sidebarOpen);
  isDarkMode = computed(() => this.appState().darkMode);

  // Right menu properties
  isRightMenuShowing = signal(false);
  isRightMenuExpanded = signal(false);
  dependencyStatus = signal<any>(null);
  isExpanded = signal(false);
  isShowing = signal(true); // Initialize to true so icons are visible when collapsed
  unreadNotificationCount = signal(0);
  isElectron = signal(false);

  // Navigation items
  navigationItems = signal([
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      badge: null
    },
    {
      label: 'Hardware',
      icon: 'memory',
      route: '/hardware',
      badge: null
    },
    {
      label: 'Connectivity',
      icon: 'link',
      route: '/connectivity',
      badge: null
    },
    {
      label: 'Console',
      icon: 'terminal',
      route: '/console',
      badge: null
    },
    {
      label: 'Simulator',
      icon: 'flight',
      route: '/simulator',
      badge: null
    },
    {
      label: 'Aircraft Models',
      icon: 'airplanemode_active',
      route: '/aircraft-models',
      badge: null
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/notifications',
      badge: this.appState().notifications
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings',
      badge: null
    }
  ]);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    this.loading.set(true);

    try {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.appState.update(state => ({
        ...state,
        isAuthenticated: true,
        currentUser: 'admin',
        notifications: 3,
        systemStatus: 'online'
      }));

      this.loading.set(false);
    } catch (err) {
      console.error('Error initializing app:', err);
      this.error.set(true);
      this.loading.set(false);
    }
  }

  toggleSidebar(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  // Hover methods for collapsed sidebar
  onSidebarMouseEnter(): void {
    if (!this.isExpanded()) {
      this.isShowing.set(true);
    }
  }

  onSidebarMouseLeave(): void {
    if (!this.isExpanded()) {
      this.isShowing.set(false);
    }
  }

  toggleDarkMode(): void {
    this.appState.update(state => ({
      ...state,
      darkMode: !state.darkMode
    }));
  }

  onLogout(): void {
    console.log('Logging out...');
    this.appState.update(state => ({
      ...state,
      isAuthenticated: false,
      currentUser: null
    }));
  }

  onUserMenuAction(action: string): void {
    switch (action) {
      case 'profile':
        console.log('Opening user profile...');
        break;
      case 'settings':
        console.log('Opening user settings...');
        break;
      case 'logout':
        this.onLogout();
        break;
      default:
        console.log(`Unknown user menu action: ${action}`);
    }
  }

  onSystemMenuAction(action: string): void {
    switch (action) {
      case 'status':
        console.log('Opening system status...');
        break;
      case 'maintenance':
        console.log('Opening maintenance mode...');
        break;
      case 'restart':
        console.log('Restarting system...');
        break;
      default:
        console.log(`Unknown system menu action: ${action}`);
    }
  }

  // Getters for template
  get currentAppState(): AppState {
    return this.appState();
  }

  get navigationList(): any[] {
    return this.navigationItems();
  }

  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return this.error();
  }

  get isOnlineState(): boolean {
    return this.isOnline();
  }

  get hasNotificationState(): boolean {
    return this.hasNotifications();
  }

  get isAuthenticatedState(): boolean {
    return this.isAuthenticated();
  }

  get isSidebarOpenState(): boolean {
    return this.isSidebarOpen();
  }

  get isDarkModeState(): boolean {
    return this.isDarkMode();
  }

  get isElectronValue(): boolean {
    return this.isElectron();
  }

  get systemStatusIcon(): string {
    switch (this.appState().systemStatus) {
      case 'online': return 'check_circle';
      case 'offline': return 'cancel';
      case 'maintenance': return 'build';
      default: return 'help';
    }
  }

  get systemStatusColor(): string {
    switch (this.appState().systemStatus) {
      case 'online': return 'primary';
      case 'offline': return 'warn';
      case 'maintenance': return 'accent';
      default: return 'default';
    }
  }

  get notificationCount(): number {
    return this.appState().notifications;
  }

  get currentUserName(): string {
    return this.appState().currentUser || 'Guest';
  }

  // Getters for template comparisons
  get unreadNotificationCountValue(): number {
    return this.unreadNotificationCount();
  }

  get dependencyStatusValue(): any {
    return this.dependencyStatus();
  }

  // Getters for template access
  get isExpandedValue(): boolean {
    return this.isExpanded();
  }

  get isShowingValue(): boolean {
    return this.isShowing();
  }

  get isRightMenuExpandedValue(): boolean {
    return this.isRightMenuExpanded();
  }

  get isRightMenuShowingValue(): boolean {
    return this.isRightMenuShowing();
  }

  get isDarkModeValue(): boolean {
    return this.isDarkMode();
  }

  getBackendApiTooltip(): string {
    return this.apiAvailabilityStatus ? 'Backend API is online' : 'Backend API is offline';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'status-online';
      case 'offline':
      case 'error':
        return 'status-offline';
      case 'degraded':
      case 'warning':
        return 'status-warning';
      default:
        return 'status-unknown';
    }
  }

  get apiAvailabilityStatus(): boolean {
    return this.appState().systemStatus === 'online';
  }

  getDependencyTooltip(dependency: any): string {
    if (!dependency) return 'Status unknown';
    return `${dependency.name}: ${dependency.status}`;
  }

  getStatusIcon(dependencyName: string): string {
    switch (dependencyName.toLowerCase()) {
      case 'msfs2024':
        return 'flight';
      case 'rabbitmq':
        return 'queue';
      case 'seq':
        return 'analytics';
      default:
        return 'help';
    }
  }

  getFormattedTimestamp(timestamp: string | Date): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  // Navigation click methods
  clickManageHardwareOutputTypes(): void {
    this.router.navigate(['/manage/hardware-output-types']);
  }

  clickManageHardwareBoards(): void {
    this.router.navigate(['/manage/hardware-boards']);
  }

  clickManageSimulatorEvents(): void {
    this.router.navigate(['/manage/simulator-events']);
  }

  clickConnectivity(): void {
    this.router.navigate(['/connectivity']);
  }

  clickConsole(): void {
    this.router.navigate(['/console']);
  }

  clickNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  clickSettings(): void {
    this.router.navigate(['/settings']);
  }

  // Additional methods
  toggle(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  fullscreen(): void {
    // TODO: Implement fullscreen functionality
    console.log('Toggle fullscreen');
  }

  get isFullscreen(): boolean {
    return false; // TODO: Implement fullscreen detection
  }

  toggleTheme(): void {
    this.appState.update(state => ({ ...state, darkMode: !state.darkMode }));
  }

  toggleRight(): void {
    this.isRightMenuExpanded.update(expanded => !expanded);
  }

  clickDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  clickManageAircraftModels(): void {
    this.router.navigate(['/manage/aircraft-models']);
  }

  clickManageHardwarePanels(): void {
    this.router.navigate(['/manage/hardware-panels']);
  }

  clickManageHardwareInputTypes(): void {
    this.router.navigate(['/manage/hardware-input-types']);
  }

  // Logo and branding methods
  getLogoPath(): string {
    return this.isDarkMode() ? 'assets/logo-dark-theme.png' : 'assets/logo.png';
  }

  // Exit method for Electron
  exit(): void {
    // TODO: Implement exit functionality for Electron
    console.log('Exit application');
  }

  // Additional utility methods
  getLogoAltText(): string {
    return 'OpenA3XX Flight Deck Logo';
  }
}
