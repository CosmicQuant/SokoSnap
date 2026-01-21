# SokoSnap by TumaFast

A secure social commerce platform with M-Pesa escrow integration. Built with React 19, TypeScript, and Zustand.

![SokoSnap Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Features

- 🎬 **TikTok-style Product Feed** - Swipeable product discovery
- 🛡️ **Secure Escrow** - M-Pesa payment protection
- 🛒 **Smart Cart** - Persistent shopping cart
- 📊 **Seller Dashboard** - Analytics and smart links
- 🔐 **Phone Authentication** - Simple and secure login
- ♿ **Accessible** - WCAG 2.1 compliant

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **Zod** - Runtime validation
- **Vite** - Fast development and building
- **Vitest** - Unit testing
- **ESLint + Prettier** - Code quality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd sokosnap

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript checks |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── LazyMedia.tsx
│   │   └── ErrorBoundary.tsx
│   └── features/        # Feature-specific components
│       ├── CheckoutFeed.tsx
│       ├── CartView.tsx
│       ├── ProfileView.tsx
│       ├── SellerDashboard.tsx
│       └── SuccessView.tsx
├── store/               # Zustand stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
│   ├── validators.ts    # Zod schemas
│   ├── formatters.ts    # Formatting helpers
│   └── constants.ts     # App constants
├── types/               # TypeScript types
├── styles/              # Global CSS
└── test/                # Test utilities
```

## Architecture Decisions

### State Management
We use **Zustand** for its simplicity and performance. Stores are organized by domain:
- `authStore` - Authentication state
- `cartStore` - Shopping cart with persistence
- `uiStore` - Navigation and UI state

### Validation
**Zod** is used for runtime validation of all user inputs, providing type inference and clear error messages.

### Component Design
- **Common components** are fully accessible with ARIA attributes
- **Feature components** handle business logic
- **Lazy loading** for performance optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ by TumaFast
