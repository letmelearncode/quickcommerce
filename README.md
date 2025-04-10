# QuickCommerce

A comprehensive e-commerce platform with multiple applications:

## Project Structure

```
├── backend/            # Spring Boot backend API
├── customer-app/       # React customer-facing storefront
├── admin-app/          # Admin dashboard for store management
└── partner-app/        # Partner/vendor portal
```

## Applications

### Backend (Spring Boot)
Java-based REST API that powers all front-end applications with features:
- Product catalog management
- Order processing
- User authentication and authorization
- Cart management
- Payment processing

### Customer App (React)
User-facing storefront with:
- Product browsing and search
- Shopping cart functionality
- Checkout flow
- User account management
- Order history

### Admin App
Dashboard for store administrators:
- Inventory management
- Order fulfillment
- Customer management
- Analytics and reporting

### Partner App
Portal for vendors and partners:
- Product listing management
- Order fulfillment
- Performance metrics

## Development

### Prerequisites
- JDK 17 or higher
- Node.js 18 or higher
- Maven

### Setup Instructions
1. Clone the repository
   ```
   git clone https://github.com/yourusername/quickcommerce.git
   cd quickcommerce
   ```

2. Backend Setup
   ```
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. Frontend Apps Setup
   ```
   cd customer-app
   npm install
   npm start
   ```

   (Similar process for admin-app and partner-app)

## License
[MIT License](LICENSE) 