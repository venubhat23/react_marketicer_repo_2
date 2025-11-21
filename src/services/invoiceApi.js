import AxiosManager from '../utils/api';

const InvoiceAPI = {
  createInvoice: async (invoiceData) => {
    try {
      const response = await AxiosManager.post('/api/v1/invoices', {
        invoice: invoiceData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInvoice: async (id) => {
    try {
      const response = await AxiosManager.get(`/api/v1/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await AxiosManager.put(`/api/v1/invoices/${id}`, {
        invoice: invoiceData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateInvoiceStatus: async (id, status) => {
    try {
      const response = await AxiosManager.put(`/api/v1/invoices/${id}/update_status`, {
        status: status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteInvoice: async (id) => {
    try {
      const response = await AxiosManager.delete(`/api/v1/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInvoices: async () => {
    try {
      const response = await AxiosManager.get('/api/v1/invoices');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInvoiceDashboard: async () => {
    try {
      const response = await AxiosManager.get('/api/v1/invoices/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default InvoiceAPI;