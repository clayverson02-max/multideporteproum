import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: "gold" | "success" | "destructive" | "default";
}

export function StatCard({ label, value, icon, accent = "default" }: Props) {
  const accents: Record<string, string> = {
    gold: "text-primary border-primary/30 bg-primary/5",
    success: "text-success border-success/30 bg-success/5",
    destructive: "text-destructive border-destructive/30 bg-destructive/5",
    default: "text-foreground border-border bg-card",
  };

  return (
    <Card className="p-5 bg-card border-border shadow-card hover:border-primary/40 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${accents[accent]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
