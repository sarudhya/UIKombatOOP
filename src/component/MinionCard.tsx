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

  const scale = isMrBeast ? 1.35 : isItchBall ? 1.15 : 1;


  return (
    <div
      className="card-minion card-minion-clickable"
      onClick={() => onClick(minion)}
    >

      {/* IMAGE AREA */}
      <div
        className="card-minion-media card-minion-media-scaled"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "bottom center",
        }}
      >
        <img
          src={minion.src}
          alt={minion.name}
          className="card-minion-image"
          style={{
            // ถ้าอยากขยับตำแหน่ง
            transform: isMrBeast
              ? "translateY(80px)"
              : isItchBall
              ? "translateY(50px)"
              : "none",
          }}
        />
      </div>

      {/* STRATEGY TEXT */}
      <div className="card-minion-footer card-minion-overlay">
        {isCompleted && (
          <p className="medieval-Sharp card-minion-strategy-label">
            Strategy
            <img src={CheckSVG} alt="CheckIcon" className="card-minion-check" />
          </p>
        )}
      </div>
    </div>
  );
};

export default MinionCard;