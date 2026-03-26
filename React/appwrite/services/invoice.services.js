import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Add Inventory
export const addInventory = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.INVENTORY,
    ID.unique(),
    data
  );
};

//  Get Inventory by Site
export const getInventoryBySite = async (siteId) => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.INVENTORY,
    [Query.equal("siteId", siteId)]
  );
};