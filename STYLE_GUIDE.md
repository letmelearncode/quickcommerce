# QuickCommerce App Style Guide

This document outlines the core visual styling guidelines for the QuickCommerce web applications (Customer, Partner, Admin) to ensure a consistent user experience.

## 1. Color Palette

*   **Primary Color:** `#007BFF` (Bootstrap Blue) - Used for main actions, links, highlights.
*   **Secondary Color:** `#6c757d` (Grey) - Used for secondary buttons, less important text.
*   **Success Color:** `#28a745` (Green) - Used for success messages, confirmations.
*   **Danger/Error Color:** `#dc3545` (Red) - Used for error messages, destructive actions.
*   **Warning Color:** `#ffc107` (Yellow) - Used for warnings, alerts.
*   **Info Color:** `#17a2b8` (Teal/Cyan) - Used for informational messages.
*   **Background Colors:**
    *   Primary Background: `#FFFFFF` (White)
    *   Secondary Background/Accents: `#f8f9fa` (Light Grey - Used for Navbar)
*   **Text Colors:**
    *   Primary Text: `#212529` (Dark Grey/Black)
    *   Secondary Text: `#6c757d` (Grey)
    *   Link Text: (Usually Primary Color)

## 2. Typography

*   **Primary Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` - Specify web-safe fonts or font imports.
*   **Headings (h1, h2, h3, etc.):**
    *   Font Weight: `bold`, `600`
    *   Font Sizes: Define sizes for each level (e.g., h1: 2.5rem, h2: 2rem, ...)
*   **Body Text:**
    *   Font Size: `1rem` or `16px`
    *   Line Height: `1.5`
    *   Font Weight: `400` - Normal

## 3. Spacing & Layout

*   **Base Unit:** `1rem` or `8px` - Use multiples of this unit for consistent padding, margins, gaps.
*   **Max Content Width:** `1280px` - As used in `#root` style.
*   **Grid System:** `TBD` (If using CSS Grid or Flexbox layouts, define common patterns).

## 4. Components

*(Define styles for common reusable components as they are built)*

*   **Buttons:**
    *   Primary Button Style: (Background: `#007bff`, Text: `white`, Padding: `0.6rem 1.2rem`, Border Radius: `4px`, Cursor: `pointer`)
    *   Secondary Button Style:
    *   Hover/Active States: (Slightly darker background)
    *   Disabled State: (Lighter background, default cursor)
*   **Forms & Inputs:**
    *   Input Padding: `0.5rem`
    *   Input Border: `1px solid #ccc`
    *   Input Border Radius: `4px`
    *   Input Focus State:
    *   Label Styling: (Bold, margin-bottom)
*   **Navbar:** (Initial styles added in `App.css`)
    *   Background: `#f8f9fa`
    *   Padding: `0.5rem 1rem`
    *   Link Color: `#007bff`
*   **Cards:**
    *   Background:
    *   Border:
    *   Padding:
    *   Shadow:
*   **Modals:**
*   **Tables:**

## 5. Icons

*   **Icon Set:** `TBD` (e.g., React Icons, Font Awesome, Material Icons)
*   **Usage Guidelines:** 