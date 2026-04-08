import api from './api';

/**
 * Get ML resource predictions based on expected patient count
 * @param {Object} data - Prediction input parameters
 * @param {number} data.patients - The expected or current patient count
 * @returns {Promise<Object>} The prediction result from the ML model
 */
export const getResourcePrediction = async (data) => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error generating prediction.');
    }
    throw new Error('Failed to connect to the prediction ML service.');
  }
};
