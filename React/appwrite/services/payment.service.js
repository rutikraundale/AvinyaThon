import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Create Payment
export const createPayment = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.PAYMENTS,
    ID.unique(),
    data
  );
};

//  Get Payments by Site
export const getPaymentsBySite = async (siteId) => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.PAYMENTS,
    [Query.equal("siteId", siteId)]
  );
};