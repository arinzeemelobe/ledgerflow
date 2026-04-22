const initDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(50) UNIQUE,
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
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};
