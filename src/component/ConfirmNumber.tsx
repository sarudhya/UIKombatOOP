import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmSvg from "../SVG/ConfirmNumber.svg";
import BackIconSvg from "../SVG/BackBtn.svg";
import DesignedButton from "./DesignedButton";

const ConfirmNumber = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#e5e5e5] overflow-hidden">
      {/* กล่องจัดสัดส่วน 16:9 */}
      <div style={{ position: "relative", height: "100%", aspectRatio: "16/9" }}>
        
        {/* รูปพื้นหลัง SVG */}
        <img
          src={ConfirmSvg}
          alt="Background"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {/* --- วางปุ่มทับลงบนรูปภาพ --- */}

        {/* 1. ปุ่ม Back (ด้านซ้าย) */}
        <DesignedButton
          onClick={() => navigate("/")}
          color="transparent" // ล้างสีพื้นหลัง default
          top="44%"
          left="2%"
          style={{
            backgroundColor: "transparent",
            width: "12%",
            height: "10%",
            borderRadius: 0,
            padding: 0,
            overflow: "visible", // ให้ content ข้างในล้นได้ถ้าจำเป็น
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={BackIconSvg}
              alt="Back"
              style={{
                width: "261px",
                height: "90px",
                objectFit: "contain",
              }}
            />
            <span
              className="medieval-Sharp"
              ref={(el) => {
                if (el) {
                  el.style.setProperty("font-size", "55px", "important"); 
                }
              }}
              style={{
                position: "absolute",
                fontSize: "60px",
                color: "#D3B14D",
                left: "75%", // ปรับตำแหน่งตัวอักษรให้ตรงกลางหัวลูกศร
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              Back
            </span>
          </div>
        </DesignedButton>

        {/* 2. ลูกศรลดตัวเลข < */}
        <DesignedButton
          onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
          top="45%"
          left="29%"
          color="transparent"
          fontColor="#5E1B28"
          style={{
            backgroundColor: "transparent",
            width: "6%",
            height: "10%",
            borderRadius: 0,
            padding: 0,
          }}
        >
          <span style={{ fontSize: "120px", fontWeight: "bold", lineHeight: 0 }}>{"<"}</span>
        </DesignedButton>

        {/* 3. ลูกศรเพิ่มตัวเลข > */}
        <DesignedButton
          onClick={() => setCount((prev) => (prev < 5 ? prev + 1 : 5))}
          top="45%"
          left="65%" // ปรับจาก right เป็น left เพื่อให้ทำงานร่วมกับ absolute ของ component ได้ดีขึ้น
          color="transparent"
          fontColor="#5E1B28"
          style={{
            backgroundColor: "transparent",
            width: "6%",
            height: "10%",
            borderRadius: 0,
            padding: 0,
          }}
        >
          <span style={{ fontSize: "120px", fontWeight: "bold", lineHeight: 0 }}>{">"}</span>
        </DesignedButton>

        {/* 4. ตัวเลข (กึ่งกลาง) */}
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "250px",
            fontFamily: "'Uncial Antiqua', serif",
            color: "#101324",
            pointerEvents: "none",
          }}
        >
          {count}
        </div>

        {/* 5. ปุ่ม Confirm (ด้านล่าง) */}
        <DesignedButton
          onClick={() => navigate("/minions" ,{ state: { minionCount: count }})}
          color="#4C5921" // เปลี่ยนเป็นสีเขียว
          top="75%"
          left="50%"
          style={{
            transform: "translateX(-50%)", // จัดให้อยู่กึ่งกลางจอพอดี
            width: 540,
            height: 140,
            fontSize: "60px",
            borderRadius: 0
          }}
        >
          confirm
        </DesignedButton>
      </div>
    </div>
  );
};

export default ConfirmNumber;