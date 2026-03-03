import { Client, Databases, Query, ID } from "appwrite";
import conf from "../config/config";
import accountService from "./account";
class TransactionService {
    constructor() {
        this.client = new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createTransaction({ label, amount, type, userId, accountId, categoryId, skipBalanceUpdate = false }) {
        try {
            if (!skipBalanceUpdate) {
                await accountService.updateAccountBalance({ userId, accountId, amount, type })
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
                    categories: categoryId
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
                [Query.equal('user_id', userId), Query.orderDesc('$createdAt'), Query.select(["*", "categories.*", "accounts.*"])]
            )
        } catch (error) {
            console.error("Appwrite service :: getTransactions :: error", error);
            throw error;
        }
    }

    async deleteTransaction(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                documentId
            )
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteTransaction :: error", error);
            return false;
        }
    }

    async updateTransaction(documentId, { label, amount, type, accountId, categoryId }) {
        try {
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
            )
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
                    Query.select(["*", "categories.*", "accounts.*"])
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
                    Query.select(["*", "categories.*", "accounts.*"])
                ]
            )

            return res.documents.reduce((total, transaction) => total + transaction.amount, 0)
        } catch (error) {
            console.error("Appwrite service :: monthyIncome :: error", error);
            throw error;
        }
    }
}

const transactionService = new TransactionService()
export default transactionService
