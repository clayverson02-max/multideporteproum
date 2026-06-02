import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, DollarSign, ArrowRight } from "lucide-react";
import { listClients } from "@/lib/clients-api";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Dashboard — RF Client Manager" }],
  }),
  component: Dashboard,
});

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

function Dashboard() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: listClients,
  });

  const total = clients.length;
  const active = clients.filter((c) => c.status === "ativo").length;
  const inactive = clients.filter((c) => c.status === "inativo").length;
  const revenue = clients
    .filter((c) => c.status === "ativo")
    .reduce((sum, c) => sum + Number(c.monthly_investment || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">
            Visão Geral
          </p>
          <h1 className="mt-1 text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gold-gradient">Dashboard</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe seus clientes e o faturamento em tempo real.
          </p>
        </div>
        <Link to="/clientes/novo">
          <Button className="gold-gradient text-primary-foreground hover:opacity-90 shadow-gold h-11 px-6">
            Adicionar Cliente
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Clientes" value={isLoading ? "—" : total} icon={<Users className="h-5 w-5" />} accent="gold" />
        <StatCard label="Clientes Ativos" value={isLoading ? "—" : active} icon={<UserCheck className="h-5 w-5" />} accent="success" />
        <StatCard label="Clientes Inativos" value={isLoading ? "—" : inactive} icon={<UserX className="h-5 w-5" />} accent="destructive" />
        <StatCard label="Faturamento Mensal" value={isLoading ? "—" : brl(revenue)} icon={<DollarSign className="h-5 w-5" />} accent="gold" />
      </div>

      <Card className="bg-card border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Clientes recentes</h2>
          <Link to="/clientes" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Carregando...</p>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum cliente cadastrado ainda.</p>
            <Link to="/clientes/novo">
              <Button variant="link" className="text-primary mt-2">
                Adicionar o primeiro cliente
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {clients.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full ${c.status === "ativo" ? "bg-success" : "bg-destructive"}`} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.responsible} · {c.platforms.join(", ") || "Sem plataforma"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {brl(Number(c.monthly_investment))}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
