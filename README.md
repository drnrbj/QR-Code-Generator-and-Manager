# QR Code Generator & Manager

A full-stack application for generating, managing, and tracking QR codes. Supports URL, Plain Text, Email, Phone Number, and WiFi QR codes with customizable colors and sizes.

**Tech Stack:** Vue.js 3, Express.js, MongoDB, Tailwind CSS, Chart.js

---

## Prerequisites

- Node.js v16 or higher
- MongoDB v5 or higher

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qr-code-manager.git
cd qr-code-manager

# Install all dependencies
npm run install-all
```

---

## Environment Variables

Create a `.env` file in the **server** directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-code-manager
```

Create a `.env` file in the **client** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Seed Database (Optional)

```bash
npm run seed
```

---

## Running the App

```bash
# Start both frontend and backend
npm run dev
```

| Service       | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:5173         |
| Backend API   | http://localhost:5000         |
| Health Check  | http://localhost:5000/api/health |