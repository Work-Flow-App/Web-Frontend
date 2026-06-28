# FeatureCard Component

A glassmorphic card component designed to showcase features with a modern, translucent design. Perfect for landing pages, feature sections, and promotional content.

## Usage

```tsx
import { FeatureCard } from '@components/UI';
import WorkIcon from '@mui/icons-material/Work';

// Basic usage
<FeatureCard
  title="Job Tracking"
  description="Keep all your jobs organized and visible in one place. With Floow."
/>

// With icon
<FeatureCard
  title="Job Tracking"
  description="Keep all your jobs organized and visible in one place. With Floow."
  icon={<WorkIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />}
/>

// With click handler
<FeatureCard
  title="Job Tracking"
  description="Keep all your jobs organized and visible in one place."
  icon={<WorkIcon />}
  onClick={() => console.log('Card clicked!')}
/>

// Custom background and border
<FeatureCard
  title="Custom Themed Card"
  description="Customize the background and border to match your brand."
  background="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)"
  borderColor="rgba(59, 130, 246, 0.4)"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | The title of the feature card |
| `description` | `string` | required | The description text of the feature card |
| `icon` | `React.ReactNode` | `undefined` | Optional icon/image to display above the title |
| `onClick` | `() => void` | `undefined` | Optional click handler for the card |
| `background` | `string` | `rgba(255, 255, 255, 0.02)` | Custom background color/gradient |
| `borderColor` | `string` | `rgba(255, 255, 255, 0.25)` | Custom border color |

## Design Specifications

### Glassmorphic Effect
- **Background**: `rgba(255, 255, 255, 0.02)` - Semi-transparent white
- **Border**: `3px solid rgba(255, 255, 255, 0.25)` - Translucent white border
- **Backdrop Filter**: `blur(20px)` - Creates the frosted glass effect
- **Shadow**: `0px 16px 24px rgba(0, 0, 0, 0.5)` - Deep shadow for depth
- **Border Radius**: `16px` - Rounded corners

### Typography
- **Title**:
  - Font: Manrope
  - Weight: 700 (Bold)
  - Size: 30px
  - Line Height: 41px
  - Color: #FFFFFF
  - Alignment: Center

- **Description**:
  - Font: Manrope
  - Weight: 400 (Regular)
  - Size: 24px
  - Line Height: 33px
  - Color: #FFFFFF
  - Alignment: Center

### Dimensions
- **Width**: 379px (fixed)
- **Min Height**: 416px
- **Padding**: 30px 20px
- **Gap**: 20px (between elements)

### Hover Effect
- Subtle lift animation (`translateY(-4px)`)
- Enhanced shadow (`0px 20px 32px rgba(0, 0, 0, 0.6)`)
- Brighter border (`rgba(255, 255, 255, 0.35)`)
- Smooth transition (0.3s ease-in-out)

## Examples

### Job Tracking Feature
```tsx
<FeatureCard
  title="Job Tracking"
  description="Keep all your jobs organized and visible in one place. With Floow. No more scattered notes or missed deadlines, everything you need stays right where you can see it."
  icon={<WorkIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />}
/>
```

### Analytics Dashboard
```tsx
<FeatureCard
  title="Analytics Dashboard"
  description="Get insights into your productivity and track your progress over time with our powerful analytics tools."
  icon={<AnalyticsIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />}
/>
```

### Without Icon
```tsx
<FeatureCard
  title="Simple Feature"
  description="This card demonstrates a feature card without an icon. Clean and minimal design that focuses on the content."
/>
```

### Custom Blue Theme
```tsx
<FeatureCard
  title="Custom Blue Theme"
  description="This card uses a custom blue gradient background with matching border for a unique look."
  icon={<AnalyticsIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />}
  background="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)"
  borderColor="rgba(59, 130, 246, 0.4)"
/>
```

### Custom Purple Theme
```tsx
<FeatureCard
  title="Purple Gradient"
  description="A vibrant purple gradient background that stands out on any page."
  background="linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)"
  borderColor="rgba(168, 85, 247, 0.5)"
/>
```

### Custom Green Success Theme
```tsx
<FeatureCard
  title="Success Theme"
  description="Perfect for success messages or positive feature highlights with a green gradient."
  background="linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)"
  borderColor="rgba(34, 197, 94, 0.4)"
/>
```

## Customization

The FeatureCard component is highly customizable to match your brand or design system:

### Background Customization

You can use solid colors, gradients, or any CSS background value:

```tsx
// Solid semi-transparent background
<FeatureCard background="rgba(30, 30, 30, 0.8)" />

// Linear gradient
<FeatureCard background="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)" />

// Radial gradient
<FeatureCard background="radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)" />
```

### Border Customization

Match your border color to your brand or theme:

```tsx
// Subtle border
<FeatureCard borderColor="rgba(255, 255, 255, 0.1)" />

// Vibrant colored border
<FeatureCard borderColor="rgba(59, 130, 246, 0.6)" />

// Theme-matched border
<FeatureCard
  background="linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)"
  borderColor="rgba(34, 197, 94, 0.4)"
/>
```

## Best Practices

1. **Background**: Use on dark or gradient backgrounds for best visual effect
2. **Icon Size**: Recommended icon size is 48px for consistency
3. **Description Length**: Keep descriptions concise (2-4 sentences) for optimal readability
4. **Title Length**: Keep titles short and punchy (1-3 words)
5. **Spacing**: Allow adequate spacing between multiple cards (recommended: 20-40px gap)

## Browser Support

The glassmorphic effect uses `backdrop-filter` which has the following browser support:
- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 9+ (with `-webkit-` prefix)
- ✅ Edge 79+

For unsupported browsers, the card will still display with a solid background as fallback.

## File Structure

```
FeatureCard/
├── FeatureCard.tsx           # Main component
├── FeatureCard.styled.tsx    # Styled components with glassmorphic effect
├── FeatureCard.types.ts      # TypeScript types
├── FeatureCard.stories.tsx   # Storybook stories
├── index.ts                  # Exports
└── README.md                 # Documentation
```

## Accessibility

- Card title uses semantic heading structure
- Clickable cards have appropriate cursor styling
- High contrast text on translucent background
- Sufficient color contrast ratio for readability
