const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const QRCode = require('../models/QRCode');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Sample data for different QR types
const sampleData = {
  URLs: [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com',
    'https://www.nodejs.org',
    'https://www.vuejs.org',
    'https://www.mongodb.com',
    'https://www.npmjs.com'
  ],
  emails: [
    'john.doe@example.com',
    'jane.smith@company.com',
    'support@techcorp.com',
    'info@startup.io'
  ],
  phones: [
    '+1234567890',
    '+9876543210',
    '+1122334455',
    '+5544332211'
  ],
  texts: [
    'Hello World!',
    'Scan me for more info',
    'QR Code Generator v1.0',
    'Confidential Document #12345',
    'Meeting Room B - Floor 3'
  ],
  wifis: [
    { ssid: 'Office_WiFi', password: 'secure123', security: 'WPA2' },
    { ssid: 'Guest_Network', password: 'guest2024', security: 'WPA' },
    { ssid: 'IoT_Devices', password: 'iot_pass', security: 'WPA2' },
    { ssid: 'Staff_Only', password: 'staff@2024', security: 'WPA2' }
  ]
};

/**
 * Generate a random date within the last 30 days
 * @returns {Date} Random date
 */
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
  const hoursAgo = Math.floor(Math.random() * 24); // 0-24 hours ago
  const minutesAgo = Math.floor(Math.random() * 60); // 0-60 minutes ago
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date;
};

/**
 * Generate sample QR codes for seeding
 * @returns {Array} Array of QR code objects
 */
const generateSampleQRCodes = () => {
  const qrCodes = [];
  
  // Generate URL QR codes (7)
  sampleData.URLs.forEach((url, index) => {
    qrCodes.push({
      content: url,
      qrType: 'URL',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      size: [200, 300, 400, 500][Math.floor(Math.random() * 4)],
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      createdAt: getRandomDate()
    });
  });

  // Generate Email QR codes (4)
  sampleData.emails.forEach((email, index) => {
    qrCodes.push({
      content: email,
      qrType: 'Email',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      size: [200, 300, 400][Math.floor(Math.random() * 3)],
      foregroundColor: '#2563eb',
      backgroundColor: '#FFFFFF',
      createdAt: getRandomDate()
    });
  });

  // Generate Phone Number QR codes (4)
  sampleData.phones.forEach((phone, index) => {
    qrCodes.push({
      content: phone,
      qrType: 'Phone Number',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      size: [300, 400][Math.floor(Math.random() * 2)],
      foregroundColor: '#059669',
      backgroundColor: '#FFFFFF',
      createdAt: getRandomDate()
    });
  });

  // Generate Plain Text QR codes (5)
  sampleData.texts.forEach((text, index) => {
    qrCodes.push({
      content: text,
      qrType: 'Plain Text',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      size: [200, 300, 500][Math.floor(Math.random() * 3)],
      foregroundColor: '#7c3aed',
      backgroundColor: '#F3F4F6',
      createdAt: getRandomDate()
    });
  });

  // Generate WiFi QR codes (4)
  sampleData.wifis.forEach((wifi, index) => {
    const wifiContent = `WIFI:T:${wifi.security};S:${wifi.ssid};P:${wifi.password};;`;
    qrCodes.push({
      content: wifiContent,
      qrType: 'WiFi',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      size: [300, 400, 500][Math.floor(Math.random() * 3)],
      foregroundColor: '#dc2626',
      backgroundColor: '#FFFFFF',
      createdAt: getRandomDate()
    });
  });

  return qrCodes;
};

/**
 * Seed the database with sample QR codes
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-code-manager';
    console.log(`📡 Connecting to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing QR codes...');
    await QRCode.deleteMany({});
    console.log('✅ Existing data cleared');

    // Generate sample data
    const qrCodes = generateSampleQRCodes();
    console.log(`📝 Generated ${qrCodes.length} sample QR codes`);

    // Insert sample data
    console.log('💾 Inserting sample data...');
    const insertedCodes = await QRCode.insertMany(qrCodes);
    console.log(`✅ Successfully inserted ${insertedCodes.length} QR codes`);

    // Display summary
    const typeCount = {};
    insertedCodes.forEach(code => {
      typeCount[code.qrType] = (typeCount[code.qrType] || 0) + 1;
    });

    console.log('\n📊 Seeding Summary:');
    console.log('-------------------');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`${type}: ${count} QR codes`);
    });

    // Get today's count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCount = insertedCodes.filter(code => 
      code.createdAt >= startOfToday
    ).length;
    console.log(`\n📅 Today's QR codes: ${todayCount}`);

    console.log('\n✨ Database seeding completed successfully!');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
console.log('🚀 Starting QR Code Database Seeder');
console.log('===================================');
seedDatabase();