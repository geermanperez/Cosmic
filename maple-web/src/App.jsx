import { useEffect, useState } from "react";
import {
  ArrowRight,
  Download,
  Gamepad2,
  IdCard,
  KeyRound,
  LockKeyhole,
  Mail,
  Newspaper,
  ShieldCheck,
  Trophy,
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

const downloadUrl =
  "https://drive.google.com/file/d/1HuY39ItV9g0O1qM03L6aK7gQex23D98A/view?usp=sharing";

const topPlayersFallback = [
  { name: "Sin datos", level: "-", job: "Ranking pendiente" },
];

const jobNames = {
  0: "Principiante",
  100: "Guerrero",
  110: "Luchador",
  111: "Cruzado",
  112: "Heroe",
  120: "Paje",
  121: "Caballero blanco",
  122: "Paladin",
  130: "Lancero",
  131: "Dragon Knight",
  132: "Dark Knight",
  200: "Mago",
  210: "Mago fuego/veneno",
  211: "Hechicero fuego/veneno",
  212: "Archimago fuego/veneno",
  220: "Mago hielo/rayo",
  221: "Hechicero hielo/rayo",
  222: "Archimago hielo/rayo",
  230: "Clerigo",
  231: "Sacerdote",
  232: "Obispo",
  300: "Arquero",
  310: "Cazador",
  311: "Ranger",
  312: "Bowmaster",
  320: "Ballestero",
  321: "Sniper",
  322: "Marksman",
  400: "Ladron",
  410: "Asesino",
  411: "Hermit",
  412: "Night Lord",
  420: "Bandido",
  421: "Chief Bandit",
  422: "Shadower",
  500: "Pirata",
  510: "Brawler",
  511: "Marauder",
  512: "Buccaneer",
  520: "Gunslinger",
  521: "Outlaw",
  522: "Corsair",
  1000: "Noblesse",
  1100: "Dawn Warrior",
  1110: "Dawn Warrior",
  1111: "Dawn Warrior",
  1112: "Dawn Warrior",
  1200: "Blaze Wizard",
  1210: "Blaze Wizard",
  1211: "Blaze Wizard",
  1212: "Blaze Wizard",
  1300: "Wind Archer",
  1310: "Wind Archer",
  1311: "Wind Archer",
  1312: "Wind Archer",
  1400: "Night Walker",
  1410: "Night Walker",
  1411: "Night Walker",
  1412: "Night Walker",
  1500: "Thunder Breaker",
  1510: "Thunder Breaker",
  1511: "Thunder Breaker",
  1512: "Thunder Breaker",
  2000: "Leyenda",
  2100: "Aran",
  2110: "Aran",
  2111: "Aran",
  2112: "Aran",
};

function getJobName(job) {
  const jobId = Number(job);
  if (Number.isNaN(jobId)) return job || "Sin clase";
  if (jobNames[jobId]) return jobNames[jobId];
  if (jobId >= 100 && jobId < 200) return "Guerrero";
  if (jobId >= 200 && jobId < 300) return "Mago";
  if (jobId >= 300 && jobId < 400) return "Arquero";
  if (jobId >= 400 && jobId < 500) return "Ladron";
  if (jobId >= 500 && jobId < 600) return "Pirata";
  if (jobId >= 2100 && jobId < 2200) return "Aran";
  return "Sin clase";
}

const DEFAULT_CHARACTER_IMAGE = "/latinms.png";

function getCharacterImage(character) {
  if (!character || typeof character !== "object") {
    return DEFAULT_CHARACTER_IMAGE;
  }

  const skin = Number(character.skin ?? character.skincolor ?? 0);
  const hair = Number(character.hair);
  const face = Number(character.face);

  if (!Number.isFinite(hair) || !Number.isFinite(face) || hair <= 0 || face <= 0) {
    return DEFAULT_CHARACTER_IMAGE;
  }

  const renderSkin = Number.isFinite(skin) && skin > 0 ? skin : 0;

  if (renderSkin === 0) {
    return DEFAULT_CHARACTER_IMAGE;
  }

  return `https://maplestory.io/api/GMS/83/Character/${renderSkin}/${hair},${face}/stand1/0?resize=3`;
}

const countryCodes = [
  "AF",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BQ",
  "BA",
  "BW",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CD",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CW",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MK",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "BL",
  "SH",
  "KN",
  "LC",
  "MF",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SX",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VA",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW",
];

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
const countryOptions = countryCodes
  .map((code) => ({ code, name: regionNames.of(code) || code }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

const getViewFromHash = () => {
  const value = window.location.hash.replace("#", "");
  if (
    value === "news" ||
    value === "ranking" ||
    value === "download" ||
    value === "login" ||
    value === "register" ||
    value === "recover" ||
    value === "account"
  ) {
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
  const [recoverForm, setRecoverForm] = useState({ email: "" });
  const [recoverMessage, setRecoverMessage] = useState("");
  const [token, setToken] = useState(() => getToken());
  const [accountData, setAccountData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [accountTab, setAccountTab] = useState("account");
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

  function goToView(nextView) {
    window.location.hash = nextView === "home" ? "" : nextView;
  }

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

  const handleRecoverChange = (event) => {
    setRecoverForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRecover = (event) => {
    event.preventDefault();
    setRecoverMessage("");

    if (!recoverForm.email) {
      setRecoverMessage("Ingresa tu correo electrónico.");
      return;
    }

    setRecoverMessage("Si el correo existe, te contactaremos con los pasos para recuperar tu cuenta.");
    setRecoverForm({ email: "" });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage("");

    if (!loginForm.username || !loginForm.password) {
      setLoginMessage("Completa usuario y contraseña.");
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
      setRegisterMessage("Las contraseñas no coinciden.");
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

  async function loadAccount() {
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
  }

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
  const rankingRows = ranking.length > 0 ? ranking : topPlayersFallback;

  const serverOnline = status?.ok === true || status?.server === "online";
  const onlinePlayers =
    status?.onlinePlayers ??
    status?.playersOnline ??
    status?.online_players ??
    status?.onlineCount ??
    status?.players_online ??
    0;

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
            className={view === "news" ? "is-active" : ""}
            onClick={() => goToView("news")}
          >
            Noticias
          </button>
          <button
            type="button"
            className={view === "ranking" ? "is-active" : ""}
            onClick={() => goToView("ranking")}
          >
            Ranking
          </button>
          <button
            type="button"
            className={view === "download" ? "is-active" : ""}
            onClick={() => goToView("download")}
          >
            Descarga
          </button>
          <button
            type="button"
            className={view === "login" || view === "register" || view === "recover" || view === "account" ? "is-active" : ""}
            onClick={() => goToView("login")}
          >
            Login
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
                <Users size={20} />
                <strong>{serverOnline ? onlinePlayers : "-"}</strong>
                <span>Jugadores online</span>
              </article>

              <article className="metric-card">
                <ShieldCheck size={20} />
                <strong>4x EXP</strong>
                <span>2x Mesos - Drops Custom</span>
              </article>

              <article className="metric-card">
                <Gamepad2 size={20} />
                <strong>v83</strong>
                <span>Version del servidor</span>
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
                          <div className="ranking-avatar">
                            <img
                              src={getCharacterImage(player)}
                              alt={`Personaje ${player.name}`}
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = "/latinms.png";
                              }}
                            />
                          </div>
                          <div>
                            <span>{player.name}</span>
                            <small>
                              Nivel {player.level} - {getJobName(player.job)}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </>
            ) : null}

            {view === "news" ? (
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Noticias</span>
                    <h2>Ultimas novedades de LatinMS</h2>
                  </div>
                  <Newspaper size={24} />
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
              </section>
            ) : null}

            {view === "ranking" ? (
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Ranking</span>
                    <h2>Top jugadores del servidor</h2>
                  </div>
                  <Trophy size={24} />
                </div>

                <div className="ranking-list ranking-list--full">
                  {rankingRows.map((player, index) => (
                    <div
                      key={player.id || player.name || index}
                      className="ranking-row"
                    >
                      <strong>#{index + 1}</strong>
                      <div className="ranking-avatar">
                        <img
                          src={getCharacterImage(player)}
                          alt={`Personaje ${player.name}`}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/latinms.png";
                          }}
                        />
                      </div>
                      <div>
                        <span>{player.name}</span>
                        <small>
                          Nivel {player.level} - {getJobName(player.job)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {view === "download" ? (
              <section className="panel download-page">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Descarga</span>
                    <h2>Descarga el cliente de LatinMS</h2>
                  </div>
                  <Download size={24} />
                </div>

                <div className="download-layout">
                  <img src="/6.png" alt="" className="download-illustration" />
                  <div>
                    <p className="panel__intro">
                      Cliente listo para entrar al mundo de LatinMS. Descargalo, instalalo y usa tu cuenta para comenzar la aventura.
                    </p>
                    <a
                      className="button-primary"
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Descargar cliente
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </section>
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
                    Contraseña
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Tu contraseña"
                    />
                  </label>

                  <button type="button" className="text-button" onClick={() => goToView("recover")}>
                    ¿Olvidaste la contraseña?
                  </button>

                  <div className="auth-actions">
                    <button type="submit" className="button-primary">
                      Iniciar sesión
                    </button>
                    <button type="button" className="button-secondary" onClick={() => goToView("register")}>
                      Crear cuenta
                    </button>
                  </div>
                </form>

                {loginMessage ? <p className="feedback">{loginMessage}</p> : null}
              </section>
            ) : null}

            {view === "recover" ? (
              <section className="panel panel--form">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">Recuperar contraseña</span>
                    <h2>Recupera el acceso a tu cuenta</h2>
                  </div>
                  <Mail size={22} />
                </div>

                <p className="panel__intro">
                  Escribe el correo asociado a tu cuenta para iniciar la recuperación.
                </p>

                <form className="form-card" onSubmit={handleRecover}>
                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      name="email"
                      value={recoverForm.email}
                      onChange={handleRecoverChange}
                      placeholder="correo@ejemplo.com"
                    />
                  </label>

                  <div className="auth-actions">
                    <button type="submit" className="button-primary">
                      Recuperar contraseña
                    </button>
                    <button type="button" className="button-secondary" onClick={() => goToView("login")}>
                      Volver al login
                    </button>
                  </div>
                </form>

                {recoverMessage ? <p className="feedback">{recoverMessage}</p> : null}
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
                    <div className="account-menu" role="tablist" aria-label="Secciones de mi cuenta">
                      <button
                        type="button"
                        className={accountTab === "account" ? "is-active" : ""}
                        onClick={() => setAccountTab("account")}
                      >
                        <IdCard size={18} />
                        Cuenta
                      </button>
                      <button
                        type="button"
                        className={accountTab === "profile" ? "is-active" : ""}
                        onClick={() => setAccountTab("profile")}
                      >
                        <Users size={18} />
                        Perfil
                      </button>
                      <button
                        type="button"
                        className={accountTab === "security" ? "is-active" : ""}
                        onClick={() => setAccountTab("security")}
                      >
                        <KeyRound size={18} />
                        Seguridad
                      </button>
                      <button
                        type="button"
                        className={accountTab === "characters" ? "is-active" : ""}
                        onClick={() => setAccountTab("characters")}
                      >
                        <Gamepad2 size={18} />
                        Personajes
                      </button>
                    </div>

                    {accountTab === "account" ? (
                    <div className="panel__section account-summary">
                      <h3>Cuenta</h3>
                      <div className="summary-grid">
                        <div>
                          <span>Usuario</span>
                          <strong>{accountData?.name || "-"}</strong>
                        </div>
                        <div>
                          <span>Loggedin</span>
                          <strong>{accountData?.loggedin ?? "-"}</strong>
                        </div>
                        <div>
                          <span>Banned</span>
                          <strong>{accountData?.banned ?? "-"}</strong>
                        </div>
                      </div>
                      <button className="button-secondary" onClick={handleLogout}>Cerrar sesión</button>
                    </div>
                    ) : null}

                    {accountTab === "profile" ? (
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
                    ) : null}

                    {accountTab === "security" ? (
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
                    ) : null}

                    {accountTab === "characters" ? (
                    <div className="panel__section">
                      <h3>Personajes</h3>
                      {characters.length === 0 ? <p>No hay personajes.</p> : (
                        <div className="characters-list">
                          {characters.map((c) => (
                            <div key={c.id} className="character-row">
                              <div className="character-portrait">
                                <img
                                  src={getCharacterImage(c)}
                                  alt={`Personaje ${c.name}`}
                                  className="character-avatar"
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = "/latinms.png";
                                  }}
                                />
                              </div>
                              <div className="character-info">
                                <strong>{c.name}</strong>
                                <span>{getJobName(c.job)}</span>
                                <div className="character-stats">
                                  <small>Lvl {c.level}</small>
                                  <small>Fame {c.fame}</small>
                                  <small>Mesos {c.mesos}</small>
                                  <small>Map {c.map}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    ) : null}

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
                    Correo electrónico
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleRegisterChange}
                      placeholder="correo@ejemplo.com"
                    />
                  </label>
                  <label>
                    Contraseña
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleRegisterChange}
                      placeholder="Mínimo 4 caracteres"
                    />
                  </label>
                  <label>
                    Repetir contraseña
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Repite la contraseña"
                    />
                  </label>
                  <label>
                    País
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleRegisterChange}
                    >
                      <option value="">Selecciona tu pais</option>
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Fecha de cumpleaños
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
            {view !== "home" ? (
            <section className="panel panel--compact">
              <span className="panel__kicker">Accesos</span>
              <h2>Todo en orden</h2>
              <div className="sidebar-actions">
                <button type="button" className="button-secondary" onClick={() => goToView("home")}>
                  Ver inicio
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("news")}>
                  Ver noticias
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("ranking")}>
                  Ver ranking
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("download")}>
                  Descargar
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView("login")}>
                  Abrir login
                </button>
              </div>
            </section>
            ) : null}

            <section className="panel panel--compact panel--download">
              <span className="panel__kicker">Cliente</span>
              <h2>Descarga el juego</h2>
              <img src="/6.png" alt="" className="sidebar-illustration" />
              <p>
                Cliente disponible para que empieces tu aventura en LatinMS ahora mismo.
              </p>
              <a
                className="button-primary button-primary--full"
                href={downloadUrl}
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
