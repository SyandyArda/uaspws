# SmartRetail Open API

> Retail Management as a Service - RESTful API for inventory, transactions, and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (for database)
- npm or yarn

### Installation

1. Clone the repository
```bash
cd api
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start database services
```bash
docker-compose up -d
```

5. Run database migrations
```bash
npm run migrate
```

6. Seed initial data (optional)
```bash
npm run seed
```

7. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:3000/api-docs`
- API Portal: `http://localhost:3000`

## 🔑 Authentication

All API requests require authentication using API Key:

```bash
curl -H "X-API-Key: sr_live_your_api_key" \
  https://api.smartretail.com/api/v1/products
```

## 📖 Endpoint Overview

- **Authentication**: `/api/v1/auth/*`
- **Products**: `/api/v1/products/*`
- **Transactions**: `/api/v1/transactions/*`
- **Reports**: `/api/v1/reports/*`
- **Sync**: `/api/v1/sync/*`

See full endpoint list in [documentation](./docs/endpoints.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

## 🏗️ Project Structure

```
api/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Test files
├── portal/              # API documentation portal
└── docker-compose.yml   # Docker services
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14
- **Cache**: Redis 7
- **ORM**: Sequelize
- **Auth**: JWT + API Keys
- **Docs**: Swagger/OpenAPI 3.0

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Syandy Arda Syahnuari - NIM 20230140148
