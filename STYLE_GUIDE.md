# QuickCommerce App Style Guide

This document outlines the core visual styling guidelines for the QuickCommerce web applications (Customer, Partner, Admin) to ensure a consistent user experience.

## 1. Color Palette

### Primary Colors
*   **Primary Color:** `#0052CC` (Brand Blue) - Used for main actions, brand identity, key links.
*   **Primary Light:** `#4C9AFF` - Used for secondary actions, highlights, accents.
*   **Primary Dark:** `#00368F` - Used for hover states, text on light backgrounds.
*   **Secondary Color:** `#6c757d` (Grey) - Used for secondary buttons, less important text.

### Status Colors
*   **Success Color:** `#36B37E` (Green) - Used for success messages, confirmations.
*   **Success Light:** `#ABF5D1` - Used for success backgrounds, success indicators.
*   **Danger/Error Color:** `#FF5630` (Red) - Used for error messages, destructive actions.
*   **Error Light:** `#FFBDAD` - Used for error backgrounds, error indicators.
*   **Warning Color:** `#FFAB00` (Yellow) - Used for warnings, alerts.
*   **Warning Light:** `#FFE380` - Used for warning backgrounds, warning indicators.
*   **Info Color:** `#00B8D9` (Teal/Cyan) - Used for informational messages.
*   **Info Light:** `#B3F5FF` - Used for information backgrounds, help indicators.

### Background Colors
*   **Primary Background:** `#FFFFFF` (White)
*   **Secondary Background:** `#F4F5F7` (Light Grey - Used for alternating sections)
*   **Dark Background:** `#172B4D` (Dark Blue/Grey - Used for footer, dark sections)

### Text Colors
*   **Primary Text:** `#172B4D` (Dark Blue/Grey) - Used for headings, important text
*   **Secondary Text:** `#6B778C` (Medium Grey) - Used for body text, descriptions
*   **Tertiary Text:** `#97A0AF` (Light Grey) - Used for less important text, placeholders
*   **Inverted Text:** `#FFFFFF` (White) - Used for text on dark backgrounds

### Gradients
*   **Primary Gradient:** `linear-gradient(135deg, #0052CC 0%, #4C9AFF 100%)` - Featured sections, CTAs
*   **Secondary Gradient:** `linear-gradient(135deg, #091E42 0%, #172B4D 100%)` - Dark sections
*   **Accent Gradient:** `linear-gradient(135deg, #FF5630 0%, #FFAB00 100%)` - Special promotions

## 2. Typography

*   **Primary Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` - Specify web-safe fonts or font imports.
*   **Headings (h1, h2, h3, etc.):**
    *   h1: 2.5rem (40px), font-weight: 700, line-height: 1.2
    *   h2: 2rem (32px), font-weight: 700, line-height: 1.2
    *   h3: 1.5rem (24px), font-weight: 600, line-height: 1.3
    *   h4: 1.25rem (20px), font-weight: 600, line-height: 1.4
    *   h5: 1rem (16px), font-weight: 600, line-height: 1.4
*   **Body Text:**
    *   Body 1: 1rem (16px), font-weight: 400, line-height: 1.5 - Primary copy
    *   Body 2: 0.875rem (14px), font-weight: 400, line-height: 1.5 - Secondary text
    *   Caption: 0.75rem (12px), font-weight: 400, line-height: 1.5 - Meta information

## 3. Spacing & Layout

*   **Base Unit:** 8px - Use multiples of this unit for consistent padding, margins, gaps.
*   **Spacing System:**
    *   xs: 4px - Minimum spacing, icons
    *   sm: 8px - Default spacing between related elements
    *   md: 16px - Spacing between content blocks
    *   lg: 24px - Section padding
    *   xl: 32px - Large separation between sections
    *   2xl: 48px - Major section breaks
    *   3xl: 64px - Page margins
*   **Max Content Width:** `1440px` - For main container
*   **Page Margins:** `5%` - Left and right margins on all pages
*   **Section Structure:**
    *   Alternating Pattern: Use contrasting backgrounds between sections
        *   Dark background with light cards/elements
        *   Light background with dark/accent cards/elements
    *   Section Spacing: 64px min. vertical spacing between major sections
    *   Section Padding: 48px top/bottom padding within sections

## 4. Components

### Buttons

*   **Primary Button:**
    *   Background: `#0052CC` (Brand Blue)
    *   Text: `#FFFFFF` (White)
    *   Padding: `12px 24px`
    *   Border Radius: `8px`
    *   Hover: `#00368F` (darker blue)
    *   Active: Even darker shade
    *   Disabled: 40% opacity
*   **Secondary Button:**
    *   Background: `#FFFFFF`
    *   Text: `#0052CC` (Brand Blue)
    *   Border: `1px solid #0052CC`
    *   Padding: `12px 24px`
    *   Border Radius: `8px`
    *   Hover: `#F0F5FF` (light blue background)
    *   Disabled: 40% opacity
