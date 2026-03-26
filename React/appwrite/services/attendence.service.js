import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Mark Attendance
export const markAttendance = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ATTENDANCE,
    ID.unique(),
    data
  );
};

//  Get Attendance by Person + Date Range
export const getAttendance = async (personId, fromDate, toDate) => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ATTENDANCE,
    [
      Query.equal("personId", personId),
      Query.greaterThanEqual("date", fromDate),
      Query.lessThanEqual("date", toDate),
    ]
  );
};