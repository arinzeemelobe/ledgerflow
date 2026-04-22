import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Invoices = () => {
  const { invoices, stats, filter, setFilter, deleteInvoice, loading } = useInvoices();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const statusFilters = ['all', 'paid', 'pending', 'overdue', 'draft'];

  const handleDelete = async () => {
    if (selectedInvoice) {
      await deleteInvoice(selectedInvoice.id);
      setDeleteModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: { color: 'text-green-700 bg-green-50', dot: 'bg-green-500' },
      pending: { color: 'text-yellow-700 bg-yellow-50', dot: 'bg-yellow-500' },
      overdue: { color: 'text-red-700 bg-red-50', dot: 'bg-red-500' },
      draft: { color: 'text-gray-700 bg-gray-50', dot: 'bg-gray-500' }
    };
    return configs[status] || configs.draft;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-on-surface font-manrope">Invoices</h1>
            <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded-full text-sm">
              {invoices.length} Total
            </span>
          </div>
          <p className="text-secondary mt-1">Manage your business billing and client payments with precision.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusFilters.map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
            <FunnelIcon className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <Link
            to="/invoices/new"
            className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <PlusIcon className="w-5 h-5" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500">PENDING</p>
          <p className="text-xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500">OVERDUE</p>
          <p className="text-xl font-bold text-red-600">${stats.overdue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500">DRAFTS</p>
          <p className="text-xl font-bold">{stats.drafts}</p>
        </div>
        <div className="bg-primary-container p-4 rounded-lg">
          <p className="text-sm text-on-primary-container">TOTAL PAID</p>
          <p className="text-xl font-bold text-on-primary-container">${stats.totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {invoices.map((invoice) => {
          const statusConfig = getStatusConfig(invoice.status);
          return (
            <div key={invoice.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-gray-900">#{invoice.invoice_number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${statusConfig.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">{invoice.client_name}</p>
                  <p className="text-sm text-gray-500">Due {new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold">${invoice.total.toLocaleString()}</p>
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        invoiceNumber={selectedInvoice?.invoice_number}
      />
    </div>
  );
};

export default Invoices;
