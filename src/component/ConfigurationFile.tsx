import React from 'react'
import ConfigSVG from "../SVG/ConfigFile.svg"
import { useLocation, useNavigate } from "react-router-dom";
import DesignedButton from "./DesignedButton";
import BackIconSvg from "../SVG/BackBtn.svg";

const ConfigurationFile = () => {
     const navigate = useNavigate();


  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#e5e5e5] overflow-hidden">
      {/* กล่องจัดสัดส่วน 16:9 */}
      <div style={{ position: "relative", height: "100%", aspectRatio: "16/9" }}>
        
        {/* รูปพื้นหลัง SVG */}
        <img
          src={ConfigSVG}
          alt="Background"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    {/* ปุ่ม Confirm (Props เดิมเป๊ะๆ) */}
            <DesignedButton
              onClick={() => navigate("/minions")}
              color="#4C5921"
              top="87%"
              left="76.2%"
              style={{
                width: 400,
                height: 82,
                fontSize: "60px",
                objectFit: "contain",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <span
                  className="medieval-Sharp"
                  ref={(el) => {
                    if (el)
                      el.style.setProperty("font-size", "55px", "important");
                  }}
                  style={{
                    position: "relative",
                    lineHeight: "1",
                    display: "block",
                  }}
                >
                  Confirm
                </span>
              </div>
            </DesignedButton>

            {/* ปุ่ม Back (Props เดิมเป๊ะๆ) */}
            <DesignedButton
              onClick={() =>
                navigate("/minions")
              }
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                <span
                  className="medieval-Sharp"
                  ref={(el) => {
                    if (el)
                      el.style.setProperty("font-size", "45px", "important");
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
    </div>
  )
}

export default ConfigurationFile