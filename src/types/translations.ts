export type Language = "en" | "es" | "it" | "ar" | "de";

export interface Translations {
  // App title and header
  appTitle: string;
  subtitle: string;

  // Auth form
  welcomeMessage: string;
  signInPrompt: string;
  createAccountPrompt: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signIn: string;
  signingIn: string;
  createAccount: string;
  creatingAccount: string;
  needAccount: string;
  haveAccount: string;

  // User info
  signedInAs: string;
  signOut: string;

  // Status card
  nextWeeksGame: string;
  signupsOpen: string;
  signupsClosed: string;
  signupsOpenMessage: string;
  signupsClosedMessage: string;
  playing: string;
  reserve: string;
  spotsLeft: string;

  // Signup buttons
  removeMySignup: string;
  signMeUp: string;
  joinReserveList: string;

  // Player lists
  startingXI: string;
  reserveList: string;
  noPlayersYet: string;
  beTheFirstToSignUp: string;
  noReservesYet: string;
  noOneWaitingYet: string;
  you: string;
  signedUpAt: string;

  // Rules
  gameRules: string;
  signupWindow: string;
  signupWindowDesc: string;
  playingSpots: string;
  playingSpotsDesc: string;
  reserveListRule: string;
  reserveListRuleDesc: string;
  selfSignupOnly: string;
  selfSignupOnlyDesc: string;

  // Messages
  loading: string;
  loadingStatus: string;
  areYouSureRemove: string;

