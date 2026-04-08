const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDataBaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionIDAccount: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_ACCOUNT),
    appwriteCollectionIDCategory: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_CATEGORY),
    appwriteCollectionIDTransaction: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_TRANSACTION),
    appwriteCollectionIDUser: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_USER),
    appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteCollectionIDInvestment: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_INVESTMENT),
    appwriteCollectionIDLoans: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_LOANS),
    appwriteCollectionIDIssue: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_ISSUE),
    appwriteCollectionIDIssueComment: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_ISSUE_COMMENT),
}

export default conf