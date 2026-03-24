import { Client, Databases, ID, Query } from "appwrite";
import { DATABASE_ID, COLLECTIONS } from "./config";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export { ID, Query };