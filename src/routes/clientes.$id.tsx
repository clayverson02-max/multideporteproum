import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, Power, FileDown, Trash2, Plus, Save, CheckCircle2, Circle, Clock,
  DollarSign, Pencil,
} from "lucide-react";
import {
  getClient, updateClient, deleteClient,
  listDemands, createDemand, updateDemand, deleteDemand,
  Client, Demand, DemandStatus, DemandPriority,
  RESPONSIBLES, PLATFORMS,
} from "@/lib/clients-api";
import { generateClientReportPDF } from "@/lib/pdf-report";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/clientes/$id")({
  head: () => ({ meta: [{ title: "Cliente — Assessoria Clayverson Demontier" }] }),
  component: ClientDetailPage,
});

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

function ClientDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
  });
  const { data: demands = [] } = useQuery({
    queryKey: ["demands", id],
    queryFn: () => listDemands(id),
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Client>>({});
  const [report, setReport] = useState<Record<string, string | number>>({});
  const [newDemand, setNewDemand] = useState({ title: "", description: "", priority: "media" as DemandPriority, assignee: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        status: client.status,
        responsible: client.responsible,
        monthly_investment: Number(client.monthly_investment),
        platforms: client.platforms,
        notes: client.notes,
      });
      setReport((client.report as Record<string, string | number>) || {});
    }
  }, [client]);

  const saveMutation = useMutation({
    mutationFn: (patch: Partial<Client>) => updateClient(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client", id] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente excluído");
      navigate({ to: "/clientes" });
    },
  });

  const addDemand = useMutation({
    mutationFn: () =>
      createDemand({
        client_id: id,
        title: newDemand.title,
        description: newDemand.description,
        priority: newDemand.priority,
        assignee: newDemand.assignee,
        status: "pendente",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["demands", id] });
      setNewDemand({ title: "", description: "", priority: "media", assignee: "" });
      toast.success("Demanda adicionada");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patchDemand = useMutation({
    mutationFn: ({ did, patch }: { did: string; patch: Partial<Demand> }) => updateDemand(did, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demands", id] }),
  });

  const removeDemand = useMutation({
    mutationFn: (did: string) => deleteDemand(did),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demands", id] }),
  });

  if (isLoading || !client) {
    return <p className="text-muted-foreground">Carregando...</p>;
  }

  const cycleStatus = (s: DemandStatus): DemandStatus =>
    s === "pendente" ? "em_andamento" : s === "em_andamento" ? "concluida" : "pendente";

  const handleSaveBasics = () => {
    saveMutation.mutate(form, { onSuccess: () => { toast.success("Cliente atualizado"); setEditing(false); } });
  };

  const handleSaveReport = () => {
    const cleaned: Record<string, unknown> = {};
    Object.entries(report).forEach(([k, v]) => { if (v !== "" && v != null) cleaned[k] = v; });
    saveMutation.mutate({ report: cleaned } as Partial<Client>, { onSuccess: () => toast.success("Relatório salvo") });
  };

  const togglePlatform = (p: string) => {
    setForm((f) => {
      const cur = f.platforms ?? [];
      return { ...f, platforms: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] };
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/clientes" })}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => generateClientReportPDF(client, demands)}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            <FileDown className="h-4 w-4 mr-1.5" /> Exportar Relatório PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(true)}
            className="hover:border-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero */}
      <Card className="p-6 bg-card border-border shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">Cliente</p>
            <h1 className="mt-1 text-4xl font-bold text-gold-gradient truncate">{client.name}</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Responsável: <span className="text-foreground font-medium">{client.responsible}</span>
              {" · "}Investimento: <span className="text-primary font-semibold">{brl(Number(client.monthly_investment))}</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {client.platforms.map((p) => (
                <Badge key={p} variant="outline" className="border-primary/30 text-primary bg-primary/5">{p}</Badge>
              ))}
            </div>
          </div>

          {/* Ads ON/OFF Meta-style */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Anúncios</span>
            <button
              type="button"
              onClick={() =>
                saveMutation.mutate(
                  { ads_active: !client.ads_active },
                  { onSuccess: () => toast.success(client.ads_active ? "Anúncios DESLIGADOS" : "Anúncios LIGADOS") },
                )
              }
              className={`flex items-center gap-3 rounded-full border-2 px-4 py-2 transition-all shadow-sm ${
                client.ads_active
                  ? "border-success bg-success/15 text-success hover:bg-success/25"
                  : "border-destructive bg-destructive/15 text-destructive hover:bg-destructive/25"
              }`}
            >
              <Power className="h-4 w-4" />
              <span className="font-bold uppercase tracking-wider text-sm">
                {client.ads_active ? "LIGADOS" : "DESLIGADOS"}
              </span>
              <span
                className={`relative inline-flex h-6 w-11 rounded-full transition-all ${
                  client.ads_active ? "bg-success" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transition-transform ${
                    client.ads_active ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandas */}
        <Card className="p-6 bg-card border-border shadow-card">
          <h2 className="text-xl font-bold mb-1">Demandas da Equipe</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Acompanhe e atribua tarefas para o cliente. Clique no círculo para alternar pendente → em andamento → concluída.
          </p>

          {/* New demand */}
          <div className="rounded-lg border border-dashed border-border bg-input/30 p-4 mb-4 space-y-3">
            <Input
              placeholder="Nova demanda (ex: Criar criativo de Black Friday)"
              value={newDemand.title}
              onChange={(e) => setNewDemand({ ...newDemand, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={newDemand.assignee || "none"} onValueChange={(v) => setNewDemand({ ...newDemand, assignee: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Responsável" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Sem responsável —</SelectItem>
                  {RESPONSIBLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={newDemand.priority} onValueChange={(v) => setNewDemand({ ...newDemand, priority: v as DemandPriority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Prioridade Baixa</SelectItem>
                  <SelectItem value="media">Prioridade Média</SelectItem>
                  <SelectItem value="alta">Prioridade Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => newDemand.title.trim() && addDemand.mutate()}
              disabled={!newDemand.title.trim() || addDemand.isPending}
              className="w-full gold-gradient text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Demanda
            </Button>
          </div>

          <div className="space-y-2">
            {demands.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma demanda ainda.</p>
            ) : (
              demands.map((d) => {
                const StatusIcon =
                  d.status === "concluida" ? CheckCircle2 : d.status === "em_andamento" ? Clock : Circle;
                const statusColor =
                  d.status === "concluida" ? "text-success" : d.status === "em_andamento" ? "text-primary" : "text-muted-foreground";
                const priorityColor =
                  d.priority === "alta" ? "border-destructive/50 text-destructive bg-destructive/5"
                  : d.priority === "baixa" ? "border-muted-foreground/30 text-muted-foreground"
                  : "border-primary/40 text-primary bg-primary/5";
                return (
                  <div key={d.id} className="flex items-start gap-3 p-3 rounded-md border border-border bg-input/20 hover:border-primary/30 transition-all">
                    <button
                      type="button"
                      onClick={() => patchDemand.mutate({ did: d.id, patch: { status: cycleStatus(d.status) } })}
                      className={`mt-0.5 ${statusColor} hover:scale-110 transition-transform`}
                      title="Alternar status"
                    >
                      <StatusIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${d.status === "concluida" ? "line-through text-muted-foreground" : ""}`}>
                        {d.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] ${priorityColor}`}>
                          {d.priority === "alta" ? "Alta" : d.priority === "baixa" ? "Baixa" : "Média"}
                        </Badge>
                        {d.assignee && (
                          <span className="text-[11px] text-muted-foreground">{d.assignee}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDemand.mutate(d.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Relatório de Anúncios */}
        <Card className="p-6 bg-card border-border shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold">Relatório de Anúncios</h2>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Preencha manualmente os números do período. Estes dados aparecem no PDF de apresentação.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <ReportField label="Período" value={report.period} onChange={(v) => setReport({ ...report, period: v })} placeholder="Ex: Out/2025" />
            <ReportField label="Investido (R$)" type="number" value={report.spend} onChange={(v) => setReport({ ...report, spend: Number(v) })} />
            <ReportField label="Impressões" type="number" value={report.impressions} onChange={(v) => setReport({ ...report, impressions: Number(v) })} />
            <ReportField label="Alcance" type="number" value={report.reach} onChange={(v) => setReport({ ...report, reach: Number(v) })} />
            <ReportField label="Cliques" type="number" value={report.clicks} onChange={(v) => setReport({ ...report, clicks: Number(v) })} />
            <ReportField label="CTR (%)" type="number" value={report.ctr} onChange={(v) => setReport({ ...report, ctr: Number(v) })} />
            <ReportField label="Leads" type="number" value={report.leads} onChange={(v) => setReport({ ...report, leads: Number(v) })} />
            <ReportField label="CPL (R$)" type="number" value={report.cpl} onChange={(v) => setReport({ ...report, cpl: Number(v) })} />
            <ReportField label="Vendas" type="number" value={report.sales} onChange={(v) => setReport({ ...report, sales: Number(v) })} />
            <ReportField label="Faturamento (R$)" type="number" value={report.revenue} onChange={(v) => setReport({ ...report, revenue: Number(v) })} />
            <ReportField label="ROAS (x)" type="number" value={report.roas} onChange={(v) => setReport({ ...report, roas: Number(v) })} />
          </div>

          <div className="mt-4 grid gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Destaques do Período</Label>
              <Textarea
                rows={3}
                value={(report.highlights as string) ?? ""}
                onChange={(e) => setReport({ ...report, highlights: e.target.value })}
                placeholder="O que funcionou? Quais campanhas se destacaram?"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Próximos Passos</Label>
              <Textarea
                rows={3}
                value={(report.next_steps as string) ?? ""}
                onChange={(e) => setReport({ ...report, next_steps: e.target.value })}
                placeholder="O que faremos nas próximas semanas?"
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={handleSaveReport} className="w-full mt-4 gold-gradient text-primary-foreground hover:opacity-90 shadow-gold">
            <Save className="h-4 w-4 mr-1.5" /> Salvar Relatório
          </Button>
        </Card>
      </div>

      {/* Dados básicos / Edição */}
      <Card className="p-6 bg-card border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Informações do Cliente</h2>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
            </Button>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Info label="Nome" value={client.name} />
            <Info label="Status" value={client.status === "ativo" ? "Ativo" : "Inativo"} />
            <Info label="Responsável" value={client.responsible} />
            <Info label="Investimento mensal" value={brl(Number(client.monthly_investment))} />
            <div className="md:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Observações</p>
              <p className="mt-1 whitespace-pre-wrap">{client.notes || "—"}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Responsável</Label>
                <Select value={form.responsible} onValueChange={(v) => setForm({ ...form, responsible: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RESPONSIBLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Investimento Mensal (R$)</Label>
                <Input type="number" value={form.monthly_investment ?? 0} onChange={(e) => setForm({ ...form, monthly_investment: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Plataformas</Label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((p) => {
                  const checked = (form.platforms ?? []).includes(p);
                  return (
                    <label key={p} className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all ${
                      checked ? "border-primary bg-primary/10 text-primary" : "border-border bg-input/40 hover:border-primary/50"
                    }`}>
                      <Checkbox checked={checked} onCheckedChange={() => togglePlatform(p)} />
                      <span className="text-sm">{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Observações</Label>
              <Textarea rows={4} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button onClick={handleSaveBasics} className="gold-gradient text-primary-foreground">
                <Save className="h-4 w-4 mr-1.5" /> Salvar
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as demandas vinculadas também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate()}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function ReportField({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 bg-input/50"
      />
    </div>
  );
}
