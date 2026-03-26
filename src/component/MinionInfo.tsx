import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ALL_CHARACTERS,
  MinionType,
  
} from "../constants/minionData";
import MinionCard from "../component/MinionCard";
import DesignedButton from "./DesignedButton";
import BackIconSvg from "../SVG/BackBtn.svg";
import StartGameSVG from "../SVG/StartGameBTN.svg";
import MinionSVG from "../SVG/MinionInfo.svg";
import CustomAlert from "./CustomAlert";
import { type StrategyData } from "../constants/strategyTypes";
import {
  clearConfigDraftStorage,
  clearConfigStorage,
  getMissingConfigLabels,
  loadConfigFromStorage,
  type GameConfig,
} from "../constants/gameConfig";
import {
  loadGameSessionFromStorage,
  serializeGameStrategies,
  saveGameSessionToStorage,
  clearGameSessionStorage,
} from "../constants/gameSession";

const MinionInfo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const sessionState = loadGameSessionFromStorage();

  const count = location.state?.minionCount ?? sessionState?.minionCount ?? 1;
  const strategies = (location.state?.strategies || sessionState?.strategies || {}) as Record<string, StrategyData | boolean>;
  const routeConfig = location.state?.config as GameConfig | undefined;
  const gameConfig = routeConfig || loadConfigFromStorage();

  const displayMinions = ALL_CHARACTERS.slice(0, count);

  const { mode, gameID, minionCount, minionTypeIDs } = location.state || {};

  const handleGoToStrategy = (minionData: MinionType, index: number) => {
    // ดึง UUID ให้ตรงกับลำดับของ minion ที่ถูกเลือก
    const specificMinionID = minionTypeIDs[index]; 

    navigate("/strategy", {
      state: {
        mode,
        gameID,
        minionCount,
        selectedMinion: {
          ...minionData,
          id: specificMinionID // ✅ ยัด ID ที่ถูกต้องใส่เข้าไปใน selectedMinion
        }
      }
    });
  };

  const isStrategyCompleted = (value: StrategyData | boolean | undefined) => {
    if (!value) return false;
    if (typeof value === "boolean") return value;
    return Boolean(value.completed);
  };

  const getMissingStrategyNames = () => {
    return displayMinions
      .filter((minion) => !isStrategyCompleted(strategies[minion.id]))
      .map((minion) => minion.name);
  };

  const handleMinionClick = (minion: MinionType) => {
    navigate("/strategy", {
      state: {
        mode,
        minionCount: count,
        strategies: strategies,
        selectedMinion: minion,
        config: gameConfig,
        gameID,
      },
    });
  };

  const handleOpenConfig = () => {
    navigate("/config", {
      state: {
        mode,
        minionCount: count,
        strategies,
        config: gameConfig,
        gameID,
      },
    });
  };

  const handleStart = () => {
    const missingStrategies = getMissingStrategyNames();
    const missingConfig = getMissingConfigLabels(gameConfig);
    const issues: string[] = [];

    if (missingStrategies.length > 0) {
      issues.push(`Missing strategy: ${missingStrategies.join(", ")}`);
    }

    if (missingConfig.length > 0) {
      if(missingConfig.length > 3) {
        setAlertMessage("Please complete the configuration file");
        return;
      }
      issues.push(`Missing config: ${missingConfig.join(", ")}`);
    }

    if (issues.length > 0) {
      setAlertMessage(issues.join(" | "));
      return;
    }

    saveGameSessionToStorage({
      mode,
      minionCount: count,
      strategies: serializeGameStrategies(strategies),
      gameID,
    });

    navigate("/board", {
      state: {
        mode,
        minionCount: count,
        strategies,
        config: gameConfig,
        gameID,
      },
    });
  };

  return (
    <div>
      <div>
        <img
          src={MinionSVG}
          alt="Background"
          className="background"
        />

        <div className="minion-list-wrap">
          {displayMinions.map((minion) => (
            <MinionCard
              key={minion.id || minion.name}
              minion={minion}
              isCompleted={isStrategyCompleted(strategies[minion.id])}
              onClick={handleMinionClick}
            />
          ))}
        </div>

        <DesignedButton
          onClick={handleOpenConfig}
          color="#04478B"
          top="89.5%"
          left="33%"
          className="btn-config-file"
        >
          <div>
            <span className="medieval-Sharp fs-60 text-single-line">
              Configuration File
            </span>
          </div>
        </DesignedButton>

        {/* Back Button */}
      <DesignedButton
        onClick={() => {
          // ล้างข้อมูล config และกลยุทธ์ของ minion ทุกครั้งที่กด Back
          clearConfigDraftStorage();
          clearConfigStorage();
          clearGameSessionStorage();
          navigate("/confirm", { state: { mode } });
        }}
        color="transparent"
        disableHover
        top="3.5%"
        left="2%"
        className="back-btn"
      >
        <div className="back-wrapper">

          <img
            src={BackIconSvg}
            alt="Back"
            className="back-icon"
          />

          <span className="medieval-Sharp back-text fs-45">
            Back
          </span>

        </div>
      </DesignedButton>

        {/* Start Button */}
        <DesignedButton
          onClick={handleStart}
          color="transparent"
          top="88%"
          left="82%"
          disableHover
        >
          <div
            className="back-wrapper"
          >
            <img
              src={StartGameSVG}
              alt="Back"
              className="media-contain"
            />
            <span
              className="medieval-Sharp start-btn-text fs-60"
            >
              Start
            </span>
          </div>
        </DesignedButton>

        {alertMessage && (
          <CustomAlert
            color="var(--color-mahogany)"
            message={alertMessage}
            top={30}
            left={535}
            fontSize="60px"
            onClose={() => setAlertMessage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MinionInfo;
