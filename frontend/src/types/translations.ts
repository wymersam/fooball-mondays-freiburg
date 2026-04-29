export type Language = "en" | "es" | "it" | "ar" | "de" | "pt";

export interface Translations {
  welcomeMessage: string;
  signInPrompt: string;
  username: string;
  usernamePlaceholder: string;
  signIn: string;
  signingIn: string;
  nextGame: string;
  signupsOpen: string;
  signupsClosed: string;
  spotsLeft: string;
  playing: string;
  reserve: string;
  removeMySignup: string;
  signMeUp: string;
  joinReserveList: string;
  startingXI: string;
  reserveList: string;
  noPlayersYet: string;
  beTheFirstToSignUp: string;
  noReservesYet: string;
  noOneWaitingYet: string;
  you: string;
  signedUpAt: string;
  gameRules: string;
  signupWindow: string;
  signupWindowDesc: string;
  playingSpots: string;
  playingSpotsDesc: string;
  reserveListRule: string;
  reserveListRuleDesc: string;
  selfSignupOnly: string;
  selfSignupOnlyDesc: string;
  loading: string;
  loadingStatus: string;
  areYouSureRemove: string;
  createdBy: string;
  weatherClear: string;
  weatherMainlyClear: string;
  weatherPartlyCloudy: string;
  weatherOvercast: string;
  weatherFoggy: string;
  weatherDrizzle: string;
  weatherRain: string;
  weatherSnow: string;
  weatherShowers: string;
  weatherSnowShowers: string;
  weatherThunderstorm: string;
  predictedWeather: string;
  adminReset: string;
  adminResetConfirm: string;
  adminOpenSignups: string;
  adminCloseSignups: string;
  adminAutoMode: string;
  noPaymentsToTrack: string;
  noPaymentsDesc: string;
  payViaPaypal: string;
  edit: string;
  save: string;
  cancel: string;
  removePaypal: string;
  paypalPlaceholder: string;
  addPaypalDetails: string;
  paidBadge: string;
  unpaidBadge: string;
  markAsPaid: string;
  undo: string;
  playersTab: string;
  paymentsTab: string;
  bibWasherBadge: string;
  ballBringerBadge: string;
  volunteerToWashBibs: string;
  canBringBall: string;
  unvolunteerBibs: string;
  unvolunteerBall: string;
  paidLabel: string;
  totalLabel: string;
  bibRule: string;
  bibRuleDesc: string;
  ballRule: string;
  ballRuleDesc: string;
  inviteCode: string;
  inviteCodePlaceholder: string;
  inviteCodeHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    welcomeMessage: "Welcome to Football Mondays!",
    signInPrompt: "Choose a username and sign in",
    username: "Username",
    usernamePlaceholder: "e.g. john_doe",
    signIn: "Sign in",
    signingIn: "Signing in...",
    nextGame: "Next game",
    signupsOpen: "Sign-ups are OPEN!",
    signupsClosed: "Sign-ups Closed",
    spotsLeft: "Spots Left",
    playing: "Playing",
    reserve: "Reserve",
    removeMySignup: "Remove My Signup",
    signMeUp: "Sign Me Up!",
    joinReserveList: "Join Reserve List",
    startingXI: "Starting XI",
    reserveList: "Reserve List",
    noPlayersYet: "No players yet",
    beTheFirstToSignUp: "Be the first to sign up!",
    noReservesYet: "No reserves yet",
    noOneWaitingYet: "No one waiting yet",
    you: "You",
    signedUpAt: "Signed up:",
    gameRules: "📋 Game Rules",
    signupWindow: "Sign-up Window",
    signupWindowDesc: "List resets Monday 7:00 PM, signups open at 10:00 PM",
    playingSpots: "Playing Spots",
    playingSpotsDesc: "First 12 people get to play",
    reserveListRule: "Reserve List",
    reserveListRuleDesc: "Additional signups go to reserves",
    selfSignupOnly: "Self Sign-up Only",
    selfSignupOnlyDesc: "You can only sign yourself up",
    loading: "Loading...",
    loadingStatus: "Loading current status...",
    areYouSureRemove: "Are you sure you want to remove your signup?",
    createdBy: "created by Sammy :)",
    weatherClear: "Clear",
    weatherMainlyClear: "Mainly clear",
    weatherPartlyCloudy: "Partly cloudy",
    weatherOvercast: "Overcast",
    weatherFoggy: "Foggy",
    weatherDrizzle: "Drizzle",
    weatherRain: "Rain",
    weatherSnow: "Snow",
    weatherShowers: "Showers",
    weatherSnowShowers: "Snow showers",
    weatherThunderstorm: "Thunderstorm",
    predictedWeather: "Weather forecast",
    adminReset: "Reset signups",
    adminResetConfirm:
      "This will clear all current signups and reopen the window. Are you sure?",
    adminOpenSignups: "Open signups",
    adminCloseSignups: "Close signups",
    adminAutoMode: "🔄 Auto",
    noPaymentsToTrack: "No payments to track",
    noPaymentsDesc:
      "Last week's player list will appear here after the weekly reset",
    payViaPaypal: "Pay {username} via PayPal",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    removePaypal: "Remove",
    paypalPlaceholder: "PayPal.me/yourname or @handle",
    addPaypalDetails: "+ Add your PayPal details so others can pay you back",
    paidBadge: "✓ Paid",
    unpaidBadge: "Unpaid",
    markAsPaid: "Mark as paid",
    undo: "Undo",
    playersTab: "Players",
    paymentsTab: "Payments",
    bibWasherBadge: "🧺",
    ballBringerBadge: "⚽",
    volunteerToWashBibs: "🧺 Wash bibs",
    canBringBall: "⚽ Bring ball",
    unvolunteerBibs: "✕ Bibs",
    unvolunteerBall: "✕ Ball",
    paidLabel: "paid",
    totalLabel: "total",
    bibRule: "Bibs",
    bibRuleDesc:
      "If you volunteer to wash the bibs, you automatically get a spot for next week",
    ballRule: "Ball",
    ballRuleDesc:
      "Let the group know you're bringing a ball by volunteering in the player list",
    inviteCode: "Invite Code",
    inviteCodePlaceholder: "Enter your invite code",
    inviteCodeHint: "Required for new accounts",
  },
  es: {
    welcomeMessage: "¡Bienvenido a Fútbol los Lunes!",
    signInPrompt: "Elige un nombre de usuario e inicia sesión",
    username: "Nombre de usuario",
    usernamePlaceholder: "ej. juan_perez",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    nextGame: "Próximo partido",
    signupsOpen: "¡Las inscripciones están ABIERTAS!",
    signupsClosed: "Inscripciones Cerradas",
    spotsLeft: "Lugares Disponibles",
    playing: "Jugando",
    reserve: "Reserva",
    removeMySignup: "Eliminar Mi Inscripción",
    signMeUp: "¡Inscríbeme!",
    joinReserveList: "Unirse a la Lista de Reserva",
    startingXI: "Once Inicial",
    reserveList: "Lista de Reserva",
    noPlayersYet: "Aún no hay jugadores",
    beTheFirstToSignUp: "¡Sé el primero en inscribirte!",
    noReservesYet: "Aún no hay reservas",
    noOneWaitingYet: "Nadie esperando todavía",
    you: "Tú",
    signedUpAt: "Inscrito:",
    gameRules: "📋 Reglas del Juego",
    signupWindow: "Ventana de Inscripción",
    signupWindowDesc:
      "La lista se reinicia el lunes a las 19:00, inscripciones abren a las 22:00",
    playingSpots: "Lugares para Jugar",
    playingSpotsDesc: "Las primeras 12 personas pueden jugar",
    reserveListRule: "Lista de Reserva",
    reserveListRuleDesc: "Las inscripciones adicionales van a reservas",
    selfSignupOnly: "Solo Inscripción Personal",
    selfSignupOnlyDesc: "Solo puedes inscribirte a ti mismo",
    loading: "Cargando...",
    loadingStatus: "Cargando estado actual...",
    areYouSureRemove: "¿Estás seguro de que quieres eliminar tu inscripción?",
    createdBy: "creado por Sammy :)",
    weatherClear: "Despejado",
    weatherMainlyClear: "Principalmente despejado",
    weatherPartlyCloudy: "Parcialmente nublado",
    weatherOvercast: "Nublado",
    weatherFoggy: "Niebla",
    weatherDrizzle: "Llovizna",
    weatherRain: "Lluvia",
    weatherSnow: "Nieve",
    weatherShowers: "Chubascos",
    weatherSnowShowers: "Chubascos de nieve",
    weatherThunderstorm: "Tormenta",
    predictedWeather: "Pronóstico",
    adminReset: "Reiniciar inscripciones",
    adminResetConfirm:
      "Esto borrará todas las inscripciones actuales y reabrirá la ventana. ¿Estás seguro?",
    adminOpenSignups: "Abrir inscripciones",
    adminCloseSignups: "Cerrar inscripciones",
    adminAutoMode: "🔄 Auto",
    noPaymentsToTrack: "No hay pagos que registrar",
    noPaymentsDesc:
      "La lista de jugadores de la semana pasada aparecerá aquí después del reinicio semanal",
    payViaPaypal: "Paga a {username} via PayPal",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    removePaypal: "Eliminar",
    paypalPlaceholder: "PayPal.me/tunombre o @usuario",
    addPaypalDetails:
      "+ Añade tus datos de PayPal para que otros puedan pagarte",
    paidBadge: "✓ Pagado",
    unpaidBadge: "Sin pagar",
    markAsPaid: "Marcar como pagado",
    undo: "Deshacer",
    playersTab: "Jugadores",
    paymentsTab: "Pagos",
    bibWasherBadge: "🧺",
    ballBringerBadge: "⚽",
    volunteerToWashBibs: "🧺 Lavar petos",
    canBringBall: "⚽ Traer balón",
    unvolunteerBibs: "✕ Petos",
    unvolunteerBall: "✕ Balón",
    paidLabel: "pagados",
    totalLabel: "total",
    bibRule: "Petos",
    bibRuleDesc:
      "Si te ofreces a lavar los petos, obtienes automáticamente un lugar para la semana siguiente",
    ballRule: "Balón",
    ballRuleDesc:
      "Avisa al grupo que traes un balón voluntáriate en la lista de jugadores",
    inviteCode: "Código de invitación",
    inviteCodePlaceholder: "Ingresa tu código de invitación",
    inviteCodeHint: "Requerido para cuentas nuevas",
  },
  it: {
    welcomeMessage: "Benvenuto a Calcio il Lunedì!",
    signInPrompt: "Scegli un nome utente e accedi",
    username: "Nome utente",
    usernamePlaceholder: "es. mario_rossi",
    signIn: "Accedi",
    signingIn: "Accesso in corso...",
    nextGame: "Prossima partita",
    signupsOpen: "Le iscrizioni sono APERTE!",
    signupsClosed: "Iscrizioni Chiuse",
    spotsLeft: "Posti Disponibili",
    playing: "Giocando",
    reserve: "Riserva",
    removeMySignup: "Rimuovi la Mia Iscrizione",
    signMeUp: "Iscrivimi!",
    joinReserveList: "Unisciti alla Lista di Riserva",
    startingXI: "Formazione Titolare",
    reserveList: "Lista di Riserva",
    noPlayersYet: "Ancora nessun giocatore",
    beTheFirstToSignUp: "Sii il primo a iscriverti!",
    noReservesYet: "Ancora nessuna riserva",
    noOneWaitingYet: "Nessuno in attesa ancora",
    you: "Tu",
    signedUpAt: "Iscritto:",
    gameRules: "📋 Regole del Gioco",
    signupWindow: "Finestra di Iscrizione",
    signupWindowDesc:
      "L'elenco si azzera lunedì alle 19:00, iscrizioni aperte alle 22:00",
    playingSpots: "Posti per Giocare",
    playingSpotsDesc: "Le prime 12 persone possono giocare",
    reserveListRule: "Lista di Riserva",
    reserveListRuleDesc: "Le iscrizioni aggiuntive vanno in riserva",
    selfSignupOnly: "Solo Iscrizione Personale",
    selfSignupOnlyDesc: "Puoi iscrivere solo te stesso",
    loading: "Caricamento...",
    loadingStatus: "Caricamento stato attuale...",
    areYouSureRemove: "Sei sicuro di voler rimuovere la tua iscrizione?",
    createdBy: "creato da Sammy :)",
    weatherClear: "Sereno",
    weatherMainlyClear: "Prevalentemente sereno",
    weatherPartlyCloudy: "Parzialmente nuvoloso",
    weatherOvercast: "Coperto",
    weatherFoggy: "Nebbia",
    weatherDrizzle: "Pioggerella",
    weatherRain: "Pioggia",
    weatherSnow: "Neve",
    weatherShowers: "Rovesci",
    weatherSnowShowers: "Rovesci di neve",
    weatherThunderstorm: "Temporale",
    predictedWeather: "Previsioni meteo",
    adminReset: "Reimposta iscrizioni",
    adminResetConfirm:
      "Questo cancellerà tutte le iscrizioni e riaprirà la finestra. Sei sicuro?",
    adminOpenSignups: "Apri iscrizioni",
    adminCloseSignups: "Chiudi iscrizioni",
    adminAutoMode: "🔄 Auto",
    noPaymentsToTrack: "Nessun pagamento da monitorare",
    noPaymentsDesc:
      "La lista dei giocatori della settimana scorsa apparirà qui dopo il reset settimanale",
    payViaPaypal: "Paga {username} via PayPal",
    edit: "Modifica",
    save: "Salva",
    cancel: "Annulla",
    removePaypal: "Rimuovi",
    paypalPlaceholder: "PayPal.me/tuonome o @handle",
    addPaypalDetails:
      "+ Aggiungi i tuoi dati PayPal così gli altri possono pagarti",
    paidBadge: "✓ Pagato",
    unpaidBadge: "Non pagato",
    markAsPaid: "Segna come pagato",
    undo: "Annulla",
    playersTab: "Giocatori",
    paymentsTab: "Pagamenti",
    bibWasherBadge: "🧺",
    ballBringerBadge: "⚽",
    volunteerToWashBibs: "🧺 Lava casacche",
    unvolunteerBibs: "✕ Casacche",
    unvolunteerBall: "✕ Pallone",
    canBringBall: "⚽ Porta pallone",
    paidLabel: "pagati",
    totalLabel: "totale",
    bibRule: "Casacche",
    bibRuleDesc:
      "Se ti offri di lavare le casacche, ottieni automaticamente un posto per la settimana successiva",
    ballRule: "Pallone",
    ballRuleDesc:
      "Fai sapere al gruppo che porti un pallone volontariandoti nella lista giocatori",
    inviteCode: "Codice Invito",
    inviteCodePlaceholder: "Inserisci il tuo codice invito",
    inviteCodeHint: "Richiesto per i nuovi account",
  },
  ar: {
    welcomeMessage: "!مرحباً بك في كرة القدم يوم الاثنين",
    signInPrompt: "اختر اسم مستخدم وسجل الدخول",
    username: "اسم المستخدم",
    usernamePlaceholder: "مثلاً أحمد_محمد",
    signIn: "تسجيل الدخول",
    signingIn: "...جاري تسجيل الدخول",
    nextGame: "المباراة القادمة",
    signupsOpen: "!التسجيلات مفتوحة",
    signupsClosed: "التسجيلات مغلقة",
    spotsLeft: "الأماكن المتبقية",
    playing: "يلعب",
    reserve: "احتياطي",
    removeMySignup: "إزالة تسجيلي",
    signMeUp: "!سجلني",
    joinReserveList: "انضم إلى القائمة الاحتياطية",
    startingXI: "التشكيلة الأساسية",
    reserveList: "القائمة الاحتياطية",
    noPlayersYet: "لا يوجد لاعبون بعد",
    beTheFirstToSignUp: "!كن أول من يسجل",
    noReservesYet: "لا يوجد احتياطيون بعد",
    noOneWaitingYet: "لا أحد ينتظر حتى الآن",
    you: "أنت",
    signedUpAt: ":مسجل",
    gameRules: "قواعد اللعبة 📋",
    signupWindow: "نافذة التسجيل",
    signupWindowDesc:
      "تتم إعادة تعيين القائمة يوم الاثنين الساعة 19:00، التسجيلات تفتح الساعة 22:00",
    playingSpots: "أماكن اللعب",
    playingSpotsDesc: "أول 12 أشخاص يمكنهم اللعب",
    reserveListRule: "القائمة الاحتياطية",
    reserveListRuleDesc: "التسجيلات الإضافية تذهب إلى الاحتياطيين",
    selfSignupOnly: "التسجيل الذاتي فقط",
    selfSignupOnlyDesc: "يمكنك فقط تسجيل نفسك",
    loading: "...جاري التحميل",
    loadingStatus: "...جاري تحميل الحالة الحالية",
    areYouSureRemove: "هل أنت متأكد من أنك تريد إزالة تسجيلك؟",
    createdBy: "(أنشأها سامي :)",
    weatherClear: "صافٍ",
    weatherMainlyClear: "صافٍ في معظمه",
    weatherPartlyCloudy: "غائم جزئياً",
    weatherOvercast: "ملبّد بالغيوم",
    weatherFoggy: "ضبابي",
    weatherDrizzle: "رذاذ",
    weatherRain: "مطر",
    weatherSnow: "ثلج",
    weatherShowers: "زخات مطر",
    weatherSnowShowers: "زخات ثلج",
    weatherThunderstorm: "عاصفة رعدية",
    predictedWeather: "توقعات الطقس",
    adminReset: "إعادة تعيين التسجيلات",
    adminResetConfirm:
      "سيؤدي هذا إلى مسح جميع التسجيلات وإعادة فتح النافذة. هل أنت متأكد؟",
    adminOpenSignups: "فتح التسجيلات",
    adminCloseSignups: "إغلاق التسجيلات",
    adminAutoMode: "🔄 تلقائي",
    noPaymentsToTrack: "لا توجد مدفوعات لتتبعها",
    noPaymentsDesc:
      "ستظهر قائمة لاعبي الأسبوع الماضي هنا بعد إعادة التعيين الأسبوعية",
    payViaPaypal: "ادفع لـ {username} عبر PayPal",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    removePaypal: "إزالة",
    paypalPlaceholder: "PayPal.me/اسمك أو @handle",
    addPaypalDetails:
      "+ أضف تفاصيل PayPal الخاصة بك حتى يتمكن الآخرون من الدفع لك",
    paidBadge: "✓ مدفوع",
    unpaidBadge: "غير مدفوع",
    markAsPaid: "وضع علامة كمدفوع",
    undo: "تراجع",
    playersTab: "اللاعبون",
    paymentsTab: "المدفوعات",
    bibWasherBadge: "🧺",
    ballBringerBadge: "⚽",
    volunteerToWashBibs: "🧺 غسيل",
    unvolunteerBibs: "✕ قمصان",
    unvolunteerBall: "✕ كرة",
    canBringBall: "⚽ إحضار كرة",
    paidLabel: "مدفوع",
    totalLabel: "إجمالي",
    bibRule: "القمصان",
    bibRuleDesc:
      "إذا تطوعت لغسيل القمصان، تحصل تلقائياً على مكان للأسبوع القادم",
    ballRule: "الكرة",
    ballRuleDesc: "أخبر المجموعة بأنك ستحضر كرة عبر قائمة اللاعبين",
    inviteCode: "رمز الدعوة",
    inviteCodePlaceholder: "أدخل رمز الدعوة الخاص بك",
    inviteCodeHint: "مطلوب للحسابات الجديدة",
  },
  de: {
    welcomeMessage: "Willkommen bei Fußball Montags!",
    signInPrompt: "Wähle einen Benutzernamen und melde dich an",
    username: "Benutzername",
    usernamePlaceholder: "z.B. hans_mueller",
    signIn: "Anmelden",
    signingIn: "Anmeldung läuft...",
    nextGame: "Nächstes Spiel",
    signupsOpen: "Anmeldungen sind OFFEN!",
    signupsClosed: "Anmeldungen Geschlossen",
    spotsLeft: "Freie Plätze",
    playing: "Spielend",
    reserve: "Reserveliste",
    removeMySignup: "Meine Anmeldung Entfernen",
    signMeUp: "Melde Mich An!",
    joinReserveList: "Zur Reserveliste Hinzufügen",
    startingXI: "Startaufstellung",
    reserveList: "Reserveliste",
    noPlayersYet: "Noch keine Spieler",
    beTheFirstToSignUp: "Sei der Erste, der sich anmeldet!",
    noReservesYet: "Noch keine Reserven",
    noOneWaitingYet: "Niemand wartet noch",
    you: "Du",
    signedUpAt: "Angemeldet:",
    gameRules: "📋 Spielregeln",
    signupWindow: "Anmeldefenster",
    signupWindowDesc:
      "Liste wird Montag 19:00 Uhr zurückgesetzt, Anmeldungen öffnen um 22:00 Uhr",
    playingSpots: "Spielplätze",
    playingSpotsDesc: "Die ersten 12 Personen können spielen",
    reserveListRule: "Reserveliste",
    reserveListRuleDesc: "Zusätzliche Anmeldungen gehen auf die Reserve",
    selfSignupOnly: "Nur Selbstanmeldung",
    selfSignupOnlyDesc: "Du kannst nur dich selbst anmelden",
    loading: "Laden...",
    loadingStatus: "Aktuellen Status laden...",
    areYouSureRemove:
      "Bist du sicher, dass du deine Anmeldung entfernen möchtest?",
    createdBy: "erstellt von Sammy :)",
    weatherClear: "Klar",
    weatherMainlyClear: "Überwiegend klar",
    weatherPartlyCloudy: "Teils bewölkt",
    weatherOvercast: "Bedeckt",
    weatherFoggy: "Neblig",
    weatherDrizzle: "Nieselregen",
    weatherRain: "Regen",
    weatherSnow: "Schnee",
    weatherShowers: "Schauer",
    weatherSnowShowers: "Schneeschauer",
    weatherThunderstorm: "Gewitter",
    predictedWeather: "Wettervorhersage",
    adminReset: "Anmeldungen zurücksetzen",
    adminResetConfirm:
      "Alle aktuellen Anmeldungen werden gelöscht und das Fenster wieder geöffnet. Bist du sicher?",
    adminOpenSignups: "Anmeldungen öffnen",
    adminCloseSignups: "Anmeldungen schließen",
    adminAutoMode: "🔄 Auto",
    noPaymentsToTrack: "Keine Zahlungen zu verfolgen",
    noPaymentsDesc:
      "Die Spielerliste der letzten Woche erscheint hier nach dem wöchentlichen Reset",
    payViaPaypal: "{username} via PayPal bezahlen",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    removePaypal: "Entfernen",
    paypalPlaceholder: "PayPal.me/deinname oder @handle",
    addPaypalDetails:
      "+ PayPal-Daten hinzufügen, damit andere dich bezahlen können",
    paidBadge: "✓ Bezahlt",
    unpaidBadge: "Ausstehend",
    markAsPaid: "Als bezahlt markieren",
    undo: "Rückgängig",
    playersTab: "Spieler",
    paymentsTab: "Zahlungen",
    bibWasherBadge: "🧺",
    volunteerToWashBibs: "🧺 Trikots waschen",
    ballBringerBadge: "⚽",
    canBringBall: "⚽ Ball mitbringen",
    unvolunteerBibs: "✕ Trikots",
    unvolunteerBall: "✕ Ball",
    paidLabel: "bezahlt",
    totalLabel: "gesamt",
    bibRule: "Trikots",
    bibRuleDesc:
      "Wenn du dich freiwillig meldest, die Leibchen zu waschen, bekommst du automatisch einen Platz für die nächste Woche",
    ballRule: "Ball",
    ballRuleDesc:
      "Teile der Gruppe mit, dass du einen Ball mitbringst, indem du dich in der Spielerliste freiwillig meldest",
    inviteCode: "Einladungscode",
    inviteCodePlaceholder: "Gib deinen Einladungscode ein",
    inviteCodeHint: "Nur für neue Konten erforderlich",
  },
  pt: {
    welcomeMessage: "Bem-vindo ao Futebol às Segundas! ⚽",
    signInPrompt: "Escolha um nome de usuário e entre",
    username: "Nome de usuário",
    usernamePlaceholder: "ex. joao_silva",
    signIn: "Entrar",
    signingIn: "Entrando...",
    nextGame: "Próximo jogo",
    signupsOpen: "Inscrições ABERTAS!",
    signupsClosed: "Inscrições Fechadas",
    spotsLeft: "Vagas Restantes",
    playing: "Jogando",
    reserve: "Reserva",
    removeMySignup: "Remover Minha Inscrição",
    signMeUp: "Me Inscrever!",
    joinReserveList: "Entrar na Lista de Reservas",
    startingXI: "Time Titular",
    reserveList: "Lista de Reservas",
    noPlayersYet: "Ainda não há jogadores",
    beTheFirstToSignUp: "Seja o primeiro a se inscrever!",
    noReservesYet: "Ainda não há reservas",
    noOneWaitingYet: "Ninguém esperando ainda",
    you: "Você",
    signedUpAt: "Inscrito:",
    gameRules: "📋 Regras do Jogo",
    signupWindow: "Janela de Inscrição",
    signupWindowDesc:
      "A lista reinicia segunda-feira às 19:00, inscrições abrem às 22:00",
    playingSpots: "Vagas para Jogar",
    playingSpotsDesc: "As primeiras 12 pessoas podem jogar",
    reserveListRule: "Lista de Reservas",
    reserveListRuleDesc: "Inscrições adicionais vão para as reservas",
    selfSignupOnly: "Apenas Inscrição Própria",
    selfSignupOnlyDesc: "Você só pode inscrever a si mesmo",
    loading: "Carregando...",
    loadingStatus: "Carregando status atual...",
    areYouSureRemove: "Tem certeza de que deseja remover sua inscrição?",
    createdBy: "criado por Sammy :)",
    weatherClear: "Limpo",
    weatherMainlyClear: "Principalmente limpo",
    weatherPartlyCloudy: "Parcialmente nublado",
    weatherOvercast: "Nublado",
    weatherFoggy: "Nevoeiro",
    weatherDrizzle: "Garoa",
    weatherRain: "Chuva",
    weatherSnow: "Neve",
    weatherShowers: "Pancadas",
    weatherSnowShowers: "Pancadas de neve",
    weatherThunderstorm: "Tempestade",
    predictedWeather: "Previsão do tempo",
    adminReset: "Redefinir inscrições",
    adminResetConfirm:
      "Isso apagará todas as inscrições e reabrirá a janela. Tem certeza?",
    adminOpenSignups: "Abrir inscrições",
    adminCloseSignups: "Fechar inscrições",
    adminAutoMode: "🔄 Auto",
    noPaymentsToTrack: "Sem pagamentos para registar",
    noPaymentsDesc:
      "A lista de jogadores da semana passada aparecerá aqui após o reinício semanal",
    payViaPaypal: "Pagar {username} via PayPal",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    removePaypal: "Remover",
    paypalPlaceholder: "PayPal.me/seunome ou @handle",
    addPaypalDetails:
      "+ Adicionar os seus dados de PayPal para que outros possam pagar-lhe",
    paidBadge: "✓ Pago",
    unpaidBadge: "Por pagar",
    markAsPaid: "Marcar como pago",
    undo: "Desfazer",
    playersTab: "Jogadores",
    paymentsTab: "Pagamentos",
    bibWasherBadge: "🧺",
    ballBringerBadge: "⚽",
    canBringBall: "⚽ Trazer bola",
    volunteerToWashBibs: "🧺 Lavar coletes",
    unvolunteerBibs: "✕ Coletes",
    unvolunteerBall: "✕ Bola",
    paidLabel: "pagos",
    totalLabel: "total",
    bibRule: "Coletes",
    bibRuleDesc:
      "Se te voluntariares para lavar os coletes, obtens automaticamente um lugar para a semana seguinte",
    ballRule: "Bola",
    ballRuleDesc:
      "Avisa o grupo que vais trazer uma bola voluntariando-te na lista de jogadores",
    inviteCode: "Código de convite",
    inviteCodePlaceholder: "Digite seu código de convite",
    inviteCodeHint: "Obrigatório para novas contas",
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  it: "Italiano",
  ar: "العربية",
  de: "Deutsch",
  pt: "Português",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  es: "🇲🇽",
  it: "🇮🇹",
  ar: "🇪🇬",
  de: "🇩🇪",
  pt: "🇧🇷",
};
