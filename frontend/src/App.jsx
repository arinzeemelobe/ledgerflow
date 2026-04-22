import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceDetails from './pages/InvoiceDetails';
import InvoiceForm from './pages/InvoiceForm';
import Navbar from './components/Navbar';
import { InvoiceProvider } from './context/InvoiceContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path="/invoices/new" element={<InvoiceForm />} />
              <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
            </Routes>
          </div>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
