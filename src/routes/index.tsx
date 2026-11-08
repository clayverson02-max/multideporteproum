import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { track, useMarketingTracking } from "../lib/tracking";
import "../Index.css";

// ⬇️ TROQUE PELO CHECKOUT REAL DA CONSTRUPEDIA
const CHECKOUT = "https://pay.hotmart.com/REEMPLAZAR?checkoutMode=10";
const PRECO = 15;
const VIDEO = "/vsl-construpedia.mp4";

const FICHAS = Array.from({ length: 20 }, (_, i) => `/img/fichas/f${String(i + 1).padStart(2, "0")}.jpg`);
const COLUNAS = [FICHAS.filter((_, i) => i % 3 === 0), FICHAS.filter((_, i) => i % 3 === 1), FICHAS.filter((_, i) => i % 3 === 2)];

const ALAS: [string, string, string][] = [
  ["01", "Estructuras y Concreto", "Zapatas, vigas, columnas, losas y empalmes de acero."],
  ["02", "Maestro de Obra", "Metrados, dosificación, presupuesto y cronograma."],
  ["03", "Electricidad", "Tableros, calibre de cable, circuitos y puesta a tierra."],
  ["04", "Sanitarias", "Agua fría, desagüe, pendientes y pruebas."],
  ["05", "Soldadura", "Juntas, simbología, amperaje y defectos del cordón."],
  ["06", "Acabados", "Aparejos, tarrajeo, pisos, enchapes y drywall."],
  ["07", "Topografía", "Nivelación, replanteo de ejes y cálculo de áreas."],
  ["08", "Seguridad en Obra", "EPP, matriz de riesgos, altura y señalización."],
];

const DESTAQUES: [string, string][] = [
  ["f01", "Zapata aislada, con el acero en los dos sentidos y el recubrimiento acotado."],
  ["f05", "Tablero unifilar: cada circuito con su llave y su diferencial."],
  ["f16", "Metrado de concreto partida por partida, con el total en m³."],
  ["f12", "Aparejos de ladrillo: soga de 15 y cabeza de 25, con la junta real."],
  ["f08", "Pendiente de desagüe: 1% en 4 pulgadas y caja de registro cada 15 m."],
  ["f18", "Cronograma de 12 semanas con las partidas montadas unas sobre otras."],
];

const BONOS: [string, string][] = [
  ["calculadoras", "Calculadoras en Excel de cemento, arena, acero y ladrillo."],
  ["detalles", "100 detalles constructivos en imagen, para abrir en la obra."],
  ["presupuesto", "Plantillas de presupuesto con partidas y precio unitario."],
  ["certificado", "Certificado de conclusión con tu nombre."],
];

const FAQ: [string, string][] = [
  ["¿Cómo recibo el acceso?", "Apenas terminas la compra te llega un correo con tu acceso. No hay envío ni espera."],
  ["¿Sirve si no soy ingeniero?", "Sí. Todo está en dibujos, tablas y ejemplos de obra. Lo usan maestros, técnicos, electricistas, soldadores y estudiantes."],
  ["¿Es un solo pago?", "Sí. Pagas una vez y el acceso es de por vida, con las alas nuevas incluidas."],
  ["¿Lo abro en el celular?", "Sí, y está hecho para eso: se abre en el celular, en la tablet o en la computadora."],
  ["¿Y si no me sirve?", "Tienes 7 días de garantía. Escribes al soporte y te devolvemos el 100%."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Construpedia | Toda la construcción en una sola plataforma" },
      { name: "description", content: "8 alas en un solo acceso: estructuras, maestro de obra, electricidad, sanitarias, soldadura, acabados, topografía y seguridad. Un solo pago." },
    ],
  }),
  component: Pagina,
});

function Comprar({ onde }: { onde: string }) {
  const ir = () => {
    track("InitiateCheckout", { content_name: "Construpedia", content_category: onde, value: PRECO, currency: "USD" });
    window.location.href = CHECKOUT;
  };
  return (
    <>
      <button className="cta" onClick={ir}>Quiero las 8 alas por US$ {PRECO}</button>
      <small className="nota">Pago único · acceso inmediato · 7 días de garantía</small>
    </>
  );
}

