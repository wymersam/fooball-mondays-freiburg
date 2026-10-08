import { useState } from "react";

const avatars = [
  {
    name: "Pelé",
    country: "Brazil",
  },
  {
    name: "Lionel Messi",
    country: "Argentina",
  },
  {
    name: "Cristiano Ronaldo",
    country: "Portugal",
  },
  {
    name: "Kylian Mbappé",
    country: "France",
  },
  {
    name: "Zinedine Zidane",
    country: "France",
  },
  {
    name: "Son Heung-min",
    country: "South Korea",
  },
  {
    name: "Hugo Sánchez",
    country: "Mexico",
    source:
      "https://commons.wikimedia.org/wiki/File:Hugo_S%C3%A1nchez_1988_(cropped).jpg",
    credit: "Rob Bogaerts / Anefo, CC BY-SA 3.0 NL",
  },
  {
    name: "Rafael Márquez",
    country: "Mexico",
    source:
      "https://commons.wikimedia.org/wiki/File:Rafael_M%C3%A1rquez_2014.jpg",
    credit: "Presidencia de la República Mexicana, CC BY 2.0",
  },
  {
    name: "Hirving Lozano",
    country: "Mexico",
    source: "https://commons.wikimedia.org/wiki/File:Hirving_Lozano.png",
    credit: "Selección Nacional de México, CC BY 3.0",
  },
  {
    name: "Mohamed Salah",
    country: "Egypt",
    source: "https://commons.wikimedia.org/wiki/File:Mohamed_Salah_2017.jpg",
    credit: "Dmitry Golubovich, CC BY-SA 3.0",
  },
  {
    name: "Mahmoud El Khatib",
    country: "Egypt",
    source:
      "https://commons.wikimedia.org/wiki/File:Mahmoud_El-Khatib_(1977).jpg",
    credit: "Public domain",
  },
  {
    name: "Mohamed Aboutrika",
    country: "Egypt",
    source: "https://commons.wikimedia.org/wiki/File:2010-abotrika.jpg",
    credit: "Eslam Amin, CC BY-SA 3.0",
  },
  {
    name: "Diego Maradona",
    country: "Argentina",
    source: "https://commons.wikimedia.org/wiki/File:Diego_Maradona_2012.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Ronaldinho",
    country: "Brazil",
    source: "https://commons.wikimedia.org/wiki/File:Ronaldinho_2006.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Ronaldo Nazário",
    country: "Brazil",
    source: "https://commons.wikimedia.org/wiki/File:Ronaldo_Naz%C3%A1rio.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Neymar",
    country: "Brazil",
    source:
      "https://commons.wikimedia.org/wiki/File:Neymar_Jr._with_Paris_Saint-Germain.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "David Beckham",
    country: "England",
    source: "https://commons.wikimedia.org/wiki/File:David_Beckham_2009.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Johan Cruyff",
    country: "Netherlands",
    source: "https://commons.wikimedia.org/wiki/File:Johan_Cruyff_1974c.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "George Best",
    country: "Northern Ireland",
    source: "https://commons.wikimedia.org/wiki/File:George_Best_1976.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Paolo Maldini",
    country: "Italy",
    source: "https://commons.wikimedia.org/wiki/File:Paolo_Maldini_2008.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Thierry Henry",
    country: "France",
    source: "https://commons.wikimedia.org/wiki/File:Thierry_Henry_2017.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Didier Drogba",
    country: "Ivory Coast",
    source: "https://commons.wikimedia.org/wiki/File:Didier_Drogba_2014.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Samuel Eto'o",
    country: "Cameroon",
    source: "https://commons.wikimedia.org/wiki/File:Samuel_Eto'o_2011.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Sadio Mané",
    country: "Senegal",
    source: "https://commons.wikimedia.org/wiki/File:Sadio_Man%C3%A9_2018.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Yaya Touré",
    country: "Ivory Coast",
    source: "https://commons.wikimedia.org/wiki/File:Yaya_Toure_9229.JPG",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Andrea Pirlo",
    country: "Italy",
    source: "https://commons.wikimedia.org/wiki/File:Andrea_Pirlo_NYCFC.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Luka Modrić",
    country: "Croatia",
    source:
      "https://commons.wikimedia.org/wiki/File:Luka_Modric_Interview_2018.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Erling Haaland",
    country: "Norway",
    source: "https://commons.wikimedia.org/wiki/File:Erling_Haaland_2023.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Robert Lewandowski",
    country: "Poland",
    source:
      "https://commons.wikimedia.org/wiki/File:Robert_Lewandowski_2010_(1).jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Marta",
    country: "Brazil",
    source: "https://commons.wikimedia.org/wiki/File:Marta_Brazil.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "George Weah",
    country: "Liberia",
    source: "https://commons.wikimedia.org/wiki/File:George_Weah_2019.jpg",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Steven Gerrard",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Steven_Gerrard",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Kenny Dalglish",
    country: "Scotland",
    source: "https://en.wikipedia.org/wiki/Kenny_Dalglish",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Ian Rush",
    country: "Wales",
    source: "https://en.wikipedia.org/wiki/Ian_Rush",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Virgil van Dijk",
    country: "Netherlands",
    source: "https://en.wikipedia.org/wiki/Virgil_van_Dijk",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Trent Alexander-Arnold",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Trent_Alexander-Arnold",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Wayne Rooney",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Wayne_Rooney",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Harry Kane",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Harry_Kane",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Jude Bellingham",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Jude_Bellingham",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Bobby Charlton",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Bobby_Charlton",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Alan Shearer",
    country: "England",
    source: "https://en.wikipedia.org/wiki/Alan_Shearer",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Rivaldo",
    country: "Brazil",
    source: "https://en.wikipedia.org/wiki/Rivaldo",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Romário",
    country: "Brazil",
    source: "https://en.wikipedia.org/wiki/Rom%C3%A1rio",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Cafu",
    country: "Brazil",
    source: "https://en.wikipedia.org/wiki/Cafu",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Xavi",
    country: "Spain",
    source: "https://en.wikipedia.org/wiki/Xavi_(footballer,_born_1980)",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Andrés Iniesta",
    country: "Spain",
    source: "https://en.wikipedia.org/wiki/Andr%C3%A9s_Iniesta",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Iker Casillas",
    country: "Spain",
    source: "https://en.wikipedia.org/wiki/Iker_Casillas",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Gianluigi Buffon",
    country: "Italy",
    source: "https://en.wikipedia.org/wiki/Gianluigi_Buffon",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Francesco Totti",
    country: "Italy",
    source: "https://en.wikipedia.org/wiki/Francesco_Totti",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Luis Suárez",
    country: "Uruguay",
    source:
      "https://en.wikipedia.org/wiki/Luis_Su%C3%A1rez_(Uruguayan_footballer)",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Diego Forlán",
    country: "Uruguay",
    source: "https://en.wikipedia.org/wiki/Diego_Forl%C3%A1n",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Zlatan Ibrahimović",
    country: "Sweden",
    source: "https://en.wikipedia.org/wiki/Zlatan_Ibrahimovi%C4%87",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Alex Morgan",
    country: "United States",
    source: "https://en.wikipedia.org/wiki/Alex_Morgan",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Mia Hamm",
    country: "United States",
    source: "https://en.wikipedia.org/wiki/Mia_Hamm",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Christine Sinclair",
    country: "Canada",
    source: "https://en.wikipedia.org/wiki/Christine_Sinclair",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Sam Kerr",
    country: "Australia",
    source: "https://en.wikipedia.org/wiki/Sam_Kerr",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Abedi Pele",
    country: "Ghana",
    source: "https://en.wikipedia.org/wiki/Abedi_Pele",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Jay-Jay Okocha",
    country: "Nigeria",
    source: "https://en.wikipedia.org/wiki/Jay-Jay_Okocha",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Hristo Stoichkov",
    country: "Bulgaria",
    source: "https://en.wikipedia.org/wiki/Hristo_Stoichkov",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Megan Rapinoe",
    country: "United States",
    source: "https://en.wikipedia.org/wiki/Megan_Rapinoe",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Franz Beckenbauer",
    country: "Germany",
    source: "https://en.wikipedia.org/wiki/Franz_Beckenbauer",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Gerd Müller",
    country: "Germany",
    source: "https://en.wikipedia.org/wiki/Gerd_M%C3%BCller",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Lothar Matthäus",
    country: "Germany",
    source: "https://en.wikipedia.org/wiki/Lothar_Matth%C3%A4us",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Oliver Kahn",
    country: "Germany",
    source: "https://en.wikipedia.org/wiki/Oliver_Kahn",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Michel Platini",
    country: "France",
    source: "https://en.wikipedia.org/wiki/Michel_Platini",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Eusébio",
    country: "Portugal",
    source: "https://en.wikipedia.org/wiki/Eus%C3%A9bio",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Luís Figo",
    country: "Portugal",
    source: "https://en.wikipedia.org/wiki/Lu%C3%ADs_Figo",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Gheorghe Hagi",
    country: "Romania",
    source: "https://en.wikipedia.org/wiki/Gheorghe_Hagi",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Ferenc Puskás",
    country: "Hungary",
    source: "https://en.wikipedia.org/wiki/Ferenc_Pusk%C3%A1s",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Lev Yashin",
    country: "Soviet Union",
    source: "https://en.wikipedia.org/wiki/Lev_Yashin",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Riyad Mahrez",
    country: "Algeria",
    source: "https://en.wikipedia.org/wiki/Riyad_Mahrez",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Ali Daei",
    country: "Iran",
    source: "https://en.wikipedia.org/wiki/Ali_Daei",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Tim Cahill",
    country: "Australia",
    source: "https://en.wikipedia.org/wiki/Tim_Cahill",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Harry Kewell",
    country: "Australia",
    source: "https://en.wikipedia.org/wiki/Harry_Kewell",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Park Ji-sung",
    country: "South Korea",
    source: "https://en.wikipedia.org/wiki/Park_Ji-sung",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Radamel Falcao",
    country: "Colombia",
    source: "https://en.wikipedia.org/wiki/Radamel_Falcao",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Carlos Valderrama",
    country: "Colombia",
    source: "https://en.wikipedia.org/wiki/Carlos_Valderrama",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Enzo Francescoli",
    country: "Uruguay",
    source: "https://en.wikipedia.org/wiki/Enzo_Francescoli",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Hope Solo",
    country: "United States",
    source: "https://en.wikipedia.org/wiki/Hope_Solo",
    credit: "Wikimedia Commons; see source page for author and license",
  },
  {
    name: "Abby Wambach",
    country: "United States",
    source: "https://en.wikipedia.org/wiki/Abby_Wambach",
    credit: "Wikimedia Commons; see source page for author and license",
  },
];

