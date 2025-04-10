# QuickCommerce Delivery App Tasks

This task list is derived from the features outlined in `PRD.txt`. Check items off as they are completed.

## Shared Backend Tasks - Ref: PRD 4.1, 4.2, 4.3

### Project Setup (Spring Boot / Java)
- [x] Initialize Project (Spring Initializr: Web, JPA, Postgres, Lombok, Security, Validation)
- [x] Set up basic package structure (controller, service, repository, model, dto, config, etc.)
- [x] Configure `application.properties` for DB connection
- [x] Configure basic Spring Security (Permit `/api/auth/**`, PasswordEncoder)

## Customer Facing App (React Web Application) - Ref: PRD 4.1

### Project Setup (React / Vite)
- [x] Initialize project (**Create React App / Vite + React**)
- [x] Set up basic directory structure (components, pages, hooks, etc.)
- [x] Initialize Git repository (in root)
- [x] Configure linter/formatter (ESLint, Prettier)
- [x] Set up basic **client-side routing (e.g., React Router)**

### User Authentication
- **Email/Password Sign Up**
    - [x] [UI] Create SignUpPage component with form (name, email, password)
    - [x] [UI] Implement form state management and basic validation
    - [x] [UI] Create API service function for signup request
    - [x] [UI] Handle API response (success/error) and navigation/feedback
    - [x] [Backend] Create User entity
    - [x] [Backend] Create UserRepository interface
    - [x] [Backend] Create SignUpRequest DTO
    - [x] [Backend] Create AuthService `registerUser` method (incl. password encoding, email check)
    - [x] [Backend] Create AuthController `/api/auth/signup` POST endpoint
- **Email/Password Login**
    - [x] [UI] Create LoginPage component with form (email, password)
    - [x] [UI] Implement form state management
    - [x] [UI] Create API service function for login request
    - [x] [UI] Handle API response (store token, handle errors)
    - [x] [UI] Implement state management for user authentication status (e.g., Context API, Redux)
    - [x] [UI] Implement protected routes requiring login
    - [x] [UI] Add logic to attach JWT token to authenticated API requests
    - [x] [Backend] Create SignInRequest DTO (email, password)
    - [x] [Backend] Create SignInResponse DTO (e.g., JWT token, user details)
    - [x] [Backend] Update SecurityConfig for authentication manager bean
    - [x] [Backend] Implement JWT token generation utility/service
    - [x] [Backend] Update AuthService with login logic (authenticate user, generate JWT)
    - [x] [Backend] Create AuthController `/api/auth/signin` POST endpoint
    - [x] [Backend] Implement CustomUserDetailsService (needed for AuthenticationManager)
    - [x] [Backend] Implement JWT authentication filter
    - [x] [Backend] Update SecurityConfig to use JWT filter
- **Social Login (Google)**
    - [x] [UI] Integrate Google Sign-In for Web SDK (@react-oauth/google)
    - [x] [UI] Implement Google Login button/flow
    - [x] [UI] Send Google token to backend for verification/signup/login
    - [x] [Backend] Add Google Auth library dependency
    - [x] [Backend] Configure Google Client ID properties
    - [x] [Backend] Create DTO for Google token
    - [x] [Backend] Implement endpoint (`/api/auth/google`) to receive token
    - [x] [Backend] Implement service logic to verify Google token
    - [x] [Backend] Implement logic to find/create user based on Google profile
    - [x] [Backend] Generate JWT for successful Google login
- **Password Reset Flow**
    - [ ] [UI] Implement 'Forgot Password' page/form (email input)
    - [ ] [UI] Implement Reset Password page/form (password, confirm password, token input)
    - [ ] [UI] API calls for requesting reset and performing reset
    - [ ] [Backend] Implement endpoint for initiating password reset (e.g., `/api/auth/forgot-password`)
    - [ ] [Backend] Generate secure password reset token (store with expiry)
    - [ ] [Backend] Implement email sending logic (using SendGrid) for reset link/token
    - [ ] [Backend] Implement endpoint for validating token and resetting password (e.g., `/api/auth/reset-password`)
    - [ ] [Backend] Implement service logic for token validation and password update
