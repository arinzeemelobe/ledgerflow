import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import api from '../services/api';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStatus, deleteInvoice } = useInvoices();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${id}`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateStatus(id, newStatus);
      await fetchInvoiceDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    await deleteInvoice(id);
    setShowDeleteModal(false);
    navigate('/invoices');
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: { 
        color: 'text-green-700 bg-green-50', 
        dot: 'bg-green-500',
        icon: CheckCircleIcon,
        label: 'Paid'
      },
      pending: { 
        color: 'text-yellow-700 bg-yellow-50', 
        dot: 'bg-yellow-500',
        icon: ClockIcon,
        label: 'Pending'
      },
      overdue: { 
        color: 'text-red-700 bg-red-50', 
        dot: 'bg-red-500',
        icon: ExclamationCircleIcon,
        label: 'Overdue'
      },
      draft: { 
        color: 'text-gray-700 bg-gray-50', 
        dot: 'bg-gray-500',
        icon: DocumentTextIcon,
        label: 'Draft'
      }
    };
    return configs[status] || configs.draft;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <Link to="/invoices" className="text-primary mt-2 inline-block">Back to Invoices</Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;
  const items = Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items || '[]');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Header with Navigation */}
      <div className="mb-6">
        <Link to="/invoices" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Invoices
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-manrope">
                Invoice #{invoice.invoice_number}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig.color}`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-gray-500">Issued on {new Date(invoice.invoice_date).toLocaleDateString()} · Due on {new Date(invoice.due_date).toLocaleDateString()}</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to={`/invoices/edit/${invoice.id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
            {invoice.status !== 'paid' && (
              <button
                onClick={() => handleStatusUpdate('paid')}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - From & To */}
        <div className="md:col-span-2 space-y-6">
          {/* From Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              From
            </h3>
            <div className="space-y-1 text-gray-600">
              <p className="font-semibold text-gray-900">LedgerFlow Systems Inc.</p>
              <p>124 Corporate Way; Suite 400</p>
              <p>San Francisco, CA 94105</p>
              <p>billing@ledgerflow.com</p>
            </div>
          </div>

          {/* To Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              Bill To
            </h3>
            <div className="space-y-1 text-gray-600">
              <p className="font-semibold text-gray-900">{invoice.client_name}</p>
              <p>{invoice.client_email}</p>
              <p>{invoice.client_address || 'No address provided'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-600">${parseFloat(item.price).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        ${(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-semibold text-gray-900">Subtotal</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      ${invoice.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Timeline */}
        <div className="space-y-6">
          {/* Invoice Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Invoice Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice Date</p>
                <p className="text-gray-900 mt-1">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Due</p>
                <p className="text-gray-900 mt-1">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${invoice.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invoice Created</p>
                  <p className="text-sm text-gray-500">{new Date(invoice.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sent to Client</p>
                  <p className="text-sm text-gray-500">{new Date(invoice.invoice_date).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${invoice.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment Status</p>
                  <p className={`text-sm ${invoice.status === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>
                    {invoice.status === 'paid' ? 'Payment Received' : 'Awaiting Payment'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View Client Profile Link */}
          <Link
            to={`/clients/${invoice.id}`}
            className="block bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition border border-gray-200"
          >
            <p className="text-primary font-medium">View Client Profile →</p>
          </Link>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        invoiceNumber={invoice.invoice_number}
      />
    </div>
  );
};

// Import missing icons
import { ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default InvoiceDetails;
