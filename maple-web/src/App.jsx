import { useEffect, useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://apims.redly.com.ar";

const newsItems = [
  {
    title: "Una aventura clasica con identidad propia",
    copy:
      "LatinMS mezcla nostalgia, progreso y comunidad en un mundo pensado para sentirse familiar y a la vez distinto.",
    icon: "/1.png",
  },
  {
    title: "Jugadores latinos, conexion global",
    copy:
      "Creamos un espacio para jugadores de Latinoamerica y para cualquier persona del mundo que quiera vivir Maple con una comunidad cercana.",
    icon: "/4.png",
  },
  {
    title: "Inicio rapido, mundo vivo",
    copy:
      "Entra, crea tu cuenta y empieza a explorar un servidor donde siempre hay metas, progreso y gente con quien compartir la experiencia.",
    icon: "/2.png",
  },
];

const serverRates = [
  { value: "4x", label: "EXP" },
  { value: "2x", label: "Mesos" },
  { value: "Custom", label: "Drops" },
  { value: "5x", label: "Quests" },
  { value: "v83", label: "Version" },
];

const topPlayersFallback = [
  { name: "Sin datos", level: "-", job: "Ranking pendiente" },
];

const getViewFromHash = () => {
  const value = window.location.hash.replace("#", "");

  if (value === "login" || value === "register") {
    return value;
  }

  return "home";
};

function App() {
  const [view, setView] = useState(getViewFromHash);
  const [status, setStatus] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    const syncView = () => setView(getViewFromHash());

    window.addEventListener("hashchange", syncView);

    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
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
          return;
        }

        if (Array.isArray(data.ranking)) {
          setRanking(data.ranking);
          return;
        }

        setRanking([]);
      } catch {
        setRanking([]);
      }
    };

    void loadStatus();
    void loadRanking();
  }, []);

  const goToView = (nextView) => {
    window.location.hash = nextView === "home" ? "" : nextView;
  };

  const handleRegisterChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLoginChange = (event) => {
    setLoginForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterMessage("");

    if (!form.username || !form.password || !form.confirmPassword) {
      setRegisterMessage("Completa todos los campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setRegisterMessage("Las contrasenas no coinciden.");
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
        setRegisterMessage(data.message || "No se pudo crear la cuenta.");
        return;
      }

      setRegisterMessage("Cuenta creada correctamente. Ya puedes entrar al juego.");
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
      });

      setStatus((current) =>
        current?.ok
          ? {
              ...current,
              accounts: Number(current.accounts || 0) + 1,
            }
          : current,
      );
    } catch {
      setRegisterMessage("Error de conexion con la API.");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      setLoginMessage("Completa usuario y contrasena.");
      return;
    }

    setLoginMessage(
      "El acceso al juego se hace dentro del cliente. Usa estos mismos datos cuando abras LatinMS.",
    );
  };

  const rankingPreview =
    ranking.length > 0 ? ranking.slice(0, 5) : topPlayersFallback;

  const serverOnline = Boolean(status?.ok);

  return (
    <div className="app-shell">
      <div className="app-backdrop">
        <img src="/portada.png" alt="Portada de LatinMS" className="app-backdrop__image" />
      </div>

      <header className="topbar">
        <button type="button" className="brand" onClick={() => goToView("home")}>
          <img src="/latinms.png" alt="LatinMS" className="brand__logo" />
        </button>

        <nav className="topbar__nav" aria-label="Navegacion principal">
          <button
            type="button"
            className={view === "home" ? "is-active" : ""}
            onClick={() => goToView("home")}
          >
            Inicio
          </button>
          <button
            type="button"
            className={view === "login" ? "is-active" : ""}
            onClick={() => goToView("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={view === "register" ? "is-active" : ""}
            onClick={() => goToView("register")}
          >
            Crear cuenta
          </button>
        </nav>
      </header>

      <main className="page">
        <section className="hero-card">
          <div className="hero-card__copy">
            <span className="hero-card__eyebrow">Una experiencia unica para la comunidad latina</span>
            <h1>Vive Maple de una forma clasica, cercana y realmente inolvidable.</h1>
            <p>
              LatinMS fue pensado para jugadores latinos y para aventureros de
              cualquier parte del mundo que buscan una comunidad activa, una
              atmosfera especial y una experiencia que se sienta unica desde el
              primer login.
            </p>

            <div className="hero-card__actions">
              <button type="button" className="button-primary" onClick={() => goToView("register")}>
                Comienza tu aventura
                <ArrowRight size={18} />
              </button>
              <button type="button" className="button-secondary" onClick={() => goToView("login")}>
                Entra con tu cuenta
              </button>
            </div>
          </div>

          <div className="hero-card__status">
            <div className={`status-pill${serverOnline ? " is-online" : ""}`}>
              <span className="status-pill__dot"></span>
              {serverOnline ? "Servidor ON" : "Servidor OFF"}
            </div>

            <div className="metric-grid">
              <article className="metric-card">
                <ShieldCheck size={20} />
                <strong>{serverOnline ? "Online" : "Offline"}</strong>
                <span>{serverOnline ? "Conexion OK" : status?.message || "Sin respuesta"}</span>
              </article>

              <article className="metric-card">
                <Users size={20} />
                <strong>{serverOnline ? status?.characters ?? "-" : "-"}</strong>
                <span>Jugadores creados</span>
              </article>

              <article className="metric-card">
                <UserPlus size={20} />
                <strong>{serverOnline ? status?.accounts ?? "-" : "-"}</strong>
                <span>Cuentas creadas</span>
              </article>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="content-main">
            {view === "home" ? (
              <>
                <section className="panel">
                  <div className="panel__head">
                    <div>
                      <span className="panel__kicker">Datos del servidor</span>
                      <h2>Lo que hace especial a LatinMS desde el primer minuto</h2>
                    </div>
                    <img src="/7.png" alt="" className="panel-head-icon" />
                  </div>

                  <div className="rates-grid">
                    {serverRates.map((rate) => (
                      <article key={rate.label} className="rate-card">
                        <strong>{rate.value}</strong>
                        <span>{rate.label}</span>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel__head">
                    <div>
                      <span className="panel__kicker">Estado del mundo</span>
                      <h2>Todo listo para sumarte a la aventura</h2>
                    </div>
                    <div className={`server-badge${serverOnline ? " is-online" : ""}`}>
                      {serverOnline ? "ON" : "OFF"}
                    </div>
                  </div>

                    <div className="highlight-grid">
                      <article className="highlight-card">
                        <img src="/2.png" alt="" className="feature-icon" />
                        <h3>Progreso que se siente</h3>
                        <p>Sube de nivel, compite y deja tu marca en un ranking vivo y visible para toda la comunidad.</p>
                      </article>
                      <article className="highlight-card">
                        <img src="/3.png" alt="" className="feature-icon" />
                        <h3>Comunidad con identidad</h3>
                        <p>Un servidor pensado para jugadores latinos, abierto a cualquier persona del mundo que quiera sentirse parte.</p>
                      </article>
                      <article className="highlight-card">
                        <img src="/4.png" alt="" className="feature-icon" />
                        <h3>Acceso rapido al juego</h3>
                        <p>Crea tu cuenta en minutos y empieza tu recorrido sin vueltas ni pasos innecesarios.</p>
                      </article>
                    </div>
                </section>

                <section className="split-grid">
                  <article className="panel">
                    <div className="panel__head">
                      <div>
                        <span className="panel__kicker">Noticias</span>
                        <h2>Por que LatinMS se siente diferente</h2>
                      </div>
                      <img src="/1.png" alt="" className="panel-head-icon" />
                    </div>

                    <div className="news-list">
                      {newsItems.map((item) => (
                        <article key={item.title} className="news-card">
                          <div className="news-card__head">
                            <img src={item.icon} alt="" className="news-card__icon" />
                            <h3>{item.title}</h3>
                          </div>
                          <p>{item.copy}</p>
                        </article>
                      ))}
                    </div>
                  </article>

                  <article className="panel">
                    <div className="panel__head">
                      <div>
                        <span className="panel__kicker">Top jugadores</span>
                        <h2>Los aventureros que marcan el ritmo</h2>
                      </div>
                      <img src="/5.png" alt="" className="panel-head-icon" />
                    </div>

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
                  </article>
                </section>
              </>
            ) : null}

            {view === "login" ? (
              <section className="panel panel--form">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Login</span>
                    <h2>Entra con tu cuenta</h2>
                  </div>
                  <LockKeyhole size={22} />
                </div>

                <p className="panel__intro">
                  Esta pantalla deja el acceso separado del home. El ingreso real
                  al personaje se hace dentro del cliente del juego.
                </p>

                <form className="form-card" onSubmit={handleLogin}>
                  <label>
                    Usuario
                    <input
                      type="text"
                      name="username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      placeholder="Tu cuenta"
                    />
                  </label>
                  <label>
                    Contrasena
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Tu contrasena"
                    />
                  </label>

                  <button type="submit" className="button-primary button-primary--full">
                    Recordar datos de acceso
                  </button>
                </form>

                {loginMessage ? <p className="feedback">{loginMessage}</p> : null}
              </section>
            ) : null}

            {view === "register" ? (
              <section className="panel panel--form">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Crear cuenta</span>
                    <h2>Registro rapido para LatinMS</h2>
                  </div>
                  <UserPlus size={22} />
                </div>

                <p className="panel__intro">
                  Formulario conectado a la API para que el alta no quede mezclada
                  con la portada principal.
                </p>

                <form className="form-card" onSubmit={handleRegister}>
                  <label>
                    Usuario
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleRegisterChange}
                      placeholder="Entre 4 y 13 caracteres"
                    />
                  </label>
                  <label>
                    Contrasena
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleRegisterChange}
                      placeholder="Minimo 4 caracteres"
                    />
                  </label>
                  <label>
                    Repetir contrasena
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Repite la contrasena"
                    />
                  </label>

                  <button
                    type="submit"
                    className="button-primary button-primary--full"
                    disabled={loadingRegister}
                  >
                    {loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
                  </button>
                </form>

                {registerMessage ? <p className="feedback">{registerMessage}</p> : null}

                <div className="helper-note">
                  <span>PIN inicial: 0000</span>
                  <span>PIC inicial: 000000</span>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="sidebar">
            <section className="panel panel--compact">
              <span className="panel__kicker">Accesos</span>
              <h2>Todo en orden</h2>
              <div className="sidebar-actions">
                <button type="button" className="button-secondary" onClick={() => goToView("home")}>
                  Ver inicio
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("login")}>
                  Abrir login
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("register")}>
                  Crear cuenta
                </button>
              </div>
            </section>

            <section className="panel panel--compact panel--download">
              <span className="panel__kicker">Cliente</span>
              <h2>Descarga proxima</h2>
              <img src="/6.png" alt="" className="sidebar-illustration" />
              <p>
                Este bloque queda listo para conectar el launcher o el link final
                del cliente cuando lo subas.
              </p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
