import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { track, useMarketingTracking } from "../lib/tracking";
import "../Index.css";

const BASIC = "https://pay.hotmart.com/P107284207G?checkoutMode=10";
const COMPLETE = "https://pay.hotmart.com/B107478096K?checkoutMode=10";
const VIDEO = "/vsl.mp4";
type Plan = "basico" | "completo";

function OfferModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [seconds, setSeconds] = useState(600);
  const complete = plan === "completo";
  const checkout = complete ? COMPLETE : BASIC;
  useEffect(() => { setSeconds(600); const id = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000); return () => window.clearInterval(id); }, []);
  const confirm = () => { track("InitiateCheckout", { content_name: complete ? "Plan Completo" : "Plan Básico", value: complete ? 10 : 5.5, currency: "USD" }); window.location.href = checkout; };
  return <div className="sale-modal"><div className="sale-card"><button className="modal-x" onClick={onClose}>×</button><div className="eyebrow">OFERTA ESPECIAL ACTIVADA</div><h3>Tu acceso todavía está reservado.</h3><p>Estás a un paso de entrar a la plataforma. Aprovecha el precio actual antes de que esta condición desaparezca.</p><div className="timer">{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}<small>PRECIO ESPECIAL</small></div><div className="selected">Plan seleccionado: <b>{complete ? "COMPLETO" : "BÁSICO"}</b></div><button className="cta" onClick={confirm}>CONFIRMAR MI ACCESO AHORA →</button><button className="later" onClick={onClose}>Quiero revisar una vez más</button></div></div>;
}

function DirectPage() {
  useMarketingTracking();
  const [plan, setPlan] = useState<Plan | null>(null);
  return <main className="sales-page direct-page">
    <div className="topbar">⚡ ACCESO DIGITAL DE POR VIDA · ENTRENAMIENTO MULTIDEPORTIVO</div>
    <section className="direct-hero"><div className="brand">MULTIDEPORTE <span>PRO</span></div><div className="sport-line">FÚTBOL · BÁSQUETBOL · VÓLEIBOL · FUTSAL</div><h1>Deja de entrenar siempre lo mismo.<br/><span>Ten cientos de formas de entrenar mejor.</span></h1><p className="direct-sub">Mira el video y descubre por qué una biblioteca completa de entrenamientos puede cambiar la forma en que preparas cada sesión.</p><div className="video-frame"><video src={VIDEO} controls playsInline preload="metadata" onPlay={() => track("Lead", { content_name: "Video Direct Sales" })}/><div className="video-caption">▶ REPRODUCE EL VIDEO PARA CONOCER LA PLATAFORMA</div></div><div className="direct-cta-wrap"><button className="cta" onClick={() => setPlan("completo")}>QUIERO VER LOS PLANES ESPECIALES →</button><small>🔒 Pago seguro procesado por Hotmart · acceso de por vida</small></div></section>
    <section className="direct-proof"><div><b>+5.000</b><span>entrenamientos</span></div><div><b>4</b><span>deportes</span></div><div><b>+100</b><span>planes nutricionales</span></div></section>
    {plan && <OfferModal plan={plan} onClose={() => setPlan(null)}/>} 
  </main>;
}

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "Multideporte Pro | Entrena mejor" }, { name: "description", content: "+5.000 entrenamientos para fútbol, básquetbol, vóleibol y futsal." }] }), component: DirectPage });
