import { useEffect, useMemo, useState } from "react";
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

const downloadUrl =
  "https://drive.google.com/file/d/1DapJOw_aofBZY7acNgrEQjQraGGZ0SX2/view?usp=sharing";

const translations = {
  en: {
    nav: {
      aria: "Main navigation",
      home: "Home",
      news: "News",
      ranking: "Ranking",
      download: "Download",
      account: "My Account",
      login: "Sign in",
    },
    hero: {
      eyebrow: "A unique experience for the Latin community",
      title: "Play Maple in a classic, welcoming, truly unforgettable way.",
      copy:
        "LatinMS is built for Latin players and adventurers from anywhere in the world who want an active community, a special atmosphere, and an experience that feels unique from the first login.",
      start: "Start your adventure",
      enter: "Enter your account",
      online: "Server ONLINE",
      offline: "Server OFFLINE",
      playersOnline: "Players online",
      rates: "2x Mesos - 2x Drops - 5x Quests",
      version: "Server version",
    },
    home: {
      statusKicker: "World status",
      statusTitle: "Everything is ready for you to join the adventure",
      highlights: [
        [
          "/2.png",
          "Progress you can feel",
          "Level up, compete, and leave your mark on a live ranking visible to the whole community.",
        ],
        [
          "/3.png",
          "A community with identity",
          "A server made for Latin players, open to anyone in the world who wants to feel part of it.",
        ],
        [
          "/4.png",
          "Quick access to the game",
          "Create your account in minutes and begin your journey without extra steps.",
        ],
      ],
      newsTitle: "Why LatinMS feels different",
      topKicker: "Top players",
      topTitle: "The adventurers setting the pace",
    },
    newsItems: [
      [
        "/4.png",
        "LatinMS v1.0 is now available",
        "A new client version is ready. Download LatinMS v1.0 from the download section and update your game before entering the server.",
      ],
      [
        "/1.png",
        "A classic adventure with its own identity",
        "LatinMS blends nostalgia, progress, and community in a world designed to feel familiar and different at the same time.",
      ],
      [
        "/4.png",
        "Latin players, global connection",
        "We created a space for players from Latin America and anyone around the world who wants to enjoy Maple with a close community.",
      ],
      [
        "/2.png",
        "Fast start, living world",
        "Jump in, create your account, and explore a server where there are always goals, progress, and people to share the experience with.",
      ],
    ],
    pages: {
      newsTitle: "Latest LatinMS news",
      rankingTitle: "Top server players",
      downloadKicker: "Download",
      downloadTitle: "Download the LatinMS client",
      downloadCopy:
        "Client ready to enter the world of LatinMS. Download it, install it, and use your account to begin the adventure.",
      downloadClient: "Download client",
    },
    ranking: {
      level: "Level",
      guild: "Guild",
      origin: "Origin",
      characterAlt: "Character",
      noData: "No data",
      pending: "Ranking pending",
    },
    auth: {
      loginKicker: "Sign in",
      loginTitle: "Enter with your account",
      loginIntro:
        "This screen keeps account access separate from the main page. The actual character login happens inside the game client.",
      username: "Username",
      usernamePlaceholder: "Your account",
      password: "Password",
      passwordPlaceholder: "Your password",
      forgotPassword: "Forgot your password?",
      loginButton: "Sign in",
      createAccount: "Create account",
      recoverKicker: "Recover password",
      recoverTitle: "Recover access to your account",
      recoverIntro: "Enter the email associated with your account to start recovery.",
      email: "Email",
      emailPlaceholder: "email@example.com",
      recoverButton: "Recover password",
      backToLogin: "Back to sign in",
      registerKicker: "Create account",
      registerTitle: "Quick registration for LatinMS",
      registerIntro:
        "Form connected to the API so registration stays separate from the main cover page.",
      displayName: "Name",
      displayNamePlaceholder: "Your name",
      passwordMinPlaceholder: "Minimum 4 characters",
      repeatPassword: "Repeat password",
      repeatPasswordPlaceholder: "Repeat the password",
      country: "Country",
      countryPlaceholder: "Select your country",
      birthDate: "Birthday",
      creatingAccount: "Creating account...",
      initialPin: "Initial PIN: 0000",
      initialPic: "Initial PIC: 000000",
    },
    account: {
      kicker: "My Account",
      title: "Your account and profile data",
      needsLogin: "You need to sign in. You will be redirected to sign in.",
      tabsLabel: "My account sections",
      account: "Account",
      profile: "Profile",
      security: "Security",
      characters: "Characters",
      user: "User",
      logout: "Sign out",
      webProfile: "Web profile",
      displayName: "Display name",
      avatarUrl: "Avatar URL",
      bio: "Bio",
      saveProfile: "Save profile",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      repeatNew: "Repeat new password",
      noCharacters: "No characters.",
      administration: "Administration Panel",
      loadingStats: "Loading stats...",
      online: "Online",
      accounts: "Accounts",
      banned: "Banned",
      players: "Players",
      latestAccounts: "Latest accounts",
      latestCharacters: "Latest characters",
    },
    sidebar: {
      shortcuts: "Shortcuts",
      allSet: "All set",
      seeHome: "View home",
      seeNews: "View news",
      seeRanking: "View ranking",
      client: "Client",
      title: "Download the game",
      copy: "Client available so you can start your LatinMS adventure right now.",
      voteAlt: "Vote for us on GTop100",
    },
    messages: {
      serverError: "Could not connect to the server.",
      enterEmail: "Enter your email.",
      recoverySent:
        "If the email exists, we will contact you with the steps to recover your account.",
      loginRequired: "Complete username and password.",
      loginError: "Sign-in error",
      connectionError: "Connection error",
      requiredFields: "Complete all fields.",
      passwordMismatch: "Passwords do not match.",
      registerError: "Could not create the account.",
      registerSuccess: "Account created successfully. You can now enter the game.",
      apiConnectionError: "API connection error.",
      loadAccountError: "Error loading data",
      profileUpdated: "Profile updated",
      profileUpdateError: "Error updating profile",
      passwordUpdated: "Password updated",
      passwordUpdateError: "Error changing password",
    },
  },
  es: {
    nav: {
      aria: "Navegacion principal",
      home: "Inicio",
      news: "Noticias",
      ranking: "Ranking",
      download: "Descarga",
      account: "Mi Cuenta",
      login: "Iniciar sesion",
    },
    hero: {
      eyebrow: "Una experiencia unica para la comunidad latina",
      title: "Vive Maple de una forma clasica, cercana y realmente inolvidable.",
      copy:
        "LatinMS esta pensado para jugadores latinos y para aventureros de cualquier parte del mundo que buscan una comunidad activa, una atmosfera especial y una experiencia que se sienta unica desde el primer inicio de sesion.",
      start: "Comienza tu aventura",
      enter: "Entra con tu cuenta",
      online: "Servidor EN LINEA",
      offline: "Servidor FUERA DE LINEA",
      playersOnline: "Jugadores en linea",
      rates: "2x Mesos - 2x Drops - 5x Quests",
      version: "Version del servidor",
    },
    home: {
      statusKicker: "Estado del mundo",
      statusTitle: "Todo listo para sumarte a la aventura",
      highlights: [
        [
          "/2.png",
          "Progreso que se siente",
          "Sube de nivel, compite y deja tu marca en un ranking vivo y visible para toda la comunidad.",
        ],
        [
          "/3.png",
          "Comunidad con identidad",
          "Un servidor pensado para jugadores latinos, abierto a cualquier persona del mundo que quiera sentirse parte.",
        ],
        [
          "/4.png",
          "Acceso rapido al juego",
          "Crea tu cuenta en minutos y empieza tu recorrido sin vueltas ni pasos innecesarios.",
        ],
      ],
      newsTitle: "Por que LatinMS se siente diferente",
      topKicker: "Top de jugadores",
      topTitle: "Los aventureros que marcan el ritmo",
    },
    newsItems: [
      [
        "/4.png",
        "Nueva version LatinMS v1.0 disponible",
        "Ya esta listo el nuevo cliente. Descarga LatinMS v1.0 desde la seccion de descarga y actualiza tu juego antes de entrar al servidor.",
      ],
      [
        "/1.png",
        "Una aventura clasica con identidad propia",
        "LatinMS mezcla nostalgia, progreso y comunidad en un mundo pensado para sentirse familiar y a la vez distinto.",
      ],
      [
        "/4.png",
        "Jugadores latinos, conexion global",
        "Creamos un espacio para jugadores de Latinoamerica y para cualquier persona del mundo que quiera vivir Maple con una comunidad cercana.",
      ],
      [
        "/2.png",
        "Inicio rapido, mundo vivo",
        "Entra, crea tu cuenta y empieza a explorar un servidor donde siempre hay metas, progreso y gente con quien compartir la experiencia.",
      ],
    ],
    pages: {
      newsTitle: "Ultimas novedades de LatinMS",
      rankingTitle: "Top jugadores del servidor",
      downloadKicker: "Descarga",
      downloadTitle: "Descarga el cliente de LatinMS",
      downloadCopy:
        "Cliente listo para entrar al mundo de LatinMS. Descargalo, instalalo y usa tu cuenta para comenzar la aventura.",
      downloadClient: "Descargar cliente",
    },
    ranking: {
      level: "Nivel",
      guild: "Guild",
      origin: "Origen",
      characterAlt: "Personaje",
      noData: "Sin datos",
      pending: "Ranking pendiente",
    },
    auth: {
      loginKicker: "Inicio de sesion",
      loginTitle: "Entra con tu cuenta",
      loginIntro:
        "Esta pantalla mantiene el acceso separado de la pagina principal. El ingreso real al personaje se realiza dentro del cliente del juego.",
      username: "Usuario",
      usernamePlaceholder: "Tu cuenta",
      password: "Contrasena",
      passwordPlaceholder: "Tu contrasena",
      forgotPassword: "Olvidaste la contrasena?",
      loginButton: "Iniciar sesion",
      createAccount: "Crear cuenta",
      recoverKicker: "Recuperar contrasena",
      recoverTitle: "Recupera el acceso a tu cuenta",
      recoverIntro: "Escribe el correo asociado a tu cuenta para iniciar la recuperacion.",
      email: "Correo electronico",
      emailPlaceholder: "correo@ejemplo.com",
      recoverButton: "Recuperar contrasena",
      backToLogin: "Volver al inicio de sesion",
      registerKicker: "Crear cuenta",
      registerTitle: "Registro rapido para LatinMS",
      registerIntro:
        "Formulario conectado a la API para que el registro no quede mezclado con la portada principal.",
      displayName: "Nombre",
      displayNamePlaceholder: "Tu nombre",
      passwordMinPlaceholder: "Minimo 4 caracteres",
      repeatPassword: "Repetir contrasena",
      repeatPasswordPlaceholder: "Repite la contrasena",
      country: "Pais",
      countryPlaceholder: "Selecciona tu pais",
      birthDate: "Fecha de cumpleanos",
      creatingAccount: "Creando cuenta...",
      initialPin: "PIN inicial: 0000",
      initialPic: "PIC inicial: 000000",
    },
    account: {
      kicker: "Mi Cuenta",
      title: "Datos de tu cuenta y perfil",
      needsLogin: "Necesitas iniciar sesion. Seras redirigido al inicio de sesion.",
      tabsLabel: "Secciones de mi cuenta",
      account: "Cuenta",
      profile: "Perfil",
      security: "Seguridad",
      characters: "Personajes",
      user: "Usuario",
      logout: "Cerrar sesion",
      webProfile: "Perfil web",
      displayName: "Nombre visible",
      avatarUrl: "Avatar URL",
      bio: "Bio",
      saveProfile: "Guardar perfil",
      changePassword: "Cambiar contrasena",
      currentPassword: "Contrasena actual",
      newPassword: "Nueva contrasena",
      repeatNew: "Repetir nueva",
      noCharacters: "No hay personajes.",
      administration: "Panel de Administracion",
      loadingStats: "Cargando estadisticas...",
      online: "En linea",
      accounts: "Cuentas",
      banned: "Baneados",
      players: "Jugadores",
      latestAccounts: "Ultimas cuentas",
      latestCharacters: "Ultimos personajes",
    },
    sidebar: {
      shortcuts: "Accesos",
      allSet: "Todo en orden",
      seeHome: "Ver inicio",
      seeNews: "Ver noticias",
      seeRanking: "Ver ranking",
      client: "Cliente",
      title: "Descarga el juego",
      copy: "Cliente disponible para que empieces tu aventura en LatinMS ahora mismo.",
      voteAlt: "Votanos en GTop100",
    },
    messages: {
      serverError: "No se pudo conectar con el servidor.",
      enterEmail: "Ingresa tu correo electronico.",
      recoverySent:
        "Si el correo existe, te contactaremos con los pasos para recuperar tu cuenta.",
      loginRequired: "Completa usuario y contrasena.",
      loginError: "Error en el inicio de sesion",
      connectionError: "Error de conexion",
      requiredFields: "Completa todos los campos.",
      passwordMismatch: "Las contrasenas no coinciden.",
      registerError: "No se pudo crear la cuenta.",
      registerSuccess: "Cuenta creada correctamente. Ya puedes entrar al juego.",
      apiConnectionError: "Error de conexion con la API.",
      loadAccountError: "Error al cargar datos",
      profileUpdated: "Perfil actualizado",
      profileUpdateError: "Error al actualizar perfil",
      passwordUpdated: "Contrasena actualizada",
      passwordUpdateError: "Error al cambiar contrasena",
    },
  },
};

