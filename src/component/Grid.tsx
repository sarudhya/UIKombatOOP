import React from "react";
import { type Cell } from "../constants/boardTypes";
import PlusSVG from "../SVG/plus.svg";

interface GridProps {
  grid: Cell[][];
  minionAssets: Record<string, string>;
  onHexClick: (r: number, c: number) => void;
  buyableCells: Set<string>;
  selectedBuyHexCell: string | null;
  canPlaceMinion: boolean;
  isFlipped: boolean;
}

const HEX_WIDTH = 137;
const HEX_HEIGHT = 120;

const Grid = ({
  grid,
  minionAssets,
  onHexClick,
  buyableCells,
  selectedBuyHexCell,
  canPlaceMinion,
  isFlipped,
}: GridProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "30px",
        right: "120px",
        width: "850px",
        height: "1020px",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const left = c * (HEX_WIDTH * 0.75);
          const top = r * HEX_HEIGHT + (c % 2 === 0 ? HEX_HEIGHT / 2 : 0);

          const cellKey = `${r}-${c}`;
          const isBuyable = buyableCells.has(cellKey);
          const isSelectedHex = selectedBuyHexCell === cellKey;
          const showPlus = isBuyable && !isSelectedHex;

          let color = "#cfc5b3";

          if (cell.owner === 0) color = cell.minion ? "#6F92AE" : "#8f86a4";
          if (cell.owner === 1) color = cell.minion ? "#5A7032" : "#d4b24c";
          if (isSelectedHex) color = "var(--color-maroon)";

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => onHexClick(r, c)}
              style={{
                position: "absolute",
                width: HEX_WIDTH,
                height: HEX_HEIGHT,
                left: left,
                top: top,
                background: "#000000",
                clipPath:
                  "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
                cursor: (canPlaceMinion && cell.owner !== null) || isBuyable ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0.5px",
                  left: "0.5px",
                  right: "0.5px",
                  bottom: "0.5px",
                  background: color,
                  clipPath:
                    "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
                }}
              />

              {showPlus ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={PlusSVG}
                    alt="Plus"
                    className="grid-plus-icon"
                  />
                </div>
              ) : null}

              {cell.minion && minionAssets[cell.minion] ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={minionAssets[cell.minion]}
                    alt={cell.minion}
                    style={{
                      width: "72%",
                      height: "72%",
                      objectFit: "contain",
                      transform: [cell.minion === "MrBeast" ? "translateY(6px) scale(1.1)" : "", isFlipped ? "rotate(180deg)" : ""]
                        .filter(Boolean)
                        .join(" "),
                    }}
                  />
                </div>
              ) : null}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default Grid;