function Pagina() {
  useMarketingTracking();
  useEffect(() => { track("ViewContent", { content_name: "Construpedia" }); }, []);

  return (
    <main>
      <div className="topbar">Precio de lanzamiento: <b>US$ {PRECO}</b> · después queda en US$ 55</div>

      <section className="wrap hero">
        <span className="brand"><i /> CONSTRUPEDIA</span>
        <h1 className="h1">Un error en obra <em>cuesta más</em> que esta plataforma</h1>
        <p className="lead" style={{ marginInline: "auto" }}>
          Fichas visuales de 8 áreas: estructuras, eléctricas, sanitarias, soldadura, acabados,
          topografía y seguridad. Con el dibujo acotado y la medida que se usa en campo.
        </p>
        <div className="chips">
          <span>Ingeniero civil</span><span>Maestro de obra</span><span>Electricista</span>
          <span>Soldador</span><span>Topógrafo</span><span>Estudiante</span>
        </div>
        <div className="vsl">
          <div className="vsl-top"><span><i>●</i> MIRA LA PLATAFORMA POR DENTRO</span><span>60s</span></div>
          <video src={VIDEO} controls playsInline preload="metadata" poster="/img/vsl-poster.jpg" />
        </div>
        <div style={{ marginTop: 26 }}><Comprar onde="hero" /></div>
      </section>

      {/* parede de fichas */}
      <section className="sec" style={{ paddingBottom: 30 }}>
        <div className="wrap mid">
          <p className="eyebrow">Lo que hay adentro</p>
          <h2 className="h2">Abres, buscas la ficha, la aplicas</h2>
        </div>
        <div className="parede" aria-hidden="true">
          <div className="parede-in">
            {COLUNAS.map((col, i) => (
              <div className="col" key={i}>
                {[...col, ...col].map((src, k) => <img src={src} alt="" key={k} loading={k < 3 ? "eager" : "lazy"} width={600} height={750} />)}
              </div>
            ))}
          </div>
          <span className="parede-tag"><b>8 alas</b> · dibujos acotados, tablas y medidas</span>
        </div>
      </section>

      {/* alas */}
      <section className="sec creme">
        <div className="wrap">
          <p className="eyebrow">Las 8 alas</p>
          <h2 className="h2">Ocho áreas, un solo acceso</h2>
          <p className="lead">No compras manual por manual. Entras una vez y abres el área que necesitas hoy.</p>
          <div className="alas">
            {ALAS.map(([n, t, d]) => (
              <article className="ala" key={n}>
                <span className="n">{n}</span><h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* destaques */}
      <section className="sec creme" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="eyebrow">Páginas reales</p>
          <h2 className="h2">Así se ve por dentro</h2>
          <p className="lead">Dibujo acotado arriba, la explicación en una línea abajo. Sin teoría de relleno.</p>
          <div className="rail">
            {DESTAQUES.map(([f, texto]) => (
              <figure className="card" key={f} style={{ margin: 0 }}>
                <img src={`/img/fichas/${f}.jpg`} alt={texto} loading="lazy" width={600} height={750} />
                <p>{texto}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* plataforma */}
      <section className="sec">
        <div className="wrap mid">
          <p className="eyebrow">La plataforma</p>
          <h2 className="h2">Se abre en el celular, en plena obra</h2>
          <div className="shot"><img src="/img/plataforma.jpg" alt="La plataforma abierta en computadora y celular" width={1600} height={1000} loading="lazy" /></div>
          <div className="facts">
            <div className="fact"><b>8</b><span>Alas completas</span></div>
            <div className="fact"><b>4</b><span>Bonos incluidos</span></div>
            <div className="fact"><b>∞</b><span>Acceso de por vida</span></div>
            <div className="fact"><b>7</b><span>Días de garantía</span></div>
          </div>
        </div>
      </section>

      {/* bônus */}
      <section className="sec creme">
        <div className="wrap">
          <p className="eyebrow">Incluido sin costo</p>
          <h2 className="h2">4 bonos que entran contigo</h2>
          <div className="rail">
            {BONOS.map(([slug, texto]) => (
              <figure className="card" key={slug} style={{ margin: 0 }}>
                <img src={`/img/bono-${slug}.jpg`} alt={texto} loading="lazy" width={1000} height={1000} style={{ aspectRatio: "1 / 1" }} />
                <p>{texto}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* pitch */}
      <section className="sec" style={{ paddingBottom: 20 }}>
        <div className="wrap">
          <div className="pitch">
            <h2>¿Eres de una sola área? Igual vas a querer las otras.</h2>
            <p>
              En obra, el que entiende un poco de todo se equivoca menos y coordina mejor.
              El electricista que lee un plano de estructuras no rompe una viga. El maestro que entiende
              instalaciones no pica el muro dos veces. <b>Y si solo quieres tu área, también está ahí, completa.</b>
            </p>
          </div>
        </div>
      </section>

      {/* oferta */}
      <section className="sec" id="oferta">
        <div className="wrap mid">
          <p className="eyebrow">La oferta</p>
          <h2 className="h2">Un solo pago, y es tuya</h2>
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
              <li>Acceso de por vida, celular y computadora</li>
              <li>7 días de garantía</li>
            </ul>
            <Comprar onde="oferta" />
          </div>
        </div>
      </section>

      {/* garantia */}
      <section className="sec creme">
        <div className="wrap mid">
          <div className="selo"><div><b>7</b><span>Días</span></div></div>
          <h2 className="h2">Ábrela, y si no te sirve te devolvemos todo</h2>
          <p className="lead">
            Entras, abres las 8 alas y los 4 bonos. Si en 7 días no te sirve, escribes al soporte y te
            devolvemos el 100%. Sin preguntas y sin trámite.
          </p>
        </div>
      </section>

      {/* faq */}
      <section className="sec">
        <div className="wrap mid">
          <p className="eyebrow">Dudas</p>
          <h2 className="h2">Preguntas frecuentes</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
          <div style={{ marginTop: 34 }}><Comprar onde="faq" /></div>
        </div>
      </section>

      <footer className="wrap">
        <b>CONSTRUPEDIA</b>
        <div>Material educativo. No reemplaza la asesoría de un profesional colegiado ni las normas técnicas vigentes en tu país.</div>
        <div>Este sitio no forma parte de Facebook ni de Meta Platforms, Inc., y no está patrocinado ni avalado por ellos.</div>
      </footer>
    </main>
  );
}
