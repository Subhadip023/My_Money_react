import accountService from "../appwrite/account";
import categoryService from "../appwrite/category";

export const seedUserData = async (userId) => {
    try {
        console.log("Seeding data for user:", userId);

        // Default Accounts
        const defaultAccounts = [
            { accountName: "Cash", balance: 0, accountType: "asset", userId },
            { accountName: "Savings Account", balance: 0, accountType: "asset", userId },
        ];

        // Default Categories
        const defaultCategories = [
            { name: "Food & Dining", type: "expense", userId },
            { name: "Shopping", type: "expense", userId },
            { name: "Transportation", type: "expense", userId },
            { name: "Salary", type: "income", userId },
            { name: "Rent & Utilities", type: "expense", userId },
            { name: "Entertainment", type: "expense", userId },
            { name: "Healthcare", type: "expense", userId },
            { name: "Others", type: "expense", userId },
        ];

        // Create accounts
        const accountPromises = defaultAccounts.map(account => 
            accountService.createAccount(account)
                .catch(err => console.error(`Failed to create account ${account.accountName}:`, err))
        );

        // Create categories
        const categoryPromises = defaultCategories.map(category => 
            categoryService.createCategory(category)
                .catch(err => console.error(`Failed to create category ${category.name}:`, err))
        );

        await Promise.all([...accountPromises, ...categoryPromises]);
        
        console.log("Data seeding completed successfully!");
        return true;
    } catch (error) {
        console.error("Error during data seeding:", error);
        return false;
    }
};
