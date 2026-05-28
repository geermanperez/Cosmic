import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  Headset,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import heroImage from "./assets/hero.png";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://apims.redly.com.ar";

const topMenu = [
  {
    title: "NOTICE",
    links: ["Noticias", "Mantenimiento"],
  },
  {
    title: "UPDATE",
    links: ["Parche", "Roadmap"],
  },
  {
    title: "EVENT",
    links: ["Eventos", "Season Pass"],
  },
  {
    title: "COMMUNITY",
    links: ["Discord", "Guilds"],
  },
  {
    title: "RANKING",
    links: ["Top nivel", "Top boss"],
  },
  {
    title: "SUPPORT",
    links: ["FAQ", "Contacto"],
    accent: true,
  },
];

const promoCards = [
  {
    title: "Server Rules",
    subtitle: "Todo lo que tenes que saber para jugar limpio.",
    action: "Ver reglas",
    tone: "blue",
    icon: ShieldCheck,
  },
  {
    title: "Donations",
    subtitle: "Apoya el servidor y obtene beneficios cosmeticos.",
    action: "Ir a tienda",
    tone: "gold",
    icon: Sparkles,
  },
  {
    title: "Promotions",
    subtitle: "Bonos de inicio, cajas y regalos de temporada.",
    action: "Ver promos",
    tone: "mint",
    icon: Bell,
  },
  {
    title: "Redeem Coupon",
    subtitle: "Canjea tus codigos y desbloquea recompensas.",
    action: "Canjear",
    tone: "violet",
    icon: FileText,
  },
];

