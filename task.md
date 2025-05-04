# QuickCommerce Delivery App Tasks

This task list outlines the development of the QuickCommerce platform, including backend services and customer/delivery partner applications.

## Shared Backend Tasks - Ref: PRD 4.1, 4.2, 4.3

### Project Setup (Spring Boot / Java)
- [x] Initialize Project (Spring Initializr: Web, JPA, Postgres, Lombok, Security, Validation)
- [x] Set up basic package structure (controller, service, repository, model, dto, config, etc.)
- [x] Configure `application.properties` for DB connection
- [x] Configure basic Spring Security (Permit `/api/auth/**`, PasswordEncoder)

## NEW Customer Facing App (Next.js Web Application) - Ref: PRD 4.1

### Project Setup (Next.js / TypeScript)
- [x] Initialize Next.js project (using `create-next-app`, named `customer-web-app`, with TypeScript, Tailwind, App Router)
- [x] Configure Tailwind CSS for styling (theme customizations, plugins if needed)
- [x] Set up project directory structure (`src/app`, `src/components`, `src/lib`, `src/hooks`, `src/services`, `src/styles`, etc.)
- [x] Initialize Git repository (if not already done in root)
- [x] Configure linter/formatter (ESLint, Prettier)
- [x] Set up environment variables (`.env.local`) for API base URL, payment keys, etc.

### Core Layout Implementation (Modern & Sleek UI Focus)
- [x] [UI] Create reusable `Layout` component (integrating Navbar, Footer, main content area)
- [x] [UI] Implement `Navbar` component from scratch
    - [x] [UI] Design and implement elegant, responsive layout (desktop & mobile)
    - [x] [UI] Integrate Next.js `Link` for routing
    - [x] [UI] Implement sleek `SearchBar` component within Navbar
    - [x] [UI] Style cart and profile icons/links
    - [x] [UI] Implement accessible mobile menu (e.g., using Headless UI)
- [x] [UI] Implement `Footer` component from scratch with modern design.

### User Authentication Implementation
- [x] [UI] Set up application state management for authentication (e.g., React Context, Zustand)
- [x] [UI] Create `SignUpPage` (`app/signup/page.tsx`)
    - [x] [UI] Design and implement signup form with validation
    - [x] [UI] Implement API calls for signup
- [x] [UI] Create `LoginPage` (`app/login/page.tsx`)
    - [x] [UI] Design and implement login form
    - [x] [UI] Implement API calls for login
    - [x] [UI] Handle JWT storage/session management (e.g., secure HttpOnly cookie via API route or other secure method)
- [x] [UI] Implement protected route handling (e.g., using Next.js Middleware, `next-auth` callbacks, or HOCs)
- [x] [UI] Implement Google Login integration (e.g., using `next-auth`)
    - [x] [UI] Set up `next-auth` configuration and API routes (`/api/auth/[...nextauth]`)
- [x] [UI] Create `ForgotPasswordPage` and `ResetPasswordPage`
- [x] [UI] Create `ProfilePage` (`app/profile/page.tsx` or `app/account/page.tsx`)
    - [x] [UI] Design UI for viewing and updating profile information
    - [x] [UI] Implement profile fetching and updating API calls

### Product Discovery & Browsing Implementation
- [ ] [UI] Implement `HomePage` (`app/page.tsx`)
    - [ ] [UI] Design modern homepage layout (hero section, categories, featured products)
    - [ ] [UI] Implement efficient data fetching (e.g., `fetch` with Server Components, `getStaticProps` if suitable)
    - [ ] [UI] Implement Category display section
    - [ ] [UI] Implement Featured Product display section (product cards)
- [ ] [UI] Implement `CategoryPage` (e.g., `app/categories/[slug]/page.tsx`)
    - [ ] [UI] Design category listing page
    - [ ] [UI] Implement data fetching for category products
- [ ] [UI] Implement `SearchPage` (`app/search/page.tsx`)
    - [ ] [UI] Design search results page with filtering options
    - [ ] [UI] Implement search input handling and API calls
    - [ ] [UI] Implement client-side or server-side filtering/sorting
- [ ] [UI] Implement `ProductDetailPage` (`app/product/[id]/page.tsx`)
    - [ ] [UI] Design product detail layout (images, description, price, reviews, stock)
    - [ ] [UI] Implement data fetching for product details
    - [ ] [UI] Implement review display
    - [ ] [UI] Implement stock level display

