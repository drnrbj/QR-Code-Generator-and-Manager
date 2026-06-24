import api from './api';

/**
 * QR Code Service
 * Handles all API calls related to QR code operations
 */
export const qrService = {
  /**
   * Generate a QR code without saving
   * @param {Object} data - QR code configuration
   * @returns {Promise} Generated QR code data
   */
  async generateQR(data) {
    try {
      console.log('🔄 Generating QR code with data:', data);
      const response = await api.post('/qrcodes/generate', data);
      console.log('✅ QR code generated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      throw error;
    }
  },

  /**
   * Save a generated QR code to database
   * @param {Object} data - QR code data to save
   * @returns {Promise} Saved QR code document
   */
  async saveQR(data) {
    try {
      console.log('💾 Saving QR code to database');
      const response = await api.post('/qrcodes', data);
      console.log('✅ QR code saved successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error saving QR code:', error);
      throw error;
    }
  },

  /**
   * Get all QR codes with optional query parameters
   * @param {Object} params - Query parameters (page, limit, sort, search)
   * @returns {Promise} Paginated QR codes array
   */
  async getAllQRCodes(params = {}) {
    try {
      console.log('📋 Fetching QR codes with params:', params);
      const response = await api.get('/qrcodes', { params });
      console.log(`✅ Fetched ${response.data.count || 0} QR codes`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching QR codes:', error);
      throw error;
    }
  },

  /**
   * Get a single QR code by ID
   * @param {string} id - QR code ID
   * @returns {Promise} QR code document
   */
  async getQRCode(id) {
    try {
      console.log('🔍 Fetching QR code:', id);
      const response = await api.get(`/qrcodes/${id}`);
      console.log('✅ QR code fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching QR code:', error);
      throw error;
    }
  },

  /**
   * Delete a QR code by ID
   * @param {string} id - QR code ID to delete
   * @returns {Promise} Deletion response
   */
  async deleteQRCode(id) {
    try {
      console.log('🗑️ Deleting QR code:', id);
      const response = await api.delete(`/qrcodes/${id}`);
      console.log('✅ QR code deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting QR code:', error);
      throw error;
    }
  },

  /**
   * Search QR codes by content and/or type
   * @param {Object} query - Search parameters (q, type)
   * @returns {Promise} Search results
   */
  async searchQRCodes(query = {}) {
    try {
      console.log('🔎 Searching QR codes with:', query);
      const response = await api.get('/qrcodes/search', { params: query });
      console.log(`✅ Found ${response.data.count || 0} results`);
      return response.data;
    } catch (error) {
      console.error('❌ Error searching QR codes:', error);
      throw error;
    }
  },

  /**
   * Get overall QR code statistics
   * @returns {Promise} Statistics data
   */
  async getStats() {
    try {
      console.log('📊 Fetching statistics');
      const response = await api.get('/qrcodes/stats');
      console.log('✅ Statistics fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  },

  /**
   * Get daily QR code generation statistics
   * @returns {Promise} Daily statistics array
   */
  async getDailyStats() {
    try {
      console.log('📅 Fetching daily statistics');
      const response = await api.get('/qrcodes/stats/daily');
      console.log('✅ Daily statistics fetched');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching daily statistics:', error);
      throw error;
    }
  },

  /**
   * Get QR code type distribution
   * @returns {Promise} Type distribution array
   */
  async getTypeDistribution() {
    try {
      console.log('📊 Fetching type distribution');
      const response = await api.get('/qrcodes/stats/types');
      console.log('✅ Type distribution fetched');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching type distribution:', error);
      throw error;
    }
  }
};

export default qrService;