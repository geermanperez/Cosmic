import { useEffect, useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import "./App.css";

import { API_URL, getToken, saveToken, request } from "./apiClient";

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
  if (value === "login" || value === "register" || value === "account") {
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
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    birthDate: "",
  });
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginMessage, setLoginMessage] = useState("");
  const [token, setToken] = useState(() => getToken());
  const [accountData, setAccountData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [profileForm, setProfileForm] = useState({ display_name: "", avatar_url: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [accountMessage, setAccountMessage] = useState("");

  useEffect(() => {
    const syncView = () => setView(getViewFromHash());

    window.addEventListener("hashchange", syncView);

    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    if (view === "account") {
      if (!token) return goToView("login");
      void loadAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, token]);

  useEffect(() => {
    const loadStatus = async () => {
      const url = `${API_URL}/status`;
      try {
        console.log("[status] URL consultada:", url);
        const res = await fetch(url);
        const data = await res.json();
        console.log("[status] Respuesta recibida:", data);
        setStatus(data);
      } catch (error) {
        console.error("[status] Error capturado:", { url, error });
        setStatus({
          ok: false,
          message: "No se pudo conectar con el servidor.",
        });
      }
    };

    const loadRanking = async () => {
      const url = `${API_URL}/ranking`;
      try {
        const res = await fetch(url);
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
      } catch (error) {
        console.error(`Error loading ranking from ${url}`, error);
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

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage("");

    if (!loginForm.username || !loginForm.password) {
      setLoginMessage("Completa usuario y contrasena.");
      return;
    }

    try {
      const data = await request("/login", { method: "POST", body: JSON.stringify({ username: loginForm.username, password: loginForm.password }) });
      if (data?.token) {
        saveToken(data.token);
        setToken(data.token);
        setLoginForm({ username: "", password: "" });
        setLoginMessage("");
        goToView("account");
      } else {
        setLoginMessage(data.message || "Error en login");
      }
    } catch (err) {
      setLoginMessage(err.body?.message || err.message || "Error al conectar");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterMessage("");

    if (
      !form.username ||
      !form.displayName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.country ||
      !form.birthDate
    ) {
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
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        birthDate: "",
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

  const loadAccount = async () => {
    setAccountMessage("");
    try {
      const acc = await request("/account/me");
      setAccountData(acc.account || null);
      setProfileForm({
        display_name: acc.profile?.display_name || "",
        avatar_url: acc.profile?.avatar_url || "",
        bio: acc.profile?.bio || "",
      });

      const chars = await request("/account/me/characters");
      setCharacters(chars.characters || []);
    } catch (err) {
      setAccountMessage(err.body?.message || err.message || "Error al cargar datos");
    }
  };

  const handleLogout = () => {
    saveToken(null);
    setToken(null);
    setAccountData(null);
    setCharacters([]);
    goToView("home");
  };

  const handleProfileChange = (e) => setProfileForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const submitProfile = async (e) => {
    e.preventDefault();
    setAccountMessage("");
    try {
      const res = await request("/account/me/profile", { method: "PUT", body: JSON.stringify(profileForm) });
      setAccountMessage(res.message || "Perfil actualizado");
      setProfileForm({ display_name: res.profile?.display_name || "", avatar_url: res.profile?.avatar_url || "", bio: res.profile?.bio || "" });
    } catch (err) {
      setAccountMessage(err.body?.message || err.message || "Error al actualizar perfil");
    }
  };

  const handlePasswordChange = (e) => setPasswordForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const submitPassword = async (e) => {
    e.preventDefault();
    setAccountMessage("");
    try {
      const res = await request("/account/me/change-password", { method: "POST", body: JSON.stringify(passwordForm) });
      setAccountMessage(res.message || "Contraseña actualizada");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setAccountMessage(err.body?.message || err.message || "Error al cambiar contraseña");
    }
  };

  const rankingPreview =
    ranking.length > 0 ? ranking.slice(0, 5) : topPlayersFallback;

  const serverOnline = status?.ok === true || status?.server === "online";
  const accountsCreated = status?.accounts ?? "-";
  const charactersCreated = status?.characters ?? "-";

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
            className={view === "account" ? "is-active" : ""}
            onClick={() => goToView("account")}
          >
            Mi Cuenta
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
        {view === "home" ? (
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
                <strong>{serverOnline ? charactersCreated : "-"}</strong>
                <span>Jugadores creados</span>
              </article>

              <article className="metric-card">
                <UserPlus size={20} />
                <strong>{serverOnline ? accountsCreated : "-"}</strong>
                <span>Cuentas creadas</span>
              </article>
            </div>
          </div>
        </section>
        ) : null}

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

                  <div className="auth-actions">
                    <button type="submit" className="button-primary">
                      Iniciar sesion
                    </button>
                    <button type="button" className="button-secondary" onClick={() => goToView("register")}>
                      Crear cuenta
                    </button>
                  </div>
                </form>

                {loginMessage ? <p className="feedback">{loginMessage}</p> : null}
              </section>
            ) : null}

            {view === "account" ? (
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Mi Cuenta</span>
                    <h2>Datos de tu cuenta y perfil</h2>
                  </div>
                </div>

                {!token ? (
                  <p>Necesitas iniciar sesión. Serás redirigido al login.</p>
                ) : (
                  <>
                    <div className="panel__section">
                      <h3>Cuenta</h3>
                      <p>Usuario: {accountData?.name}</p>
                      <p>Loggedin: {accountData?.loggedin}</p>
                      <p>Banned: {accountData?.banned}</p>
                      <button className="button-secondary" onClick={handleLogout}>Cerrar sesión</button>
                    </div>

                    <div className="panel__section">
                      <h3>Perfil web</h3>
                      <form className="form-card" onSubmit={submitProfile}>
                        <label>
                          Nombre visible
                          <input name="display_name" value={profileForm.display_name} onChange={handleProfileChange} />
                        </label>
                        <label>
                          Avatar URL
                          <input name="avatar_url" value={profileForm.avatar_url} onChange={handleProfileChange} />
                        </label>
                        <label>
                          Bio
                          <input name="bio" value={profileForm.bio} onChange={handleProfileChange} />
                        </label>
                        <button type="submit" className="button-primary">Guardar perfil</button>
                      </form>
                    </div>

                    <div className="panel__section">
                      <h3>Cambiar contraseña</h3>
                      <form className="form-card" onSubmit={submitPassword}>
                        <label>
                          Contraseña actual
                          <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                        </label>
                        <label>
                          Nueva contraseña
                          <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                        </label>
                        <label>
                          Repetir nueva
                          <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                        </label>
                        <button type="submit" className="button-primary">Cambiar contraseña</button>
                      </form>
                    </div>

                    <div className="panel__section">
                      <h3>Personajes</h3>
                      {characters.length === 0 ? <p>No hay personajes.</p> : (
                        <div className="characters-list">
                          {characters.map((c) => (
                            <div key={c.id} className="character-row">
                              <img src={profileForm.avatar_url || "/latinms.png"} alt="avatar" className="character-avatar" />
                              <div>
                                <strong>{c.name}</strong>
                                <div>Lvl {c.level} · {c.job}</div>
                                <div>Fame {c.fame} · Mesos {c.mesos}</div>
                                <div>Map: {c.map}</div>
                                <div>Gender: {c.gender} · Skin: {c.skin} · Face: {c.face} · Hair: {c.hair}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {accountMessage ? <p className="feedback">{accountMessage}</p> : null}
                  </>
                )}
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
                    Nombre
                    <input
                      type="text"
                      name="displayName"
                      value={form.displayName}
                      onChange={handleRegisterChange}
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label>
                    Correo electronico
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleRegisterChange}
                      placeholder="correo@ejemplo.com"
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
                  <label>
                    Pais
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleRegisterChange}
                      placeholder="Tu pais"
                    />
                  </label>
                  <label>
                    Fecha de cumpleanos
                    <input
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleRegisterChange}
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
              <h2>Descarga el juego</h2>
              <img src="/6.png" alt="" className="sidebar-illustration" />
              <p>
                Cliente disponible para que empieces tu aventura en LatinMS ahora mismo.
              </p>
              <a
                className="button-primary button-primary--full"
                href="https://drive.google.com/file/d/1HuY39ItV9g0O1qM03L6aK7gQex23D98A/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Descargar cliente
                <ArrowRight size={18} />
              </a>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
