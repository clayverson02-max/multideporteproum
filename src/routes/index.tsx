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
  return <div className="sale-modal"><div className="sale-card"><button className="modal-x" onClick={onClose}>×</button><div className="eyebrow">OFERTA ESPECIAL ACTIVADA</div><h3>Tu acceso está listo. Solo falta un paso.</h3><p>Estás a punto de entrar a una biblioteca diseñada para que nunca vuelvas a quedarte sin ideas para entrenar.</p><div className="timer">{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}<small>CONDICIÓN ESPECIAL ACTIVA</small></div><div className="selected">Plan seleccionado: <b>{complete ? "COMPLETO" : "BÁSICO"}</b></div><button className="cta" onClick={confirm}>QUIERO MI ACCESO AHORA →</button><button className="later" onClick={onClose}>Quiero revisar una vez más</button></div></div>;
}

function DirectPage() {
  useMarketingTracking();
  const [plan, setPlan] = useState<Plan | null>(null);
  return <main className="sales-page direct-page">
    <div className="topbar">⚡ ACCESO DE POR VIDA · +5.000 ENTRENAMIENTOS · 4 DEPORTES · OFERTA ESPECIAL</div>
    <section className="direct-hero">
      <div className="brand">MULTIDEPORTE <span>PRO</span></div>
      <div className="sport-line">FÚTBOL · FUTSAL · BÁSQUETBOL · VÓLEIBOL</div>
      <div className="direct-badge">🔥 LA BIBLIOTECA DE ENTRENAMIENTO QUE TE AHORRA HORAS DE BÚSQUEDA</div>
      <h1>+5.000 ENTRENAMIENTOS<br/><span>PARA ENTRENAR Y EVOLUCIONAR COMO UN PROFESIONAL.</span></h1>
      <p className="direct-sub"><b>Deja de improvisar cada sesión.</b> Ten una biblioteca completa de ejercicios, sesiones y material de apoyo para fútbol, futsal, básquetbol y vóleibol, disponible desde cualquier dispositivo y con acceso de por vida.</p>
      <div className="hero-numbers"><div><b>+5.000</b><span>ENTRENAMIENTOS</span></div><div><b>4</b><span>DEPORTES</span></div><div><b>+100</b><span>GUÍAS NUTRICIONALES</span></div></div>
      <div className="video-frame"><video src={VIDEO} controls playsInline preload="metadata" onPlay={() => track("Lead", { content_name: "Video Direct Sales" })}/><div className="video-caption">▶ MIRA EL VIDEO Y DESCUBRE TODO LO QUE PUEDES TENER DENTRO</div></div>
      <div className="direct-cta-wrap"><button className="cta" onClick={() => setPlan("completo")}>🔥 QUIERO ACCESO A LOS +5.000 ENTRENAMIENTOS →</button><small>🔒 Pago seguro procesado por Hotmart · acceso de por vida</small></div>
    </section>
    <section className="numbers-section"><div className="section-kicker">MIRA TODO LO QUE RECIBES</div><h2>No son 100. No son 500. <span>Son más de 5.000 formas de entrenar.</span></h2><p>Una plataforma pensada para acabar con el “¿qué entreno hoy?” y darte variedad para trabajar técnica, velocidad, coordinación, táctica, definición y mucho más.</p><div className="number-grid"><article><b>+2.000</b><strong>FÚTBOL DE CAMPO</strong><span>Técnica · táctica · finalización · velocidad · control</span></article><article><b>+1.000</b><strong>BÁSQUETBOL</strong><span>Tiro · drible · defensa · coordinación · fundamentos</span></article><article><b>+1.000</b><strong>VÓLEIBOL</strong><span>Saque · recepción · ataque · bloqueo · fundamentos</span></article><article><b>+1.000</b><strong>FUTSAL</strong><span>Control · definición · táctica · decisión bajo presión</span></article></div></section>
    <section className="direct-benefits"><div><div className="section-kicker">¿POR QUÉ TENER TODO EN UN SOLO LUGAR?</div><h2>Porque entrenar mejor también significa <span>dejar de perder tiempo buscando qué hacer.</span></h2></div><div className="benefit-list"><div><b>01</b><strong>VARIEDAD INFINITA PARA TUS SESIONES</strong><p>Evita repetir los mismos ejercicios por falta de ideas.</p></div><div><b>02</b><strong>ENTRENAMIENTOS PARA DISTINTOS OBJETIVOS</strong><p>Encuentra material para desarrollar diferentes capacidades y fundamentos.</p></div><div><b>03</b><strong>TODO DESDE TU CELULAR</strong><p>Consulta tu biblioteca cuando quieras, estés donde estés.</p></div></div></section>
    <section className="direct-offer"><div className="section-kicker">ENTRA HOY</div><h2>Todo este contenido por una fracción de lo que costaría conseguirlo por separado.</h2><p>Elige cómo quieres comenzar. El Plan Completo es la opción para quien quiere aprovechar los 4 deportes y todo el contenido disponible.</p><button className="cta" onClick={() => setPlan("completo")}>🔥 VER MI OFERTA ESPECIAL →</button><small>7 días de garantía · pago único · acceso de por vida</small></section>
    {plan && <OfferModal plan={plan} onClose={() => setPlan(null)}/>} 
  </main>;
}

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "Multideporte Pro | +5.000 Entrenamientos" }, { name: "description", content: "+5.000 entrenamientos para fútbol, futsal, básquetbol y vóleibol. Acceso de por vida." }] }), component: DirectPage });
