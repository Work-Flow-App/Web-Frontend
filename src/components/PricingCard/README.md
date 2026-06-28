# PricingCard Component

A glassmorphic pricing card component designed for subscription plans, pricing tiers, and product packages. Features a modern gradient background with backdrop blur effects.

## Usage

```tsx
import { PricingCard } from '@components/UI';

// Basic usage
<PricingCard
  planName="Standard"
  planDescription="Best for professional use"
  price="15"
  pricePeriod="per month"
  features={[
    { text: 'Clients directory', included: true },
    { text: 'Jobs management', included: true },
    { text: 'File storage upto 8Gb', included: true },
  ]}
/>

// With button handler
<PricingCard
  planName="Premium"
  price="49"
  buttonText="Subscribe Now"
  onButtonClick={() => console.log('Subscribe clicked')}
  features={[
    { text: 'Unlimited storage', included: true },
    { text: 'Priority support', included: true },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `planName` | `string` | required | The plan name/title |
| `planDescription` | `string` | `undefined` | The plan description/subtitle |
| `price` | `number \| string` | required | The price amount |
| `pricePeriod` | `string` | `'per month'` | The price period (e.g., "per month", "per year") |
| `currency` | `string` | `'$'` | The currency symbol |
| `buttonText` | `string` | `'Get Started'` | The button text |
| `onButtonClick` | `() => void` | `undefined` | Button click handler |
| `features` | `PricingFeature[]` | `[]` | List of features included in the plan |
| `icon` | `React.ReactNode` | Circle icon | Optional custom icon to display at the top |
| `background` | `string` | gradient | Optional custom background gradient |
| `featured` | `boolean` | `false` | Whether this is a highlighted/featured plan |

### PricingFeature Type

```typescript
interface PricingFeature {
  text: string;
  included?: boolean;
}
```

## Design Specifications

### Card Dimensions
- **Width**: 363px (fixed)
- **Min Height**: 658px
- **Padding**: 32px 40px
- **Gap**: 40px (between sections)
- **Border Radius**: 24px

### Glassmorphic Effect
- **Background**: `linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.07) 100%)`
- **Backdrop Filter**: `blur(42px)` - Creates frosted glass effect
- **Hover Effect**: Lift animation with shadow

### Icon Circle
- **Size**: 40px × 40px
- **Background**: `linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.41) 100%)`
- **Inner Circle**: 20px × 20px, black (#000000)
- **Border Radius**: 100px (circular)

### Typography

**Plan Name:**
- Font: Manrope
- Weight: 700 (Bold)
- Size: 24px
- Line Height: 33px
- Color: #FFFFFF

**Plan Description:**
- Font: Manrope
- Weight: 400 (Regular)
- Size: 14px
- Line Height: 19px
- Color: rgba(255, 255, 255, 0.7)

**Price:**
- Font: Manrope
- Weight: 700 (Bold)
- Size: 48px
- Line Height: 66px
- Color: #FFFFFF

**Currency:**
- Font: Manrope
- Weight: 700 (Bold)
- Size: 32px
- Line Height: 44px
- Color: #FFFFFF

**Price Period:**
- Font: Manrope
- Weight: 400 (Regular)
- Size: 14px
- Line Height: 19px
- Color: rgba(255, 255, 255, 0.7)

### Button
- **Background**: `linear-gradient(180deg, #FFFFFF 0%, #B1B1B1 100%)`
- **Padding**: 12px 14px
- **Height**: 44px
- **Border Radius**: 8px
- **Font**: Manrope, 600 weight, 16px
- **Color**: #000000 (black text)
- **Width**: 100% (full width)

### Features List
- **Gap**: 10px between items
- **Icon Size**: 16px × 16px
- **Icon Color**: #FFFFFF
- **Text**: Manrope, 400 weight, 14px, rgba(255, 255, 255, 0.9)

## Examples

### Standard Plan
```tsx
<PricingCard
  planName="Standard"
  planDescription="Best for professional use"
  price="15"
  pricePeriod="per month"
  features={[
    { text: 'Clients directory' },
    { text: 'Jobs management' },
    { text: 'File storage upto 8Gb' },
    { text: 'Collaboration tools' },
    { text: 'Dashboard and analytics' },
  ]}
/>
```

### Premium Plan
```tsx
<PricingCard
  planName="Premium"
  planDescription="For teams and enterprises"
  price="49"
  pricePeriod="per month"
  features={[
    { text: 'Everything in Standard' },
    { text: 'Unlimited storage' },
    { text: 'Advanced analytics' },
    { text: 'Priority support' },
  ]}
/>
```

### Annual Billing
```tsx
<PricingCard
  planName="Standard"
  planDescription="Save 20% with annual billing"
  price="144"
  pricePeriod="per year"
  buttonText="Subscribe Now"
  features={[
    { text: 'All Standard features' },
    { text: '2 months free' },
    { text: 'Priority onboarding' },
  ]}
/>
```

### Custom Background
```tsx
<PricingCard
  planName="Enterprise"
  price="99"
  background="linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.15) 100%)"
  features={[
    { text: 'Unlimited everything' },
    { text: 'Dedicated account manager' },
    { text: 'Custom SLA' },
  ]}
/>
```

## Customization

### Background Gradients

You can customize the card background with any CSS gradient:

```tsx
// Blue gradient
<PricingCard
  background="linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 50%)"
  ...
/>

// Purple gradient
<PricingCard
  background="linear-gradient(180deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%)"
  ...
/>

// Green gradient
<PricingCard
  background="linear-gradient(180deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 50%)"
  ...
/>
```

### Custom Icons

Replace the default circle icon with your own:

```tsx
import StarIcon from '@mui/icons-material/Star';

<PricingCard
  icon={<StarIcon sx={{ fontSize: 40, color: '#FFD700' }} />}
  ...
/>
```

## Best Practices

1. **Pricing Display**: Use clear, easy-to-read pricing with appropriate currency symbols
2. **Features**: List 3-6 key features per plan for optimal readability
3. **Button Text**: Use action-oriented text like "Get Started", "Subscribe Now", "Try Free"
4. **Background**: Use on dark backgrounds for best glassmorphic effect
5. **Comparison**: Display multiple pricing cards side-by-side for easy comparison
6. **Spacing**: Allow 20-40px gap between multiple pricing cards

## Browser Support

The glassmorphic effect uses `backdrop-filter` which has the following browser support:
- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 9+ (with `-webkit-` prefix)
- ✅ Edge 79+

For unsupported browsers, the card will display with the gradient background but without the blur effect.

## File Structure

```
PricingCard/
├── PricingCard.tsx           # Main component
├── PricingCard.styled.tsx    # Styled components
├── PricingCard.types.ts      # TypeScript types
├── PricingCard.stories.tsx   # Storybook stories
├── index.ts                  # Exports
└── README.md                 # Documentation
```

## Accessibility

- Button has appropriate hover and focus states
- High contrast text on semi-transparent background
- Semantic HTML structure for screen readers
- All interactive elements are keyboard accessible
