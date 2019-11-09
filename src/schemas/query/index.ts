import { channelQueries } from "./channels";
import { generalQueries } from "./general";
import { invoiceQueries } from "./invoices";

export const query = {
  ...channelQueries,
  ...generalQueries,
  ...invoiceQueries
};