### Shopping Cart Implementation
- [x] [UI] Set up cart state management (React Context, Zustand, Redux Toolkit)
- [x] [UI] Implement Add/Remove/Update cart functionality in product components/detail page
- [x] [UI] Implement `CartPage` view (`app/cart/page.tsx`)
    - [x] [UI] Design cart display with items, quantities, pricing, and summary

### Address Management Implementation
- [x] [UI] Implement Add/List/Edit/Delete Address UI (e.g., within profile/account page or checkout)
- [ ] [UI] Implement Google Places Autocomplete for address forms

### Checkout & Payment Implementation
- [ ] [UI] Implement multi-step `CheckoutPage` (`app/checkout/page.tsx`)
    - [x] [UI] Design elegant Address selection step
    - [x] [UI] Design Payment method selection step
    - [ ] [UI] Integrate Razorpay Checkout SDK for Next.js
- [ ] [UI] Implement `OrderConfirmationPage` (`app/order/confirmation/[orderId]/page.tsx`)
    - [ ] [UI] Design clear order success/summary page

### Order Management & Tracking Implementation
- [x] [UI] Implement `OrderHistoryPage` (`app/orders/page.tsx`)
- [ ] [UI] Implement `OrderDetailPage` (`app/orders/[orderId]/page.tsx`)
- [ ] [UI] Implement real-time map tracking component
    - [ ] [UI] Integrate Google Maps SDK for React/Next.js
    - [ ] [UI] Implement WebSocket/SSE client for location updates
- [ ] [UI] Create `OrderTrackingPage` (`app/orders/[orderId]/tracking/page.tsx`)
    - [ ] [UI] Display order details and delivery address
    - [ ] [UI] Integrate map (OpenStreetMap/Leaflet) showing delivery address and delivery partner markers
    - [ ] [UI] Simulate live delivery partner location updates with mock data
    - [ ] [UI] Show real-time distance between delivery partner and delivery address
    - [ ] [UI] Animate delivery partner marker moving toward destination
    - [x] [UI] Show custom rider icon on map

### General Development Tasks (Next.js App)
- [x] [Build] Define API service layer/functions for backend communication
- [ ] [Build] Implement utility functions/hooks as needed
- [ ] [Build] Ensure robust error handling across the application
- [ ] [Build] Write unit and integration tests (e.g., Jest, React Testing Library)
- [ ] [Build] Conduct thorough testing for responsiveness and cross-browser compatibility
- [ ] [Build] Optimize performance (image optimization, code splitting, data fetching)
- [x] [Cleanup] Eventually remove the old React+Vite customer app (`quickcommerce-app/customer-app`)

## Delivery Partner App (React Native) - Ref: PRD 4.2

### Project Setup (React Native / Expo)
- [x] Initialize Project (**Expo CLI**)
- [x] Set up basic structure (screens, components, navigation, etc.)
- [ ] Configure linter/formatter

### Authentication
- [x] Implement Login screen UI
- [x] Implement API calls for partner login
- [x] Implement token storage (SecureStore)
- [x] Implement logout functionality

### Delivery Partner Order Flow

#### Order Assignment and Notification System
- [ ] Implement a notification system to alert delivery partners about new orders
- [ ] Create an API endpoint to send delivery requests to all available delivery partners
- [ ] Develop a real-time notification feature using WebSockets or Firebase Cloud Messaging
- [x] Design and implement a delivery request screen in the partner app
- [x] Add functionality for partners to view order details before accepting/rejecting
- [x] Create accept/reject buttons with appropriate confirmation dialogs
- [x] Implement timeout logic if a partner doesn't respond within a specific timeframe

#### Order Management for Delivery Partners
- [ ] Create "My Orders" section in the partner app to display accepted orders
- [x] Design and implement order detail view showing customer info, items, and delivery address
- [ ] Add map integration to show delivery route from restaurant to customer
- [ ] Implement order filtering by status (pending pickup, in transit, delivered)
- [ ] Create search functionality within orders
- [ ] Add order history section for completed deliveries

#### Order Status Updates
- [x] Create a status update workflow for delivery partners:
  - [x] "Accepted" - Initial status when partner accepts the order
  - [x] "Arrived at Restaurant" - Partner has arrived at pickup location
  - [x] "Order Picked Up" - Partner has received the order from restaurant
  - [x] "In Transit" - Partner is on the way to customer
  - [x] "Arrived at Location" - Partner has arrived at delivery location
  - [x] "Delivered" - Order successfully delivered to customer
  - [x] "Delivery Failed" - Issues with delivery (wrong address, customer not available, etc.)
- [x] Design UI components for updating status with single tap
- [x] Implement confirmation prompts for critical status changes
- [ ] Add ability to add notes or photos at each status change (particularly for failed deliveries)
- [ ] Create an API to process and propagate status updates

