import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { track, useMarketingTracking } from "../lib/tracking";
import "../Index.css";

const BASIC = "https://pay.hotmart.com/P107284207G?checkoutMode=10";
const COMPLETE = "https://pay.hotmart.com/B107478096K?checkoutMode=10";
const VIDEO = "/vsl.mp4";
type Plan = "basico" | "completo";

const testimonials = [
  ["feedback-1.png", "Carlos Mendoza", "Entrenador de básquetbol", "Antes perdía mucho tiempo buscando ejercicios. Ahora con Multideporte Pro tengo más de 1.000 entrenamientos listos y mis jugadores mejoraron la técnica en pocas semanas."],
  ["feedback-2.png", "Valentina Ríos", "Jugadora de vóley", "Los ejercicios están muy bien explicados y se notan resultados rápido. Subí mi nivel de ataque y recepción en menos de un mes."],
  ["feedback-3.png", "Andrés López", "Entrenador de fútbol", "Los más de 2.000 ejercicios de fútbol de campo son una joya. Organizo sesiones completas en minutos y el equipo se ve mucho más intenso."],
  ["feedback-4.png", "Mateo Vargas", "Jugador de futsal", "Encontré ejercicios específicos de pivote, defensa y finalización que no veía en ningún lado. Mi rendimiento en partidos cambió bastante."],
  ["feedback-5.png", "Lucía Fernández", "Jugadora de básquet", "Me encanta poder entrenar sola con los videos. Mejoré mi tiro libre y mi juego de pies sin necesitar un entrenador todos los días."],
  ["feedback-6.png", "Diego Ramírez", "Entrenador de vóley", "La calidad de los entrenamientos es profesional. Mis equipos de categoría juvenil mejoraron el bloqueo y la recepción de forma notable."],
  ["feedback-7.png", "Sofía Herrera", "Jugadora de fútbol", "El paquete completo vale totalmente la pena. Además del fútbol, la guía nutricional me ayudó a tener más energía en los entrenamientos."],
  ["feedback-1.png", "Javier Morales", "Entrenador de futsal", "Los ejercicios de futsal son muy específicos y fáciles de aplicar. Mis jugadores mejoraron la toma de decisiones bajo presión."],
  ["feedback-2.png", "Camila Soto", "Entrenadora de básquet", "Uso Multideporte Pro todas las semanas. Ahorro horas de planificación y los jugadores están más motivados porque ven progreso real."],
  ["feedback-3.png", "Tomás Silva", "Jugador de vóley", "Los entrenamientos de ataque y defensa son excelentes. En dos meses noté una gran diferencia en mi salto y precisión."],
  ["feedback-4.png", "Martín Castro", "Entrenador", "El contenido de fútbol de campo es brutal. Tengo material para todo el año y todavía me sobra. Recomiendo el paquete completo sin dudar."],
  ["feedback-5.png", "Isabella Ruiz", "Jugadora de futsal", "Me gustó mucho la variedad de ejercicios. Mejoré mi control y mi velocidad de reacción. Muy recomendado."],
];

function OfferModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [seconds, setSeconds] = useState(600);
  const complete = plan === "completo";
  const checkout = complete ? COMPLETE : BASIC;

  useEffect(() => {
    setSeconds(600);
    const id = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const confirm = () => {
    track("InitiateCheckout", {
      content_name: complete ? "Plan Completo" : "Plan Básico",
      value: complete ? 10 : 5.5,
      currency: "USD",
    });
    window.location.href = checkout;
  };

  return (
    <div className="sale-modal" role="dialog" aria-modal="true">
      <div className="sale-card">
        <button className="modal-x" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="eyebrow">OFERTA ESPECIAL ACTIVADA</div>
        <h3>Tu acceso está listo.<br />Solo falta un paso.</h3>
        <p>Entra a una biblioteca completa para dejar de improvisar tus sesiones y entrenar con material listo para usar.</p>
        <div className="timer">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}<small>CONDICIÓN ESPECIAL ACTIVA</small></div>
        <div className="selected">Plan seleccionado: <b>{complete ? "COMPLETO" : "BÁSICO"}</b></div>
        <button className="cta cta-dark" onClick={confirm}>QUIERO MI ACCESO AHORA →</button>
        <button className="later" onClick={onClose}>Quiero revisar una vez más</button>
      </div>
    </div>
  );
}

