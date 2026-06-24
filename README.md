# QR Code Generator and Manager

A full-stack application for generating, managing, and tracking QR codes.

## Tech Stack
- **Frontend:** Vue.js 3, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM

## Features
- Generate QR codes for URLs, Plain Text, Email, Phone Numbers, and WiFi
- View history of all generated QR codes
- Dashboard with statistics
- Customizable QR code colors and sizes

## Installation

1. Clone the repository
2. Run `npm run install-all` to install all dependencies
3. Make sure MongoDB is running locally on port 27017
4. Run `npm run dev` to start both frontend and backend

## Environment Variables

Create a `.env` file in the server directory with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-code-manager

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run build` - Build the client for production
- `npm start` - Start the server in production mode