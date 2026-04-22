import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const InvoiceContext = createContext();

export const useInvoices = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ pending: 0, overdue: 0, drafts: 0, totalPaid: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices?status=${filter}`);
      setInvoices(response.data.invoices);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const createInvoice = async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      await fetchInvoices();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateInvoice = async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      await fetchInvoices();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await api.delete(`/invoices/${id}`);
      await fetchInvoices();
    } catch (error) {
      throw error;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/invoices/${id}/status`, { status });
      await fetchInvoices();
    } catch (error) {
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      stats,
      loading,
      filter,
      setFilter,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      updateStatus,
      fetchInvoices
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};