#### Customer App Integration
- [ ] Update customer app to display real-time delivery status
- [ ] Create a delivery tracking screen showing order progress
- [ ] Add push notifications for customers when order status changes
- [ ] Implement estimated time of arrival based on partner's location
- [ ] Add ability for customers to contact their delivery partner
- [ ] Create rating/feedback system for delivery after completion

### Navigation & Tracking (Delivery Partner)
- [ ] Integrate Map library (e.g., `react-native-maps`)
- [ ] Display route from current location to pickup/delivery address
- [ ] Implement background location tracking service
- [ ] Send location updates periodically to the backend

### Notifications (Delivery Partner)
- [ ] Configure Push Notifications (Expo Notifications / FCM)
- [ ] Handle receiving new order assignment notifications
- [ ] Handle order update notifications

## Backend Development (Continued)

### Delivery Partner Specific Endpoints
- [ ] Implement Partner Authentication endpoint
- [ ] Implement endpoint to fetch available orders for partners
- [ ] Implement endpoint for partner to accept an order
- [ ] Implement endpoint to fetch details of an assigned order
- [ ] Implement endpoint for partner to confirm pickup
- [ ] Implement endpoint for partner to confirm delivery
- [ ] Implement endpoint to receive partner location updates
- [ ] Implement endpoint to fetch partner's order history

### Backend Requirements for Delivery System
- [ ] Extend Order model to include delivery-specific fields:
  - [ ] deliveryPartnerId
  - [ ] deliveryStatus
  - [ ] deliveryNotes
  - [ ] estimatedDeliveryTime
  - [ ] actualDeliveryTime
  - [ ] deliveryRating
- [ ] Create APIs for:
  - [ ] Broadcasting new orders to available partners
  - [ ] Accepting/rejecting delivery requests
  - [ ] Updating delivery status
  - [ ] Tracking delivery partner location
  - [ ] Customer feedback for delivery
- [ ] Implement availability tracking for delivery partners
- [ ] Create logic for selecting delivery partners based on location, rating, etc.
- [ ] Build analytics dashboard for delivery performance metrics

### System Integration
- [ ] Ensure seamless communication between restaurant app, customer app, and partner app
- [ ] Implement proper error handling and fallback mechanisms
- [ ] Create system for handling edge cases (partner cancellations, app crashes, network issues)
- [ ] Design retry mechanisms for failed API calls
- [ ] Build monitoring and alerting for delivery system components

### Real-time Communication Enhancements
- [ ] Refine WebSocket/SSE implementation for broadcasting location updates efficiently
- [ ] Implement WebSocket/SSE for broadcasting new order availability to eligible partners

### Admin Features (Optional - Future)
- [ ] User Management UI
- [ ] Product/Category Management UI
- [ ] Order Monitoring UI
- [ ] Delivery Partner Management UI

## Deployment & Infrastructure

### Backend (Spring Boot)
- [ ] Containerize application (Dockerfile)
- [ ] Set up CI/CD pipeline (GitHub Actions -> AWS Elastic Beanstalk / EC2 / EKS)
- [ ] Configure managed PostgreSQL database (AWS RDS)
- [ ] Configure logging and monitoring (CloudWatch)
- [ ] Set up load balancer and auto-scaling

### Customer App (Next.js)
- [ ] Configure Vercel for deployment (or choose alternative: AWS Amplify, Netlify)
- [ ] Set up CI/CD pipeline (GitHub Actions -> Vercel)
- [ ] Configure domain name


### Delivery Partner App (React Native / Expo)
- [ ] Build standalone apps (`eas build`)
- [ ] Submit to App Store / Google Play Store
- [ ] Set up Over-The-Air (OTA) updates (Expo Updates / EAS Update)

## Cross-Cutting Concerns

- [ ] **API Documentation:** Generate/maintain API docs (Swagger/OpenAPI)
- [ ] **Testing:**
    - [ ] Implement Unit Tests (JUnit for Backend, Jest/React Testing Library for Frontend/RN)
    - [ ] Implement Integration Tests (Spring Boot Tests, Cypress/Playwright for Frontend)
    - [ ] Implement End-to-End Tests
- [ ] **Security:**
    - [ ] Regular dependency scanning
    - [ ] Security headers (Helmet for Spring Boot, configure in Next.js/Vercel)
    - [ ] Rate limiting on APIs
    - [ ] Input validation (backend and frontend)
- [ ] **Logging & Monitoring:** Centralized logging, performance monitoring
- [ ] **Error Handling:** Consistent error handling strategy across apps 