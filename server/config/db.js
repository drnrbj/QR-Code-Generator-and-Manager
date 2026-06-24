const mongoose = require('mongoose');

/**
 * MongoDB connection function using Mongoose
 * Reads connection string from environment variables
 * Handles connection errors gracefully
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 7+ uses these options by default, but we'll be explicit
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log successful connection with host information
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events for better debugging
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    // Log detailed error information for debugging
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Exit process with failure code if we can't connect to database
    process.exit(1);
  }
};

module.exports = connectDB;