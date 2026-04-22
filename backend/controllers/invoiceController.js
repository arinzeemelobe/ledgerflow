const { db } = require('../models/database');

// Get all invoices with filters
const getInvoices = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM invoices ORDER BY created_at DESC';
    const params = [];
    
    if (status && status !== 'all') {
      query = 'SELECT * FROM invoices WHERE status = $1 ORDER BY created_at DESC';
      params.push(status);
    }
    
    const result = await db.query(query, params);
    
    // Calculate summary stats
    const stats = {
      pending: 0,
      overdue: 0,
      drafts: 0,
      totalPaid: 0
    };
    
    result.rows.forEach(inv => {
      if (inv.status === 'pending') stats.pending += inv.total;
      if (inv.status === 'overdue') stats.overdue += inv.total;
      if (inv.status === 'draft') stats.drafts += 1;
      if (inv.status === 'paid') stats.totalPaid += inv.total;
    });
    
    res.json({ invoices: result.rows, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientAddress,
      items,
      total,
      status = 'draft',
      dueDate,
      invoiceDate
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO invoices 
       (client_name, client_email, client_address, items, total, status, due_date, invoice_date, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
       RETURNING *`,
      [clientName, clientEmail, clientAddress, JSON.stringify(items), total, status, dueDate, invoiceDate]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const result = await db.query(
      `UPDATE invoices 
       SET client_name = $1, client_email = $2, client_address = $3, 
           items = $4, total = $5, status = $6, due_date = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [updates.clientName, updates.clientEmail, updates.clientAddress, 
       JSON.stringify(updates.items), updates.total, updates.status, 
       updates.dueDate, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM invoices WHERE id = $1', [id]);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      'UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus
};
