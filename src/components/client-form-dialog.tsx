import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Client, ClientStatus, PLATFORMS, RESPONSIBLES } from "@/lib/clients-api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Client | null;
  onSubmit: (data: Omit<Client, "id" | "created_at" | "updated_at">) => Promise<void>;
}

type FormState = {
  name: string;
  status: ClientStatus;
  responsible: string;
  monthly_investment: number;
  platforms: string[];
  notes: string;
};

const empty: FormState = {
  name: "",
  status: "ativo",
  responsible: "Aloan",
  monthly_investment: 0,
  platforms: [],
  notes: "",
};

export function ClientFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              status: initial.status,
              responsible: initial.responsible,
              monthly_investment: Number(initial.monthly_investment),
              platforms: initial.platforms ?? [],
              notes: initial.notes ?? "",
            }
          : empty,
      );
    }
  }, [open, initial]);

  const togglePlatform = (p: string) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="text-gold-gradient">
              {initial ? "Editar Cliente" : "Novo Cliente"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input
              id="name"
              placeholder="Ex: Loja da Maria"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 rounded-md border border-border bg-input/40 px-4 h-10">
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
              <Label>Responsável</Label>
              <Select value={form.responsible} onValueChange={(v) => setForm({ ...form, responsible: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RESPONSIBLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="grid gap-2">
            <Label>Plataformas</Label>
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
            <Label htmlFor="notes">Observações / Demandas</Label>
            <Textarea
              id="notes"
              rows={5}
              placeholder="Anotações sobre o cliente, demandas atuais, ajustes pendentes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !form.name.trim()}
            className="gold-gradient text-primary-foreground hover:opacity-90 shadow-gold"
          >
            {saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