- **Profile Management**
    - [ ] [UI] Create Profile page to display user info
    - [ ] [UI] Implement form for updating profile (name, phone - if added, password change)
    - [ ] [UI] Implement API calls for fetching and updating profile
    - [ ] [UI] Handle profile picture upload (optional)
    - [ ] [Backend] Create DTOs for profile viewing and updating
    - [ ] [Backend] Implement endpoint to get current user profile (e.g., `/api/users/me`)
    - [ ] [Backend] Implement endpoint to update current user profile
    - [ ] [Backend] Implement service logic for fetching and updating user details (incl. password change logic)

### Product Discovery & Browsing
- [x] [UI] Implement Homepage UI (featured items, promotions, categories)
- [x] [UI] Implement Category browsing screen
- **Search Functionality**
    - [x] [UI] Implement basic search input UI
    - [x] [UI] Display search results UI
    - [x] [Backend] Implement product search API endpoint (basic filtering/keyword matching)
- **Search Filters**
    - [x] [UI] Implement filter selection UI
    - [x] [Backend] Update search API to handle filters (price, brand, etc.)
- **Search Auto-suggestions**
    - [ ] [UI] Display auto-suggestions UI
    - [x] [Backend] Implement auto-suggestion API endpoint
- [x] [UI] Implement Product Detail screen (images, description, price, etc.)
- [x] [UI] Implement Product Reviews display on Product Detail screen
- [x] [UI] Implement Stock Availability indicator on product details
- [x] [Backend] Define Product entity/model
- [x] [Backend] Define Category entity/model
- [x] [Backend] Implement Repositories for Product, Category
- [x] [Backend] Implement Service methods for fetching products, categories, details
- [x] [Backend] Implement Controller endpoints for products, categories
- [x] [Backend] Define Review/Rating entity/model (for delivery, for product)
- [x] [Backend] Implement endpoints for submitting delivery/product reviews
- [x] [Backend] Implement service logic for saving reviews
- [x] [Backend] Implement endpoints for fetching reviews (e.g., for product page)

### Shopping Cart
- [x] [UI] Implement Add to Cart functionality
- [ ] [UI] Implement Remove from Cart functionality
- [ ] [UI] Implement Adjust Item Quantity in Cart
- [ ] [UI] Implement Cart Summary view
- [ ] [UI] Implement Cart state management (e.g., Context API, Redux)
- [ ] [Backend] Define Cart/CartItem entities/models (or handle transiently)
- [ ] [Backend] Implement API endpoints for cart operations (add, remove, update, view)
- [ ] [Backend] Implement Service logic for cart management

### Address Management
- [ ] [UI] Implement Add Delivery Address form UI
- [ ] [UI] Implement List/View saved addresses UI
- [ ] [UI] Implement Set Default Address functionality UI
- [ ] [UI] Implement Edit/Delete Address functionality UI
- [ ] [UI] Implement Address validation/suggestion (Google Places JavaScript API)
    - [ ] [UI] Integrate Google Places JS API library
    - [ ] [UI] Implement autocomplete suggestions in address form
- [ ] [Backend] Define Address entity/model (associated with User)
- [ ] [Backend] Implement Address Repository
- [ ] [Backend] Implement Address Service methods (CRUD, set default)
- [ ] [Backend] Implement Address Controller endpoints (CRUD for current user)

### Checkout & Payment
- [ ] [UI] Implement Order Summary Review screen UI
- [ ] **Integrate Payment Gateway (Stripe)**
    - [ ] [UI] Setup Stripe account & keys (client-side)
    - [ ] [UI] Integrate React Stripe Elements for payment method input
    - [ ] [UI] Handle payment intent client secret from backend
    - [ ] [UI] Handle payment confirmation/status updates client-side
    - [ ] [Backend] Setup Stripe account & keys (server-side)
    - [ ] [Backend] Add Stripe Java library dependency
    - [ ] [Backend] Implement endpoint to create Payment Intent
    - [ ] [Backend] Implement webhook handler for Stripe events (optional but recommended)
