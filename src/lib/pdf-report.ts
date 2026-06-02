import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Client, Demand } from "./clients-api";

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

export function generateClientReportPDF(client: Client, demands: Demand[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ---- Capa ----
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, pageW, 6, "F");
  doc.rect(0, pageH - 6, pageW, 6, "F");

  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ASSESSORIA CLAYVERSON DEMONTIER", pageW / 2, 90, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text("PAINEL ESTRATÉGICO DE TRÁFEGO PAGO", pageW / 2, 108, { align: "center" });

  doc.setFontSize(34);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de", pageW / 2, pageH / 2 - 40, { align: "center" });
  doc.text("Performance", pageW / 2, pageH / 2 - 5, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text(client.name, pageW / 2, pageH / 2 + 35, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.setFont("helvetica", "normal");
  doc.text(`Período: ${client.report?.period || fmtDate(client.updated_at)}`, pageW / 2, pageH / 2 + 60, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageW / 2, pageH - 40, { align: "center" });

  // ---- Página 2: KPIs ----
  doc.addPage();
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, pageW, pageH, "F");

  // Header gold bar
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 70, pageW, 3, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ASSESSORIA CLAYVERSON DEMONTIER", 40, 30);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`Cliente: ${client.name}`, 40, 55);

  let y = 110;

  doc.setTextColor(15, 15, 18);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo dos Resultados", 40, y);
  y += 8;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.5);
  doc.line(40, y, 130, y);
  y += 25;

  const r = client.report || {};
  const kpis: { label: string; value: string }[] = [
    { label: "Investimento", value: brl(Number(client.monthly_investment)) },
    { label: "Investido (Período)", value: r.spend != null ? brl(r.spend) : "—" },
    { label: "Impressões", value: r.impressions?.toLocaleString("pt-BR") ?? "—" },
    { label: "Alcance", value: r.reach?.toLocaleString("pt-BR") ?? "—" },
    { label: "Cliques", value: r.clicks?.toLocaleString("pt-BR") ?? "—" },
    { label: "CTR", value: r.ctr != null ? `${r.ctr.toFixed(2)}%` : "—" },
    { label: "Leads", value: r.leads?.toString() ?? "—" },
    { label: "CPL", value: r.cpl != null ? brl(r.cpl) : "—" },
    { label: "Vendas", value: r.sales?.toString() ?? "—" },
    { label: "Faturamento", value: r.revenue != null ? brl(r.revenue) : "—" },
    { label: "ROAS", value: r.roas != null ? `${r.roas.toFixed(2)}x` : "—" },
    { label: "Plataformas", value: client.platforms.join(", ") || "—" },
  ];

  const cardW = (pageW - 80 - 20) / 3;
  const cardH = 60;
  kpis.forEach((k, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 40 + col * (cardW + 10);
    const yy = y + row * (cardH + 10);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(x, yy, cardW, cardH, 4, 4, "FD");
    doc.setFillColor(212, 175, 55);
    doc.rect(x, yy, 3, cardH, "F");

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.text(k.label.toUpperCase(), x + 12, yy + 18);
    doc.setFontSize(14);
    doc.setTextColor(15, 15, 18);
    doc.setFont("helvetica", "bold");
    doc.text(k.value, x + 12, yy + 40);
  });

  y += Math.ceil(kpis.length / 3) * (cardH + 10) + 20;

  // Highlights
  if (r.highlights) {
    doc.setFontSize(13);
    doc.setTextColor(15, 15, 18);
    doc.setFont("helvetica", "bold");
    doc.text("Destaques do Período", 40, y);
    y += 6;
    doc.setDrawColor(212, 175, 55);
    doc.line(40, y, 130, y);
    y += 18;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(r.highlights, pageW - 80);
    doc.text(lines, 40, y);
    y += lines.length * 14 + 10;
  }

  // Próximos passos
  if (r.next_steps) {
    if (y > pageH - 120) { doc.addPage(); y = 60; }
    doc.setFontSize(13);
    doc.setTextColor(15, 15, 18);
    doc.setFont("helvetica", "bold");
    doc.text("Próximos Passos", 40, y);
    y += 6;
    doc.setDrawColor(212, 175, 55);
    doc.line(40, y, 130, y);
    y += 18;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(r.next_steps, pageW - 80);
    doc.text(lines, 40, y);
    y += lines.length * 14 + 10;
  }

  // Demandas em andamento
  const openDemands = demands.filter((d) => d.status !== "concluida");
  if (openDemands.length > 0) {
    if (y > pageH - 200) { doc.addPage(); y = 60; }
    doc.setFontSize(13);
    doc.setTextColor(15, 15, 18);
    doc.setFont("helvetica", "bold");
    doc.text("Ações em Execução", 40, y);
    y += 6;
    doc.setDrawColor(212, 175, 55);
    doc.line(40, y, 130, y);
    y += 12;

    autoTable(doc, {
      startY: y,
      head: [["Demanda", "Status", "Prioridade", "Responsável"]],
      body: openDemands.map((d) => [
        d.title,
        d.status === "pendente" ? "Pendente" : "Em andamento",
        d.priority === "alta" ? "Alta" : d.priority === "baixa" ? "Baixa" : "Média",
        d.assignee || "—",
      ]),
      theme: "grid",
      headStyles: { fillColor: [15, 15, 18], textColor: [212, 175, 55], fontStyle: "bold" },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 40, right: 40 },
      styles: { fontSize: 9, cellPadding: 6 },
    });
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Assessoria Clayverson Demontier · Relatório ${client.name} · Página ${i}/${pageCount}`,
      pageW / 2,
      pageH - 20,
      { align: "center" },
    );
  }

  doc.save(`relatorio-${client.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
