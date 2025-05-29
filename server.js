const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'expense_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

// Initialize database connection
async function initializeDatabase() {
    try {
        // Create connection pool
        pool = mysql.createPool(dbConfig);
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.query(`USE ${dbConfig.database}`);
        
        // Create transactions table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                type ENUM('income', 'expense') NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.query(createTableQuery);
        console.log('Database tables created successfully');
        
        connection.release();
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// Routes

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM transactions ORDER BY date DESC, created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get transaction by ID
app.get('/api/transactions/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

// Create new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        console.log(req);
        const { description, amount, category, type, date } = req.body;
        
        // Validation
        if (!description || !amount || !category || !type || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either income or expense' });
        }
        
        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO transactions (description, amount, category, type, date) VALUES (?, ?, ?, ?, ?)',
            [description, amount, category, type, date]
        );
        
        // Fetch the created transaction
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// Update transaction
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { description, amount, category, type, date } = req.body;
        const { id } = req.params;
        
        // Validation
        if (!description || !amount || !category || !type || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either income or expense' });
        }
        
        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }
        
        const [result] = await pool.execute(
            'UPDATE transactions SET description = ?, amount = ?, category = ?, type = ?, date = ? WHERE id = ?',
            [description, amount, category, type, date, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        // Fetch the updated transaction
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [id]
        );
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM transactions WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

// Get transaction summary/statistics
app.get('/api/summary', async (req, res) => {
    try {
        const [incomeResult] = await pool.execute(
            'SELECT COALESCE(SUM(amount), 0) as total_income FROM transactions WHERE type = "income"'
        );
        
        const [expenseResult] = await pool.execute(
            'SELECT COALESCE(SUM(amount), 0) as total_expenses FROM transactions WHERE type = "expense"'
        );
        
        const [transactionCount] = await pool.execute(
            'SELECT COUNT(*) as total_transactions FROM transactions'
        );
        
        const totalIncome = parseFloat(incomeResult[0].total_income);
        const totalExpenses = parseFloat(expenseResult[0].total_expenses);
        const balance = totalIncome - totalExpenses;
        
        res.json({
            total_income: totalIncome,
            total_expenses: totalExpenses,
            balance: balance,
            total_transactions: transactionCount[0].total_transactions
        });
        const amount = document.querySelectorAll('.amount');

        window.addEventListener("DOMContentLoaded", function(){
            amount.forEach(function(){
                console.log(amount.classList.id);
            })
        })
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// Get transactions by category
app.get('/api/transactions/category/:category', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE category = ? ORDER BY date DESC',
            [req.params.category]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions by category:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get transactions by type
app.get('/api/transactions/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either income or expense' });
        }
        
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC',
            [type]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions by type:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get transactions by date range
app.get('/api/transactions/range', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC',
            [start_date, end_date]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions by date range:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Expense Tracker API is running' });
});

// Serve frontend for production
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (pool) {
        await pool.end();
        console.log('Database connection pool closed');
    }
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Expense Tracker API running on port ${PORT}`);
            console.log(`📊 Database: ${dbConfig.database}`);
            console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();