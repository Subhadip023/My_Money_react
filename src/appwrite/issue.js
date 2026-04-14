import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/config";

export class IssueService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createIssue({ title, desc, imageId, status, userId, type }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                ID.unique(),
                {
                    title,
                    desc,
                    imageId,
                    status,
                    userId,
                    type: type || 'issue'
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createIssue :: error", error);
            throw error;
        }
    }

    async updateIssue(documentId, { title, desc, imageId, status, type }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                documentId,
                {
                    title,
                    desc,
                    imageId,
                    status,
                    type
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateIssue :: error", error);
            throw error;
        }
    }

    async deleteIssue(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                documentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteIssue :: error", error);
            return false;
        }
    }

    async getIssueById(documentId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                documentId
            );
        } catch (error) {
            console.log("Appwrite service :: getIssueById :: error", error);
            throw error;
        }
    }

    async getIssues(userId, queries = []) {
        try {
            const allQueries = [
                Query.equal("userId", userId),
                Query.orderDesc("$createdAt"),
                ...queries
            ];
            
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                allQueries
            );
        } catch (error) {
            console.log("Appwrite service :: getIssues :: error", error);
            throw error;
        }
    }

    async getAllIssues(queries = []) {
        try {
            const allQueries = [
                Query.orderDesc("$createdAt"),
                ...queries
            ];
            
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssue,
                allQueries
            );
        } catch (error) {
            console.log("Appwrite service :: getAllIssues :: error", error);
            throw error;
        }
    }

    async addComment({ issueId, userId, comment }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssueComment,
                ID.unique(),
                {
                    issues: issueId,
                    userId,
                    comment
                }
            );
        } catch (error) {
            console.log("Appwrite service :: addComment :: error", error);
            throw error;
        }
    }

    async getComments(issueId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDIssueComment,
                [
                    Query.equal("issues", issueId),
                    Query.orderAsc("$createdAt")
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getComments :: error", error);
            throw error;
        }
    }
}

const issueService = new IssueService();
export default issueService;
