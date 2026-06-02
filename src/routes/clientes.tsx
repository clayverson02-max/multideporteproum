import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Client,
  listClients,
  updateClient,
  deleteClient,
} from "@/lib/clients-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientFormDialog } from "@/components/client-form-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Meus Clientes — RF Client Manager" }] }),
  component: ClientsPage,
});

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function ClientsPage() {
  const qc = useQueryClient();
  const { data: clients = [], isLoading } = useQuery({ queryKey: ["clients"], queryFn: listClients });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "inativo">("todos");
  const [editing, setEditing] = useState<Client | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);

  const filtered = clients.filter((c) => {
    if (filter !== "todos" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ativo" | "inativo" }) =>
      updateClient(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Status atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveClient = useMutation({
    mutationFn: (data: Omit<Client, "id" | "created_at" | "updated_at">) =>
      updateClient(editing!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente atualizado");
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
              <TabsTrigger value="ativo" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">Ativos</TabsTrigger>
              <TabsTrigger value="inativo" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Inativos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="p-5 bg-card border-border shadow-card hover:border-primary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Atualizado em {fmtDate(c.updated_at)}
                  </p>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 border ${
                  c.status === "ativo"
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}>
                  <Switch
                    checked={c.status === "ativo"}
                    onCheckedChange={(v) =>
                      toggleStatus.mutate({ id: c.id, status: v ? "ativo" : "inativo" })
                    }
                    className="data-[state=checked]:bg-success data-[state=unchecked]:bg-destructive scale-90"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {c.status}
                  </span>
                </div>
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

              {c.notes && (
                <p className="text-sm text-muted-foreground bg-input/30 rounded-md p-3 mb-4 line-clamp-3">
                  {c.notes}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:border-primary hover:text-primary"
                  onClick={() => { setEditing(c); setDialogOpen(true); }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
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

      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={async (data) => { await saveClient.mutateAsync(data); }}
      />

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
