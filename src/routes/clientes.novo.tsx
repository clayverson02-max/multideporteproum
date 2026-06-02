import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient as createClientApi, Client } from "@/lib/clients-api";
import { ClientFormDialog } from "@/components/client-form-dialog";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({ meta: [{ title: "Adicionar Cliente — RF Client Manager" }] }),
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(true);

  const create = useMutation({
    mutationFn: (data: Omit<Client, "id" | "created_at" | "updated_at">) => createClientApi(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente adicionado com sucesso!");
      navigate({ to: "/clientes" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!open) navigate({ to: "/clientes" });
  }, [open, navigate]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center py-12">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">Novo cadastro</p>
        <h1 className="mt-1 text-4xl font-bold text-gold-gradient">Adicionar Cliente</h1>
        <p className="mt-2 text-muted-foreground">Preencha o formulário para registrar um novo cliente.</p>
      </div>
      <ClientFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => { await create.mutateAsync(data); }}
      />
    </div>
  );
}
