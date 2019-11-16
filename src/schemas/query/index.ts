import { channelQueries } from "./channels";
import { generalQueries } from "./general";
import { invoiceQueries } from "./invoices";
import { dataQueries } from "./data";

export const query = {
  ...channelQueries,
  ...generalQueries,
  ...invoiceQueries,
  ...dataQueries
};
