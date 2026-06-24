const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  saveQRCode,
  getAllQRCodes,
  getQRCode,
  deleteQRCode,
  searchQRCodes,
  getStats,
  getDailyStats,
  getTypeDistribution
} = require('../controllers/qrCodeController');

/**
 * QR Code Routes
 * Defines all API endpoints for QR code management
 */

// QR Code Generation & Management Routes
router.post('/generate', generateQRCode);
router.post('/', saveQRCode);

// QR Code Retrieval Routes
router.get('/', getAllQRCodes);
router.get('/search', searchQRCodes);

// Statistics Routes (must be before /:id to avoid conflict)
router.get('/stats', getStats);
router.get('/stats/daily', getDailyStats);
router.get('/stats/types', getTypeDistribution);

// Single QR Code Routes (must be after specific routes)
router.get('/:id', getQRCode);
router.delete('/:id', deleteQRCode);

module.exports = router;