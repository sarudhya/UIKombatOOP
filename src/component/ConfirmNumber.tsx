import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmSvg from "../SVG/ConfirmNumber.svg";
import BackIconSvg from "../SVG/BackBtn.svg";
import DesignedButton from "./DesignedButton";
import { API } from "../api";
import { ALL_CHARACTERS } from "../constants/minionData";


const ConfirmNumber = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const location = useLocation();
  const mode = location.state?.mode || "Solitaire";
  const gameID = location.state?.gameID || "";

  const handleConfirm = async () => {
    try {
      // เรียกใช้ API ส่งจำนวน Minion และ GameID ที่รับมาจาก state
      const response = await API.createNumberOfMinion({ numberOfMinion: count, gameID });
      console.log("Response from server (Number of Minions):", response);

      // response คาดว่าเป็น List<UUID> สำหรับ minion type แต่ละตัว (ตามลำดับ)
      const uuidList: string[] = Array.isArray(response) ? response : [];

      uuidList.forEach((uuid, index) => {
        if (ALL_CHARACTERS[index]) {
          ALL_CHARACTERS[index].id = uuid;
        }
      });

      navigate("/minions", {
        state: {
          mode,
          gameID,
          minionCount: count,
        },
      });
    } catch (error) {
      console.error("Error setting number of minions:", error);
    }
  };

  return (
    <div>
      <div>
        {/* Background */}
        <img
          src={ConfirmSvg}
          alt="Background"
          className="background"
        />

        {/* Back Button */}
        <DesignedButton
          onClick={() => {
            
            navigate("/");
          }}
          disableHover
          color="transparent"
          top="44%"
          left="2%"
          className="back-btn"
        >
          <div className="back-wrapper">
            <img src={BackIconSvg} alt="Back" className="back-icon" />
            <span className="medieval-Sharp back-text fs-45">Back</span>
          </div>
        </DesignedButton>

        {/* Arrow Left */}
        <DesignedButton
          onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
          disableHover
          top="46%"
          left="29%"
          color="transparent"
          className="arrow-btn"
        >
          <span className="arrow-text medieval-Sharp">{"<"}</span>
        </DesignedButton>

        {/* Arrow Right */}
        <DesignedButton
          onClick={() => setCount((prev) => (prev < 5 ? prev + 1 : 5))}
          disableHover
          top="46%"
          left="65%"
          color="transparent"
          className="arrow-btn"
        >
          <span className="arrow-text medieval-Sharp">{">"}</span>
        </DesignedButton>

        {/* Number */}
        <div className="confirm-number big-number uncial-font">
          <span>{count}</span>
        </div>

        {/* Confirm Button */}
        <DesignedButton
          onClick={handleConfirm}
          color="#4C5921"
          top="75%"
          left="50%"
          className="confirm-btn confirm-center"
        >
          <span className="medieval-Sharp confirm-text fs-60">Confirm</span>
        </DesignedButton>
      </div>
    </div>
  );
};

export default ConfirmNumber;
