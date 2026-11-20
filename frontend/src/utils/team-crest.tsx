import { useState } from "react";

const leagues: Record<string, string[]> = {
  "Premier League": [
    "Arsenal",
    "Aston Villa",
    "AFC Bournemouth",
    "Brentford",
    "Brighton & Hove Albion",
    "Burnley",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Leeds United",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Newcastle United",
    "Nottingham Forest",
    "Sunderland",
    "Tottenham Hotspur",
    "West Ham United",
    "Wolverhampton Wanderers",
  ],
  "La Liga": [
    "Athletic Club",
    "Atlético Madrid",
    "Barcelona",
    "Real Madrid",
    "Real Sociedad",
    "Villarreal",
    "Real Betis",
    "Sevilla",
    "Valencia",
    "Girona",
    "Celta Vigo",
    "Osasuna",
    "Mallorca",
    "Getafe",
    "Rayo Vallecano",
    "Elche",
    "Levante",
    "Espanyol",
    "Real Oviedo",
  ],
  Bundesliga: [
    "Bayern Munich",
    "Borussia Dortmund",
    "RB Leipzig",
    "Bayer Leverkusen",
    "Eintracht Frankfurt",
    "VfB Stuttgart",
    "SC Freiburg",
    "Borussia Mönchengladbach",
    "VfL Wolfsburg",
    "Werder Bremen",
    "TSG Hoffenheim",
    "1. FC Union Berlin",
    "FC Augsburg",
    "1. FSV Mainz 05",
    "FC St. Pauli",
    "1. FC Heidenheim",
    "Hamburger SV",
    "1. FC Köln",
  ],
  "Liga MX": [
    "Club América",
    "Guadalajara",
    "Cruz Azul",
    "Tigres UANL",
    "Monterrey",
    "Pumas UNAM",
    "Santos Laguna",
    "Toluca",
    "León",
    "Pachuca",
    "Atlas",
    "Tijuana",
    "Necaxa",
    "Puebla",
    "Querétaro",
    "Mazatlán",
    "FC Juárez",
    "San Luis",
  ],
  "Serie A": [
    "Atalanta",
    "Bologna",
    "Cagliari",
    "Como",
    "Cremonese",
    "Fiorentina",
    "Genoa",
    "Hellas Verona",
    "Inter Milan",
    "Juventus",
    "Lazio",
    "Lecce",
    "AC Milan",
    "Napoli",
    "Parma",
    "Pisa",
    "Roma",
    "Sassuolo",
    "Torino",
    "Udinese",
  ],
  "Ligue 1": [
    "Angers",
    "Auxerre",
    "Brest",
    "Le Havre",
    "Lens",
    "Lille",
    "Lorient",
    "Lyon",
    "Marseille",
    "Metz",
    "Monaco",
    "Montpellier",
    "Nantes",
    "Nice",
    "Paris Saint-Germain",
    "Paris FC",
    "Rennes",
    "Strasbourg",
    "Toulouse",
  ],
  "UEFA Champions League": [
    "Sporting CP",
    "FC Porto",
    "Club Brugge",
    "PSV Eindhoven",
    "Feyenoord",
    "Bodø/Glimt",
    "Fenerbahçe",
    "Shakhtar Donetsk",
    "Galatasaray",
    "Slavia Praha",
    "Slovan Bratislava",
    "AEK Athens",
    "LASK",
    "Viking FK",
    "Sabah",
  ],
  "UEFA Europa League": [
    "AZ Alkmaar",
    "Sparta Praha",
    "Olympiacos",
    "Salzburg",
    "Celtic",
    "Dinamo Zagreb",
    "Beşiktaş",
    "Benfica",
  ],
  "Classic English Clubs": [
    "Blackburn Rovers",
    "Derby County",
    "Sheffield Wednesday",
    "Middlesbrough",
    "Leicester City",
    "Southampton",
    "Ipswich Town",
    "Norwich City",
    "Stoke City",
    "West Bromwich Albion",
    "Sheffield United",
    "Portsmouth",
    "Queens Park Rangers",
    "Coventry City",
  ],
  "International Teams": [
    "Argentina",
    "Brazil",
    "France",
    "England",
    "Spain",
    "Germany",
    "Portugal",
    "Netherlands",
    "Italy",
    "Belgium",
    "Croatia",
    "Uruguay",
    "Colombia",
    "Mexico",
    "United States",
    "Japan",
    "South Korea",
    "Morocco",
    "Senegal",
    "Nigeria",
  ],
};

export interface Team {
  name: string;
  league: string;
  crest: string;
}

// Crest files are expected at public/avatars/crests/<slug>.png
function crestPath(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/avatars/crests/${slug}.png`;
}

const teams: Team[] = [];
for (const [league, names] of Object.entries(leagues)) {
  for (const name of names) {
    teams.push({ name, league, crest: crestPath(name) });
  }
}

function getWeekSeed() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Each username gets a distinct crest for the week. Usernames are processed in
// sorted order so the result is the same regardless of list order. If there are
// more users than teams, the extra users necessarily share crests.
export function assignTeamCrests(usernames: string[]): Map<string, Team> {
  const weekSeed = getWeekSeed();
  const taken = new Set<number>();
  const assignments = new Map<string, Team>();

  for (const username of [...new Set(usernames)].sort()) {
    let index = hashString(username + weekSeed) % teams.length;
    if (taken.size < teams.length) {
      while (taken.has(index)) {
        index = (index + 1) % teams.length;
      }
    }
    taken.add(index);
    assignments.set(username, teams[index]);
  }

  return assignments;
}

export function CrestPortrait({ team }: { team: Team }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = team.name
    .split(/\s+/)
    .filter((part) => /^[A-Za-zÀ-ÿ]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  if (imageFailed) {
    return (
      <span
        className="player-avatar-fallback"
        role="img"
        aria-label={team.name}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={team.crest}
      alt={`${team.name} (${team.league})`}
      title={`${team.name} (${team.league})`}
      onError={() => setImageFailed(true)}
    />
  );
}
