export interface StrategyData {
  completed: boolean;
  customName: string;
  fileText: string;
  txtFile?: File | null;
  defense: number | string;
  // เก็บ UUID ของ minion type ไว้ใน strategy โดยตรง เพื่อใช้ยืนยันกับ backend
  minionTypeID: string;
}