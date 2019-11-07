import { channels } from "./channels";
import { invoices } from "./invoices";

export const mutation = { ...channels, ...invoices };
