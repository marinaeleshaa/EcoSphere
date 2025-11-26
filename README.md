# EcoSphere 🌱

**EcoSphere** is a modern, eco-friendly e-commerce platform designed to help users discover and purchase sustainable products, participate in environmental events, learn about recycling, and engage with eco-conscious content through gamification.

## 🌟 Features

- **🛍️ Eco-Friendly Shopping**: Browse and purchase sustainable products from our curated store
- **📰 Environmental News**: Stay updated with the latest environmental news and sustainability tips
- **📅 Events**: Discover and participate in local and global environmental events
- **♻️ Recycling Hub**: Learn about recycling practices and find recycling resources
- **🎮 Gamification**: Engage with eco-friendly activities through interactive games
- **🛒 Shopping Cart**: Add products to cart and manage your purchases
- **❤️ Favorites**: Save your favorite products for later
- **👤 User Authentication**: Secure login and registration with JWT tokens
- **🌓 Dark Mode**: Beautiful dark/light theme support

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Redux Toolkit** - State management
- **Next Themes** - Theme switching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing
- **TSyringe** - Dependency injection container

### Database
- **MongoDB** - NoSQL database

## 📁 Project Structure

```
EcoSphere/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── login/          # Login endpoint
│   │   │   ├── signup/         # Signup endpoint
│   │   │   └── users/          # User management endpoints
│   │   ├── about/              # About page
│   │   ├── auth/               # Authentication page
│   │   ├── cart/               # Shopping cart page
│   │   ├── events/             # Events page
│   │   ├── fav/                # Favorites page
│   │   ├── game/               # Gamification page
│   │   ├── news/               # News page
│   │   ├── recycle/            # Recycling page
│   │   ├── shop/               # Shop page
│   │   └── store/              # Store page
│   ├── backend/                # Backend logic
│   │   ├── config/             # Configuration files
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Authentication feature
│   │   │   └── user/           # User management feature
│   │   └── utils/              # Utility functions
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components
│   ├── frontend/               # Frontend utilities
│   │   ├── hooks/              # Custom React hooks
│   │   ├── providers/          # Context providers
│   │   ├── redux/              # Redux store
│   │   ├── schema/             # Validation schemas
│   │   └── utilities/          # Frontend utilities
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.types.ts        # API response types
│   │   └── api-helpers.ts      # API helper functions
│   └── lib/                    # Library configurations
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoSphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/ecosphere"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   JWT_SECRET="your-jwt-secret-key"
   ```
4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

All API responses follow a consistent structure:
```typescript
// Success response
{
  success: true,
  data: T,
  message?: string
}

// Error response
{
  success: false,
  error: string,
  message?: string,
  statusCode?: number
}
```

For detailed API type definitions and usage examples, see [`src/types/API_USAGE_GUIDE.md`](src/types/API_USAGE_GUIDE.md).

## 🏗️ Architecture

### Backend Architecture

The backend follows a **layered architecture** with dependency injection:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Models**: Data models and interfaces

Dependency injection is managed using **TSyringe**, providing a clean separation of concerns and testability.

### Type Safety

The project uses TypeScript throughout with:
- Typed API responses
- Type-safe database queries with Prisma
- Type guards for runtime type checking
- Comprehensive type definitions

## 🎨 Styling

The project uses **Tailwind CSS** with a custom color palette:
- Primary green: `#527b50`
- Medium green: `#D6DE75`
- Light green: `#e3e8e2`
- Dark mode support with `next-themes`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

- Password hashing with bcrypt
- JWT token-based authentication
- Secure API endpoints with NextAuth.js
- Type-safe request/response handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🌍 Environmental Impact

EcoSphere is committed to promoting sustainable living and environmental awareness. By providing a platform for eco-friendly products and educational content, we aim to make a positive impact on our planet.

---

Built with ❤️ for a sustainable future 🌱
