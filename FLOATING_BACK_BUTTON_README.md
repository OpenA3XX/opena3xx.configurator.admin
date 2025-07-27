# Floating Back Button Feature

## Overview

A circular floating back button has been added to the OpenA3XX Flight Deck application to improve navigation experience. The button appears at the bottom right of the screen and functions like a browser's back button.

## Features

- **Circular Design**: Modern circular button with Material Design styling
- **Smart Visibility**: Only shows when not on the dashboard/home page
- **Browser-like Behavior**: Uses browser history when available, falls back to dashboard navigation
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Full keyboard navigation and screen reader support
- **Theme Support**: Adapts to light/dark theme changes
- **Smooth Animations**: Entrance and hover animations for better UX

## Implementation Details

### Component Location
- **Component**: `src/app/shared/components/ui/floating-back-button/`
- **Files**:
  - `floating-back-button.component.ts` - Component logic
  - `floating-back-button.component.html` - Template
  - `floating-back-button.component.scss` - Styles
  - `floating-back-button.component.spec.ts` - Tests

### Integration
- Added to `SharedModule` for reuse across the application
- Integrated into main `AppComponent` template
- Positioned absolutely at bottom-right of screen

### Styling Features
- Fixed positioning at bottom-right (24px from edges)
- Circular design with 56px diameter (48px on mobile)
- Material Design color scheme with theme support
- Box shadow with hover effects
- Smooth transitions and animations
- Responsive design for mobile devices

### Behavior
1. **Visibility Logic**: Button shows when user is not on dashboard/home routes
2. **Navigation Logic**: 
   - Uses `location.back()` if browser history exists
   - Falls back to dashboard navigation if no history
3. **Accessibility**: Full keyboard support and ARIA labels

## Usage

The floating back button is automatically available throughout the application. No additional setup is required.

### For Developers

To use the component in other parts of the application:

```html
<opena3xx-floating-back-button></opena3xx-floating-back-button>
```

The component is already exported from `SharedModule` and available globally.

## Testing

The component includes comprehensive tests covering:
- Component creation
- Visibility logic based on route
- Click functionality
- Navigation behavior

Run tests with:
```bash
npm test
```

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- Mobile responsive design
- Touch-friendly on mobile devices
- Keyboard navigation support

## Future Enhancements

Potential improvements could include:
- Customizable positioning
- Different icon options
- Animation customization
- Integration with specific route patterns
- Analytics tracking for usage patterns 
