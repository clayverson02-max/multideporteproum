import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8 font-mono whitespace-pre-wrap">
      Aprove e execute este plano por completo de forma detalhada
    </div>
  ),
});

