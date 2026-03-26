import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WinnerPageSVG from "../SVG/winnerPage.svg";
import DesignedButton from "./DesignedButton";
import { clearGameSessionStorage } from "../constants/gameSession";
import BackIconSvg from "../SVG/BackBtn.svg";

const WinnerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode as string | undefined;
  const winnerName = location.state?.winnerName as string | undefined;

  const fallbackWinnerName =
    mode === "Solitaire"
      ? "Player"
      : mode === "Duel"
        ? "Player 1"
        : mode === "Auto"
          ? "Bot 1"
          : "Winner";

  const displayWinnerName = winnerName || fallbackWinnerName;

  return (
    <div>
      <div>
        <img
          src={WinnerPageSVG}
          alt="Winner Page"
          className="background"
        />
        <div
          className="absolute full flex-center"
          style={{
            pointerEvents: "none",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <span
            className="jacquard-24 fs-300"
            style={{
              position: "absolute",
              left: "10%",
              top: "30%",
              color: "var(--color-gold)",
              textShadow: "1px 4px 0 var(--color-mahogany)",
            }}
          >
            {displayWinnerName}
          </span>
        </div>

        <DesignedButton
          onClick={() => {
            clearGameSessionStorage();
            navigate("/");
          }}
          disableHover
          color="transparent"
          top="89%"
          left="2%"
          className="back-btn"
        >
          <div className="back-wrapper">
            <img src={BackIconSvg} alt="Back" className="back-icon" />
            <span className="medieval-Sharp back-text fs-45">Back</span>
          </div>
        </DesignedButton>
      </div>
    </div>
  );
};

export default WinnerPage;
