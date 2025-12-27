import { storage, appwriteConfig } from "../lib/appwrite";

export async function uploadAvatar(imageInfo, userId) {
    try{
        const file = await storage.createFile({
            bucketId: appwriteConfig.BUCKET_ID,
            fileId: userId,
            file: {
                name: imageInfo.fileName,
                type: imageInfo.mimeType,
                size: imageInfo.fileSize,
                uri: imageInfo.uri
            }
        })
        return file.$id;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
        
}
