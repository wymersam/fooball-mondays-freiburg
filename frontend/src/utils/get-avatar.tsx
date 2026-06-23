import { FaUserAstronaut, FaUserNinja, FaUserSecret } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { RiGhost2Fill, RiAliensFill } from "react-icons/ri";
import { TbPoo } from "react-icons/tb";
import {
  GiPirateCaptain,
  GiWizardStaff,
  GiSamuraiHelmet,
  GiSpartanHelmet,
  GiRobotGolem,
  GiRoastChicken,
  GiRollerSkate,
  GiRetroController,
  GiRawEgg,
  GiRat,
  GiPirateSkull,
  GiPiranha,
  GiPinata,
  GiKiwiBird,
  GiDonerKebab,
  GiMexico,
  GiEgyptianWalk,
  GiBeerStein,
  GiCactus,
  GiCupcake,
  GiClown,
  GiDragonHead,
  GiDinosaurRex,
  GiDuck,
  GiGoblinHead,
  GiFox,
  GiDumplingBao,
  GiOstrich,
  GiFishMonster,
  GiPenguin,
  GiPig,
  GiPretzel,
  GiUnicorn,
  GiSombrero,
  GiWalrusHead,
  GiTurtle,
} from "react-icons/gi";
import { CgGhostCharacter } from "react-icons/cg";

const avatars = [
  FaUserAstronaut,
  FaUserNinja,
  FaUserSecret,
  GiPirateCaptain,
  GiWizardStaff,
  GiSamuraiHelmet,
  GiSpartanHelmet,
  GiRobotGolem,
  GiRoastChicken,
  GiRollerSkate,
  GiRetroController,
  GiRawEgg,
  GiRat,
  GiPretzel,
  GiPirateSkull,
  GiPiranha,
  GiPinata,
  GiPig,
  GiKiwiBird,
  GiDonerKebab,
  GiMexico,
  GiClown,
  GiBeerStein,
  GiCupcake,
  GiCactus,
  GiGoblinHead,
  GiDinosaurRex,
  GiEgyptianWalk,
  GiDragonHead,
  GiDuck,
  GiPenguin,
  GiOstrich,
  GiWalrusHead,
  GiFox,
  GiTurtle,
  GiSombrero,
  GiFishMonster,
  GiDumplingBao,
  MdEmojiEvents,
  CgGhostCharacter,
  RiGhost2Fill,
  RiAliensFill,
  GiUnicorn,
  TbPoo,
];

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