- [ ] [UI] Implement Add/Save Payment Methods UI (using Stripe Setup Intents / saved cards)
- [ ] [Backend] Implement endpoints/logic for managing saved payment methods (Stripe Customer object)
- [ ] [UI] Implement Apply Promo Codes/Discounts logic UI
- [ ] [Backend] Define Promotion/Discount entity/model
- [ ] [Backend] Implement logic/endpoints for validating and applying promo codes
- [ ] [UI] Implement Order Confirmation screen UI
- [ ] [UI] Implement Payment Failure handling (UI feedback & potential retry)
- [ ] [Backend] Define Order/OrderItem entities/models
- [ ] [Backend] Implement Order creation logic in service layer (triggered after successful payment)
- [ ] [Backend] Implement Order Repository
- [ ] [Backend] Implement Order Controller endpoints (e.g., place order)

### Order Management & Tracking
- [ ] [UI] Implement Order History screen (Past & Current) UI
- [ ] [UI] Implement Order Detail view UI
- **Real-time Map-based Delivery Tracking**
    - [ ] [UI] Integrate Google Maps JavaScript API library
    - [ ] [UI] Display delivery partner marker on map
    - [ ] [UI] Subscribe to live location updates (WebSockets/SSE)
    - [ ] [UI] Update marker position based on received data
    - [ ] [Backend] Define mechanism for tracking partner location (e.g., separate endpoint or WebSocket connection)
    - [ ] [Backend] Implement WebSocket/SSE endpoint to broadcast location updates to relevant customers
- [ ] [UI] Implement ETA display and dynamic updates
- [ ] [Backend] Implement ETA calculation logic (potentially involving external map APIs)
- [ ] [Backend] Include ETA in location update broadcasts
- [ ] [UI] Implement 'Reorder' button/flow UI
- [ ] [Backend] Implement endpoint/logic for reordering

### Notifications
- **Setup Web Push (FCM) / Email (SendGrid)**
    - [ ] [UI] Configure Firebase Project & SendGrid Account keys (client-safe keys if needed)
    - [ ] [UI] Implement browser permission request for Web Push
    - [ ] [UI] Implement Service Worker for FCM Web Push
    - [ ] [Backend] Configure FCM/SendGrid server keys/credentials
    - [ ] [Backend] Add FCM/SendGrid Java libraries
    - [ ] [Backend] Implement endpoint for saving/managing push subscriptions
    - [ ] [Backend] Implement service for sending Web Push notifications via FCM
    - [ ] [Backend] Implement service for sending emails via SendGrid
- [ ] [Backend] Implement Order Confirmation notification logic (trigger push/email)
- [ ] [Backend] Implement Payment Success/Failure notifications logic (trigger push/email)
- [ ] [Backend] Implement Delivery Partner Assigned notification logic (trigger push/email)
- [ ] [Backend] Implement Partner Arriving Soon notification logic (trigger push/email)
- [ ] [Backend] Implement Order Delivered notification logic (trigger push/email)
- [ ] [Backend] Implement Special Offers/Promotions notifications logic (trigger push/email - likely admin initiated)
- [ ] [UI] Implement In-app Notification Center UI & API (fetching/displaying notification history)
- [ ] [Backend] Define Notification entity/model (for history)
- [ ] [Backend] Implement endpoint for fetching user notifications

### Ratings & Reviews
- [ ] [UI] Implement Rate Delivery Experience flow UI
- [ ] [UI] Implement Rate Purchased Products flow UI
- [ ] [Backend] Define Review/Rating entity/model (for delivery, for product)
- [ ] [Backend] Implement endpoints for submitting delivery/product reviews
- [ ] [Backend] Implement service logic for saving reviews
- [ ] [Backend] Implement endpoints for fetching reviews (e.g., for product page)

### Customer Support
- **Implement Web Chat feature/integration**
    - [ ] [UI] Select & Integrate 3rd party Web chat widget
    - [ ] [UI] Implement Chat UI integration
