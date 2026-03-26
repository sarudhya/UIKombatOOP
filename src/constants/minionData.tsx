import ShrekSvg from "../SVG/Shrek.svg";
import DonkeySvg from "../SVG/Donkey.svg";
import MrBeastSvg from "../SVG/MrBeast.svg";
import MarkipilerSvg from "../SVG/Markipiler.svg";
import ItchBallSvg from "../SVG/ItchBall.svg";

// กำหนดโครงสร้างข้อมูลตัวละคร
// id ใช้เก็บ UUID ของ minion type ที่ Spring Boot ใช้
export interface MinionType {
  id: string;
  name: string;
  src: string;
}

// รายชื่อตัวละครทั้งหมด
// TODO: แทนที่ "" ด้วย UUID จริงจาก backend ของคุณ
export const ALL_CHARACTERS: MinionType[] = [
  { id: "", name: "Shrek", src: ShrekSvg },
  { id: "", name: "Donkey", src: DonkeySvg },
  { id: "", name: "MrBeast", src: MrBeastSvg },
  { id: "", name: "Markipiler", src: MarkipilerSvg },
  { id: "", name: "ItchBall", src: ItchBallSvg },
];