function App() {
  const [openMenu, setOpenMenu] = useState(null);
  const [status, setStatus] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [message, setMessage] = useState("");

  const loadStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({
        ok: false,
        message: "No se pudo conectar con el servidor.",
      });
    }
  };

  const loadRanking = async () => {
    try {
      const res = await fetch(`${API_URL}/ranking`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setRanking(data);
      } else if (Array.isArray(data.ranking)) {
        setRanking(data.ranking);
      } else {
        setRanking([]);
      }
    } catch {
      setRanking([]);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStatus();
      void loadRanking();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.username || !form.password || !form.confirmPassword) {
      setMessage("Completa todos los campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Las contrasenas no coinciden.");
      return;
    }

    try {
      setLoadingRegister(true);

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "No se pudo crear la cuenta.");
        return;
      }

      setMessage("Cuenta creada correctamente. Ya puedes entrar al juego.");
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
      });

      loadStatus();
    } catch {
      setMessage("Error de conexion con la API.");
    } finally {
      setLoadingRegister(false);
    }
  };

  const rankingPreview = ranking.slice(0, 5);

  return (
    <div className="site-shell">
      <header className="masthead">
        <nav
          className="top-nav"
          onMouseLeave={() => setOpenMenu(null)}
          aria-label="Main navigation"
        >
          {topMenu.map((section) => {
            const isOpen = openMenu === section.title;
            const targetHref =
              section.title === "SUPPORT"
                ? "#support"
                : section.title === "RANKING"
                  ? "#ranking"
                  : "#news";

            return (
              <div
                key={section.title}
                className={`top-nav__item${section.accent ? " is-accent" : ""}${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setOpenMenu(section.title)}
              >
                <button
                  type="button"
                  className="top-nav__trigger"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === section.title ? null : section.title,
                    )
                  }
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <ChevronDown size={16} />
                </button>

                <div className="top-nav__dropdown">
                  {section.links.map((link) => (
                    <a
                      key={link}
                      href={targetHref}
                      onClick={() => setOpenMenu(null)}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="brand-row">
          <div className="brand-mark">
            <div className="brand-mark__badge">
              <Gamepad2 size={30} />
            </div>
            <div>
              <p>Star Maple inspired portal</p>
              <h1>LatinMS</h1>
            </div>
          </div>

          <div className="language-pill">
            <span>Language</span>
            <strong>ES / EN</strong>
          </div>
        </div>
      </header>

      <main className="portal">
        <section className="hero-banner" id="inicio">
          <img src={heroImage} alt="Hero Maple" className="hero-banner__art" />
          <div className="hero-banner__overlay"></div>

          <div className="hero-banner__copy">
            <span className="eyebrow">Classic MapleStory Experience</span>
            <h2>Star style landing, adapted for your own server</h2>
            <p>
              Una portada mas llamativa, con accesos rapidos, visual fuerte y una
              estructura de portal MMO para descarga, comunidad y progreso.
            </p>
          </div>

          <div className="hero-banner__status">
            <div className="signal"></div>
            <div>
              <strong>{status?.ok ? "Servidor online" : "Estado del servidor"}</strong>
              <span>
                {status?.ok
                  ? `Cuentas: ${status?.accounts ?? "-"} · Personajes: ${status?.characters ?? "-"}`
                  : status?.message || "Consultando API..."}
              </span>
            </div>
          </div>

          <div className="hero-banner__dots" aria-hidden="true">
            <span className="is-active"></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <section className="quick-actions">
          <a className="action-card action-card--dark" href="#download">
            <Download size={34} />
            <div>
              <h3>Client Download</h3>
              <p>Descarga el launcher y entra en minutos.</p>
            </div>
          </a>

          <a className="action-card action-card--orange" href="#register">
            <UserPlus size={34} />
            <div>
              <h3>Create Account</h3>
              <p>Registro inmediato conectado a la API del servidor.</p>
            </div>
          </a>

          <a className="action-card action-card--green" href="#ranking">
            <Trophy size={34} />
            <div>
              <h3>Ranking Board</h3>
              <p>Mira quienes lideran el mundo de LatinMS.</p>
            </div>
          </a>
        </section>

        <section className="promo-strip">
          {promoCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className={`promo-card promo-card--${card.tone}`}>
                <Icon size={30} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                </div>
                <span>{card.action}</span>
              </article>
            );
          })}
        </section>

        <section className="content-grid" id="news">
          <div className="board-grid">
            <article className="board-card">
              <div className="board-card__header board-card__header--orange">
                <Sparkles size={18} />
                <h3>Notice</h3>
              </div>
              <ul>
                <li>Guia de inicio rapido para nuevos aventureros</li>
                <li>Horario de eventos y bonus del fin de semana</li>
                <li>Requisitos del cliente y launcher actualizado</li>
                <li>Consulta el Discord para anuncios en tiempo real</li>
              </ul>
              <a href="#support">View more</a>
            </article>

            <article className="board-card">
              <div className="board-card__header board-card__header--green">
                <Bell size={18} />
                <h3>Update</h3>
              </div>
              <ul>
                <li>Balance visual renovado para home y accesos</li>
                <li>Panel de estado conectado a la API del backend</li>
                <li>Formulario de cuenta integrado en la portada</li>
                <li>Seccion de ranking con top real del servidor</li>
              </ul>
              <a href="#register">View more</a>
            </article>

            <article className="board-card">
              <div className="board-card__header board-card__header--blue">
                <Users size={18} />
                <h3>Community</h3>
              </div>
              <ul>
                <li>Canal para guilds, party quest y boss runs</li>
                <li>Zona de trading, soporte y feedback del launcher</li>
                <li>Noticias del staff y eventos con premios</li>
                <li>Invita a tus amigos y arma tu party inicial</li>
              </ul>
              <a href="#support">View more</a>
            </article>
          </div>

          <aside className="side-stack" id="support">
            <article className="support-card support-card--discord">
              <MessageSquare size={38} />
              <h3>Discord</h3>
              <p>Comparte guias, dudas y builds con la comunidad.</p>
            </article>

            <article className="support-card support-card--support">
              <Headset size={38} />
              <h3>Customer Support</h3>
              <p>FAQ, asistencia del staff y ayuda de cuenta.</p>
            </article>
          </aside>
        </section>

        <section className="utility-grid">
          <article className="panel panel--register" id="register">
            <div className="panel__title">
              <LockKeyhole size={22} />
              <div>
                <h3>Registro rapido</h3>
                <p>Crea tu cuenta y entra al juego sin salir de la portada.</p>
              </div>
            </div>

            <form className="register-form" onSubmit={handleRegister}>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Usuario"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contrasena"
              />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contrasena"
              />

              <button type="submit" disabled={loadingRegister}>
                {loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            {message ? <p className="form-feedback">{message}</p> : null}

            <div className="mini-info">
              <span>PIN inicial: 0000</span>
              <span>PIC inicial: 000000</span>
            </div>
          </article>

          <article className="panel panel--ranking" id="ranking">
            <div className="panel__title">
              <Trophy size={22} />
              <div>
                <h3>Top jugadores</h3>
                <p>Vista previa del ranking traido desde el backend.</p>
              </div>
            </div>

            {rankingPreview.length === 0 ? (
              <p className="empty-state">Todavia no hay datos de ranking disponibles.</p>
            ) : (
              <div className="ranking-list">
                {rankingPreview.map((player, index) => (
                  <div
                    key={player.id || player.name || index}
                    className="ranking-row"
                  >
                    <strong>#{index + 1}</strong>
                    <div>
                      <span>{player.name}</span>
                      <small>
                        Nivel {player.level} · {player.job}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="panel panel--download" id="download">
            <div className="panel__title">
              <Download size={22} />
              <div>
                <h3>Launcher y cliente</h3>
                <p>Deja listo aqui el enlace final cuando subas los archivos.</p>
              </div>
            </div>

            <a href="#" className="download-button">
              Descargar cliente
            </a>

            <div className="download-meta">
              <span>Version recomendada: MapleStory v83</span>
              <span>Estado: enlace pendiente</span>
            </div>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>LatinMS</strong>
          <p>Home redisenada con look de portal MMO clasico.</p>
        </div>

        <a href="#inicio">
          Volver arriba
          <ExternalLink size={16} />
        </a>
      </footer>
    </div>
  );
}

export default App;
