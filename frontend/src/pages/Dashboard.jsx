import React from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { invoices, stats, loading } = useInvoices();

  const summaryCards = [
    { title: 'PENDING', value: `$${stats.pending.toLocaleString()}`, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: ClockIcon },
    { title: 'OVERDUE', value: `$${stats.overdue.toLocaleString()}`, color: 'text-red-600', bg: 'bg-red-50', icon: ExclamationTriangleIcon },
    { title: 'DRAFTS', value: stats.drafts, color: 'text-gray-600', bg: 'bg-gray-50', icon: DocumentDuplicateIcon },
    { title: 'TOTAL PAID', value: `$${stats.totalPaid.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50', icon: CurrencyDollarIcon },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface font-manrope">Financial Overview</h1>
        <p className="text-secondary mt-1">Welcome back. Your ledger is up to date.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">{card.title}</p>
                <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-full`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold font-manrope">Recent Invoices</h2>
          <Link to="/invoices" className="text-primary hover:underline text-sm">View All →</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.client_name}</p>
                      <p className="text-sm text-gray-500">{invoice.client_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">#{invoice.invoice_number}</td>
                  <td className="px-6 py-4 font-semibold">${invoice.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
