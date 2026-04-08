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

/**
 * Route Configuration:
 * Defines which routes are protected and which labels are required.
 */
export const dashboardRoutes = [
    {
        path: 'dashboard',
        element: Dashboard,
        name: 'Dashboard'
    },
    {
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
        path: 'transactions',
        element: Transactions,
        name: 'Transactions',
        requiredLabel: 'premium'
    },
    {
        path: 'investments',
        element: Investments,
        name: 'Investments',
        requiredLabel: 'premium'
    },
    {
        path: 'loans',
        element: Loans,
        name: 'Loans',
        requiredLabel: 'premium'
    },
    {
        path: 'monthly-report',
        element: MonthlyReport,
        name: 'Monthly Report',
        requiredLabel: 'premium'
    },
    {
        path: 'settings',
        element: Settings,
        name: 'Settings'
    },
    {
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
        path: 'complaints',
        element: AdminIssues,
        name: 'Admin Issues',
        requiredLabel: 'admin'
    }
];
