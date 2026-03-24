export const generateInvoiceData = ({
  title,
  amount,
  type,
  referenceId,
  siteId,
}) => {
  return {
    title,
    amount,
    type,
    referenceId,
    siteId,
    date: new Date().toISOString().split("T")[0],
  };
};