# ETITE LTD Commerce Frontend

A modern, responsive e-commerce authentication frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Authentication**
  - Sign Up / Register
  - Sign In / Login
  - Email OTP Verification
  - Resend OTP functionality
  - Password visibility toggle

- **Security**
  - OTP-based email verification
  - Secure authentication service
  - Error handling with user-friendly messages

- **UI/UX**
  - Modern, clean interface
  - Responsive design (mobile-first)
  - Beautiful background images
  - Form validation
  - Loading states
  - Error displays

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── verify/            # OTP verification page
│   │   └── resend/        # Resend OTP page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── auth/              # Auth components
│       ├── AuthInput.tsx  # Reusable input (with password toggle)
│       ├── AuthButton.tsx # Reusable button
│       ├── navbar.tsx
│       ├── footer.tsx
├── services/
│   └── authService.ts     # API service for auth endpoints
└── types/
    └── auth.ts            # TypeScript interfaces
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run development server**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production**
   ```bash
   pnpm run build
   pnpm run start
   ```

## 📋 Authentication Flow

1. **Sign Up** → User registers with name, email, password
2. **Verification Email** → Backend sends OTP to email
3. **Verify OTP** → User enters 6-digit code
4. **Success** → Token stored, redirect to dashboard
5. **Resend OTP** → If expired, user can request new code

## 🔐 API Endpoints Required

Your backend should provide:
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/resend-otp` - Resend OTP

## 🎨 UI Components

### AuthInput
- Text input with labels
- **Password fields** have show/hide toggle (👁️ icon)
- Responsive design
- Validation support

### AuthButton
- Loading state with spinner
- Disabled state styling
- Hover effects

## 📱 Pages

| Route | Purpose |
|-------|---------|
| `/login` | User login |
| `/signup` | User registration |
| `/verify` | OTP verification |
| `/verify/resend` | Resend OTP code |

## ⚠️ Recent Fixes

✅ Fixed OTP verification flow
✅ Added resend OTP functionality
✅ Implemented password show/hide toggle
✅ Improved error handling and messages
✅ Removed duplicate component declarations

## 🔧 Tech Stack

- **Framework**: Next.js 16.2.9 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState)

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For issues or questions, contact the development team.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