const localAvatarImages: Record<string, string> = {
  Pelé: "/avatars/pele.jpg",
  "Lionel Messi": "/avatars/lionel-messi.jpg",
  "Cristiano Ronaldo": "/avatars/cristiano-ronaldo.jpg",
  "Zinedine Zidane": "/avatars/zinedine-zidane.jpg",
  "Rafael Márquez": "/avatars/rafael-marquez.jpg",
  "Ronaldo Nazário": "/avatars/ronaldo-nazario.jpg",
  Neymar: "/avatars/neymar.jpg",
  "David Beckham": "/avatars/david-beckham.jpg",
  "George Best": "/avatars/george-best.jpg",
  "Paolo Maldini": "/avatars/paolo-maldini.jpg",
  "Thierry Henry": "/avatars/thierry-henry.webp",
  "Didier Drogba": "/avatars/didier-drogba.jpg",
  "Yaya Touré": "/avatars/yaya-toure.jpg",
  "Andrea Pirlo": "/avatars/andrea-pirlo.jpg",
  "Luka Modrić": "/avatars/luka-modric.jpg",
  "George Weah": "/avatars/george-weah.jpg",
  "Steven Gerrard": "/avatars/steven-gerrard.jpg",
  "Kenny Dalglish": "/avatars/kenny-dalglish.jpg",
  "Virgil van Dijk": "/avatars/virgil-van-dijk.jpg",
  "Wayne Rooney": "/avatars/wayne-rooney.jpg",
  "Harry Kane": "/avatars/harry-kane.jpg",
  "Jude Bellingham": "/avatars/jude-bellingham.jpg",
  "Bobby Charlton": "/avatars/bobby-charlton.jpg",
  "Kylian Mbappé": "/avatars/kylian-mbappe.jpg",
  "Son Heung-min": "/avatars/son-heung-min.jpg",
  "Hugo Sánchez": "/avatars/hugo-sanchez.jpg",
  "Hirving Lozano": "/avatars/hirving-lozano.png",
  "Mohamed Salah": "/avatars/mohamed-salah.jpg",
  "Mahmoud El Khatib": "/avatars/mahmoud-el-khatib.jpg",
  "Mohamed Aboutrika": "/avatars/mohamed-aboutrika.jpg",
  "Diego Maradona": "/avatars/diego-maradona.jpg",
  Ronaldinho: "/avatars/ronaldinho.jpg",
  "Johan Cruyff": "/avatars/johan-cruyff.jpg",
  "Samuel Eto'o": "/avatars/samuel-eto-o.jpg",
  "Sadio Mané": "/avatars/sadio-mane.jpg",
  "Erling Haaland": "/avatars/erling-haaland.webp",
  "Robert Lewandowski": "/avatars/robert-lewandowski.jpg",
  "Ian Rush": "/avatars/ian-rush.jpg",
  "Trent Alexander-Arnold": "/avatars/trent-alexander-arnold.jpg",
  "Alan Shearer": "/avatars/alan-shearer.jpg",
  Rivaldo: "/avatars/rivaldo.jpg",
  Romário: "/avatars/romario.jpg",
  Cafu: "/avatars/cafu.jpg",
  Xavi: "/avatars/xavi.jpg",
  "Andrés Iniesta": "/avatars/andres-iniesta.jpg",
  "Iker Casillas": "/avatars/iker-casillas.jpg",
  "Gianluigi Buffon": "/avatars/gianluigi-buffon.jpg",
  "Francesco Totti": "/avatars/francesco-totti.jpg",
  "Luis Suárez": "/avatars/luis-suarez.jpg",
  "Diego Forlán": "/avatars/diego-forlan.jpg",
  "Zlatan Ibrahimović": "/avatars/zlatan-ibrahimovic.jpg",
  "Alex Morgan": "/avatars/alex-morgan.jpg",
  "Mia Hamm": "/avatars/mia-hamm.jpg",
  "Christine Sinclair": "/avatars/christine-sinclair.jpg",
  "Sam Kerr": "/avatars/sam-kerr.jpg",
  "Abedi Pele": "/avatars/abedi-pele.jpg",
  "Jay-Jay Okocha": "/avatars/jay-jay-okocha.jpg",
  "Cha Bum-kun": "/avatars/cha-bum-kun.jpg",
  "Hristo Stoichkov": "/avatars/hristo-stoichkov.jpg",
  "Megan Rapinoe": "/avatars/megan-rapinoe.jpg",
  "Franz Beckenbauer": "/avatars/franz-beckenbauer.jpg",
  "Gerd Müller": "/avatars/gerd-muller.jpg",
  "Lothar Matthäus": "/avatars/lothar-matthaus.jpg",
  "Oliver Kahn": "/avatars/oliver-kahn.jpg",
  "Michel Platini": "/avatars/michel-platini.jpg",
  Eusébio: "/avatars/eusebio.jpg",
  "Luís Figo": "/avatars/luis-figo.jpg",
  "Gheorghe Hagi": "/avatars/gheorghe-hagi.jpg",
  "Ferenc Puskás": "/avatars/ferenc-puskas.jpg",
  "Lev Yashin": "/avatars/lev-yashin.jpg",
  "Riyad Mahrez": "/avatars/riyad-mahrez.jpg",
  "Ali Daei": "/avatars/ali-daei.jpg",
  "Tim Cahill": "/avatars/tim-cahill.jpg",
  "Harry Kewell": "/avatars/harry-kewell.jpg",
  "Park Ji-sung": "/avatars/park-ji-sung.jpg",
  "Radamel Falcao": "/avatars/radamel-falcao.jpg",
  "Carlos Valderrama": "/avatars/carlos-valderrama.jpg",
  "Enzo Francescoli": "/avatars/enzo-francescoli.jpg",
  "Hope Solo": "/avatars/hope-solo.jpg",
  "Abby Wambach": "/avatars/abby-wambach.jpg",
};

function getWeekSeed() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

export function getAvatar(username: string) {
  const weekSeed = getWeekSeed();

  let hash = 0;
  const input = username + weekSeed;

  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatars[Math.abs(hash) % avatars.length];
}

export function AvatarPortrait({
  avatar,
}: {
  avatar: ReturnType<typeof getAvatar>;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = avatar.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const imageSrc = localAvatarImages[avatar.name];

  if (imageFailed || !imageSrc) {
    return (
      <span
        className="player-avatar-fallback"
        role="img"
        aria-label={avatar.name}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={`${avatar.name} (${avatar.country})`}
      title={`${avatar.name} (${avatar.country})`}
      onError={() => setImageFailed(true)}
    />
  );
}
