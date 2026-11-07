import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { track, useMarketingTracking } from "../lib/tracking";
import "../Index.css";

// ⬇️ TROQUE PELO CHECKOUT REAL DA CONSTRUPEDIA
const CHECKOUT = "https://pay.hotmart.com/REEMPLAZAR?checkoutMode=10";
const PRECO = 15;
const VIDEO = "/vsl-construpedia.mp4";

const ALAS: [string, string, string][] = [
  ["estructuras", "Estructuras y Concreto Armado", "Zapatas, vigas, columnas y losas: cómo se arman, qué acero lleva cada una y dónde se cierran los estribos."],
  ["maestro", "Maestro de Obra y Residente", "Metrados, presupuesto por partidas, cronograma y control diario de la obra."],
  ["electricidad", "Instalaciones Eléctricas", "Tableros, circuitos derivados, cálculo de conductores, diferencial y puesta a tierra."],
  ["sanitarias", "Instalaciones Sanitarias", "Agua fría y caliente, desagüe, ventilación, pendientes y pruebas."],
  ["soldadura", "Soldadura", "Procesos, simbología de planos, posiciones, electrodos y defectos del cordón."],
  ["acabados", "Acabados y Albañilería", "Muros, tarrajeo, pisos, enchapes y drywall, con los espesores y las mezclas."],
  ["topografia", "Topografía", "Nivelación, replanteo de ejes, poligonales y cálculo de áreas y volúmenes."],
  ["seguridad", "Seguridad en Obra", "EPP, señalización, trabajos en altura, matriz de riesgos y charlas de 5 minutos."],
];

const PAGINAS: [string, string][] = [
  ["zapata", "Detalle de zapata aislada, con el acero en los dos sentidos y el recubrimiento acotado."],
  ["viga", "Corte típico de viga: acero superior, inferior y la separación real de los estribos."],
  ["tablero", "Tablero eléctrico residencial, circuito por circuito, con diferencial y puesta a tierra."],
  ["soldadura", "Simbología de soldadura: qué dice cada símbolo del plano y de qué lado va el cordón."],
];

const BONOS: [string, string][] = [
  ["calculadoras", "Calculadoras en Excel de cemento, arena, acero y ladrillo. Pones las medidas y sale la cantidad."],
  ["detalles", "100 detalles constructivos en imagen, listos para abrir en el celular en plena obra."],
  ["presupuesto", "Plantillas de presupuesto con partidas, metrados y precio unitario."],
  ["certificado", "Certificado de conclusión con tu nombre al terminar cada ala."],
];

const FAQ: [string, string][] = [
  ["¿Cómo recibo el acceso?", "Apenas termina la compra te llega un correo con tu acceso a la plataforma. No hay envío ni espera."],
  ["¿Sirve si no soy ingeniero?", "Sí. El material está hecho con dibujos y ejemplos, no con teoría pesada. Lo usan maestros de obra, técnicos, electricistas, soldadores y estudiantes."],
  ["¿Es un solo pago?", "Sí. Pagas una vez y el acceso es de por vida, con las alas nuevas que vayamos sumando."],
  ["¿Lo puedo ver en el celular?", "Sí, y está pensado para eso: se abre en el celular, en la tablet o en la computadora."],
  ["¿Qué pasa con las alas nuevas?", "Entran en tu cuenta sin costo. No se cobra actualización."],
  ["¿Y si no me sirve?", "Tienes 7 días de garantía. Escribes al correo de soporte y te devolvemos el 100%, sin preguntas."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Construpedia | Toda la construcción en una sola plataforma" },
      { name: "description", content: "8 alas, un solo acceso: estructuras, maestro de obra, electricidad, sanitarias, soldadura, acabados, topografía y seguridad. Un solo pago." },
    ],
  }),
  component: Pagina,
});

function img(p: string) { return `/img/${p}`; }

function Comprar({ onde }: { onde: string }) {
  const ir = () => {
    track("InitiateCheckout", { content_name: "Construpedia", content_category: onde, value: PRECO, currency: "USD" });
    window.location.href = CHECKOUT;
  };
  return (
    <>
      <button className="cta" onClick={ir}>Quiero la Construpedia por US$ {PRECO}</button>
      <small className="nota">Pago único · Acceso de por vida · 7 días de garantía</small>
    </>
  );
}

