const QRCode = require('qrcode');
const QRCodeModel = require('../models/QRCode');

/**
 * QR Code Controller
 * Handles all QR code generation, CRUD operations, and statistics
 */

/**
 * Generate QR code image from content
 * @route POST /api/qrcodes/generate
 * @param {Object} req.body - Request body containing QR code parameters
 * @returns {Object} Generated QR code data URL and metadata
 */
const generateQRCode = async (req, res, next) => {
  try {
    console.log('📥 Generating QR code with body:', req.body);
    
    const { 
      content, 
      qrType, 
      size = 300, 
      foregroundColor = '#000000', 
      backgroundColor = '#FFFFFF',
      wifiSSID,
      wifiPassword,
      wifiSecurity = 'WPA'
    } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Validate QR type
    const validTypes = ['URL', 'Plain Text', 'Email', 'Phone Number', 'WiFi'];
    if (!qrType || !validTypes.includes(qrType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid QR type. Must be one of: ${validTypes.join(', ')}`,
        error: 'VALIDATION_ERROR'
      });
    }

    // Validate size
    const validSizes = [200, 300, 400, 500];
    if (size && !validSizes.includes(Number(size))) {
      return res.status(400).json({
        success: false,
        message: `Invalid size. Must be one of: ${validSizes.join(', ')}`,
        error: 'VALIDATION_ERROR'
      });
    }

    // Validate colors
    const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
    if (foregroundColor && !hexColorRegex.test(foregroundColor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid foreground color format. Use hex format: #000000',
        error: 'VALIDATION_ERROR'
      });
    }

    if (backgroundColor && !hexColorRegex.test(backgroundColor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid background color format. Use hex format: #FFFFFF',
        error: 'VALIDATION_ERROR'
      });
    }

    // Format content based on QR type
    let formattedContent = content;

    switch (qrType) {
      case 'URL':
        // Ensure URL starts with http:// or https://
        if (!content.startsWith('http://') && !content.startsWith('https://')) {
          formattedContent = `https://${content}`;
        }
        console.log('🔗 Formatted URL:', formattedContent);
        break;

      case 'Email':
        formattedContent = `mailto:${content}`;
        console.log('📧 Formatted Email:', formattedContent);
        break;

      case 'Phone Number':
        // Remove any non-digit characters except +
        const cleanPhone = content.replace(/[^\d+]/g, '');
        formattedContent = `tel:${cleanPhone}`;
        console.log('📞 Formatted Phone:', formattedContent);
        break;

      case 'WiFi':
        // Validate WiFi fields
        if (!wifiSSID) {
          return res.status(400).json({
            success: false,
            message: 'WiFi SSID is required for WiFi QR codes',
            error: 'VALIDATION_ERROR'
          });
        }

        const validSecurities = ['WEP', 'WPA', 'WPA2', 'nopass'];
        const security = validSecurities.includes(wifiSecurity) ? wifiSecurity : 'WPA';
        
        // Format: WIFI:T:security;S:ssid;P:password;;
        formattedContent = `WIFI:T:${security};S:${wifiSSID};`;
        if (wifiPassword && security !== 'nopass') {
          formattedContent += `P:${wifiPassword};`;
        }
        formattedContent += ';';
        console.log('📶 Formatted WiFi:', formattedContent);
        break;

      case 'Plain Text':
      default:
        // Use content as-is
        console.log('📝 Plain Text content');
        break;
    }

    // Generate QR code as data URL
    const qrOptions = {
      width: Number(size),
      color: {
        dark: foregroundColor,
        light: backgroundColor
      },
      errorCorrectionLevel: 'M'
    };

    console.log('🎨 Generating QR with options:', qrOptions);
    const qrImage = await QRCode.toDataURL(formattedContent, qrOptions);
    console.log('✅ QR code generated successfully');

    // Return success response
    res.status(200).json({
      success: true,
      qrImage,
      formattedContent,
      qrType,
      size: Number(size),
      foregroundColor,
      backgroundColor
    });

  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    next(error);
  }
};

/**
 * Save QR code to database
 * @route POST /api/qrcodes
 * @param {Object} req.body - QR code data to save
 * @returns {Object} Saved QR code document
 */
