# E-commerce App

A full-stack E-commerce app built with the **MERN stack** (MongoDB, Express.js, React, Node.js), styled using **TailwindCSS**. Authentication and Authorization are implemented using **JWT**, and **Zustand** is used for global state management.

![Demo App](/frontend/public/screenshot-for-readme-1.png)
![Demo App](/frontend/public/screenshot-for-readme-2.png)
![Demo App](/frontend/public/screenshot-for-readme-3.png)

---

## Demo

🔗 **Live App**: [E-commerce app](https://real-time-chat-app-fqbd.onrender.com)
- Please wait 50 seconds for the server to turn on instance.
- Test accounts:
- Admin email: john@gmail.com
- Admin password: 123456
- User email: jane@gmail.com
- User Password: 123456

---

## Features

-   User Signup & Login
-   Admin can create or remove products and see the order analytics
-   E-Commerce App Core Function
-   Shopping Cart Functionality
-   Checkout with Stripe
-   Coupon Code System
-   Cart & Checkout Process
-   Get suggested product when checkout

---

## Tech Stack

- **Frontend**: React.js, Zustand, Tailwind CSS

- **Backend**: Node.js, Express.js, MongoDB, Redis

- **Authentication**: JSON Web Tokens (JWT)

- **Image Storage**: Cloudinary

- **Deployment**: Render.com

---

### Setup .env file

```js
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm run start
```