function DirectPage() {
  useMarketingTracking();
  const [plan, setPlan] = useState<Plan | null>(null);

  return (
    <main className="sales-page direct-page">
      <div className="topbar">⚡ ACCESO DE POR VIDA · +5.000 ENTRENAMIENTOS · 4 DEPORTES · OFERTA ESPECIAL</div>

      <section className="hero-new">
        <div className="hero-glow" />
        <div className="brand-row"><span className="brand-mark">M</span><b>MULTIDEPORTE <span>PRO</span></b><span className="live-pill">ACCESO DE POR VIDA</span></div>
        <div className="sport-line">FÚTBOL · FUTSAL · BÁSQUETBOL · VÓLEIBOL</div>
        <div className="hero-label">🔥 LA BIBLIOTECA DE ENTRENAMIENTO QUE TE AHORRA HORAS DE BÚSQUEDA</div>
        <h1>+5.000 ENTRENAMIENTOS<br /><em>PARA ENTRENAR Y EVOLUCIONAR</em><br />COMO UN PROFESIONAL.</h1>
        <p className="hero-lead"><b>Deja de improvisar cada sesión.</b> Ten miles de ejercicios, sesiones y material de apoyo listos para fútbol, futsal, básquetbol y vóleibol, desde cualquier dispositivo y con acceso de por vida.</p>

        <div className="hero-stats">
          <div><strong>+5.000</strong><span>ENTRENAMIENTOS</span></div>
          <div><strong>4</strong><span>DEPORTES</span></div>
          <div><strong>+100</strong><span>GUÍAS NUTRICIONALES</span></div>
        </div>

        <div className="video-shell">
          <div className="video-top"><span>▶ VIDEO DE PRESENTACIÓN</span><span>01:46 · MIRA HASTA EL FINAL</span></div>
          <video src={VIDEO} controls playsInline preload="metadata" onPlay={() => track("Lead", { content_name: "Video Direct Sales" })} />
        </div>
        <button className="cta hero-cta" onClick={() => setPlan("completo")}>🔥 QUIERO LOS +5.000 ENTRENAMIENTOS →</button>
        <small className="secure-note">🔒 Pago seguro por Hotmart · acceso inmediato · 7 días de garantía</small>
      </section>

      <section className="marquee"><span>+2.000 FÚTBOL</span><i>✦</i><span>+1.000 BÁSQUETBOL</span><i>✦</i><span>+1.000 VÓLEIBOL</span><i>✦</i><span>+1.000 FUTSAL</span></section>

      <section className="intro-section">
        <div className="section-tag">TODO EN UN SOLO LUGAR</div>
        <h2>No son unos cuantos ejercicios.<br /><em>Son miles de opciones para cada sesión.</em></h2>
        <p>Cuando tienes variedad, dejas de repetir lo mismo. Cuando tienes una biblioteca completa, puedes planificar mejor, entrenar con más intención y aprovechar cada minuto.</p>
      </section>

      <section className="sport-section">
        <div className="section-head"><div><div className="section-tag">4 DEPORTES · +5.000 ENTRENAMIENTOS</div><h2>Elige tu deporte.<br /><em>Abre tu biblioteca.</em></h2></div><p>Contenido organizado para que encuentres nuevas ideas y puedas construir sesiones completas.</p></div>
        <div className="sport-cards">
          <article><b>01</b><strong>+2.000</strong><h3>FÚTBOL DE CAMPO</h3><p>Técnica · táctica · control · velocidad · definición · finalización</p></article>
          <article><b>02</b><strong>+1.000</strong><h3>BÁSQUETBOL</h3><p>Tiro · drible · defensa · coordinación · fundamentos</p></article>
          <article><b>03</b><strong>+1.000</strong><h3>VÓLEIBOL</h3><p>Saque · recepción · ataque · bloqueo · fundamentos</p></article>
          <article><b>04</b><strong>+1.000</strong><h3>FUTSAL</h3><p>Control · definición · táctica · decisión bajo presión</p></article>
        </div>
      </section>

      <section className="problem-section">
        <div className="problem-copy"><div className="section-tag">DEJA DE PERDER TIEMPO</div><h2>Tu problema no es falta de ganas.<br /><em>Es falta de opciones.</em></h2><p>Buscar ejercicios todos los días, guardar videos, repetir las mismas sesiones y llegar al entrenamiento sin un plan claro consume tiempo y energía.</p><button className="text-cta" onClick={() => setPlan("completo")}>QUIERO ENTRENAR CON UN PLAN →</button></div>
        <div className="problem-list"><div><b>01</b><span><strong>VARIEDAD</strong>Miles de ejercicios para dejar de repetir siempre lo mismo.</span></div><div><b>02</b><span><strong>RÁPIDO</strong>Encuentra ideas para tu próxima sesión en minutos.</span></div><div><b>03</b><span><strong>DESDE CUALQUIER LUGAR</strong>Consulta la biblioteca desde tu celular, tablet o computadora.</span></div><div><b>04</b><span><strong>PARA TODA LA TEMPORADA</strong>Material suficiente para seguir evolucionando.</span></div></div>
      </section>

      <section className="proof-section">
        <div className="section-tag">QUIENES YA LO ESTÁN USANDO</div>
        <h2>Menos búsqueda.<br /><em>Más entrenamiento.</em></h2>
        <p className="center-lead">Experiencias de entrenadores y jugadores que usan la biblioteca para preparar sus sesiones y seguir mejorando.</p>
        <div className="testimonial-grid">
          {testimonials.map(([image, name, role, quote], index) => (
            <article className="testimonial" key={`${name}-${index}`}>
              <img src={`/${image}`} alt={`Experiencia de ${name}`} loading="lazy" />
              <div className="stars">★★★★★</div>
              <p>“{quote}”</p>
              <strong>{name}</strong><span>{role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="value-section">
        <div className="section-tag">PLAN COMPLETO</div>
        <h2>Todo lo que necesitas para entrenar<br /><em>sin quedarte sin ideas.</em></h2>
        <div className="value-grid"><div><b>+5.000</b><span>ENTRENAMIENTOS EN 4 DEPORTES</span></div><div><b>+100</b><span>GUÍAS Y MATERIAL NUTRICIONAL</span></div><div><b>∞</b><span>ACCESO DE POR VIDA</span></div><div><b>03</b><span>BONOS EXCLUSIVOS</span></div></div>
        <div className="bonus-row"><div><b>BONO 01</b><h3>Planificación semanal</h3><p>Organiza tus sesiones y deja de improvisar.</p></div><div><b>BONO 02</b><h3>Prevención y recuperación</h3><p>Material de apoyo para cuidar tu entrenamiento.</p></div><div><b>BONO 03</b><h3>Comunidad exclusiva</h3><p>Acceso a futuras novedades y nuevos deportes.</p></div></div>
      </section>

      <section className="offer-section">
        <div className="offer-badge">🔥 MÁS ELEGIDO</div>
        <div className="section-tag">OFERTA ESPECIAL DE LANZAMIENTO</div>
        <h2>Empieza hoy.<br /><em>Entrena durante toda la vida.</em></h2>
        <div className="plans-new">
          <article className="plan-new"><span className="plan-mini">PLAN BÁSICO</span><h3>Fútbol</h3><p>Para quien quiere comenzar con la biblioteca de fútbol.</p><div className="old-price">US$29,90</div><div className="new-price">US$5,50 <small>pago único</small></div><ul><li>✓ +2.000 ejercicios de fútbol</li><li>✓ Acceso de por vida</li><li>✓ Acceso inmediato</li><li>✓ 7 días de garantía</li></ul><button className="cta secondary" onClick={() => setPlan("basico")}>QUIERO EL PLAN BÁSICO →</button></article>
          <article className="plan-new featured"><span className="plan-mini">PLAN COMPLETO · MÁS ELEGIDO</span><h3>Multideporte Pro</h3><p>La biblioteca completa para aprovechar los 4 deportes.</p><div className="old-price">US$74,90</div><div className="new-price">US$10 <small>pago único</small></div><div className="saving">AHORRAS 87%</div><ul><li>✓ +2.000 fútbol de campo</li><li>✓ +1.000 básquetbol</li><li>✓ +1.000 vóleibol</li><li>✓ +1.000 futsal</li><li>✓ +100 guías nutricionales</li><li>✓ 3 bonos exclusivos</li><li>✓ Acceso de por vida</li></ul><button className="cta" onClick={() => setPlan("completo")}>🔥 QUIERO TODO POR US$10 →</button></article>
        </div>
        <div className="guarantee-new"><b>🛡️ GARANTÍA DE 7 DÍAS</b><br />Pruébalo. Si no es para ti, solicita tu garantía dentro del plazo.</div>
      </section>

      <section className="final-section"><div className="section-tag">TU PRÓXIMA SESIÓN PUEDE SER DIFERENTE</div><h2>Deja de buscar ejercicios.<br /><em>Empieza a entrenar.</em></h2><button className="cta" onClick={() => setPlan("completo")}>🔥 QUIERO ACCESO A MULTIDEPORTE PRO →</button><p>+5.000 entrenamientos · 4 deportes · +100 guías · acceso de por vida</p></section>

      {plan && <OfferModal plan={plan} onClose={() => setPlan(null)} />}
    </main>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Multideporte Pro | +5.000 Entrenamientos" }] }),
  component: DirectPage,
});
