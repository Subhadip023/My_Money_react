import { Client, Databases } from "appwrite";
import conf from "../config/config";
import { Query, ID } from "appwrite";

class AccountService {
    constructor() {
        this.client = new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createAccount({ accountName, balance, userId, accountType }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDAccount,
                ID.unique(),
                { accountName, balance, userId, accountType }
            )
        } catch (error) {
            throw error
        }
    }

    async getAccounts({ userId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDAccount,
                [Query.equal('userId', userId)]
            )
        } catch (error) {
            throw error
        }
    }

    async deleteAccount(documentId) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDAccount,
                documentId
            )
        } catch (error) {
            throw error
        }
    }

    async getAccount(documentId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDAccount,
                documentId
            )
        } catch (error) {
            throw error
        }
    }

    async getAccountBalance({ userId }) {
        try {
            const accounts = await this.getAccounts({ userId })
            console.log(accounts)
            const totalBalance = accounts.documents.reduce((acc, account) => acc + (account.accountType === 'asset' ? account.balance : -account.balance), 0)
            return totalBalance
        } catch (error) {
            throw error
        }
    }

    async updateAccountBalance({ userId, accountId, amount, type }) {
        try {
            const account = await this.getAccount(accountId)
            if (account.userId !== userId) {
                throw new Error('You are not authorized to update this account')
            }
            const currentBalance = Number(account.balance)
            const changeAmount = Number(amount)
            const newBalance = type === 'income' ? currentBalance + changeAmount : (account.accountType === 'asset' ? currentBalance - changeAmount : currentBalance + changeAmount)

            return await this.updateAccount(accountId, {
                accountName: account.accountName,
                balance: Number(newBalance.toFixed(2)),
                userId: account.userId,
                accountType: account.accountType
            })
        } catch (error) {
            throw error
        }
    }

    async transferAmount({ userId, fromAccountId, toAccountId, amount }) {
        try {
            const [fromAccount, toAccount] = await Promise.all([
                this.getAccount(fromAccountId),
                this.getAccount(toAccountId)
            ])

            if (fromAccount.userId !== userId || toAccount.userId !== userId) {
                throw new Error('You are not authorized to transfer amount')
            }

            const transferAmt = Number(amount)
            const fromBalance = fromAccount.accountType === 'asset' ? Number(fromAccount.balance) - transferAmt : Number(fromAccount.balance) + transferAmt
            const toBalance = toAccount.accountType === 'asset' ? Number(toAccount.balance) + transferAmt : Number(toAccount.balance) - transferAmt

            await Promise.all([
                this.updateAccount(fromAccountId, { ...fromAccount, balance: Number(fromBalance.toFixed(2)) }),
                this.updateAccount(toAccountId, { ...toAccount, balance: Number(toBalance.toFixed(2)) })
            ])

            return true
        } catch (error) {
            console.error("AccountService :: transferAmount :: error", error)
            throw error
        }
    }

    async updateAccount(documentId, { accountName, balance, userId, accountType }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDAccount,
                documentId,
                { accountName, balance, userId, accountType }
            )
        } catch (error) {
            throw error
        }
    }
}

const accountService = new AccountService()

export default accountService
