import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ClientStatus = "ativo" | "inativo";
export type DemandStatus = "pendente" | "em_andamento" | "concluida";
export type DemandPriority = "alta" | "media" | "baixa";

/** Métricas preenchidas manualmente pela equipe e usadas no relatório em PDF. */
export type ClientReport = {
  period?: string;
  spend?: number;
  impressions?: number;
  reach?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  leads?: number;
  cpl?: number;
  sales?: number;
  revenue?: number;
  roas?: number;
  highlights?: string;
  next_steps?: string;
  [key: string]: unknown;
};

export type Client = {
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
};

export type Demand = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: DemandStatus;
  assignee: string;
  priority: DemandPriority;
  created_at: string;
  updated_at: string;
};

export type ClientInput = Omit<Client, "id" | "created_at" | "updated_at">;
export type DemandInput = Omit<Demand, "id" | "created_at" | "updated_at">;

export const PLATFORMS: string[] = [
  "Meta Ads",
  "Google Ads",
  "TikTok Ads",
  "YouTube Ads",
  "LinkedIn Ads",
  "Kwai Ads",
];

export const RESPONSIBLES: string[] = [
  "Clayverson",
  "Aloan",
  "Equipe",
];

export const DEMAND_STATUSES: { value: DemandStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

export const DEMAND_PRIORITIES: { value: DemandPriority; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type DemandRow = Database["public"]["Tables"]["client_demands"]["Row"];

const toClient = (row: ClientRow): Client => ({
  id: row.id,
  name: row.name,
  status: row.status === "inativo" ? "inativo" : "ativo",
  ads_active: Boolean(row.ads_active),
  responsible: row.responsible ?? "",
  monthly_investment: Number(row.monthly_investment ?? 0),
  platforms: row.platforms ?? [],
  notes: row.notes ?? "",
  report: (row.report ?? {}) as ClientReport,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const toDemand = (row: DemandRow): Demand => ({
  id: row.id,
  client_id: row.client_id,
  title: row.title,
  description: row.description ?? "",
  status: (row.status ?? "pendente") as DemandStatus,
  assignee: row.assignee ?? "",
  priority: (row.priority ?? "media") as DemandPriority,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const asJson = (value: ClientReport) => value as unknown as ClientInsert["report"];

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toClient);
}

export async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toClient(data) : null;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      status: input.status,
      ads_active: input.ads_active,
      responsible: input.responsible,
      monthly_investment: input.monthly_investment,
      platforms: input.platforms,
      notes: input.notes,
      report: asJson(input.report ?? {}),
    })
    .select("*")
    .single();
  if (error) throw error;
  return toClient(data);
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  const payload: ClientInsert = { id };
  if (input.name !== undefined) payload.name = input.name;
  if (input.status !== undefined) payload.status = input.status;
  if (input.ads_active !== undefined) payload.ads_active = input.ads_active;
  if (input.responsible !== undefined) payload.responsible = input.responsible;
  if (input.monthly_investment !== undefined) payload.monthly_investment = input.monthly_investment;
  if (input.platforms !== undefined) payload.platforms = input.platforms;
  if (input.notes !== undefined) payload.notes = input.notes;
  if (input.report !== undefined) payload.report = asJson(input.report);

  const { data, error } = await supabase.from("clients").update(payload).eq("id", id).select("*").single();
  if (error) throw error;
  return toClient(data);
}

export async function setAdsActive(id: string, ads_active: boolean): Promise<Client> {
  return updateClient(id, { ads_active });
}

export async function deleteClient(id: string): Promise<void> {
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
  return (data ?? []).map(toDemand);
}

export async function createDemand(input: DemandInput): Promise<Demand> {
  const { data, error } = await supabase
    .from("client_demands")
    .insert({
      client_id: input.client_id,
      title: input.title,
      description: input.description,
      status: input.status,
      assignee: input.assignee,
      priority: input.priority,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toDemand(data);
}

export async function updateDemand(id: string, input: Partial<DemandInput>): Promise<Demand> {
  const { data, error } = await supabase
    .from("client_demands")
    .update({
      title: input.title,
      description: input.description,
      status: input.status,
      assignee: input.assignee,
      priority: input.priority,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return toDemand(data);
}

export async function deleteDemand(id: string): Promise<void> {
  const { error } = await supabase.from("client_demands").delete().eq("id", id);
  if (error) throw error;
}
