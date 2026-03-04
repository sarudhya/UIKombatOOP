import React from "react";
import { MinionType } from "../constants/minionData";
import CheckSVG from "../SVG/Check.png";

interface MinionCardProps {
  minion: MinionType;
  isCompleted: boolean;
  onClick: (minion: MinionType) => void;
}

const MinionCard: React.FC<MinionCardProps> = ({
  minion,
  isCompleted,
  onClick,
}) => {
  const isMrBeast = minion.name === "MrBeast";
  const isItchBall = minion.name === "ItchBall";

  return (
    <div
      key={minion.name}
      className="flex flex-col items-center animate-fadeIn cursor-pointer"
      onClick={() => onClick(minion)}
      style={{
        flexShrink: 0,
        width: "20%",
        transform: isMrBeast
          ? "scale(1.35)"
          : isItchBall
            ? "scale(1.15)"
            : "scale(1)",
        transition: "transform 0.3s ease",
        position: "relative", // เพิ่มเพื่อให้ลูกอ้างอิงตำแหน่งได้
        height: "600px",      // กำหนดความสูงรวมให้เท่ากันเพื่อให้จุด Bottom เท่ากัน
      }}
    >
      <div
        style={{
          width: "100%",
          height: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={minion.src}
          alt={minion.name}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            width: isMrBeast ? "120%" : "100%",
          }}
        />
      </div>

      <div 
        className="text-center" 
        style={{ 
          pointerEvents: "none",
          /* ล็อกตำแหน่งให้อยู่ล่างสุดของการ์ดเสมอ */
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0
        }}
      >
        {isCompleted && (
          <p
            className="medieval-Sharp"
            ref={(el) => {
              if (el) {
                // บังคับขนาด Font ให้เท่ากันทุกใบโดยไม่สน Scale ของตัวแม่
                el.style.setProperty("font-size", "55px", "important");
              }
            }}
            style={{
              color: "#5A7032",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: "0 auto",
              fontFamily: "'Uncial Antiqua', serif", // ใช้ฟอนต์ที่คุณ import มา
            }}
          >
            Strategy
            <img src={CheckSVG} alt="CheckIcon" style={{ width: "50px", height: "auto" }}></img>
          </p>
        )}
      </div>
    </div>
  );
};

export default MinionCard;