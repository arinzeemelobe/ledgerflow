import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import api from '../services/api';
import { 
  PlusIcon, 
  TrashIcon, 
  SaveIcon,
  XIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  MailIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createInvoice, updateInvoice } = useInvoices();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    items: [{ name: '', description: '', quantity: 1, price: 0 }],
    total: 0
  });

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`);
      const invoice = response.data;
      setFormData({
        clientName: invoice.client_name,
        clientEmail: invoice.client_email,
        clientAddress: invoice.client_address || '',
        invoiceDate: invoice.invoice_date.split('T')[0],
        dueDate: invoice.due_date.split('T')[0],
        status: invoice.status,
        items: Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items || '[]'),
        total: invoice.total
      });
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setFetching(false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    const newTotal = calculateTotal(newItems);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newTotal = calculateTotal(newItems);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Client email is required';
    if (!formData.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.clientEmail = 'Valid email is required';
    }
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';
    formData.items.forEach((item, idx) => {
      if (!item.name.trim()) newErrors[`item_${idx}_name`] = 'Item name required';
      if (item.quantity <= 0) newErrors[`item_${idx}_qty`] = 'Quantity must be > 0';
      if (item.price <= 0) newErrors[`item_${idx}_price`] = 'Price must be > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    formData.status = status;
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const submitData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        items: formData.items,
        total: formData.total,
        status: status,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate
      };
      
      if (id) {
        await updateInvoice(id, submitData);
      } else {
        await createInvoice(submitData);
      }
      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-manrope">
          {id ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
        <p className="text-gray-500 mt-1">Fill in the details to generate a professional invoice</p>
      </div>

      <form className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bill From Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Bill From
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Company / Entity</label>
                <input
                  type="text"
                  value="LedgerFlow Inc."
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value="billing@ledgerflow.com"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value="123 Financial District, New York, NY 10001"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Bill To
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter client name"
                />
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email *</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="client@example.com"
                />
                {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter client address"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details Row */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Invoice Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
              <select
                onChange={(e) => {
                  const days = parseInt(e.target.value);
                  const newDueDate = new Date(formData.invoiceDate);
                  newDueDate.setDate(newDueDate.getDate() + days);
                  setFormData({ ...formData, dueDate: newDueDate.toISOString().split('T')[0] });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="15">Net 15 Days</option>
                <option value="30" selected>Net 30 Days</option>
                <option value="45">Net 45 Days</option>
                <option value="60">Net 60 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Item
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Web Design"
                      />
                      {errors[`item_${index}_name`] && <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>}
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 mt-6"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors[`item_${index}_qty`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors[`item_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <input
                        type="text"
                        value={`$${(item.quantity * item.price).toLocaleString()}`}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Additional details about this item..."
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Amount */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${formData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount Due</span>
                  <span className="text-primary">${formData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'pending')}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (id ? 'Update Invoice' : 'Send Invoice')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
