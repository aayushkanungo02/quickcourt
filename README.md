<div align="center">

# QuickCourt

Discover, book, and manage sports venues and courts.

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-^7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-UI-000000)](https://ui.shadcn.com)
[![TanStack Query](https://img.shields.io/badge/TanStackQuery-5-FF4154)](https://tanstack.com/query/latest)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com)

</div>

### Project overview

- Full‑stack booking platform with three roles:
  - User: browse venues, view details, book courts, pay with Stripe
  - Facility Owner: manage venues and courts
  - Admin: secure admin dashboard with server‑side credentials
- Modern UI, responsive design, OTP email verification, and cookie‑based auth.

### Tech stack

- Frontend: React (Vite), React Router, Tailwind CSS, shadcn/ui, TanStack Query, Stripe Elements
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary, Nodemailer, Stripe

### Repository layout

```
Odoo-hackathon/
  Backend/   # Express API
  Frontend/  # Vite + React client
```

### Prerequisites

- Node.js 18+
- MongoDB running locally or hosted
- Stripe and Cloudinary accounts (optional for basic dev without uploads/payments)

### Quick start

1) Backend

```bash
# Clone the repo
git clone https://github.com/your-username/quickcourt.git

# Install dependencies for backend
cd server
npm install

# Install dependencies for frontend
cd ../client
npm install

# Create .env files in server & client with required variables
# Example for server/.env:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Run backend
cd server
npm run dev

# Run frontend
cd ../client
npm run dev
```

3) Open the app at `http://localhost:5173`

### How backend and frontend connect

- In development, the frontend calls the backend at `http://localhost:4001/api` (see `Frontend/src/lib/axios.js`).
- Vite dev server also proxies `/api` → `http://localhost:4001` (see `Frontend/vite.config.js`).
- Backend CORS is configured to allow `http://localhost:5173` with credentials. Axios is set to `withCredentials: true`.

### Features at a glance

- Venue discovery and details, search/filter
- Court booking flow with date/time selection
- Stripe payments and booking confirmation
- Facility owner dashboard for managing facilities/courts
- Admin dashboard (email/password from `.env`)

### Useful scripts

- Backend: `npm run dev`, `npm start`, `npm run seed`, `npm run seed:courts`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

### Troubleshooting (dev)

- If user auth checks 401 before login, that’s expected. After login, ensure cookies are set and CORS allows credentials.
- For admin login, make sure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` are set and the backend is restarted.



