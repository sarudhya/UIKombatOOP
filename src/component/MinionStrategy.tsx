import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DesignedButton from "./DesignedButton";
import CustomAlert from "./CustomAlert";
import StrategySVG from "../SVG/MinionStrategy.svg";
import BackIconSvg from "../SVG/BackBtn.svg";
import AddFileSVG from "../SVG/File_Add.svg";
import { API } from "../api";
import { type StrategyData } from "../constants/strategyTypes";
import { type GameConfig } from "../constants/gameConfig";
import { type MinionType } from "../constants/minionData";
import {
  loadGameSessionFromStorage,
  serializeGameStrategies,
  saveGameSessionToStorage,
} from "../constants/gameSession";

interface LocationState {
  mode?: string;
  minionCount: number;
  strategies: Record<string, StrategyData>;
  selectedMinion: MinionType;
  config?: GameConfig;
  gameID?: string;
}

const MINION_SCALES: Record<string, number> = {
  Shrek: 0.7,
  Donkey: 0.65,
  MrBeast: 1.6,
  Markipiler: 0.65,
  ItchBall: 1.7,
};

// ------------------------------------------------------------------
// 2. CUSTOM HOOK (แยก Logic การจัดการฟอร์มออกจาก UI)
// ------------------------------------------------------------------

const useStrategyForm = (initialData?: StrategyData, defaultName?: string) => {
  const [customName, setCustomName] = useState(initialData?.customName || defaultName || "");
  const [fileText, setFileText] = useState(initialData?.fileText || "");
  const [txtFile, setTxtFile] = useState<File | null>(initialData?.txtFile ?? null);
  const [defense, setDefense] = useState<number | string>(initialData?.defense || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return null;

    if (file.name.toLowerCase().endsWith(".txt")) {
      setTxtFile(file);
      setFileText(file.name);
      return null;
    }

    return "Please upload a .txt file";
  };

  const validateForm = () => {
    if (!txtFile && !fileText) return "Please upload a .txt file";
    if (!customName.trim()) return "Please enter a name";
    if (defense === "") return "Please enter defense value";
    if (Number(defense) < 0) return "Please enter a non-negative number for Defense";
    
  };

  return { customName, setCustomName, fileText, txtFile, defense, setDefense, handleFileChange, validateForm };
};

// ------------------------------------------------------------------
// 3. SUB-COMPONENTS (แยกชิ้นส่วน UI เล็กๆ เพื่อให้อ่านง่าย)
// ------------------------------------------------------------------

