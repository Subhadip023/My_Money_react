import { Client, Databases, Query, ID } from "appwrite";
import conf from "../config/config";

class CategoryService {
    constructor() {
        this.client = new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createCategory({ name, type, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDCategory,
                ID.unique(),
                { name, type, userId }
            )
        } catch (error) {
            console.error("Appwrite service :: createCategory :: error", error);
            throw error;
        }
    }

    async getCategories({ userId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDCategory,
                [Query.equal('userId', userId)]
            )
        } catch (error) {
            console.error("Appwrite service :: getCategories :: error", error);
            throw error;
        }
    }

    async deleteCategory(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDCategory,
                documentId
            )
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteCategory :: error", error);
            return false;
        }
    }

    async getCategory(documentId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDCategory,
                documentId
            )
        } catch (error) {
            console.error("Appwrite service :: getCategory :: error", error);
            throw error;
        }
    }

    async updateCategory(documentId, { name, type }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDCategory,
                documentId,
                { name, type }
            )
        } catch (error) {
            console.error("Appwrite service :: updateCategory :: error", error);
            throw error;
        }
    }
    async getCategoryTransactions(categoryId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDTransaction,
                [Query.equal('categoryId', categoryId)]
            )
        } catch (error) {
            console.error("Appwrite service :: getCategoryTransactions :: error", error);
            throw error;
        }
    }
}

const categoryService = new CategoryService()
export default categoryService