  // Footer
  createdBy: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: "Football Mondays Freiburg",
    subtitle: "Weekly Football Sign-ups",
    welcomeMessage: "Welcome to Football Mondays! ⚽",
    signInPrompt: "Sign in to your account",
    createAccountPrompt: "Create a new account",
    username: "Username",
    usernamePlaceholder: "e.g. john_doe",
    password: "Password",
    passwordPlaceholder: "At least 4 characters",
    signIn: "Sign in",
    signingIn: "Signing in...",
    createAccount: "Create Account",
    creatingAccount: "Creating account...",
    needAccount: "Need an account? Register",
    haveAccount: "Already have an account? Sign in",
    signedInAs: "Signed in as:",
    signOut: "Sign out",
    nextWeeksGame: "⚽ Next week's game",
    signupsOpen: "Sign-ups are OPEN!",
    signupsClosed: "Sign-ups Closed",
    signupsOpenMessage: "First 10 players get to play!",
    signupsClosedMessage: "List resets Monday 7:00 PM, signups open at 8:00 PM",
    playing: "Playing",
    reserve: "Reserve",
    spotsLeft: "Spots Left",
    removeMySignup: "Remove My Signup",
    signMeUp: "Sign Me Up!",
    joinReserveList: "Join Reserve List",
    startingXI: "🏟️ Starting XI",
    reserveList: "⏳ Reserve List",
    noPlayersYet: "No players yet",
    beTheFirstToSignUp: "Be the first to sign up!",
    noReservesYet: "No reserves yet",
    noOneWaitingYet: "No one waiting yet",
    you: "You",
    signedUpAt: "Signed up:",
    gameRules: "📋 Game Rules",
    signupWindow: "Sign-up Window",
    signupWindowDesc: "List resets Monday 7:00 PM, signups open at 8:00 PM",
    playingSpots: "Playing Spots",
    playingSpotsDesc: "First 10 people get to play",
    reserveListRule: "Reserve List",
    reserveListRuleDesc: "Additional signups go to reserves",
    selfSignupOnly: "Self Sign-up Only",
    selfSignupOnlyDesc: "You can only sign yourself up",
    loading: "Loading...",
    loadingStatus: "Loading current status...",
    areYouSureRemove: "Are you sure you want to remove your signup?",
    createdBy: "created by Sammy :)",
  },
  es: {
    appTitle: "Fútbol los Lunes Freiburg",
    subtitle: "Inscripciones Semanales de Fútbol",
    welcomeMessage: "¡Bienvenido a Fútbol los Lunes! ⚽",
    signInPrompt: "Inicia sesión en tu cuenta",
    createAccountPrompt: "Crea una nueva cuenta",
    username: "Nombre de usuario",
    usernamePlaceholder: "ej. juan_perez",
    password: "Contraseña",
    passwordPlaceholder: "Al menos 4 caracteres",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    createAccount: "Crear Cuenta",
    creatingAccount: "Creando cuenta...",
    needAccount: "¿Necesitas una cuenta? Regístrate",
    haveAccount: "¿Ya tienes cuenta? Inicia sesión",
    signedInAs: "Conectado como:",
    signOut: "Cerrar sesión",
    nextWeeksGame: "⚽ Partido de la próxima semana",
    signupsOpen: "¡Las inscripciones están ABIERTAS!",
    signupsClosed: "Inscripciones Cerradas",
    signupsOpenMessage: "¡Los primeros 10 jugadores pueden jugar!",
    signupsClosedMessage:
      "La lista se reinicia el lunes a las 19:00, inscripciones abren a las 20:00",
    playing: "Jugando",
    reserve: "Reserva",
    spotsLeft: "Lugares Disponibles",
    removeMySignup: "Eliminar Mi Inscripción",
    signMeUp: "¡Inscríbeme!",
    joinReserveList: "Unirse a la Lista de Reserva",
    startingXI: "🏟️ Once Inicial",
    reserveList: "⏳ Lista de Reserva",
    noPlayersYet: "Aún no hay jugadores",
    beTheFirstToSignUp: "¡Sé el primero en inscribirte!",
    noReservesYet: "Aún no hay reservas",
    noOneWaitingYet: "Nadie esperando todavía",
    you: "Tú",
    signedUpAt: "Inscrito:",
    gameRules: "📋 Reglas del Juego",
    signupWindow: "Ventana de Inscripción",
    signupWindowDesc:
      "La lista se reinicia el lunes a las 19:00, inscripciones abren a las 20:00",
    playingSpots: "Lugares para Jugar",
    playingSpotsDesc: "Las primeras 10 personas pueden jugar",
    reserveListRule: "Lista de Reserva",
    reserveListRuleDesc: "Las inscripciones adicionales van a reservas",
    selfSignupOnly: "Solo Inscripción Personal",
    selfSignupOnlyDesc: "Solo puedes inscribirte a ti mismo",
    loading: "Cargando...",
    loadingStatus: "Cargando estado actual...",
    areYouSureRemove: "¿Estás seguro de que quieres eliminar tu inscripción?",
    createdBy: "creado por Sammy :)",
  },
  it: {
    appTitle: "Calcio il Lunedì Freiburg",
    subtitle: "Iscrizioni Settimanali al Calcio",
    welcomeMessage: "Benvenuto a Calcio il Lunedì! ⚽",
    signInPrompt: "Accedi al tuo account",
    createAccountPrompt: "Crea un nuovo account",
    username: "Nome utente",
    usernamePlaceholder: "es. mario_rossi",
    password: "Password",
    passwordPlaceholder: "Almeno 4 caratteri",
    signIn: "Accedi",
    signingIn: "Accesso in corso...",
    createAccount: "Crea Account",
    creatingAccount: "Creazione account...",
    needAccount: "Hai bisogno di un account? Registrati",
    haveAccount: "Hai già un account? Accedi",
    signedInAs: "Connesso come:",
    signOut: "Disconnetti",
    nextWeeksGame: "⚽ Partita della prossima settimana",
    signupsOpen: "Le iscrizioni sono APERTE!",
    signupsClosed: "Iscrizioni Chiuse",
    signupsOpenMessage: "I primi 10 giocatori possono giocare!",
    signupsClosedMessage:
      "L'elenco si azzera lunedì alle 19:00, iscrizioni aperte alle 20:00",
    playing: "In Gioco",
    reserve: "Riserva",
    spotsLeft: "Posti Disponibili",
    removeMySignup: "Rimuovi la Mia Iscrizione",
    signMeUp: "Iscrivimi!",
    joinReserveList: "Unisciti alla Lista di Riserva",
    startingXI: "🏟️ Formazione Titolare",
    reserveList: "⏳ Lista di Riserva",
    noPlayersYet: "Ancora nessun giocatore",
    beTheFirstToSignUp: "Sii il primo a iscriverti!",
    noReservesYet: "Ancora nessuna riserva",
    noOneWaitingYet: "Nessuno in attesa ancora",
    you: "Tu",
    signedUpAt: "Iscritto:",
    gameRules: "📋 Regole del Gioco",
    signupWindow: "Finestra di Iscrizione",
    signupWindowDesc:
      "L'elenco si azzera lunedì alle 19:00, iscrizioni aperte alle 20:00",
    playingSpots: "Posti per Giocare",
    playingSpotsDesc: "Le prime 10 persone possono giocare",
    reserveListRule: "Lista di Riserva",
    reserveListRuleDesc: "Le iscrizioni aggiuntive vanno in riserva",
    selfSignupOnly: "Solo Iscrizione Personale",
    selfSignupOnlyDesc: "Puoi iscrivere solo te stesso",
    loading: "Caricamento...",
    loadingStatus: "Caricamento stato attuale...",
    areYouSureRemove: "Sei sicuro di voler rimuovere la tua iscrizione?",
    createdBy: "creato da Sammy :)",
  },
  ar: {
    appTitle: "كرة القدم يوم الاثنين فرايبورغ",
    subtitle: "التسجيلات الأسبوعية لكرة القدم",
    welcomeMessage: "!مرحباً بك في كرة القدم يوم الاثنين ⚽",
    signInPrompt: "تسجيل الدخول إلى حسابك",
    createAccountPrompt: "إنشاء حساب جديد",
    username: "اسم المستخدم",
    usernamePlaceholder: "مثلاً أحمد_محمد",
    password: "كلمة المرور",
    passwordPlaceholder: "4 أحرف على الأقل",
    signIn: "تسجيل الدخول",
    signingIn: "...جاري تسجيل الدخول",
    createAccount: "إنشاء حساب",
    creatingAccount: "...جاري إنشاء الحساب",
    needAccount: "هل تحتاج إلى حساب؟ سجل",
    haveAccount: "هل لديك حساب بالفعل؟ تسجيل الدخول",
    signedInAs: ":مسجل الدخول باسم",
    signOut: "تسجيل الخروج",
    nextWeeksGame: "مباراة الأسبوع المقبل ⚽",
    signupsOpen: "!التسجيلات مفتوحة",
    signupsClosed: "التسجيلات مغلقة",
    signupsOpenMessage: "!أول 10 لاعبين يمكنهم اللعب",
    signupsClosedMessage:
      "تتم إعادة تعيين القائمة يوم الاثنين الساعة 19:00، التسجيلات تفتح الساعة 20:00",
    playing: "يلعب",
    reserve: "احتياطي",
    spotsLeft: "الأماكن المتبقية",
    removeMySignup: "إزالة تسجيلي",
    signMeUp: "!سجلني",
    joinReserveList: "انضم إلى القائمة الاحتياطية",
    startingXI: "التشكيلة الأساسية 🏟️",
    reserveList: "القائمة الاحتياطية ⏳",
    noPlayersYet: "لا يوجد لاعبون بعد",
    beTheFirstToSignUp: "!كن أول من يسجل",
    noReservesYet: "لا يوجد احتياطيون بعد",
    noOneWaitingYet: "لا أحد ينتظر حتى الآن",
    you: "أنت",
    signedUpAt: ":مسجل",
    gameRules: "قواعد اللعبة 📋",
    signupWindow: "نافذة التسجيل",
    signupWindowDesc:
      "تتم إعادة تعيين القائمة يوم الاثنين الساعة 19:00، التسجيلات تفتح الساعة 20:00",
    playingSpots: "أماكن اللعب",
    playingSpotsDesc: "أول 10 أشخاص يمكنهم اللعب",
    reserveListRule: "القائمة الاحتياطية",
    reserveListRuleDesc: "التسجيلات الإضافية تذهب إلى الاحتياطيين",
    selfSignupOnly: "التسجيل الذاتي فقط",
    selfSignupOnlyDesc: "يمكنك فقط تسجيل نفسك",
    loading: "...جاري التحميل",
    loadingStatus: "...جاري تحميل الحالة الحالية",
    areYouSureRemove: "هل أنت متأكد من أنك تريد إزالة تسجيلك؟",
    createdBy: "(أنشأها سامي :)",
  },
  de: {
    appTitle: "Fußball Montags Freiburg",
    subtitle: "Wöchentliche Fußball-Anmeldungen",
    welcomeMessage: "Willkommen bei Fußball Montags! ⚽",
    signInPrompt: "Melde dich in deinem Konto an",
    createAccountPrompt: "Erstelle ein neues Konto",
    username: "Benutzername",
    usernamePlaceholder: "z.B. hans_mueller",
    password: "Passwort",
    passwordPlaceholder: "Mindestens 4 Zeichen",
    signIn: "Anmelden",
    signingIn: "Anmeldung läuft...",
    createAccount: "Konto Erstellen",
    creatingAccount: "Konto wird erstellt...",
    needAccount: "Brauchst du ein Konto? Registrieren",
    haveAccount: "Hast du bereits ein Konto? Anmelden",
    signedInAs: "Angemeldet als:",
    signOut: "Abmelden",
    nextWeeksGame: "⚽ Spiel nächste Woche",
    signupsOpen: "Anmeldungen sind OFFEN!",
    signupsClosed: "Anmeldungen Geschlossen",
    signupsOpenMessage: "Die ersten 10 Spieler können spielen!",
    signupsClosedMessage:
      "Liste wird Montag 19:00 Uhr zurückgesetzt, Anmeldungen öffnen um 20:00 Uhr",
    playing: "Spielend",
    reserve: "Reserve",
    spotsLeft: "Freie Plätze",
    removeMySignup: "Meine Anmeldung Entfernen",
    signMeUp: "Melde Mich An!",
    joinReserveList: "Zur Reserveliste Hinzufügen",
    startingXI: "🏟️ Startaufstellung",
    reserveList: "⏳ Reserveliste",
    noPlayersYet: "Noch keine Spieler",
    beTheFirstToSignUp: "Sei der Erste, der sich anmeldet!",
    noReservesYet: "Noch keine Reserven",
    noOneWaitingYet: "Niemand wartet noch",
    you: "Du",
    signedUpAt: "Angemeldet:",
    gameRules: "📋 Spielregeln",
    signupWindow: "Anmeldefenster",
    signupWindowDesc:
      "Liste wird Montag 19:00 Uhr zurückgesetzt, Anmeldungen öffnen um 20:00 Uhr",
    playingSpots: "Spielplätze",
    playingSpotsDesc: "Die ersten 10 Personen können spielen",
    reserveListRule: "Reserveliste",
    reserveListRuleDesc: "Zusätzliche Anmeldungen gehen auf die Reserve",
    selfSignupOnly: "Nur Selbstanmeldung",
    selfSignupOnlyDesc: "Du kannst nur dich selbst anmelden",
    loading: "Laden...",
    loadingStatus: "Aktuellen Status laden...",
    areYouSureRemove:
      "Bist du sicher, dass du deine Anmeldung entfernen möchtest?",
    createdBy: "erstellt von Sammy :)",
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  it: "Italiano",
  ar: "العربية",
  de: "Deutsch",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  it: "🇮🇹",
  ar: "🇸🇦",
  de: "🇩🇪",
};
