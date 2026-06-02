import { supabase } from "@/integrations/supabase/client";

export type ClientStatus = "ativo" | "inativo";
export type Platform = "Meta Ads" | "Google Ads" | "TikTok Ads";

export interface ClientReport {
  period?: string;
  impressions?: number;
  reach?: number;
  clicks?: number;
  ctr?: number;
  spend?: number;
  leads?: number;
  cpl?: number;
  roas?: number;
  sales?: number;
  revenue?: number;
  highlights?: string;
  next_steps?: string;
}

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  ads_active: boolean;
  responsible: string;
  monthly_investment: number;
  platforms: string[];
  notes: string;
  report: ClientReport;
  created_at: string;
  updated_at: string;
}

export type DemandStatus = "pendente" | "em_andamento" | "concluida";
export type DemandPriority = "baixa" | "media" | "alta";

export interface Demand {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: DemandStatus;
  assignee: string;
  priority: DemandPriority;
  created_at: string;
  updated_at: string;
}

export const RESPONSIBLES = ["Clayverson", "Equipe", "Auxiliar"];
export const PLATFORMS: Platform[] = ["Meta Ads", "Google Ads", "TikTok Ads"];

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClient(id: string): Promise<Client> {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Client;
}

export async function createClient(input: Omit<Client, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("clients").insert(input as never).select().single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, input: Partial<Omit<Client, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase.from("clients").update(input as never).eq("id", id).select().single();
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

export async function listDemands(clientId: string): Promise<Demand[]> {
  const { data, error } = await supabase
    .from("client_demands")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Demand[];
}

export async function createDemand(input: Omit<Demand, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("client_demands").insert(input).select().single();
  if (error) throw error;
  return data as Demand;
}

export async function updateDemand(id: string, input: Partial<Omit<Demand, "id" | "client_id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase.from("client_demands").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data as Demand;
}

export async function deleteDemand(id: string) {
  const { error } = await supabase.from("client_demands").delete().eq("id", id);
  if (error) throw error;
}
