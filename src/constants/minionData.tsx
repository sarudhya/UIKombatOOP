import ShrekSvg from "../SVG/Shrek.svg";
import DonkeySvg from "../SVG/Donkey.svg";
import MrBeastSvg from "../SVG/MrBeast.svg";
import MarkipilerSvg from "../SVG/Markipiler.svg";
import ItchBallSvg from "../SVG/ItchBall.svg";

// กำหนดโครงสร้างข้อมูลตัวละคร
export interface MinionType {
  name: string;
  src: string;
}

// เก็บสถานะการกรอกข้อมูล (ชื่อตัวละคร: สถานะ)
export interface StrategyStatus {
  [key: string]: boolean;
}

// รายชื่อตัวละครทั้งหมด
export const ALL_CHARACTERS: MinionType[] = [
  { name: "Shrek", src: ShrekSvg },
  { name: "Donkey", src: DonkeySvg },
  { name: "MrBeast", src: MrBeastSvg },
  { name: "Markipiler", src: MarkipilerSvg },
  { name: "ItchBall", src: ItchBallSvg },
];