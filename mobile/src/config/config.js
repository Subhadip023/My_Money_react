const conf = {
    appwriteUrl: String(process.env.EXPO_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteDataBaseId: String(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID),
    appwriteCollectionIDAccount: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_ACCOUNT),
    appwriteCollectionIDCategory: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_CATEGORY),
    appwriteCollectionIDTransaction: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_TRANSACTION),
    appwriteCollectionIDUser: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USER),
    appwriteBucketID: String(process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID),
    appwriteCollectionIDInvestment: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_INVESTMENT),
    appwriteCollectionIDLoans: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_LOANS),
    appwriteCollectionIDIssue: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_ISSUE),
    appwriteCollectionIDIssueComment: String(process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_ISSUE_COMMENT),
}

export default conf