- [ ] [UI] Implement Help Center/FAQ screen (static content initially)
- **Implement Report Order Issue flow**
    - [ ] [UI] Create form/flow to report issue
    - [ ] [UI] API call to submit issue report
    - [ ] [Backend] Define SupportTicket entity/model
    - [ ] [Backend] Implement endpoint for submitting support tickets
    - [ ] [Backend] Implement service logic for saving tickets (potentially notify admin)

### UI Styling & Polish (Customer App)
- [ ] **Implement overall modern, sleek, minimalistic design vision** (Ref: PRD Usability)
- [x] Apply consistent form styling (Login, Signup, etc.) based on STYLE_GUIDE.md
    - [x] Style `LoginPage` form
    - [x] Style `SignUpPage` form
    - [ ] Style `ProfilePage` form (once update fields are added)
- [x] Refine Navbar styling based on STYLE_GUIDE.md
    - [x] Style `Navbar` layout in `App.jsx`
    - [x] Style `SearchBar` component appearance
- [ ] Define and apply consistent button styles (primary, secondary, disabled) based on STYLE_GUIDE.md
    - [ ] Style login/signup buttons
    - [ ] Style search button
    - [ ] Style logout button
    - [ ] Style 'Add to Cart' button (on Product Detail)
- [ ] Style `HomePage` layout and components based on STYLE_GUIDE.md
    - [ ] Style category list section
    - [ ] Style featured product list section
- [ ] Style `CategoryPage` layout and components based on STYLE_GUIDE.md
- [ ] Style `SearchResultsPage` layout and components based on STYLE_GUIDE.md
    - [ ] Style `SearchFilters` component appearance
    - [ ] Style `ProductCard` component appearance (as used on search results)
- [ ] Style `ProductDetailPage` layout and components based on STYLE_GUIDE.md
    - [ ] Style product image display
    - [ ] Style product info section (name, price, description, stock)
    - [ ] Style `ReviewItem` component appearance
- [ ] Ensure consistent typography and spacing across pages based on STYLE_GUIDE.md

## Delivery Partner App (React Web Application) - Ref: PRD 4.2

### Project Setup (React / Vite)
- [ ] Initialize project (**Create React App / Vite + React**)
- [ ] Set up basic directory structure
- [ ] Configure linter/formatter
- [ ] Set up basic **client-side routing (e.g., React Router)**

### Registration & Onboarding
- **Partner Sign Up Process**
    - [ ] [UI] Implement Sign Up form specific to partners
    - [ ] [UI] API call to partner signup endpoint
    - [ ] [Backend] Potentially different DTO/endpoint/logic for partner signup (e.g., `/api/partners/signup`)
- **Integrate Identity Verification service**
    - [ ] [UI] Implement verification steps in UI flow
    - [ ] [Backend] Select & Integrate 3rd party service
    - [ ] [Backend] Handle verification callbacks/status updates
- **Integrate Background Check service**
    - [ ] [Backend] Select & Integrate 3rd party service
    - [ ] [Backend] Trigger background check process
    - [ ] [Backend] Handle background check status updates
- **Implement Profile Setup**
    - [ ] [UI] Implement form for vehicle details, bank info
    - [ ] [UI] API call to update partner profile
    - [ ] [Backend] Extend User or create PartnerProfile entity for extra details
    - [ ] [Backend] Implement endpoint/service for updating partner profile

### Availability & Orders
- **Implement Availability Toggle**
    - [ ] [UI] Implement Online/Offline toggle button
    - [ ] [UI] API call to update partner status
    - [ ] [UI] Implement background location tracking using Browser Geolocation API
    - [ ] [UI] Send location updates to backend while online
    - [ ] [Backend] Add field to User/PartnerProfile for availability status
    - [ ] [Backend] Implement endpoint to update availability status
    - [ ] [Backend] Implement endpoint to receive location updates
- **Order Notifications & Details**
    - [ ] [UI] Implement UI to display new delivery request notification (FCM Web Push / In-app alert)
    - [ ] [UI] Implement View Order Details screen
    - [ ] [UI] API call to fetch order details
    - [ ] [Backend] Implement logic to find available partners and assign orders
    - [ ] [Backend] Trigger notification (FCM) to assigned partner
    - [ ] [Backend] Implement endpoint for partner to fetch assigned order details
