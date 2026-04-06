# MyMoney 💰
**Next-Generation Personal Finance & Wealth Management Platform**

MyMoney is a feature-rich, high-performance financial command center designed to give you complete mastery over your entire financial lifecycle. From tracking daily expenses to managing complex investment portfolios and high-interest loans, MyMoney provides a premium, intuitive experience for modern wealth management.

---

## 🚀 Key Features

### 🏢 Wealth Command Center
- **Real-time Dashboard**: Instant overview of Total Balance, Monthly Income, and Expenses with high-fidelity visualizations.
- **Multi-Account Sync**: Unified management for Savings, Cash, Credit Cards, and Wallets.

### 🏦 Investment & Portfolio Management
- **Asset Diversity**: Track Mutual Funds, Stocks, Fixed Deposits (FDs), and more.
- **Live Valuations**: Premium stats-based tracking of current values and return-on-investment (ROI).

### 💸 Debt & Loan Ledger
- **Loan Lifecycle**: Complete tracking for Personal Loans, Mortgages, and Credit.
- **Automated Settlements**: One-click settlements with automatic double-entry transaction logging.

### 📊 Advanced Reporting & Analytics
- **Monthly Insight Report**: Deep-dive analytics into category-wise spending habits.
- **Excel Export**: Professional-grade financial reporting with one-click Excel downloads.
- **Visual Trends**: Highcharts-powered interactive data visualization.

### 🔐 Security & Access Control
- **Appwrite Backend**: Secure authentication and industry-leading database encryption.
- **Dynamic Guard System**: Config-driven permission management with tier-based access control (Labels: `mvp`, `premium`).

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 7
- **State Management**: Redux Toolkit (Auth, Theme, UI)
- **Backend Service**: Appwrite (Database, Auth, Storage)
- **Visualization**: Highcharts (Dynamic Financial Graphs)
- **Export Engine**: XLSX (Professional Spreadsheet Generation)
- **Styling**: Tailwind CSS 4 + Modern CSS
- **Modals & UI**: Custom-built accessible modal architecture and Floating Cards.

---

## ⚙️ Architecture Highlights

### **Configuration-Driven Routing**
The application uses a centralized `src/config/routes.js` to manage all dashboard features, permissions, and sidebar visibility dynamically.
```javascript
{
    path: 'investments',
    element: Investments,
    name: 'Investments',
    requiredLabel: 'premium'
}
```

### **DynamicGuard System**
A modular authorization wrapper (`src/components/DynamicGuard.jsx`) that enforces label-based access automatically across both the UI and navigation.

### **Automated Data Seeding**
Fresh users are automatically initialized with default finance categories and base accounts (Cash, Savings) on their first registration via the `dataSeeder` utility.

---

## 🛠️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Subhadip023/My_Money_react.git
   cd My_Money_react
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_APPWRITE_URL=your_appwrite_url
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_db_id
   VITE_APPWRITE_COLLECTION_ID_ACCOUNTS=...
   VITE_APPWRITE_COLLECTION_ID_CATEGORIES=...
   VITE_APPWRITE_COLLECTION_ID_TRANSACTIONS=...
   VITE_APPWRITE_COLLECTION_ID_INVESTMENTS=...
   VITE_APPWRITE_COLLECTION_ID_LOANS=...
   VITE_APPWRITE_BUCKET_ID=...
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy
MyMoney follows a **"Premium-First"** design aesthetic.
- **Glassmorphism**: Subtle blurs and translucent borders.
- **Responsive-Everything**: Pixel-perfect UI from 4K monitors to small mobile screens.
- **Dynamic Dark Mode**: A high-contrast, eye-friendly dark interface that adapts instantly.

---

## 👨‍💻 Developer
**Subhadip Chakraborty**
*Creative Lead & Full Stack Developer*
[GitHub Profile](https://github.com/Subhadip023)

---

**License**: [MIT](LICENSE)
