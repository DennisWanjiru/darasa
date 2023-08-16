import { Database } from "./schema";

export type Major = Database["public"]["Tables"]["major"]["Row"];
export type Role = Database["public"]["Tables"]["role"]["Row"];