*   **Ghost Button:**
    *   Background: Transparent
    *   Text: `#0052CC` (Brand Blue)
    *   Padding: `12px 24px`
    *   Border Radius: `8px`
    *   Hover: `#F7FAFF` (very light blue background)
    *   Disabled: 40% opacity

### Forms & Inputs

*   **Text Input:**
    *   Height: `48px`
    *   Background: `#FFFFFF`
    *   Border: `1px solid #DFE1E6`
    *   Border Radius: `8px`
    *   Padding: `12px 16px`
    *   Focus Border: `#0052CC` (Brand Blue)
    *   Focus Shadow: `0 0 0 2px rgba(0, 82, 204, 0.2)`
    *   Error Border: `#FF5630` (Error)
    *   Placeholder: `#6B778C` with 60% opacity
*   **Checkbox:**
    *   Size: `20px × 20px`
    *   Border: `2px solid #DFE1E6`
    *   Border Radius: `4px`
    *   Checked Background: `#0052CC` (Brand Blue)
    *   Checked Icon: White checkmark

### Cards

*   **Product Card:**
    *   Background: `#FFFFFF`
    *   Border Radius: `12px`
    *   Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
    *   Hover Shadow: `0 4px 16px rgba(0, 0, 0, 0.12)`
    *   Padding: `16px`
    *   Image Container: Aspect ratio 1:1
    *   Title: h4, `#172B4D`, truncate after 2 lines
    *   Price: Bold, 1.125rem
    *   Description: Body 2, `#6B778C`, truncate after 2 lines
*   **Content Card:**
    *   Background: `#FFFFFF`
    *   Border Radius: `12px`
    *   Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
    *   Padding: `24px`
    *   Title: h3, `#172B4D`
    *   Content: Body 1, `#6B778C`

### Navbar

*   Background: Primary Gradient or `#FFFFFF`
*   Text: `#FFFFFF` (on gradient) or `#172B4D` (on white)
*   Height: `64px`
*   Shadow: `0 2px 4px rgba(0, 0, 0, 0.08)`

## 5. E-commerce Specific Patterns

### Product Grid
*   2 columns (mobile), 3 columns (tablet), 4+ columns (desktop)
*   Consistent image aspect ratios (1:1 recommended)
*   Clear price positioning
*   "Add to cart" action prominent

### Cart Elements
*   Clear visual feedback for cart actions
*   Quantity adjustments with +/- buttons
*   Subtotal prominently displayed
*   Proceed to checkout button follows primary button style

### Promotional Elements
*   Sale badges: Red/orange accents
*   New item badges: Blue/green accents
*   Limited offer elements: Use accent gradient for emphasis

## 6. Accessibility Guidelines

### Color Contrast
*   **Text on Background:** Minimum 4.5:1 ratio (AA compliance)
*   **Large Text:** Minimum 3:1 ratio
*   **UI Components/Graphics:** Minimum 3:1 ratio against adjacent colors

### Focus States
*   **Focus Indicator:** 2px solid Brand Blue
*   **Visible outline** on all interactive elements during keyboard navigation

## 7. Dark Mode

### Dark Mode Palette
*   **Primary Background:** `#1A1A1A` (replaces White)
*   **Secondary Background:** `#2C2C2C` (replaces Light Grey)
*   **Primary Text:** `#F0F0F0` (replaces Dark Blue/Grey)
*   **Secondary Text:** `#A0A0A0` (replaces Medium Grey)
*   **Primary Color:** `#4C9AFF` (lighter shade of Brand Blue)

## 8. Implementation Examples

### Tailwind CSS Classes for Page Layout
```jsx
{/* Page layout with 5% margins */}
<main className="mx-[5%]">
  <div className="max-w-[1440px] mx-auto">
    {/* Page content */}
  </div>
</main>
```

### Tailwind CSS Classes for Alternating Sections

```jsx
{/* Dark section with light cards */}
<section className="bg-gradient-to-r from-primary-dark to-primary py-16">
  <div className="mx-[5%] max-w-[1440px] mx-auto">
    <h2 className="text-white text-2xl font-bold mb-6 text-center">Featured Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Light card on dark background */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-gray-900 font-semibold">Product Title</h3>
      </div>
    </div>
  </div>
</section>

{/* Light section with dark cards */}
<section className="bg-white py-16">
  <div className="mx-[5%] max-w-[1440px] mx-auto">
    <h2 className="text-gray-900 text-2xl font-bold mb-6 text-center">Categories</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Dark card on light background */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg p-4">
        <h3 className="text-white font-semibold">Category Title</h3>
      </div>
    </div>
  </div>
</section>
``` 