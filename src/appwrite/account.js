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
