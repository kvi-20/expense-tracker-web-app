# 💰 Expense Tracker - Full Stack Application

A modern, responsive expense tracker application built with vanilla JavaScript, Node.js, Express, and MySQL. Perfect for managing personal finances with a clean, intuitive interface.

## ✨ Features

- **💸 Transaction Management**: Add, view, edit, and delete income/expense transactions
- **📊 Real-time Statistics**: Track total income, expenses, and current balance
- **🏷️ Category Organization**: Organize transactions by categories (Food, Transport, Bills, etc.)
- **🔍 Advanced Filtering**: Filter transactions by type, category, and date range
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, gradient-based design with smooth animations
- **⚡ Real-time Updates**: Instant updates without page refresh
- **🔒 Data Persistence**: Secure MySQL database storage

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Hosting**: Frontend (Netlify/Vercel), Backend (Railway/Render)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Setup Backend**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your MySQL credentials
   nano .env
   ```

3. **Configure Database**
   ```sql
   -- Create MySQL database (optional - app will create it automatically)
   CREATE DATABASE expense_tracker;
   ```

4. **Start the Application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the Application**
   - Frontend: Open the HTML file in your browser or serve it locally
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/api/health

## 📁 Project Structure

```
expense-tracker/
├── server.js              # Main backend server
├── package.json           # Node.js dependencies
├── .env.example          # Environment variables template
├── .env                  # Your environment variables (create this)
├── README.md             # This file
└── public/
    └── index.html        # Frontend application
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
```

### Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🌐 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Filtering & Analytics
- `GET /api/transactions/type/:type` - Get transactions by type (income/expense)
- `GET /api/transactions/category/:category` - Get transactions by category
- `GET /api/transactions/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get transactions by date range
- `GET /api/summary` - Get financial summary statistics

### Utility
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Free Hosting Options

#### Backend Deployment (Railway)
1. Sign up at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

#### Database Hosting (PlanetScale)
1. Sign up at [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get connection string and update your environment variables

#### Frontend Deployment (Netlify)
1. Sign up at [Netlify](https://netlify.com)
2. Drag and drop your HTML file or connect GitHub
3. Update the API URL in the frontend code to your deployed backend

### Production Checklist

- [ ] Update `baseURL` in frontend JavaScript to your deployed backend URL
- [ ] Set up proper CORS configuration for your frontend domain
- [ ] Configure environment variables on your hosting platform
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up database backups
- [ ] Configure error logging and monitoring

## 💡 Usage Examples

### Adding a Transaction
```javascript
// Example API call to add a transaction
const transaction = {
    description: "Grocery Shopping",
    amount: 85.50,
    category: "food",
    type: "expense",
    date: "2024-01-15"
};

fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
});
```

### Getting Summary Statistics
```javascript
// Get financial summary
fetch('/api/summary')
    .then(response => response.json())
    .then(data => {
        console.log(`Total Income: ₹${data.total_income}`);
        console.log(`Total Expenses: ₹${data.total_expenses}`);
        console.log(`Balance: ₹${data.balance}`);
    });
```

## 🎨 Customization

### Adding New Categories
Update the category options in both:
- Frontend: `index.html` (select options)
- Backend: No changes needed (dynamic)

### Changing Currency
Update the currency symbol in the frontend JavaScript:
```javascript
// Change ₹ to $ or any other currency symbol
document.getElementById('total-income').textContent = `$${income.toFixed(2)}`;
```

### Custom Styling
Modify the CSS variables in the `<style>` section of `index.html`:
```css
:root {
    --primary-color: #4facfe;
    --secondary-color: #00f2fe;
    --success-color: #4caf50;
    --error-color: #f44336;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists or app has permission to create it

2. **CORS Error in Frontend**
   - Update CORS configuration in `server.js`
   - Ensure frontend URL is whitelisted

3. **Transactions Not Loading**
   - Check backend URL in frontend JavaScript
   - Verify API endpoints are working: `GET /api/health`

4. **Date Issues**
   - Ensure dates are in YYYY-MM-DD format
   - Check timezone settings

## 📈 Performance Optimization

- Database indexing on frequently queried columns
- Connection pooling for database connections
- Pagination for large transaction lists
- Caching for summary statistics
- Minification of frontend assets

## 🔐 Security Considerations

- Input validation and sanitization
- SQL injection prevention (using parameterized queries)
- Rate limiting for API endpoints
- HTTPS enforcement in production
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Contact: your.email@example.com

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Happy Budgeting! 💰**