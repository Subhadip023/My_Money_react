import { LazyExoticComponent, ReactNode } from 'react'
import Dashboard from '../pages/Dashboard'
import Accounts from '../pages/Accounts'
import AccountDetails from '../pages/AccountDetails'
import Categories from '../pages/Categories'
import CategoryDetails from '../pages/CategoryDetails'
import Transactions from '../pages/Transactions'
import Investments from '../pages/Investments'
import Loans from '../pages/Loans'
import MonthlyReport from '../pages/MonthlyReport'
import Settings from '../pages/Settings'
import Issues from '../pages/Issues'
import AdminIssues from '../pages/AdminIssues'
import IssueDetails from '../pages/IssueDetails'
import InvestmentDetails from '../pages/InvestmentDetails'


/*

'Dashboard': '📊', 'Accounts': '💳', 'Categories': '🏷️', 'Transactions': '📝', 'Investments': '🏦', 'Loans': '💰', 'Settings': '⚙️' };

*/
export const dashboardRoutes = [
    {
        icon: '📊',
        path: 'dashboard',
        element: Dashboard,
        name: 'Dashboard'
    },
    {
        icon: '💳',
        path: 'accounts',
        element: Accounts,
        name: 'Accounts'
    },
    {
        path: 'accounts/:id',
        element: AccountDetails,
        name: 'Account Details'
    },
    {
        icon: '🏷️',
        path: 'categories',
        element: Categories,
        name: 'Categories'
    },
    {
        path: 'categories/:id',
        element: CategoryDetails,
        name: 'Category Details'
    },
    {
        icon: '📝',
        path: 'transactions',
        element: Transactions,
        name: 'Transactions',
        requiredLabel: 'premium'
    },
    {
        icon: '🏦',
        path: 'investments',
        element: Investments,
        name: 'Investments',
        requiredLabel: 'premium'
    },
    {
        path: 'investments/:id',
        element: InvestmentDetails,
        name: 'Investment Details',
        requiredLabel: 'premium'
    },

    {
        icon: '💰',
        path: 'loans',
        element: Loans,
        name: 'Loans',
        requiredLabel: 'premium'
    },
    {
        icon: '📋',
        path: 'monthly-report',
        element: MonthlyReport,
        name: 'Monthly Report',
        requiredLabel: 'premium'
    },
    {
        icon: '⚙️',
        path: 'settings',
        element: Settings,
        name: 'Settings'
    },
    {
        icon: '🚨',
        path: 'issues',
        element: Issues,
        name: 'Issues'
    },
    {

        path: 'issues/:id',
        element: IssueDetails,
        name: 'Issue Details'
    },
    {
        icon: '🛡️',
        path: 'complaints',
        element: AdminIssues,
        name: 'User Issues',
        requiredLabel: 'admin'
    }
];
