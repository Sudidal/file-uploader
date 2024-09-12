import { createClient } from "@supabase/supabase-js";
import process from "node:process";
import { config } from "dotenv";

class SupaBaseClient {
  #supabase;

  constructor() {
    config();

    this.#supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  async createBucket(bucketName, isPublic, uploadSizeLimit) {
    const { error } = await this.#supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: uploadSizeLimit,
    });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  async uploadFile(bucketName, fileName, file, path = "") {
    path = this.#preparePath();

    const { error } = await this.#supabase.storage
      .from(bucketName)
      .upload(path + fileName, file);

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  async deleteFile(bucketName, fileName, path = "") {
    path = this.#preparePath();

    const { error } = await this.#supabase.storage
      .from(bucketName)
      .remove(path + fileName);

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  async getEternalDownloadUrl(bucketName, fileName, path = "", shouldDownload) {
    path = this.#preparePath();
    //getPublicUrl is Sync
    const fileUrl = this.#supabase.storage
      .from(bucketName)
      .getPublicUrl(path + fileName, { download: true }).data.publicUrl;
    return fileUrl;
  }

  #preparePath(path) {
    if (path) {
      if (!path.endsWith("/")) path += "/";
    } else {
      path = "";
    }
    return path;
  }
}

const supaBaseClient = new SupaBaseClient();
export default supaBaseClient;
