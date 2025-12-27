import { storage, appwriteConfig } from "../lib/appwrite";

export async function getAvatar(userId) {
    try{
        const file = await storage.listFiles({
            bucketId: appwriteConfig.BUCKET_ID,
            fileId: userId
        })
        console.log(file, "is the image")
        return file
    } catch (error) {
        console.error("Error retreiving image:", error);
        throw error;
    }
}
