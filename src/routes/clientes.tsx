import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, Plus, Calendar, Power, FileDown } from "lucide-react";
import { toast } from "sonner";
import {
  Client,
  listClients,
  updateClient,
  deleteClient,
  listDemands,
} from "@/lib/clients-api";
import { generateClientReportPDF } from "@/lib/pdf-report";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Meus Clientes — Assessoria Clayverson Demontier" }] }),
  component: ClientsPage,
});

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function ClientsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: clients = [], isLoading } = useQuery({ queryKey: ["clients"], queryFn: listClients });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativos" | "desligados">("todos");
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);

  const filtered = clients.filter((c) => {
    if (filter === "ativos" && !c.ads_active) return false;
    if (filter === "desligados" && c.ads_active) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleAds = useMutation({
    mutationFn: ({ id, ads_active }: { id: string; ads_active: boolean }) =>
      updateClient(id, { ads_active }),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", v.id] });
      toast.success(v.ads_active ? "Anúncios LIGADOS" : "Anúncios DESLIGADOS");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeClient = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente excluído");
      setConfirmDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportPdf = async (client: Client) => {
    const demands = await listDemands(client.id);
    generateClientReportPDF(client, demands);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">Carteira</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-gold-gradient">Meus Clientes</h1>
          <p className="mt-2 text-muted-foreground">{clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado{clients.length !== 1 ? "s" : ""}.</p>
        </div>
        <Link to="/clientes/novo">
          <Button className="gold-gradient text-primary-foreground hover:opacity-90 shadow-gold h-11">
            <Plus className="h-4 w-4 mr-1" /> Novo Cliente
          </Button>
        </Link>
      </header>

      <Card className="p-4 bg-card border-border shadow-card">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-input/50"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="bg-input/50">
              <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Todos</TabsTrigger>
              <TabsTrigger value="ativos" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">Anúncios LIGADOS</TabsTrigger>
              <TabsTrigger value="desligados" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">DESLIGADOS</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
          <Link to="/clientes/novo">
            <Button variant="link" className="text-primary mt-2">Adicionar o primeiro cliente</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="p-5 bg-card border-border shadow-card hover:border-primary/40 transition-all cursor-pointer"
              onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Atualizado em {fmtDate(c.updated_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAds.mutate({ id: c.id, ads_active: !c.ads_active });
                  }}
                  className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all ${
                    c.ads_active
                      ? "border-success bg-success/10 text-success hover:bg-success/20"
                      : "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }`}
                  title={c.ads_active ? "Clique para DESLIGAR anúncios" : "Clique para LIGAR anúncios"}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {c.ads_active ? "LIGADOS" : "DESLIGADOS"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Responsável</p>
                  <p className="text-sm font-medium mt-0.5">{c.responsible}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Investimento</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{brl(Number(c.monthly_investment))}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Plataformas</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.platforms.length === 0 ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    c.platforms.map((p) => (
                      <Badge key={p} variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        {p}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:border-primary hover:text-primary"
                  onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}
                >
                  Abrir painel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:border-primary hover:text-primary"
                  onClick={() => exportPdf(c)}
                  title="Exportar relatório PDF"
                >
                  <FileDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirmDelete(c)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente <strong className="text-foreground">{confirmDelete?.name}</strong> será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmDelete && removeClient.mutate(confirmDelete.id)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