function Pagina() {
  useMarketingTracking();
  useEffect(() => { track("ViewContent", { content_name: "Construpedia" }); }, []);

  return (
    <main>
      <div className="topbar">Precio de lanzamiento: <b>US$ {PRECO}</b> · después sube a US$ 55</div>

      {/* hero */}
      <section className="wrap hero">
        <span className="brand"><i /> CONSTRUPEDIA</span>
        <h1 className="h1">Toda la construcción en <em>una sola plataforma</em></h1>
        <p className="lead" style={{ margin: "0 auto" }}>
          Manuales visuales de 8 áreas de obra, con dibujos, cortes y ejemplos.
          Abres, buscas lo que necesitas y lo aplicas el mismo día.
        </p>
        <div className="chips">
          <span>Ingeniero civil</span><span>Maestro de obra</span><span>Residente</span>
          <span>Electricista</span><span>Soldador</span><span>Topógrafo</span><span>Estudiante</span>
        </div>

        <div className="vsl">
          <div className="vsl-top"><span><i>●</i> MIRA LA PLATAFORMA POR DENTRO</span><span className="mono">60s</span></div>
          <video src={VIDEO} controls playsInline preload="metadata" poster={img("plataforma.jpg")} />
        </div>

        <div style={{ marginTop: 30 }}><Comprar onde="hero" /></div>
      </section>

      {/* o que recebe */}
      <section className="sec">
        <div className="wrap mid">
          <p className="eyebrow mid">Lo que recibes hoy</p>
          <h2 className="h2">Una plataforma, ocho alas, un solo acceso</h2>
          <p className="lead">Entras una vez y eliges el área. No tienes que comprar manual por manual ni buscar nada suelto por internet.</p>
          <div className="shot"><img src={img("plataforma.jpg")} alt="La plataforma Construpedia abierta en computadora y celular" width={1600} height={1000} /></div>
          <div className="facts">
            <div className="fact"><b>8</b><span>Alas completas, de estructuras a seguridad en obra</span></div>
            <div className="fact"><b>4</b><span>Bonos incluidos: calculadoras, detalles, plantillas y certificado</span></div>
            <div className="fact"><b>∞</b><span>Acceso de por vida, con las alas nuevas incluidas</span></div>
            <div className="fact"><b>7</b><span>Días de garantía. Si no te sirve, te devolvemos todo</span></div>
          </div>
        </div>
      </section>

      {/* alas */}
      <section className="sec creme">
        <div className="wrap">
          <p className="eyebrow">Las 8 alas</p>
          <h2 className="h2">Esto es lo que abres por dentro</h2>
          <p className="lead" style={{ marginTop: 16 }}>Cada ala es un manual visual completo, con sus dibujos, sus tablas y sus ejemplos de obra.</p>
          <div className="alas">
            {ALAS.map(([slug, titulo, desc]) => (
              <article className="ala" key={slug}>
                <img src={img(`ala-${slug}.jpg`)} alt={titulo} loading="lazy" width={1000} height={1280} />
                <div className="t"><h3>{titulo}</h3><p>{desc}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* por dentro */}
      <section className="sec creme" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="eyebrow">Páginas reales</p>
          <h2 className="h2">Así se ve una página por dentro</h2>
          <p className="lead" style={{ marginTop: 16 }}>Dibujo acotado arriba, la explicación corta abajo. Sin teoría de relleno.</p>
          <div className="rail">
            {PAGINAS.map(([slug, texto]) => (
              <figure className="pag" key={slug} style={{ margin: 0 }}>
                <img src={img(`pagina-${slug}.jpg`)} alt={texto} loading="lazy" width={1080} height={1350} />
                <p>{texto}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* bônus */}
      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Incluido sin costo</p>
          <h2 className="h2">4 bonos que entran con tu acceso</h2>
          <div className="bonos">
            {BONOS.map(([slug, texto]) => (
              <article className="bono" key={slug}>
                <img src={img(`bono-${slug}.jpg`)} alt={texto} loading="lazy" width={1000} height={1000} />
                <p>{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* pitch */}
      <section className="sec tight">
        <div className="wrap">
          <div className="pitch">
            <h2>¿Eres de una sola área? Igual vas a querer las otras.</h2>
            <p>
              En obra, el que entiende un poco de todo se equivoca menos, coordina mejor y cobra mejor.
              El electricista que sabe leer un plano de estructuras no rompe una viga. El maestro que entiende
              instalaciones no pica un muro dos veces. <b>Y si solo quieres tu área, también está ahí, completa.</b>
            </p>
          </div>
        </div>
      </section>

      {/* oferta */}
      <section className="sec" id="oferta">
        <div className="wrap mid">
          <p className="eyebrow mid">La oferta</p>
          <h2 className="h2">Todo por un solo pago</h2>
          <div className="oferta">
            <div className="riscos">
              <span>Un manual suelto de una sola área cuesta cerca de <s>US$ 13</s></span>
              <span>Precio normal de la plataforma completa: <s>US$ 55</s></span>
            </div>
            <div className="preco">US$ {PRECO}<small>pago único, en el lanzamiento</small></div>
            <ul className="inclui">
              <li>Las 8 alas completas, sin bloqueos</li>
              <li>Los 4 bonos incluidos</li>
              <li>Alas nuevas sin costo adicional</li>
              <li>Acceso de por vida, en celular y computadora</li>
              <li>7 días de garantía</li>
            </ul>
            <Comprar onde="oferta" />
          </div>
        </div>
      </section>

      {/* garantia */}
      <section className="sec creme">
        <div className="wrap mid">
          <div className="selo"><div><b>7</b><span>Días de garantía</span></div></div>
          <h2 className="h2">Pruébala sin riesgo</h2>
          <p className="lead" style={{ marginTop: 16 }}>
            Entras, abres las 8 alas y los bonos. Si en 7 días sientes que no es para ti, escribes al soporte
            y te devolvemos el 100%. Sin preguntas y sin trámite.
          </p>
        </div>
      </section>

      {/* faq */}
      <section className="sec">
        <div className="wrap">
          <p className="eyebrow mid">Dudas</p>
          <h2 className="h2 mid">Preguntas frecuentes</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
          <div style={{ marginTop: 40 }}><Comprar onde="faq" /></div>
        </div>
      </section>

      <footer className="wrap">
        <b>CONSTRUPEDIA</b>
        <div>Material educativo. No reemplaza la asesoría de un profesional colegiado ni las normas técnicas vigentes en tu país.</div>
        <div>Este sitio no forma parte de Facebook ni de Meta Platforms, Inc., y no está patrocinado ni avalado por ellos.</div>
        <div>Los resultados dependen del uso que cada persona le dé al material.</div>
      </footer>
    </main>
  );
}
