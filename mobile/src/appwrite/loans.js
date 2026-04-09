import { Client, Databases, Query, ID } from "appwrite";
import conf from "../config/config";

export class LoanService {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createLoan({ loanName, loanType, principalAmount, outstandingAmount, interestRate, dueDate, status, userId }) {
        try {
            
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                ID.unique(),
                {
                    loanName,
                    loanType,
                    principalAmount,
                    outstandingAmount,
                    interestRate,
                    dueDate,
                    status,
                    userId
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createLoan :: error", error);
            throw error;
        }
    }

    async updateLoan(documentId, { loanName, loanType, principalAmount, outstandingAmount, interestRate, dueDate, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                documentId,
                {
                    loanName,
                    loanType,
                    principalAmount,
                    outstandingAmount,
                    interestRate,
                    dueDate,
                    status
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateLoan :: error", error);
            throw error;
        }
    }

    async deleteLoan(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                documentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteLoan :: error", error);
            return false;
        }
    }

    async getLoan(documentId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                documentId
            );
        } catch (error) {
            console.log("Appwrite service :: getLoan :: error", error);
            return false;
        }
    }

    async getLoans(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getLoans :: error", error);
            return false;
        }
    }

    async getUserLoans(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDLoans,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.log("Appwrite service :: getUserLoans :: error", error);
            return false;
        }
    }
}

const loanService = new LoanService();
export default loanService;