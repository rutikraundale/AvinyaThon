import { databases, ID } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Add Engineer
export const addEngineer = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ENGINEERS,
    ID.unique(),
    data
  );
};

//  Get Engineers
export const getEngineers = async () => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ENGINEERS
  );
};