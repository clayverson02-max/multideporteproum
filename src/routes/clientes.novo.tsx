import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Power } from "lucide-react";
import {
  createClient as createClientApi,
  Client,
  PLATFORMS,
  RESPONSIBLES,
} from "@/lib/clients-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({ meta: [{ title: "Adicionar Cliente — Assessoria Clayverson Demontier" }] }),
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    status: "ativo" as "ativo" | "inativo",
    ads_active: true,
    responsible: "Clayverson",
    monthly_investment: 0,
    platforms: [] as string[],
    notes: "",
  });

  const create = useMutation({
    mutationFn: () =>
      createClientApi({ ...form, report: {} } as unknown as Omit<Client, "id" | "created_at" | "updated_at">),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente cadastrado!");
      navigate({ to: "/clientes/$id", params: { id: c.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePlatform = (p: string) =>
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Informe o nome do cliente");
      return;
    }
    create.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/clientes" })} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">Novo cadastro</p>
        <h1 className="mt-1 text-4xl font-bold text-gold-gradient">Adicionar Cliente</h1>
        <p className="mt-2 text-muted-foreground">
          Preencha os dados do cliente para começar a gerenciar suas demandas e relatórios.
        </p>
      </div>

      <form onSubmit={submit}>
        <Card className="p-6 bg-card border-border shadow-card space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Cliente *</Label>
            <Input
              id="name"
              placeholder="Ex: Loja da Maria"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label>Status do Cliente</Label>
              <div className="flex items-center gap-3 rounded-md border border-border bg-input/40 px-4 h-11">
                <Switch
                  checked={form.status === "ativo"}
                  onCheckedChange={(v) => setForm({ ...form, status: v ? "ativo" : "inativo" })}
                  className="data-[state=checked]:bg-success"
                />
                <span className={form.status === "ativo" ? "text-success font-medium" : "text-destructive font-medium"}>
                  {form.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Anúncios (estilo Meta Ads)</Label>
              <button
                type="button"
                onClick={() => setForm({ ...form, ads_active: !form.ads_active })}
                className={`flex items-center justify-between rounded-md border px-4 h-11 transition-all ${
                  form.ads_active
                    ? "border-success/50 bg-success/10 text-success"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold uppercase text-xs tracking-wider">
                  <Power className="h-4 w-4" />
                  {form.ads_active ? "LIGADOS" : "DESLIGADOS"}
                </span>
                <span
                  className={`relative inline-flex h-6 w-11 rounded-full border-2 transition-all ${
                    form.ads_active ? "bg-success border-success" : "bg-muted border-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${
                      form.ads_active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <Label htmlFor="invest">Investimento Mensal (R$)</Label>
              <Input
                id="invest"
                type="number"
                min="0"
                step="0.01"
                value={form.monthly_investment}
                onChange={(e) => setForm({ ...form, monthly_investment: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Plataformas de Tráfego</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((p) => {
                const checked = form.platforms.includes(p);
                return (
                  <label
                    key={p}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2.5 cursor-pointer transition-all ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-input/40 hover:border-primary/50"
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => togglePlatform(p)} />
                    <span className="text-sm font-medium">{p}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Observações Iniciais</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Briefing, segmento, metas iniciais..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/clientes" })}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || !form.name.trim()}
              className="gold-gradient text-primary-foreground hover:opacity-90 shadow-gold"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {create.isPending ? "Salvando..." : "Cadastrar Cliente"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
