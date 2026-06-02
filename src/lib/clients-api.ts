import { supabase } from "@/integrations/supabase/client";

export type ClientStatus = "ativo" | "inativo";
export type Platform = "Meta Ads" | "Google Ads" | "TikTok Ads";

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  responsible: string;
  monthly_investment: number;
  platforms: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export const RESPONSIBLES = ["Aloan", "Auxiliar", "Equipe RF"];
export const PLATFORMS: Platform[] = ["Meta Ads", "Google Ads", "TikTok Ads"];

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function createClient(input: Omit<Client, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("clients").insert(input).select().single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, input: Partial<Omit<Client, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase.from("clients").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}
