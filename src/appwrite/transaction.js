import { Client, Databases, Query, ID } from "appwrite";
import conf from "../config/config";
import accountService from "./account";
class TransactionService {
    constructor() {
        this.client = new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createTransaction({ label, amount, type, userId, accountId, categoryId, skipBalanceUpdate = false, loans, investments }) {
        try {
            if (!skipBalanceUpdate) {
                await accountService.updateAccountBalance({ userId, accountId, amount, type, loans, investments })
            }
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                ID.unique(),
                {
                    label,
                    amount,
                    type,
                    user_id: userId,
                    accounts: accountId,
                    categories: categoryId,
                    lonans: loans || null,
                    investments: investments || null,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: createTransaction :: error", error);
            throw error;
        }
    }

    async getTransactions({ userId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [Query.equal('user_id', userId), Query.orderDesc('$createdAt'), Query.select(["*", "categories.*", "accounts.*", "investments.*"])]
            )
        } catch (error) {
            console.error("Appwrite service :: getTransactions :: error", error);
            throw error;
        }
    }

    async deleteTransaction(documentId) {
        try {
            // 1. Fetch transaction metadata to know how much to reverse
            const tx = await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                documentId
            );

            // 2. Reverse balance impact
            // If it was income, we SUBTRACT it now. If expense, we ADD it back.
            const reverseType = tx.type === 'income' ? 'expense' : 'income';
            await accountService.updateAccountBalance({
                userId: tx.user_id,
                accountId: tx.accounts?.$id || tx.accounts,
                amount: tx.amount,
                type: reverseType
            });

            // 3. Delete the document
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                documentId
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteTransaction :: error", error);
            return false;
        }
    }

    async updateTransaction(documentId, { label, amount, type, accountId, categoryId, userId }) {
        try {
            // 1. Fetch original transaction to reverse its impact
            const oldTx = await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                documentId
            );

            // 2. Reverse OLD transaction balance
            const oldReverseType = oldTx.type === 'income' ? 'expense' : 'income';
            await accountService.updateAccountBalance({
                userId: oldTx.user_id,
                accountId: oldTx.accounts?.$id || oldTx.accounts,
                amount: oldTx.amount,
                type: oldReverseType
            });

            // 3. Apply NEW transaction balance
            await accountService.updateAccountBalance({
                userId: userId,
                accountId: accountId,
                amount: amount,
                type: type
            });

            // 4. Update the document
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                documentId,
                {
                    label,
                    amount,
                    type,
                    accounts: accountId,
                    categories: categoryId
                }
            );
        } catch (error) {
            console.error("Appwrite service :: updateTransaction :: error", error);
            throw error;
        }
    }
    async monthyExpences({ userId }) {
        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        firstDay.setHours(0, 0, 0, 0);
        lastDay.setHours(23, 59, 59, 999);
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [
                    Query.equal('user_id', userId),
                    Query.equal('type', 'expense'),
                    Query.greaterThanEqual('$createdAt', firstDay.toISOString()),
                    Query.lessThanEqual('$createdAt', lastDay.toISOString()),
                    Query.orderDesc('$createdAt'),
                    Query.select(["*", "categories.*", "accounts.*", "investments.*"])
                ]
            )

            return res.documents.reduce((total, transaction) => total + transaction.amount, 0)
        } catch (error) {
            console.error("Appwrite service :: monthyExpences :: error", error);
            throw error;
        }
    }
    async monthyIncome({ userId }) {
        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        firstDay.setHours(0, 0, 0, 0);
        lastDay.setHours(23, 59, 59, 999);
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [
                    Query.equal('user_id', userId),
                    Query.equal('type', 'income'),
                    Query.greaterThanEqual('$createdAt', firstDay.toISOString()),
                    Query.lessThanEqual('$createdAt', lastDay.toISOString()),
                    Query.orderDesc('$createdAt'),
                    Query.select(["*", "categories.*", "accounts.*", "investments.*"])
                ]
            )

            return res.documents.reduce((total, transaction) => total + transaction.amount, 0)
        } catch (error) {
            console.error("Appwrite service :: monthyIncome :: error", error);
            throw error;
        }
    }
    async getMonthlyTransactions({ userId }) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        firstDay.setHours(0, 0, 0, 0);
        lastDay.setHours(23, 59, 59, 999);
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [
                    Query.equal('user_id', userId),
                    Query.greaterThanEqual('$createdAt', firstDay.toISOString()),
                    Query.lessThanEqual('$createdAt', lastDay.toISOString()),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100),
                    Query.select(["*", "categories.*", "accounts.*", "investments.*"])
                ]
            )
        } catch (error) {
            console.error("Appwrite service :: getMonthlyTransactions :: error", error);
            throw error;
        }
    }
    async getTransactionsByFilters({ userId, filters = {}, offset = 0, limit = 25 }) {
        try {
            const queries = [
                Query.equal('user_id', userId),
                Query.orderDesc('$createdAt'),
                Query.offset(offset),
                Query.limit(limit),
                Query.select(["*", "categories.*", "accounts.*", "investments.*"])
            ];

            if (filters.type && filters.type !== 'all') {
                queries.push(Query.equal('type', filters.type));
            }
            if (filters.category && filters.category !== 'all') {
                queries.push(Query.equal('categories', filters.category));
            }
            if (filters.account && filters.account !== 'all') {
                queries.push(Query.equal('accounts', filters.account));
            }
            // Note: Partial label search is best handled client-side unless a search index is pre-configured.
            // For now, we return the filtered list by metadata and the component can refine by label.

            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                queries
            );
        } catch (error) {
            console.error("Appwrite service :: getTransactionsByFilters :: error", error);
            throw error;
        }
    }

    async getTransactionsByInvestment({ userId, investmentId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [
                    Query.equal('user_id', userId),
                    Query.equal('investments', investmentId),
                    Query.orderDesc('$createdAt'),
                    Query.select(["*", "categories.*", "accounts.*", "investments.*"])
                ]
            );
        } catch (error) {
            console.error("Appwrite service :: getTransactionsByInvestment :: error", error);
            throw error;
        }
    }

}

const transactionService = new TransactionService()
export default transactionService