const jobNameKeys = {
  0: ["Beginner", "Principiante"],
  100: ["Warrior", "Guerrero"],
  110: ["Fighter", "Luchador"],
  111: ["Crusader", "Cruzado"],
  112: ["Hero", "Heroe"],
  120: ["Page", "Paje"],
  121: ["White Knight", "Caballero blanco"],
  122: ["Paladin", "Paladin"],
  130: ["Spearman", "Lancero"],
  131: ["Dragon Knight", "Dragon Knight"],
  132: ["Dark Knight", "Dark Knight"],
  200: ["Magician", "Mago"],
  210: ["Fire/Poison Wizard", "Mago fuego/veneno"],
  211: ["Fire/Poison Mage", "Hechicero fuego/veneno"],
  212: ["Fire/Poison Archmage", "Archimago fuego/veneno"],
  220: ["Ice/Lightning Wizard", "Mago hielo/rayo"],
  221: ["Ice/Lightning Mage", "Hechicero hielo/rayo"],
  222: ["Ice/Lightning Archmage", "Archimago hielo/rayo"],
  230: ["Cleric", "Clerigo"],
  231: ["Priest", "Sacerdote"],
  232: ["Bishop", "Obispo"],
  300: ["Archer", "Arquero"],
  310: ["Hunter", "Cazador"],
  311: ["Ranger", "Ranger"],
  312: ["Bowmaster", "Bowmaster"],
  320: ["Crossbowman", "Ballestero"],
  321: ["Sniper", "Sniper"],
  322: ["Marksman", "Marksman"],
  400: ["Thief", "Ladron"],
  410: ["Assassin", "Asesino"],
  411: ["Hermit", "Hermit"],
  412: ["Night Lord", "Night Lord"],
  420: ["Bandit", "Bandido"],
  421: ["Chief Bandit", "Chief Bandit"],
  422: ["Shadower", "Shadower"],
  500: ["Pirate", "Pirata"],
  510: ["Brawler", "Brawler"],
  511: ["Marauder", "Marauder"],
  512: ["Buccaneer", "Buccaneer"],
  520: ["Gunslinger", "Gunslinger"],
  521: ["Outlaw", "Outlaw"],
  522: ["Corsair", "Corsair"],
  1000: ["Noblesse", "Noblesse"],
  1100: ["Dawn Warrior", "Dawn Warrior"],
  1110: ["Dawn Warrior", "Dawn Warrior"],
  1111: ["Dawn Warrior", "Dawn Warrior"],
  1112: ["Dawn Warrior", "Dawn Warrior"],
  1200: ["Blaze Wizard", "Blaze Wizard"],
  1210: ["Blaze Wizard", "Blaze Wizard"],
  1211: ["Blaze Wizard", "Blaze Wizard"],
  1212: ["Blaze Wizard", "Blaze Wizard"],
  1300: ["Wind Archer", "Wind Archer"],
  1310: ["Wind Archer", "Wind Archer"],
  1311: ["Wind Archer", "Wind Archer"],
  1312: ["Wind Archer", "Wind Archer"],
  1400: ["Night Walker", "Night Walker"],
  1410: ["Night Walker", "Night Walker"],
  1411: ["Night Walker", "Night Walker"],
  1412: ["Night Walker", "Night Walker"],
  1500: ["Thunder Breaker", "Thunder Breaker"],
  1510: ["Thunder Breaker", "Thunder Breaker"],
  1511: ["Thunder Breaker", "Thunder Breaker"],
  1512: ["Thunder Breaker", "Thunder Breaker"],
  2000: ["Legend", "Leyenda"],
  2100: ["Aran", "Aran"],
  2110: ["Aran", "Aran"],
  2111: ["Aran", "Aran"],
  2112: ["Aran", "Aran"],
};