const saveQRCode = async (req, res, next) => {
  try {
    console.log('💾 Saving QR code to database');
    
    const { 
      content, 
      qrType, 
      qrImage, 
      size, 
      foregroundColor, 
      backgroundColor 
    } = req.body;

    // Validate required fields
    if (!content || !qrType || !qrImage) {
      return res.status(400).json({
        success: false,
        message: 'Content, qrType, and qrImage are required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Create new QR code document
    const qrCode = new QRCodeModel({
      content,
      qrType,
      qrImage,
      size: size || 300,
      foregroundColor: foregroundColor || '#000000',
      backgroundColor: backgroundColor || '#FFFFFF'
    });

    // Save to database
    const savedQRCode = await qrCode.save();
    console.log('✅ QR code saved successfully:', savedQRCode._id);

    res.status(201).json({
      success: true,
      data: savedQRCode
    });

  } catch (error) {
    console.error('❌ Error saving QR code:', error);
    next(error);
  }
};

/**
 * Get all QR codes with pagination and filtering
 * @route GET /api/qrcodes
 * @param {Object} req.query - Query parameters for pagination and filtering
 * @returns {Object} Paginated QR codes array
 */
const getAllQRCodes = async (req, res, next) => {
  try {
    console.log('📋 Fetching QR codes with query:', req.query);
    
    const { 
      page = 1, 
      limit = 10, 
      sort = 'newest', 
      search = '' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = {};
    
    // Add search functionality
    if (search) {
      query.content = { 
        $regex: search, 
        $options: 'i' // Case insensitive
      };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'type':
        sortObj = { qrType: 1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query with pagination
    const [qrCodes, totalDocuments] = await Promise.all([
      QRCodeModel.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'), // Exclude version key
      QRCodeModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalDocuments / limitNum);

    console.log(`✅ Found ${qrCodes.length} QR codes (Page ${pageNum}/${totalPages})`);

    res.status(200).json({
      success: true,
      count: totalDocuments,
      totalPages,
      currentPage: pageNum,
      data: qrCodes
    });

  } catch (error) {
    console.error('❌ Error fetching QR codes:', error);
    next(error);
  }
};

/**
 * Get single QR code by ID
 * @route GET /api/qrcodes/:id
 * @param {string} req.params.id - QR code ID
 * @returns {Object} QR code document
 */
const getQRCode = async (req, res, next) => {
  try {
    console.log('🔍 Fetching QR code with ID:', req.params.id);
    
    const qrCode = await QRCodeModel.findById(req.params.id).select('-__v');

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
        error: 'NOT_FOUND'
      });
    }

    console.log('✅ QR code found');
    res.status(200).json({
      success: true,
      data: qrCode
    });

  } catch (error) {
    console.error('❌ Error fetching QR code:', error);
    next(error);
  }
};

/**
 * Delete QR code by ID
 * @route DELETE /api/qrcodes/:id
 * @param {string} req.params.id - QR code ID to delete
 * @returns {Object} Success message
 */
const deleteQRCode = async (req, res, next) => {
  try {
    console.log('🗑️ Deleting QR code with ID:', req.params.id);
    
    const qrCode = await QRCodeModel.findByIdAndDelete(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
        error: 'NOT_FOUND'
      });
    }

    console.log('✅ QR code deleted successfully');
    res.status(200).json({
      success: true,
      message: 'QR code deleted successfully',
      data: {
        id: qrCode._id,
        type: qrCode.qrType
      }
    });

  } catch (error) {
    console.error('❌ Error deleting QR code:', error);
    next(error);
  }
};

/**
 * Search QR codes by content and/or type
 * @route GET /api/qrcodes/search
 * @param {Object} req.query - Search parameters
 * @returns {Array} Matching QR codes
 */
const searchQRCodes = async (req, res, next) => {
  try {
    console.log('🔎 Searching QR codes with params:', req.query);
    
    const { q, type } = req.query;
    
    // Build query with $and operator for multiple conditions
    let query = {};
    let conditions = [];

    if (q) {
      conditions.push({ 
        content: { 
          $regex: q, 
          $options: 'i' 
        } 
      });
    }

    if (type) {
      const validTypes = ['URL', 'Plain Text', 'Email', 'Phone Number', 'WiFi'];
      if (validTypes.includes(type)) {
        conditions.push({ qrType: type });
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid QR type. Must be one of: ${validTypes.join(', ')}`,
          error: 'VALIDATION_ERROR'
        });
      }
    }

    if (conditions.length > 0) {
      query = { $and: conditions };
    }

    const qrCodes = await QRCodeModel.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(`✅ Found ${qrCodes.length} QR codes matching search criteria`);

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      data: qrCodes
    });

  } catch (error) {
    console.error('❌ Error searching QR codes:', error);
    next(error);
  }
};

/**
 * Get overall QR code statistics
 * @route GET /api/qrcodes/stats
 * @returns {Object} Statistics object with counts and latest QR
 */
const getStats = async (req, res, next) => {
  try {
    console.log('📊 Fetching QR code statistics');
    
    // Get today's date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Run multiple queries in parallel for efficiency
    const [
      stats,
      todayCount,
      latestQR
    ] = await Promise.all([
      // Aggregate statistics by type
      QRCodeModel.aggregate([
        {
          $group: {
            _id: null,
            totalQRs: { $sum: 1 },
            urlQRs: {
              $sum: {
                $cond: [{ $eq: ['$qrType', 'URL'] }, 1, 0]
              }
            },
            textQRs: {
              $sum: {
                $cond: [{ $eq: ['$qrType', 'Plain Text'] }, 1, 0]
              }
            },
            emailQRs: {
              $sum: {
                $cond: [{ $eq: ['$qrType', 'Email'] }, 1, 0]
              }
            },
            phoneQRs: {
              $sum: {
                $cond: [{ $eq: ['$qrType', 'Phone Number'] }, 1, 0]
              }
            },
            wifiQRs: {
              $sum: {
                $cond: [{ $eq: ['$qrType', 'WiFi'] }, 1, 0]
              }
            }
          }
        }
      ]),
      
      // Count today's QR codes
      QRCodeModel.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }),
      
      // Get most recent QR code
      QRCodeModel.findOne()
        .sort({ createdAt: -1 })
        .select('content qrType createdAt qrImage')
    ]);

    // Extract stats from aggregation result
    const aggregatedStats = stats[0] || {
      totalQRs: 0,
      urlQRs: 0,
      textQRs: 0,
      emailQRs: 0,
      phoneQRs: 0,
      wifiQRs: 0
    };

    console.log('✅ Statistics fetched successfully');

    res.status(200).json({
      success: true,
      data: {
        totalQRs: aggregatedStats.totalQRs,
        todayQRs: todayCount,
        urlQRs: aggregatedStats.urlQRs,
        textQRs: aggregatedStats.textQRs,
        emailQRs: aggregatedStats.emailQRs,
        phoneQRs: aggregatedStats.phoneQRs,
        wifiQRs: aggregatedStats.wifiQRs,
        latestQR: latestQR || null
      }
    });

  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    next(error);
  }
};

/**
 * Get daily QR code generation statistics
 * @route GET /api/qrcodes/stats/daily
 * @returns {Array} Daily count of QR codes generated
 */
const getDailyStats = async (req, res, next) => {
  try {
    console.log('📅 Fetching daily statistics');
    
    const dailyStats = await QRCodeModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$createdAt' 
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    console.log(`✅ Found ${dailyStats.length} days of statistics`);

    res.status(200).json({
      success: true,
      data: dailyStats
    });

  } catch (error) {
    console.error('❌ Error fetching daily statistics:', error);
    next(error);
  }
};

/**
 * Get QR code type distribution
 * @route GET /api/qrcodes/stats/types
 * @returns {Array} Distribution of QR code types
 */
const getTypeDistribution = async (req, res, next) => {
  try {
    console.log('📊 Fetching type distribution');
    
    const typeDistribution = await QRCodeModel.aggregate([
      {
        $group: {
          _id: '$qrType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log(`✅ Found distribution for ${typeDistribution.length} types`);

    res.status(200).json({
      success: true,
      data: typeDistribution
    });

  } catch (error) {
    console.error('❌ Error fetching type distribution:', error);
    next(error);
  }
};

module.exports = {
  generateQRCode,
  saveQRCode,
  getAllQRCodes,
  getQRCode,
  deleteQRCode,
  searchQRCodes,
  getStats,
  getDailyStats,
  getTypeDistribution
};