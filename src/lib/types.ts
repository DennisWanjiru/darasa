import { Database } from "./schema";

export type Major = Database["public"]["Tables"]["major"]["Row"];
export type Role = Database["public"]["Tables"]["role"]["Row"];
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type Class = Database["public"]["Tables"]["class"]["Row"];
