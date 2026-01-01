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

export function getAvatar(userId) {
    try{
        const file = storage.getFileViewURL({
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

export async function getAllAvatars() {
    try{
        const file = await storage.listFiles({
            bucketId: appwriteConfig.BUCKET_ID
        })
        console.log(file, "is the image")
        return file
    } catch (error) {
        console.error("Error retreiving image:", error);
        throw error;
    }
}
