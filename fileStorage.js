import supaBaseClient from "./supaBaseClient.js";

class FileStorage {
  constructor() {}

  createBucket = (bucketName, isPublic, fileSizeLimit) =>
    supaBaseClient.createBucket(bucketName, isPublic, fileSizeLimit);
  uploadFile = async (bucket, fileName, file, path) =>
    await supaBaseClient.uploadFile(bucket, fileName, file, path);
  deleteFile = async (bucket, fileName, path) =>
    await supaBaseClient.deleteFile(bucket, fileName, path);
  getEternaleDownloadUrl = async (bucket, fileName, path) =>
    await supaBaseClient.getEternalDownloadUrl(bucket, fileName, path);
}

const fileStorage = new FileStorage();
export default fileStorage;
