const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(50) UNIQUE DEFAULT 'INV-' || to_char(NOW(), 'YYYYMMDD') || '-' || nextval('invoice_seq'),
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255),
      client_address TEXT,
      items JSONB NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'draft',
      due_date DATE,
      invoice_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1000;
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDatabase();

module.exports = { db: pool };