const fallbackCountryCodes = [
  "AR",
  "BO",
  "BR",
  "CA",
  "CL",
  "CO",
  "CR",
  "DO",
  "EC",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PY",
  "SV",
  "US",
  "UY",
  "VE",
];

const DEFAULT_CHARACTER_IMAGE = "/latinms.png";

const getViewFromHash = () => {
  const value = window.location.hash.replace("#", "");
  if (["news", "ranking", "download", "login", "register", "recover", "account"].includes(value)) {
    return value;
  }
  return "home";
};

function getInitialLanguage() {
  const saved = localStorage.getItem("latinms-language");
  return saved === "es" ? "es" : "en";
}

function getJobName(job, language) {
  const jobId = Number(job);
  const languageIndex = language === "es" ? 1 : 0;
  const noClass = language === "es" ? "Sin clase" : "No class";

  if (Number.isNaN(jobId)) return job || noClass;
  if (jobNameKeys[jobId]) return jobNameKeys[jobId][languageIndex];
  if (jobId >= 100 && jobId < 200) return language === "es" ? "Guerrero" : "Warrior";
  if (jobId >= 200 && jobId < 300) return language === "es" ? "Mago" : "Magician";
  if (jobId >= 300 && jobId < 400) return language === "es" ? "Arquero" : "Archer";
  if (jobId >= 400 && jobId < 500) return language === "es" ? "Ladron" : "Thief";
  if (jobId >= 500 && jobId < 600) return language === "es" ? "Pirata" : "Pirate";
  if (jobId >= 2100 && jobId < 2200) return "Aran";
  return noClass;
}

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
  if (renderSkin === 0) return DEFAULT_CHARACTER_IMAGE;

  return `https://maplestory.io/api/GMS/83/Character/${renderSkin}/${hair},${face}/stand1/0?resize=3`;
}

