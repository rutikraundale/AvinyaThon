import { databases, ID } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Create Site
export const createSite = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.SITES,
    ID.unique(),
    data
  );
};

//  Get All Sites
export const getSites = async () => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.SITES
  );
};