const FileUploader = ({ fileText, onChange }: { fileText: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div onClick={() => fileInputRef.current?.click()} className="upload-click-area">
      <input type="file" accept=".txt" ref={fileInputRef} onChange={onChange} className="input-hidden" />
      <div className="file-box uncial-font fs-45 flex-center">
        {fileText || "File Text Here"}
        <img src={AddFileSVG} alt="Add File" className="icon-upload-add" />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 4. MAIN COMPONENT (ประกอบร่าง)
// ------------------------------------------------------------------

const MinionStrategy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [nameFontSize, setNameFontSize] = useState(60);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // ดึงข้อมูลจาก Location State อย่างปลอดภัย
  const state = location.state as LocationState | null;
  const sessionState = loadGameSessionFromStorage();
  const { mode, minionCount, strategies = {}, selectedMinion, config, gameID } = state || {};
  const resolvedMode = mode ?? sessionState?.mode;
  const resolvedMinionCount = minionCount ?? sessionState?.minionCount ?? 1;
  const resolvedStrategies = (strategies || sessionState?.strategies || {}) as Record<string, StrategyData>;
  const resolvedGameID = gameID ?? sessionState?.gameID;

  // เรียกใช้ Logic จาก Custom Hook
  const existingData = selectedMinion ? resolvedStrategies[selectedMinion.id] : undefined;
  const { 
    customName, setCustomName, 
    fileText, txtFile, handleFileChange, 
    defense, setDefense, 
    validateForm 
  } = useStrategyForm(existingData, selectedMinion?.name);

  useLayoutEffect(() => {
    const input = nameInputRef.current;
    if (!input) return;

    const defaultSize = 60;
    const minSize = 28;

    const fitName = () => {
      let nextSize = defaultSize;
      input.style.fontSize = `${nextSize}px`;

      while (input.scrollWidth > input.clientWidth && nextSize > minSize) {
        nextSize -= 1;
        input.style.fontSize = `${nextSize}px`;
      }

      setNameFontSize(nextSize);
    };

    fitName();

    const resizeObserver = new ResizeObserver(() => {
      fitName();
    });

    resizeObserver.observe(input);

    return () => {
      resizeObserver.disconnect();
    };
  }, [customName]);

  // ป้องกันกรณีเข้าหน้านี้โดยไม่มี Data
  useEffect(() => {
    if (!selectedMinion) navigate("/"); // หรือกลับไปหน้าเลือกตัวละคร
  }, [selectedMinion, navigate]);

  if (!selectedMinion) return null;

  // Actions
  const handleConfirm = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setAlertMessage(validationMessage);
      return;
    }

    if (!resolvedGameID) {
      setAlertMessage("Game session not found");
      return;
    }

    try {
      // บันทึกข้อมูล minion หลัก (ชื่อ + defense) ไป Spring Boot
      await API.createUpdateMinionInfo({
        gameID: resolvedGameID,
        minionTypeID: selectedMinion.id,
        minionName: customName.trim(),
        defenseFactor: Number(defense),
      });

      // อัปโหลดไฟล์กลยุทธ์ (.txt) แยก endpoint
      if (txtFile) {
        await API.createUpdateMinionStrategy({
          gameID: resolvedGameID,
          minionTypeID: selectedMinion.id,
          file: txtFile,
        });
      }
    } catch (error) {
      console.error("Error saving minion strategy:", error);
      setAlertMessage("Failed to save strategy to server");
      return;
    }

    const updatedStrategies = {
      ...resolvedStrategies,
      [selectedMinion.id]: {
        completed: true,
        customName,
        fileText,
        txtFile,
        defense,
        minionTypeID: selectedMinion.id,
      },
    };

    saveGameSessionToStorage({
      mode: resolvedMode,
      minionCount: resolvedMinionCount,
      strategies: serializeGameStrategies(updatedStrategies),
      config,
      gameID: resolvedGameID,
    });

    navigate("/minions", {
      state: {
        mode: resolvedMode,
        minionCount: resolvedMinionCount,
        strategies: updatedStrategies,
        config,
        gameID: resolvedGameID,
      },
    });
  };

  const handleBack = () => {
    navigate("/minions", { state: { mode: resolvedMode, minionCount: resolvedMinionCount, strategies: resolvedStrategies, config, gameID: resolvedGameID } });
  };

  return (
    <div>
      <div>
        
        {/* Background */}
        <img src={StrategySVG} alt="Background" className="background" />

        {/* Content Layout */}
        <div className="strategy-layout">
          
          {/* --- LEFT PANEL: Form Inputs --- */}
          <div className="strategy-left">
            <input
              ref={nameInputRef}
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="input-name uncial-font fs-60 w-full"
              style={{ fontSize: `${nameFontSize}px` }}
            />

            <FileUploader
              fileText={fileText}
              onChange={(e) => {
                const fileMessage = handleFileChange(e);
                if (fileMessage) setAlertMessage(fileMessage);
              }}
            />

            <div className="flex-center w-full">
              <span className="medieval-Sharp fs-55 defense-text ">Defense:</span>
              <input
                type="number"
                value={defense}
                onChange={(e) => setDefense(e.target.value)}
                className="input-defense medieval-Sharp fs-60 input-defense-compact"
              />
            </div>
          </div>

          {/* --- RIGHT PANEL: Minion Preview --- */}
          <div className="strategy-right">
            <img
              src={selectedMinion.src}
              alt={selectedMinion.name}
              className="strategy-minion"
              style={{ transform: `scale(${MINION_SCALES[selectedMinion.name] ?? 1})` }}
            />
          </div>
        </div>

        {/* --- ACTIONS BUTTONS --- */}
        <DesignedButton onClick={handleConfirm} color="#4C5921" top="87%" left="62.5%" className="confirm-btn">
          <span className="medieval-Sharp confirm-text fs-60">Confirm</span>
        </DesignedButton>

        <DesignedButton onClick={handleBack} color="transparent" disableHover top="3.5%" left="2%" className="back-btn">
          <div className="back-wrapper">
            <img src={BackIconSvg} alt="Back" className="back-icon" />
            <span className="medieval-Sharp back-text fs-45">Back</span>
          </div>
        </DesignedButton>

        {alertMessage && (
          <CustomAlert
            color="var(--color-maroon)"
            message={alertMessage}
            top={30}
            left={1000}
            fontSize="80px"
            onClose={() => setAlertMessage(null)}
            
          />
        )}

      </div>

    </div>
  );
};

export default MinionStrategy;