function RankingRows({ players, language, text }) {
  return players.map((player, index) => (
    <div key={player.id || player.name || index} className="ranking-row">
      <strong>#{index + 1}</strong>
      <div className="ranking-avatar">
        <img
          src={getCharacterImage(player)}
          alt={`${text.characterAlt} ${player.name}`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/latinms.png";
          }}
        />
      </div>
      <div>
        <span>{player.name}</span>
        <small>
          {text.level} {player.level} - {getJobName(player.job, language)}
        </small>
        {player.guild_name ? <small>{text.guild}: {player.guild_name}</small> : null}
        {player.country ? <small>{text.origin}: {player.country}</small> : null}
      </div>
    </div>
  ));
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const t = translations[language];
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
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginMessage, setLoginMessage] = useState("");
  const [recoverForm, setRecoverForm] = useState({ email: "" });
  const [recoverMessage, setRecoverMessage] = useState("");
  const [token, setToken] = useState(() => getToken());
  const [accountData, setAccountData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [accountTab, setAccountTab] = useState("account");
  const [profileForm, setProfileForm] = useState({ display_name: "", avatar_url: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [accountMessage, setAccountMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const countryOptions = useMemo(() => {
    const regionNames = new Intl.DisplayNames([language], { type: "region" });

    return fallbackCountryCodes
      .map((code) => ({ code, name: regionNames.of(code) || code }))
      .sort((a, b) => a.name.localeCompare(b.name, language));
  }, [language]);

  const topPlayersFallback = useMemo(
    () => [
      {
        name: t.ranking.noData,
        level: "-",
        job: t.ranking.pending,
        guild_name: null,
        country: null,
      },
    ],
    [t.ranking.noData, t.ranking.pending],
  );

  useEffect(() => {
    localStorage.setItem("latinms-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const syncView = () => setView(getViewFromHash());
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    if (token) {
      void loadAccount();
    }
    // Initial token validation should only run once when the app boots.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === "account") {
      if (!token) return goToView("login");
      void loadAccount();
    }
    // loadAccount reads the latest auth/profile state and should only rerun on route/token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, token]);

  useEffect(() => {
    const loadStatus = async () => {
      const url = `${API_URL}/status`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("[status] Error:", { url, error });
        setStatus({ ok: false, message: t.messages.serverError });
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

        setRanking(Array.isArray(data.ranking) ? data.ranking : []);
      } catch (error) {
        console.error(`Error loading ranking from ${url}`, error);
        setRanking([]);
      }
    };

    void loadStatus();
    void loadRanking();
  }, [t.messages.serverError]);

  function goToView(nextView) {
    window.location.hash = nextView === "home" ? "" : nextView;
  }

  const handleRegisterChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleLoginChange = (event) => {
    setLoginForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleRecoverChange = (event) => {
    setRecoverForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleRecover = (event) => {
    event.preventDefault();
    setRecoverMessage("");

    if (!recoverForm.email) {
      setRecoverMessage(t.messages.enterEmail);
      return;
    }

    setRecoverMessage(t.messages.recoverySent);
    setRecoverForm({ email: "" });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage("");

    if (!loginForm.username || !loginForm.password) {
      setLoginMessage(t.messages.loginRequired);
      return;
    }

    try {
      const data = await request("/login", {
        method: "POST",
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password }),
      });

      if (data?.token) {
        saveToken(data.token);
        setToken(data.token);
        setLoginForm({ username: "", password: "" });
        setLoginMessage("");
        goToView("account");
      } else {
        setLoginMessage(data.message || t.messages.loginError);
      }
    } catch (err) {
      setLoginMessage(err.body?.message || err.message || t.messages.connectionError);
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
      setRegisterMessage(t.messages.requiredFields);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setRegisterMessage(t.messages.passwordMismatch);
      return;
    }

    try {
      setLoadingRegister(true);

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setRegisterMessage(data.message || t.messages.registerError);
        return;
      }

      setRegisterMessage(t.messages.registerSuccess);
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
        current?.ok ? { ...current, accounts: Number(current.accounts || 0) + 1 } : current,
      );
    } catch {
      setRegisterMessage(t.messages.apiConnectionError);
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

      setLoadingAdmin(true);
      try {
        const adm = await request("/admin/stats");
        if (adm.ok) {
          setIsAdmin(true);
          setAdminStats(adm.stats);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setLoadingAdmin(false);
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        handleLogout();
        return;
      }
      setAccountMessage(err.body?.message || err.message || t.messages.loadAccountError);
    }
  }

  const handleLogout = () => {
    saveToken(null);
    setToken(null);
    setAccountData(null);
    setCharacters([]);
    goToView("home");
  };

  const handleProfileChange = (event) => {
    setProfileForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setAccountMessage("");
    try {
      const res = await request("/account/me/profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      setAccountMessage(res.message || t.messages.profileUpdated);
      setProfileForm({
        display_name: res.profile?.display_name || "",
        avatar_url: res.profile?.avatar_url || "",
        bio: res.profile?.bio || "",
      });
    } catch (err) {
      setAccountMessage(err.body?.message || err.message || t.messages.profileUpdateError);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setAccountMessage("");
    try {
      const res = await request("/account/me/change-password", {
        method: "POST",
        body: JSON.stringify(passwordForm),
      });
      setAccountMessage(res.message || t.messages.passwordUpdated);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setAccountMessage(err.body?.message || err.message || t.messages.passwordUpdateError);
    }
  };

  const rankingPreview = ranking.length > 0 ? ranking.slice(0, 5) : topPlayersFallback;
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
        <img src="/portada.png" alt="LatinMS cover" className="app-backdrop__image" />
      </div>

      <header className="topbar">
        <button type="button" className="brand" onClick={() => goToView("home")}>
          <img src="/latinms.png" alt="LatinMS" className="brand__logo" />
        </button>

        <div className="topbar__right">
          <div className="language-switcher" aria-label="Language selector">
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <span>|</span>
            <button
              type="button"
              className={language === "es" ? "is-active" : ""}
              onClick={() => setLanguage("es")}
            >
              ES
            </button>
          </div>

          <nav className="topbar__nav" aria-label={t.nav.aria}>
            <button type="button" className={view === "home" ? "is-active" : ""} onClick={() => goToView("home")}>
              {t.nav.home}
            </button>
            <button type="button" className={view === "news" ? "is-active" : ""} onClick={() => goToView("news")}>
              {t.nav.news}
            </button>
            <button type="button" className={view === "ranking" ? "is-active" : ""} onClick={() => goToView("ranking")}>
              {t.nav.ranking}
            </button>
            <button type="button" className={view === "download" ? "is-active" : ""} onClick={() => goToView("download")}>
              {t.nav.download}
            </button>
            <button
              type="button"
              className={["login", "register", "recover", "account"].includes(view) ? "is-active" : ""}
              onClick={() => goToView(token ? "account" : "login")}
            >
              {token ? t.nav.account : t.nav.login}
            </button>
          </nav>
        </div>
      </header>

      <main className="page">
        {view === "home" ? (
          <section className="hero-card">
            <div className="hero-card__copy">
              <span className="hero-card__eyebrow">{t.hero.eyebrow}</span>
              <h1>{t.hero.title}</h1>
              <p>{t.hero.copy}</p>

              <div className="hero-card__actions">
                <button type="button" className="button-primary" onClick={() => goToView("register")}>
                  {t.hero.start}
                  <ArrowRight size={18} />
                </button>
                <button type="button" className="button-secondary" onClick={() => goToView(token ? "account" : "login")}>
                  {token ? t.nav.account : t.hero.enter}
                </button>
              </div>
            </div>

            <div className="hero-card__status">
              <div className={`status-pill${serverOnline ? " is-online" : ""}`}>
                <span className="status-pill__dot"></span>
                {serverOnline ? t.hero.online : t.hero.offline}
              </div>

              <div className="metric-grid">
                <article className="metric-card">
                  <Users size={20} />
                  <strong>{serverOnline ? onlinePlayers : "-"}</strong>
                  <span>{t.hero.playersOnline}</span>
                </article>
                <article className="metric-card">
                  <ShieldCheck size={20} />
                  <strong>2x EXP</strong>
                  <span>{t.hero.rates}</span>
                </article>
                <article className="metric-card">
                  <Gamepad2 size={20} />
                  <strong>v83</strong>
                  <span>{t.hero.version}</span>
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
                      <span className="panel__kicker">{t.home.statusKicker}</span>
                      <h2>{t.home.statusTitle}</h2>
                    </div>
                    <div className={`server-badge${serverOnline ? " is-online" : ""}`}>
                      {serverOnline ? "ON" : "OFF"}
                    </div>
                  </div>

                  <div className="highlight-grid">
                    {t.home.highlights.map(([icon, title, copy]) => (
                      <article key={title} className="highlight-card">
                        <img src={icon} alt="" className="feature-icon" />
                        <h3>{title}</h3>
                        <p>{copy}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="split-grid">
                  <article className="panel">
                    <div className="panel__head">
                      <div>
                        <span className="panel__kicker">{t.nav.news}</span>
                        <h2>{t.home.newsTitle}</h2>
                      </div>
                      <img src="/1.png" alt="" className="panel-head-icon" />
                    </div>
                    <NewsList items={t.newsItems} />
                  </article>

                  <article className="panel">
                    <div className="panel__head">
                      <div>
                        <span className="panel__kicker">{t.home.topKicker}</span>
                        <h2>{t.home.topTitle}</h2>
                      </div>
                      <img src="/5.png" alt="" className="panel-head-icon" />
                    </div>
                    <div className="ranking-list">
                      <RankingRows players={rankingPreview} language={language} text={t.ranking} />
                    </div>
                  </article>
                </section>
              </>
            ) : null}

            {view === "news" ? (
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">{t.nav.news}</span>
                    <h2>{t.pages.newsTitle}</h2>
                  </div>
                  <Newspaper size={24} />
                </div>
                <NewsList items={t.newsItems} />
              </section>
            ) : null}

            {view === "ranking" ? (
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">{t.nav.ranking}</span>
                    <h2>{t.pages.rankingTitle}</h2>
                  </div>
                  <Trophy size={24} />
                </div>
                <div className="ranking-list ranking-list--full">
                  <RankingRows players={rankingRows} language={language} text={t.ranking} />
                </div>
              </section>
            ) : null}

            {view === "download" ? (
              <section className="panel download-page">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">{t.pages.downloadKicker}</span>
                    <h2>{t.pages.downloadTitle}</h2>
                  </div>
                  <Download size={24} />
                </div>
                <div className="download-layout">
                  <img src="/6.png" alt="" className="download-illustration" />
                  <div>
                    <p className="panel__intro">{t.pages.downloadCopy}</p>
                    <a className="button-primary" href={downloadUrl} target="_blank" rel="noreferrer">
                      {t.pages.downloadClient}
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
                    <span className="panel__kicker">{t.auth.loginKicker}</span>
                    <h2>{t.auth.loginTitle}</h2>
                  </div>
                  <LockKeyhole size={22} />
                </div>
                <p className="panel__intro">{t.auth.loginIntro}</p>
                <form className="form-card" onSubmit={handleLogin}>
                  <label>
                    {t.auth.username}
                    <input type="text" name="username" value={loginForm.username} onChange={handleLoginChange} placeholder={t.auth.usernamePlaceholder} />
                  </label>
                  <label>
                    {t.auth.password}
                    <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} placeholder={t.auth.passwordPlaceholder} />
                  </label>
                  <button type="button" className="text-button" onClick={() => goToView("recover")}>
                    {t.auth.forgotPassword}
                  </button>
                  <div className="auth-actions">
                    <button type="submit" className="button-primary">{t.auth.loginButton}</button>
                    <button type="button" className="button-secondary" onClick={() => goToView("register")}>{t.auth.createAccount}</button>
                  </div>
                </form>
                {loginMessage ? <p className="feedback">{loginMessage}</p> : null}
              </section>
            ) : null}

            {view === "recover" ? (
              <section className="panel panel--form">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">{t.auth.recoverKicker}</span>
                    <h2>{t.auth.recoverTitle}</h2>
                  </div>
                  <Mail size={22} />
                </div>
                <p className="panel__intro">{t.auth.recoverIntro}</p>
                <form className="form-card" onSubmit={handleRecover}>
                  <label>
                    {t.auth.email}
                    <input type="email" name="email" value={recoverForm.email} onChange={handleRecoverChange} placeholder={t.auth.emailPlaceholder} />
                  </label>
                  <div className="auth-actions">
                    <button type="submit" className="button-primary">{t.auth.recoverButton}</button>
                    <button type="button" className="button-secondary" onClick={() => goToView("login")}>{t.auth.backToLogin}</button>
                  </div>
                </form>
                {recoverMessage ? <p className="feedback">{recoverMessage}</p> : null}
              </section>
            ) : null}

            {view === "account" ? (
              <AccountPanel
                accountData={accountData}
                accountMessage={accountMessage}
                accountTab={accountTab}
                adminStats={adminStats}
                characters={characters}
                handleLogout={handleLogout}
                handlePasswordChange={handlePasswordChange}
                handleProfileChange={handleProfileChange}
                isAdmin={isAdmin}
                language={language}
                loadingAdmin={loadingAdmin}
                passwordForm={passwordForm}
                profileForm={profileForm}
                setAccountTab={setAccountTab}
                submitPassword={submitPassword}
                submitProfile={submitProfile}
                text={t.account}
                token={token}
              />
            ) : null}

            {view === "register" ? (
              <section className="panel panel--form">
                <div className="panel__head">
                  <div>
                    <span className="panel__kicker">{t.auth.registerKicker}</span>
                    <h2>{t.auth.registerTitle}</h2>
                  </div>
                  <UserPlus size={22} />
                </div>
                <p className="panel__intro">{t.auth.registerIntro}</p>
                <form className="form-card" onSubmit={handleRegister}>
                  <label>
                    {t.auth.username}
                    <input type="text" name="username" value={form.username} onChange={handleRegisterChange} placeholder="4 - 13 characters" />
                  </label>
                  <label>
                    {t.auth.displayName}
                    <input type="text" name="displayName" value={form.displayName} onChange={handleRegisterChange} placeholder={t.auth.displayNamePlaceholder} />
                  </label>
                  <label>
                    {t.auth.email}
                    <input type="email" name="email" value={form.email} onChange={handleRegisterChange} placeholder={t.auth.emailPlaceholder} />
                  </label>
                  <label>
                    {t.auth.password}
                    <input type="password" name="password" value={form.password} onChange={handleRegisterChange} placeholder={t.auth.passwordMinPlaceholder} />
                  </label>
                  <label>
                    {t.auth.repeatPassword}
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleRegisterChange} placeholder={t.auth.repeatPasswordPlaceholder} />
                  </label>
                  <label>
                    {t.auth.country}
                    <select name="country" value={form.country} onChange={handleRegisterChange}>
                      <option value="">{t.auth.countryPlaceholder}</option>
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.auth.birthDate}
                    <input type="date" name="birthDate" value={form.birthDate} onChange={handleRegisterChange} />
                  </label>
                  <button type="submit" className="button-primary button-primary--full" disabled={loadingRegister}>
                    {loadingRegister ? t.auth.creatingAccount : t.auth.createAccount}
                  </button>
                </form>
                {registerMessage ? <p className="feedback">{registerMessage}</p> : null}
                <div className="helper-note">
                  <span>{t.auth.initialPin}</span>
                  <span>{t.auth.initialPic}</span>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="sidebar">
            {view !== "home" ? (
              <section className="panel panel--compact">
                <span className="panel__kicker">{t.sidebar.shortcuts}</span>
                <h2>{t.sidebar.allSet}</h2>
                <div className="sidebar-actions">
                  <button type="button" className="button-secondary" onClick={() => goToView("home")}>{t.sidebar.seeHome}</button>
                  <button type="button" className="button-secondary" onClick={() => goToView("news")}>{t.sidebar.seeNews}</button>
                  <button type="button" className="button-secondary" onClick={() => goToView("ranking")}>{t.sidebar.seeRanking}</button>
                  <button type="button" className="button-secondary" onClick={() => goToView("download")}>{t.nav.download}</button>
                  <button type="button" className="button-secondary" onClick={() => goToView(token ? "account" : "login")}>
                    {token ? t.nav.account : t.nav.login}
                  </button>
                </div>
              </section>
            ) : null}

            {view === "home" ? (
              <a href="https://gtop100.com/MapleStory/server-106094" target="_blank" rel="noopener noreferrer" className="panel panel--compact panel--voting">
                <img src="/votanos.png" alt={t.sidebar.voteAlt} />
              </a>
            ) : null}

            <section className="panel panel--compact panel--download">
              <span className="panel__kicker">{t.sidebar.client}</span>
              <h2>{t.sidebar.title}</h2>
              <img src="/6.png" alt="" className="sidebar-illustration" />
              <p>{t.sidebar.copy}</p>
              <a className="button-primary button-primary--full" href={downloadUrl} target="_blank" rel="noreferrer">
                {t.pages.downloadClient}
                <ArrowRight size={18} />
              </a>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

function NewsList({ items }) {
  return (
    <div className="news-list">
      {items.map(([icon, title, copy]) => (
        <article key={title} className="news-card">
          <div className="news-card__head">
            <img src={icon} alt="" className="news-card__icon" />
            <h3>{title}</h3>
          </div>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}

function AccountPanel({
  accountData,
  accountMessage,
  accountTab,
  adminStats,
  characters,
  handleLogout,
  handlePasswordChange,
  handleProfileChange,
  isAdmin,
  language,
  loadingAdmin,
  passwordForm,
  profileForm,
  setAccountTab,
  submitPassword,
  submitProfile,
  text,
  token,
}) {
  return (
    <section className="panel">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">{text.kicker}</span>
          <h2>{text.title}</h2>
        </div>
      </div>

      {!token ? (
        <p>{text.needsLogin}</p>
      ) : (
        <>
          <div className="account-menu" role="tablist" aria-label={text.tabsLabel}>
            <button type="button" className={accountTab === "account" ? "is-active" : ""} onClick={() => setAccountTab("account")}>
              <IdCard size={18} />
              {text.account}
            </button>
            <button type="button" className={accountTab === "profile" ? "is-active" : ""} onClick={() => setAccountTab("profile")}>
              <Users size={18} />
              {text.profile}
            </button>
            <button type="button" className={accountTab === "security" ? "is-active" : ""} onClick={() => setAccountTab("security")}>
              <KeyRound size={18} />
              {text.security}
            </button>
            <button type="button" className={accountTab === "characters" ? "is-active" : ""} onClick={() => setAccountTab("characters")}>
              <Gamepad2 size={18} />
              {text.characters}
            </button>
            {isAdmin ? (
              <button type="button" className={accountTab === "admin" ? "is-active" : ""} onClick={() => setAccountTab("admin")}>
                <ShieldCheck size={18} />
                Admin
              </button>
            ) : null}
          </div>

          {accountTab === "account" ? (
            <div className="panel__section account-summary">
              <h3>{text.account}</h3>
              <div className="summary-grid">
                <div>
                  <span>{text.user}</span>
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
              <button className="button-secondary" onClick={handleLogout}>{text.logout}</button>
            </div>
          ) : null}

          {accountTab === "profile" ? (
            <div className="panel__section">
              <h3>{text.webProfile}</h3>
              <form className="form-card" onSubmit={submitProfile}>
                <label>
                  {text.displayName}
                  <input name="display_name" value={profileForm.display_name} onChange={handleProfileChange} />
                </label>
                <label>
                  {text.avatarUrl}
                  <input name="avatar_url" value={profileForm.avatar_url} onChange={handleProfileChange} />
                </label>
                <label>
                  {text.bio}
                  <input name="bio" value={profileForm.bio} onChange={handleProfileChange} />
                </label>
                <button type="submit" className="button-primary">{text.saveProfile}</button>
              </form>
            </div>
          ) : null}

          {accountTab === "security" ? (
            <div className="panel__section">
              <h3>{text.changePassword}</h3>
              <form className="form-card" onSubmit={submitPassword}>
                <label>
                  {text.currentPassword}
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                </label>
                <label>
                  {text.newPassword}
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                </label>
                <label>
                  {text.repeatNew}
                  <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                </label>
                <button type="submit" className="button-primary">{text.changePassword}</button>
              </form>
            </div>
          ) : null}

          {accountTab === "characters" ? (
            <div className="panel__section">
              <h3>{text.characters}</h3>
              {characters.length === 0 ? <p>{text.noCharacters}</p> : (
                <div className="characters-list">
                  {characters.map((character) => (
                    <div key={character.id} className="character-row">
                      <div className="character-portrait">
                        <img
                          src={getCharacterImage(character)}
                          alt={`${text.characters} ${character.name}`}
                          className="character-avatar"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/latinms.png";
                          }}
                        />
                      </div>
                      <div className="character-info">
                        <strong>{character.name}</strong>
                        <span>{getJobName(character.job, language)}</span>
                        <div className="character-stats">
                          <small>Lvl {character.level}</small>
                          <small>Fame {character.fame}</small>
                          <small>Mesos {character.mesos}</small>
                          <small>Map {character.map}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {accountTab === "admin" ? (
            <div className="panel__section">
              <h3>{text.administration}</h3>
              {loadingAdmin && !adminStats ? <p>{text.loadingStats}</p> : adminStats && (
                <>
                  <div className="summary-grid">
                    <article className="metric-card">
                      <strong>{adminStats.onlineUsers}</strong>
                      <span>{text.online}</span>
                    </article>
                    <article className="metric-card">
                      <strong>{adminStats.totalAccounts}</strong>
                      <span>{text.accounts}</span>
                    </article>
                    <article className="metric-card">
                      <strong>{adminStats.totalCharacters}</strong>
                      <span>{text.characters}</span>
                    </article>
                    <article className="metric-card">
                      <strong>{adminStats.bannedAccounts}</strong>
                      <span>{text.banned}</span>
                    </article>
                    <article className="metric-card">
                      <strong>{adminStats.gmCharacters}</strong>
                      <span>GMs</span>
                    </article>
                    <article className="metric-card">
                      <strong>{adminStats.normalCharacters}</strong>
                      <span>{text.players}</span>
                    </article>
                  </div>
                  <div className="split-grid admin-split">
                    <div className="admin-list-container">
                      <h4>{text.latestAccounts}</h4>
                      <div className="ranking-list">
                        {adminStats.latestAccounts.map((account) => (
                          <div key={account.id} className="ranking-row ranking-row--compact">
                            <span>ID: {account.id} - <strong>{account.name}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="admin-list-container">
                      <h4>{text.latestCharacters}</h4>
                      <div className="ranking-list">
                        {adminStats.latestCharacters.map((character) => (
                          <div key={character.id} className="ranking-row ranking-row--compact">
                            <span><strong>{character.name}</strong> (Lvl {character.level}) - {getJobName(character.job, language)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {accountMessage ? <p className="feedback">{accountMessage}</p> : null}
        </>
      )}
    </section>
  );
}

export default App;
