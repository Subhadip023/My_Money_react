import { Client, Storage, ID } from "appwrite";
import conf from "../config/config";

export class StorageService {
    client = new Client();
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.storage = new Storage(this.client);
    }

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketID,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {

        try {
            return `https://fra.cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketID}/files/${fileId}/view?project=${conf.appwriteProjectId}`;
        } catch (error) {
            console.log("Appwrite service :: getFilePreview :: error", error);
            return null;
        }
    }
}

const storageService = new StorageService();
export default storageService;
