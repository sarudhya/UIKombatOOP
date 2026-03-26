import React, { useState } from "react";
import ConfigSVG from "../SVG/ConfigFile.svg";
import { useLocation, useNavigate } from "react-router-dom";
import DesignedButton from "./DesignedButton";
import BackIconSvg from "../SVG/BackBtn.svg";
import CustomAlert from "./CustomAlert";
import { API } from "../api";
import { loadGameSessionFromStorage } from "../constants/gameSession";
import { type StrategyData } from "../constants/strategyTypes";
import {
  createGameConfigFormFromConfig,
  clearConfigDraftStorage,
  GAME_CONFIG_FIELDS,
  loadConfigDraftFromStorage,
  loadConfigFromStorage,
  parseGameConfigForm,
  saveConfigDraftToStorage,
  saveConfigToStorage,
  type GameConfig,
} from "../constants/gameConfig";

interface LocationState {
  mode?: string;
  minionCount?: number;
  strategies?: Record<string, StrategyData>;
  config?: GameConfig;
  gameID?: string;
}

const ConfigurationFile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) || {};
  const sessionState = loadGameSessionFromStorage();
  const sessionGameID = sessionState?.gameID;
  const { mode, minionCount = 1, strategies = {}, gameID: stateGameID } = state;
  const gameID = stateGameID ?? sessionGameID;
  const fallbackConfig = loadConfigFromStorage();
  const draftConfig = loadConfigDraftFromStorage();
  const initialConfig = state.config || fallbackConfig;

  const [formData, setFormData] = useState(() => draftConfig || createGameConfigFormFromConfig(initialConfig));
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (key: (typeof GAME_CONFIG_FIELDS)[number]["key"], value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      saveConfigDraftToStorage(next);
      return next;
    });
  };

  const handleConfirm = async () => {
    const validation = parseGameConfigForm(formData);

    if (!validation.isValid) {
      if (validation.missing.length > 0) {
        if (validation.missing.length > 3) {
          setAlertMessage("Please fill in all fields");
          return;
        }

        setAlertMessage(`Missing: ${validation.missing.join(", ")}`);
        return;
      }

      if (validation.invalid.length > 0) {
        setAlertMessage(`Must be non-negative numbers: ${validation.invalid.join(", ")}`);
        return;
      }
    }

    saveConfigToStorage(validation.config);
    clearConfigDraftStorage();
    try {
      if (gameID) {
        const response = await API.createConfig({
          gameID,
          ...validation.config,
        });
        console.log("Response from server (Config):", response);
      } else {
        console.warn("No gameID provided to ConfigurationFile; skipping backend config save.");
      }

      navigate("/minions", {
        state: {
          mode,
          minionCount,
          strategies,
          config: validation.config,
          gameID,
        },
      });
    } catch (error) {
      console.error("Error creating config:", error);
      setAlertMessage("Failed to save configuration to server");
    }
  };

  const handleBack = () => {
    navigate("/minions", {
      state: {
        mode,
        minionCount,
        strategies,
        gameID,
      },
    });
  };


  return (
    <div>
      <div>
        <img
          src={ConfigSVG}
          alt="Background"
          className="background"
        />

        <div className="config-fields-grid">
          {GAME_CONFIG_FIELDS.map((field) => (
            <label key={field.key} className="config-field-item" htmlFor={field.key}>
              <span className="medieval-Sharp fs-45 config-field-label">{field.label} :</span>
              <input
                id={field.key}
                type="number"
                min="0"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="config-inline-input"
              />
            </label>
          ))}
        </div>

        {alertMessage && (
          <CustomAlert
            message={alertMessage}
            boxWidth={700}
            boxHeight={150}
            boxPadding={40}
            top={30}
            left={580}
            fontSize="80px"
            onClose={() => setAlertMessage(null)}
          />
        )}

      </div>

      

      {/* Confirm Button */}
      <DesignedButton
        onClick={handleConfirm}
        color="#4C5921"
        top="87%"
        left="76.2%"
        className="confirm-btn"
      >
        <span className="medieval-Sharp confirm-text fs-60">
          Confirm
        </span>
      </DesignedButton>

      {/* Back Button */}
      <DesignedButton
        onClick={handleBack}
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

      
    </div>
  );
};

export default ConfigurationFile;