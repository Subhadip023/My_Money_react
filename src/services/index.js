// Service entry point for the application.
// This follows the SOLID principle by using Dependency Inversion:
// The rest of the app depends on these exported instances, 
// and we can swap their underlying implementations (e.g., from Appwrite to a Custom API)
// without changing a single line in our components.

import authService from '../appwrite/auth'
import accountService from '../appwrite/account'
import transactionService from '../appwrite/transaction'
import categoryService from '../appwrite/category'

export {
    authService,
    accountService,
    transactionService,
    categoryService
}
