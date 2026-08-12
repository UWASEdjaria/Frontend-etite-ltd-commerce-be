# ETITE LTD Commerce Frontend

A Next.js + TypeScript e-commerce frontend for admin and user dashboards.

## What this project includes

- Admin product management
- Admin order and analytics pages
- User product browsing, cart, checkout, orders, wishlist, and profile
- Authentication flow with login, sign up, OTP verify, and password reset
- File uploads for product images using `FormData`
- Mobile money checkout via Flutterwave
- Toast notification messages for success / error feedback

## Main technologies

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios for API calls
- react-hook-form + zod for validation
- react-hot-toast and sonner for notifications
- react-icons / lucide-react for icons

## Key folders

- `src/app/` - page routes and layouts
- `src/components/` - reusable UI components and admin widgets
- `src/services/` - API service functions
- `src/types/` - TypeScript type definitions
- `src/lib/` - validation and helper utilities

## Important pages

- `/admin/products` - admin product list + add/edit product
- `/admin/orders` - admin order management
- `/admin/analytics` - admin dashboard summary
- `/admin/users` - admin user management
- `/user-dashboard/products` - browse products
- `/user-dashboard/cart` - cart page
- `/user-dashboard/checkout` - checkout page
- `/user-dashboard/orders` - user order history
- `/user-dashboard/profile` - user profile page
- `/user-dashboard/wishlist` - wishlist page

## Upload flow

Product image upload happens in:
- `src/components/admin/productForm.tsx`

The form creates a `FormData` object, appends the image file and other product fields, and sends it to the backend through:
- `src/services/adminProduct.service.ts`

The backend endpoint is:
- `POST ${API_URL}/products`
- `PUT ${API_URL}/products/{id}`

## Why pages update without refresh

This is a React Single Page App behavior:

- Components use `useState()` to store page data
- Pages use `useEffect()` to fetch data from the backend
- When data changes, React re-renders the page automatically
- No full browser refresh is required

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=https://commerce-be-3-5gsc.onrender.com
NEXT_PUBLIC_FLW_PUBLIC_KEY=your_flutterwave_key
```

3. Start development server

```bash
pnpm dev
```

4. Build for production

```bash
pnpm build
pnpm start
```

## Notes

- This is a frontend repo only; it depends on a backend API at `NEXT_PUBLIC_API_URL`
- Authentication tokens are stored in `localStorage`
- Product uploads are sent as multipart form data
- Notifications use `react-hot-toast` and `sonner`

## Useful prompt for learning this project

> Explain this Next.js + TypeScript ecommerce frontend project: what each main page does, how API calls are made from `src/services`, how product image uploads work with `FormData`, and how React state makes pages refresh without full browser reload.
