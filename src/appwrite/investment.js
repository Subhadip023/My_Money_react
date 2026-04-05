import { Client, Databases, Query, ID } from "appwrite";
import conf from "../config/config";

class InvestmentService {
    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createInvestment({
        userId,
        investmentName,
        investmentType,
        investedAmount,
        currentValue,
        symbol,
        quantity,
        avgBuyPrice
    }) {
        
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDInvestment,
                ID.unique(),
                {
                    userId,
                    investmentName,
                    investmentType,
                    investedAmount,
                    currentValue,
                    symbol,
                    quantity,
                    avgBuyPrice
                }
            );
        } catch (error) {
            console.error("InvestmentService :: createInvestment :: error", error);
            throw error;
        }
    }

    async getInvestments({ userId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDInvestment,
                [Query.equal('userId', userId)]
            );
        } catch (error) {
            console.error("InvestmentService :: getInvestments :: error", error);
            throw error;
        }
    }

    async updateInvestment(documentId, data) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDInvestment,
                documentId,
                data
            );
        } catch (error) {
            console.error("InvestmentService :: updateInvestment :: error", error);
            throw error;
        }
    }

    async deleteInvestment(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionIDInvestment,
                documentId
            );
            return true;
        } catch (error) {
            console.error("InvestmentService :: deleteInvestment :: error", error);
            return false;
        }
    }
}

const investmentService = new InvestmentService();
export default investmentService;