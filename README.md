# 🛩️ OpenA3XX Configurator Admin

A modern, enterprise-ready Angular 17 application for configuring and managing OpenA3XX hardware panels, simulator events, and real-time monitoring.

![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Material](https://img.shields.io/badge/Material-17-purple?logo=material-design)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔧 Development](#-development)
- [🏭 Production](#-production)
- [🧪 Testing](#-testing)
- [📱 Performance](#-performance)
- [🔒 Security](#-security)
- [🎨 UI/UX](#-uiux)
- [🔌 API Integration](#-api-integration)
- [📊 Monitoring](#-monitoring)
- [🐳 Docker](#-docker)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

The OpenA3XX Configurator Admin is a comprehensive web application designed for managing OpenA3XX flight simulator hardware. It provides an intuitive interface for configuring hardware panels, managing input/output types, linking simulator events, and monitoring real-time system status.

### Key Capabilities
- **Hardware Management** - Configure panels, boards, and I/O types
- **Simulator Integration** - Link hardware to simulator events
- **Real-time Monitoring** - Live console and system health tracking
- **Configuration Management** - Environment-specific settings
- **User Management** - Authentication and role-based access
- **Performance Monitoring** - Built-in metrics and analytics

## ✨ Features

### 🔧 Hardware Management
- **Hardware Panels** - Create, edit, and manage hardware panels
- **Input/Output Types** - Define and configure hardware I/O types
- **Hardware Boards** - Register and manage hardware boards
- **Selector Mapping** - Map hardware selectors to extender bits

### 🎮 Simulator Integration
- **Event Management** - Manage simulator events and integration types
- **Hardware Linking** - Link hardware inputs to simulator events
- **Test Events** - Send test events to verify configurations
- **Real-time Console** - Monitor live flight events

### 🎨 Modern UI/UX
- **Material Design** - Consistent, modern interface
- **Dark/Light Themes** - Automatic and manual theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Smart loading indicators (excludes ping requests)
- **Error Handling** - User-friendly error messages and recovery

### 🔒 Security & Authentication
- **Route Guards** - Protected routes with authentication
- **Role-based Access** - User roles and permissions
- **Security Headers** - CSP, XSS protection, and more
- **Input Validation** - Comprehensive form validation

### 📊 Performance & Monitoring
- **Performance Metrics** - Web Vitals monitoring
- **Error Tracking** - Global error handling and logging
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Health Checks** - API health monitoring

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── core/                    # Core services and utilities
│   │   ├── components/          # Core UI components
│   │   ├── guards/             # Route guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── models/             # Core interfaces and types
│   │   └── services/           # Core services
│   ├── features/               # Feature modules
│   │   ├── dashboard/          # Dashboard and console
│   │   ├── hardware/           # Hardware management
│   │   └── simulator/          # Simulator integration
│   ├── shared/                 # Shared components and utilities
│   │   ├── components/         # Reusable UI components
│   │   ├── directives/         # Custom directives
│   │   ├── models/             # Shared interfaces
│   │   └── pipes/              # Custom pipes
│   └── assets/                 # Static assets and configuration
```

### Module Architecture
- **Core Module** - Singleton services and global components
- **Shared Module** - Reusable components, pipes, and directives
- **Feature Modules** - Domain-specific functionality
- **Lazy Loading** - Optimized bundle splitting

### Service Architecture
- **Configuration Service** - Environment-specific configuration
- **Data Service** - Legacy API integration
- **Feature Services** - Domain-specific API services
- **Loading Service** - Global loading state management
- **Theme Service** - Dark/light theme management
- **Performance Service** - Metrics collection and monitoring

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **Angular CLI** 17+

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd opena3xx.configurator.admin

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Environment Configuration
```bash
# Development environment
npm run start         # Uses development config

# Production environment  
npm run start:prod    # Uses production config
```

## 📦 Installation

### System Requirements
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Chrome/Firefox/Safari/Edge** (latest versions)

### Dependencies Installation
```bash
# Install all dependencies
npm install

# Install only production dependencies
npm ci --only=production

# Update dependencies
npm update
```

### Git Hooks Setup
```bash
# Initialize Husky for pre-commit hooks
npm run prepare
```

## 🔧 Development

### Development Scripts
```bash
# Start development server with HMR
npm start

# Start with fast rebuild (no source maps)
npm run start:fast

# Start with production configuration
npm run start:prod

# Build for development
npm run build:dev

# Build for production
npm run build:prod
```

### Code Quality
```bash
# Lint TypeScript files
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run pre-commit checks
npm run pre-commit
```

### Configuration Management
```bash
# Set development configuration
npm run config:dev

# Set production configuration
npm run config:prod
```

### Development Features
- **Hot Module Replacement** - Fast development iterations
- **Live Reload** - Automatic browser refresh
- **Source Maps** - Enhanced debugging experience
- **Polling** - File change detection (2000ms interval)

## 🏭 Production

### Build Process
```bash
# Production build with optimizations
npm run build:prod

# Analyze bundle size
npm run analyze
```

### Build Optimizations
- **Tree Shaking** - Remove unused code
- **Minification** - Compressed JavaScript and CSS
- **Bundle Splitting** - Optimized chunk loading
- **Ahead-of-Time Compilation** - Faster runtime performance
- **Service Worker** - Offline functionality

### Deployment Options

#### Static File Hosting
```bash
# Build and serve
npm run build:prod
npx http-server dist/
```

#### Docker Deployment
```bash
# Build Docker image
docker build -t opena3xx-configurator .

# Run container
docker run -p 80:80 opena3xx-configurator
```

#### Nginx Configuration
The included `nginx.conf` provides:
- **Gzip Compression** - Reduced file sizes
- **Security Headers** - XSS, CSRF protection
- **Caching** - Optimized static file caching
- **API Proxy** - Backend API routing

## 🧪 Testing

### Test Scripts
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run e2e tests
npm run e2e
```

### Test Coverage
- **Unit Tests** - Component and service testing
- **Integration Tests** - HTTP interceptor testing
- **E2E Tests** - End-to-end user workflows

### Testing Best Practices
- **Service Mocking** - Isolated unit tests
- **HTTP Testing** - Mock HTTP requests
- **Component Testing** - Isolated component testing
- **Accessibility Testing** - WCAG compliance

## 📱 Performance

### Performance Features
- **Web Vitals Monitoring** - LCP, FID, CLS tracking
- **Bundle Analysis** - Size optimization
- **Lazy Loading** - Feature module splitting
- **OnPush Strategy** - Optimized change detection
- **Performance Service** - Real-time metrics collection

### Performance Metrics
```typescript
// Example usage in components
constructor(private performanceService: PerformanceService) {}

// Measure function execution
const result = this.performanceService.measure('loadData', () => {
  return this.loadHardwarePanels();
});

// Measure async operations
const data = await this.performanceService.measureAsync('apiCall', () => {
  return this.dataService.getAllPanels();
});
```

### Optimization Strategies
- **Smart Loading** - Excludes ping/heartbeat requests
- **Component Lazy Loading** - On-demand loading
- **Image Optimization** - Optimized asset loading
- **Memory Management** - Proper subscription cleanup

## 🔒 Security

### Security Features
- **Authentication Guards** - Route protection
- **Role-based Access Control** - User permissions
- **Content Security Policy** - XSS prevention
- **Input Validation** - Form security
- **HTTP Security Headers** - OWASP recommendations

### Authentication System
```typescript
// Login example
this.authService.login(username, password).subscribe(success => {
  if (success) {
    this.router.navigate(['/dashboard']);
  }
});

// Route protection
{
  path: 'admin',
  canActivate: [AuthGuard],
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}
```

### Security Headers
- **X-Frame-Options** - Clickjacking protection
- **X-Content-Type-Options** - MIME sniffing protection
- **X-XSS-Protection** - XSS filtering
- **Referrer-Policy** - Referrer information control

## 🎨 UI/UX

### Design System
- **Material Design 3** - Modern, consistent UI
- **Angular Material** - Pre-built components
- **Custom Theme** - Brand-specific styling
- **Responsive Grid** - Mobile-first design

### Theme System
```typescript
// Theme service usage
constructor(private themeService: ThemeService) {}

// Set theme
this.themeService.setTheme('dark');

// Toggle theme
this.themeService.toggleTheme();

// Listen to theme changes
this.themeService.currentTheme$.subscribe(theme => {
  console.log('Current theme:', theme);
});
```

### Accessibility
- **WCAG 2.1 AA** - Accessibility compliance
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and descriptions
- **High Contrast** - Theme support

## 🔌 API Integration

### API Configuration
Configuration is managed through JSON files:

```json
// src/assets/config/app-config.json
{
  "api": {
    "baseUrl": "http://localhost:5000"
  },
  "app": {
    "name": "OpenA3XX Configurator Admin",
    "version": "1.0.0"
  },
  "features": {
    "enableDebugMode": false,
    "enableConsoleLogging": true
  }
}
```

### Service Architecture
```typescript
// Feature-specific services
HardwarePanelService     // Hardware panel management
HardwareBoardService     // Hardware board operations
HardwareInputService     // Input type management
HardwareOutputService    // Output type management
SimulatorEventService    // Simulator integration
DashboardService         // Dashboard data
SettingsService          // Configuration management
```

### HTTP Interceptor
- **Loading Management** - Smart loading indicators
- **Error Handling** - Global error processing
- **Request Logging** - Debug mode logging
- **Authentication** - Token management

### Real-time Communication
```typescript
// SignalR integration
this.realTimeService.connect();
this.realTimeService.flightEvents$.subscribe(events => {
  // Handle real-time flight events
});
```

## 📊 Monitoring

### Performance Monitoring
```typescript
// Built-in performance tracking
this.performanceService.getMetrics();           // Get all metrics
this.performanceService.getMetricsByType('lcp'); // Get specific metrics
this.performanceService.getMemoryUsage();       // Memory information
```

### Error Monitoring
```typescript
// Global error handling
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Log error, show user message, send to monitoring service
  }
}
```

### Health Monitoring
- **API Health Checks** - Automatic ping monitoring
- **System Status** - Real-time system health
- **Performance Metrics** - Web Vitals tracking
- **Error Tracking** - Comprehensive error logging

## 🐳 Docker

### Docker Configuration
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
# ... build stage

FROM nginx:alpine
# ... production stage
```

### Docker Commands
```bash
# Build image
docker build -t opena3xx-configurator .

# Run container
docker run -p 80:80 opena3xx-configurator

# Run with custom configuration
docker run -p 80:80 -v $(pwd)/config:/usr/share/nginx/html/assets/config opena3xx-configurator
```

### Docker Features
- **Multi-stage Build** - Optimized image size
- **Nginx Integration** - Production web server
- **Health Checks** - Container health monitoring
- **Security** - Non-root user execution

## 🛠️ Troubleshooting

### Common Issues

#### Loading Indicator Flashing
**Problem**: Loading spinner flashes every 5 seconds
**Solution**: The HTTP interceptor automatically excludes ping requests
```typescript
// Ping requests won't trigger loading
this.dataService.checkApiHealth(); // No loading indicator
```

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean
```

#### Development Server Issues
```bash
# Kill existing processes
pkill -f "ng serve"

# Start with different port
ng serve --port 4201
```

#### API Connection Issues
1. Check `app-config.json` for correct API URL
2. Verify API server is running
3. Check browser network tab for CORS errors
4. Ensure API endpoints are accessible

### Debug Mode
Enable debug mode in configuration:
```json
{
  "features": {
    "enableDebugMode": true,
    "enableConsoleLogging": true
  }
}
```

### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
# Use Chrome DevTools Memory tab

# Monitor performance
# Use built-in PerformanceService
```

## 📚 Documentation

### Code Documentation
```bash
# Generate documentation
npm run compodoc

# View documentation
open documentation/index.html
```

### API Documentation
- **Component Documentation** - Generated with Compodoc
- **Service Documentation** - Inline JSDoc comments
- **Interface Documentation** - TypeScript definitions

### Architecture Documentation
- **Module Structure** - Feature-based organization
- **Service Layer** - API integration patterns
- **Component Hierarchy** - UI component structure

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** your changes
5. **Submit** a pull request

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code quality rules
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

### Pre-commit Hooks
```json
{
  "*.{ts,js}": ["ng lint --fix", "git add"],
  "*.{html,scss,css}": ["prettier --write", "git add"],
  "*.{json,md}": ["prettier --write", "git add"]
}
```

### Testing Requirements
- **Unit Tests** - Minimum 80% coverage
- **Integration Tests** - Critical user flows
- **E2E Tests** - Complete user journeys

---

## 📞 Support

For issues, questions, or contributions:
- **Issues** - GitHub Issues
- **Documentation** - In-code documentation
- **Performance** - Built-in monitoring tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Angular 17, TypeScript, and Material Design**