- **Accept/Reject Orders**
    - [ ] [UI] Implement Accept/Reject buttons/logic
    - [ ] [UI] API call to accept/reject order
    - [ ] [Backend] Implement endpoint for partner to accept/reject order
    - [ ] [Backend] Update order status and handle timeouts/reassignment

### Delivery Execution
- [ ] [UI] Implement Link/Button to open Pickup Location in external map app (Google Maps)
- **Implement Order Pickup Confirmation**
    - [ ] [UI] Implement QR Code scanning via webcam or Manual Code Entry UI
    - [ ] [UI] API call to confirm pickup
    - [ ] [Backend] Implement endpoint for pickup confirmation
    - [ ] [Backend] Update order status
- [ ] [UI] Implement Link/Button to open Delivery Location in external map app (Google Maps)
- [ ] [Backend] Implement Route Optimization service (if required)
- **Implement In-app communication with customer**
    - [ ] [UI] Implement web chat component UI
    - [ ] [Backend] Implement masked communication service integration or basic chat backend
- **Implement Proof of Delivery (Photo)**
    - [ ] [UI] Implement Photo upload component UI
    - [ ] [UI] API call to upload photo
    - [ ] [Backend] Implement file storage solution (e.g., S3, local)
    - [ ] [Backend] Implement endpoint for photo upload, link photo to order
- [ ] [UI] Implement Order Completion confirmation step
- [ ] [Backend] Implement endpoint for order completion confirmation
- [ ] [Backend] Update order status, trigger notifications/payments

### Earnings & Performance
- [ ] [UI] Implement Earnings Dashboard UI
- [ ] [UI] Implement Weekly/Daily Earnings summary view UI
- [ ] [UI] Implement View Ratings/Feedback from Customers screen UI
- [ ] [Backend] Implement endpoints to fetch earnings data and ratings for partner
- [ ] [Backend] Calculate earnings based on completed deliveries

### Support
- [ ] [UI] Implement Access to Partner Support (e.g., chat, FAQ link)
- [ ] [UI] Implement Partner-specific FAQ section

### UI Styling & Polish (Partner App)
- [ ] Apply consistent form styling (Signup, Profile, etc.) based on STYLE_GUIDE.md
- [ ] Define and apply consistent button styles
- [ ] Style Dashboard/Earnings views
- [ ] Style Order Details view
- [ ] Ensure consistent typography and spacing

## Admin Panel (React Web Application) - Ref: PRD 4.3

### Project Setup (React / Vite)
- [ ] Initialize project (**Create React App / Vite + React**)
- [ ] Set up basic directory structure
- [ ] Configure linter/formatter
- [ ] Set up basic **client-side routing (e.g., React Router)**

### Dashboard
- [ ] [UI] Implement Dashboard UI with Key Metrics
- [ ] [UI] Implement Real-time Activity Feed display
- [ ] [Backend] Implement endpoints to provide dashboard data (aggregation queries)

### User Management
- [ ] [UI] Implement Customer List view (Table, Search, Filter)
- [ ] [UI] Implement Delivery Partner List view (Table, Search, Filter)
- [ ] [UI] Implement User Profile Management view (Verify, Suspend, Delete actions)
- [ ] [UI] Implement View User Order History
- [ ] [UI] Implement Delivery Partner Verification/Documentation Management UI
- [ ] [Backend] Implement admin endpoints for user listing (with pagination/search/filter)
- [ ] [Backend] Implement admin endpoints for managing users (verify, suspend, delete)
- [ ] [Backend] Implement admin endpoints for managing partner verification status/docs
- [ ] [Backend] Implement admin endpoints for viewing user order history

### Product & Inventory Management
- [ ] [UI] Implement Category Management UI (CRUD)
- [ ] [UI] Implement Product Management UI (CRUD)
- [ ] [UI] Implement Stock Level Management UI
- [ ] [UI] Implement Product Visibility/Availability controls UI
- [ ] [Backend] Implement admin endpoints for CRUD operations on Categories
- [ ] [Backend] Implement admin endpoints for CRUD operations on Products
- [ ] [Backend] Implement admin endpoints for managing stock levels
- [ ] [Backend] Implement admin endpoints for controlling product visibility

