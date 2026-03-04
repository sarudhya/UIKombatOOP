import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ALL_CHARACTERS,
  MinionType,
  StrategyStatus,
} from "../constants/minionData";
import MinionCard from "../component/MinionCard";
import DesignedButton from "./DesignedButton";
import BackIconSvg from "../SVG/BackBtn.svg";
import StartGameSVG from "../SVG/StartGameBTN.svg";
import MinionSVG from "../SVG/MinionInfo.svg";

const MinionInfo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const count = location.state?.minionCount || 1;
  const strategies: StrategyStatus = location.state?.strategies || {};

  const displayMinions = ALL_CHARACTERS.slice(0, count);

  const handleMinionClick = (minion: MinionType) => {
    navigate("/strategy", {
      state: {
        minionCount: count,
        strategies: strategies,
        selectedMinion: minion,
      },
    });
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#e5e5e5] overflow-hidden">
      <div
        style={{ position: "relative", height: "100%", aspectRatio: "16/9" }}
      >
        <img
          src={MinionSVG}
          alt="Background"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "48%",
            transform: "translate(-50%, -40%)",
            width: "95%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          {displayMinions.map((minion) => (
            <MinionCard
              key={minion.name}
              minion={minion}
              isCompleted={!!strategies[minion.name]}
              onClick={handleMinionClick}
            />
          ))}
        </div>
        <DesignedButton
          onClick={() => navigate("/config")}
          color="#04478B"
          top="89.5%"
          left="33%"
          style={{
            width: 600,
            height: 100,
            objectFit: "contain",
            borderRadius: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <span
              className="medieval-Sharp"
              ref={(el) => {
                if (el) el.style.setProperty("font-size", "55px", "important");
              }}
              style={{
                position: "relative",
                lineHeight: "1",
                display: "block",
              }}
            >
              Configuraion File
            </span>
          </div>
        </DesignedButton>
        {/* Back Button */}
        <DesignedButton
          onClick={() => navigate("/confirm")}
          color="transparent"
          top="3.5%"
          left="2%"
          style={{
            backgroundColor: "transparent",
            width: "12%",
            height: "12%",
            padding: 0,
            border: "none",
            boxShadow: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={BackIconSvg}
              alt="Back"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <span
              className="medieval-Sharp"
              ref={(el) => {
                if (el) el.style.setProperty("font-size", "45px", "important");
              }}
              style={{
                position: "absolute",
                color: "#D3B14D",
                left: "70%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                fontWeight: "bold",
              }}
            >
              Back
            </span>
          </div>
        </DesignedButton>

        {/* Start Button */}
        <DesignedButton
          onClick={() => navigate("/board")} //DONT FORGET TO CHANGE**********************************************
          color="transparent"
          top="88%"
          left="82%"
          style={{
            backgroundColor: "transparent",
            width: "18%",
            height: "12%",
            padding: 0,
            border: "none",
            boxShadow: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={StartGameSVG}
              alt="Back"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <span
              className="medieval-Sharp"
              ref={(el) => {
                if (el) el.style.setProperty("font-size", "50px", "important");
              }}
              style={{
                position: "absolute",
                color: "#EEE2B8",
                left: "25%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              Start
            </span>
          </div>
        </DesignedButton>
      </div>
    </div>
  );
};

export default MinionInfo;
