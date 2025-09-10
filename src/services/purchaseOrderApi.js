import AxiosManager from '../utils/api';

const PurchaseOrderAPI = {
  listPurchaseOrders: async () => {
    try {
      const response = await AxiosManager.get('/api/v1/purchase_orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPurchaseOrder: async (id) => {
    try {
      const response = await AxiosManager.get(`/api/v1/purchase_orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createPurchaseOrder: async (purchaseOrderData) => {
    try {
      const response = await AxiosManager.post('/api/v1/purchase_orders', {
        purchase_order: purchaseOrderData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePurchaseOrder: async (id, purchaseOrderData) => {
    try {
      const response = await AxiosManager.put(`/api/v1/purchase_orders/${id}`, {
        purchase_order: purchaseOrderData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      const response = await AxiosManager.delete(`/api/v1/purchase_orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPurchaseOrderDashboard: async () => {
    try {
      const response = await AxiosManager.get('/api/v1/purchase_orders/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default PurchaseOrderAPI;