### Order Management
- [ ] [UI] Implement Order List view (Table, Current & Past, Search, Filter)
- [ ] [UI] Implement Order Detail view for Admins
- [ ] [UI] Implement Manual Order Assignment functionality UI
- [ ] [UI] Implement Order Cancellation/Refund processing UI
- [ ] [Backend] Implement admin endpoints for order listing (with pagination/search/filter)
- [ ] [Backend] Implement admin endpoint for viewing specific order details
- [ ] [Backend] Implement admin endpoint/logic for manual order assignment
- [ ] [Backend] Implement admin endpoint/logic for order cancellation/refund (integrating with Stripe)

### Pricing & Promotions
- [ ] [UI] Implement Delivery Fee configuration UI
- [ ] [UI] Implement Promo Code Management UI (CRUD)
- [ ] [UI] Implement Service Fee/Markup configuration UI
- [ ] [Backend] Define entities/storage for pricing rules, delivery fees
- [ ] [Backend] Implement admin endpoints for managing delivery fees, service fees
- [ ] [Backend] Implement admin endpoints for CRUD operations on Promo Codes

### Zone Management
- [ ] [UI] Implement Map Interface for defining delivery zones (Google Maps JS API)
    - [ ] [UI] Draw/Edit polygons on map
- [ ] [UI] Implement Zone Settings Management UI (fees, hours)
- [ ] [Backend] Define Zone entity/model (store geometry using PostGIS types)
- [ ] [Backend] Implement admin endpoints for CRUD operations on Zones
- [ ] [Backend] Implement admin endpoints for managing zone settings

### Delivery Partner Management
- [ ] [UI] Implement Map view for monitoring partner locations/status (Google Maps JS API)
- [ ] [UI] Implement Payout Management/Reporting UI
- [ ] [UI] Implement Admin-to-Partner communication tool UI (Announcements/Messages)
- [ ] [Backend] Ensure live location updates from partners are stored/accessible
- [ ] [Backend] Implement admin endpoint to fetch current partner locations/statuses
- [ ] [Backend] Implement logic/endpoints for managing partner payouts
- [ ] [Backend] Implement logic/endpoints for admin sending messages/announcements to partners

### Reporting & Analytics
- [ ] [UI] Implement Sales Report display
- [ ] [UI] Implement Customer Report display
- [ ] [UI] Implement Delivery Report display
- [ ] [UI] Implement Product Performance Report display
- [ ] [UI] Implement Data Visualization (integrate charting library)
- [ ] [UI] Implement Data Export functionality
- [ ] [Backend] Implement services/queries to generate data for various reports
- [ ] [Backend] Implement endpoints to serve report data
- [ ] [Backend] Implement data export logic (e.g., CSV generation)

### Support Management
- [ ] [UI] Implement Support Ticket Management view (List, View details)
- [ ] [UI] Implement Assign Tickets to Staff functionality UI
- [ ] [Backend] Implement admin endpoints for listing/viewing support tickets
- [ ] [Backend] Implement admin endpoint/logic for assigning tickets

### Settings
- [ ] [UI] Implement Application Settings configuration UI
- [ ] [UI] Implement Admin User Role/Permission Management UI
- [ ] [Backend] Define storage/entity for application settings
- [ ] [Backend] Implement admin endpoints for managing application settings
- [ ] [Backend] Define Role/Permission entities/models
- [ ] [Backend] Implement admin endpoints for managing admin roles/permissions
- [ ] [Backend] Enforce permissions using Spring Security method security or filter rules

### UI Styling & Polish (Admin Panel)
- [ ] Apply consistent styling to tables and lists
- [ ] Apply consistent form styling
- [ ] Define and apply consistent button styles
- [ ] Style Dashboard and key metrics display
- [ ] Style map views (Zone Management, Partner Monitoring)
- [ ] Ensure consistent typography and spacing 