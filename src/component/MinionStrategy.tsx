import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DesignedButton from "./DesignedButton";
import StrategySVG from "../SVG/MinionStrategy.svg";
import BackIconSvg from "../SVG/BackBtn.svg";
import AddFileSVG from "../SVG/File_Add.svg";

const MinionStrategy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { minionCount, strategies = {}, selectedMinion } = location.state || {};

  const existingData = selectedMinion ? strategies[selectedMinion.name] : {};
  const [customName, setCustomName] = useState(
    existingData?.customName || selectedMinion?.name || "",
  );
  const [fileText, setFileText] = useState(existingData?.fileText || "");
  const [defense, setDefense] = useState(existingData?.defense || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".txt")) {
      setFileText(file.name);
    } else if (file) {
      alert("กรุณาใส่ไฟล์นามสกุล .txt เท่านั้นงับ!");
    }
  };

  const handleConfirm = () => {
    if (!customName.trim() || !fileText || !defense) {
      alert(
        "ข้อมูลยังไม่ครบ! กรุณาใส่ชื่อ, ไฟล์ .txt และค่า Defense ให้เรียบร้อยก่อนนะคะ",
      );
      return;
    }

    const updatedStrategies = {
      ...strategies,
      [selectedMinion.name]: {
        completed: true,
        customName,
        fileText,
        defense,
      },
    };

    navigate("/minions", {
      state: { minionCount, strategies: updatedStrategies },
    });
  };

  if (!selectedMinion) return null;

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#D6CA9E] overflow-hidden">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; overflow: hidden; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div
        style={{ position: "relative", height: "100%", aspectRatio: "16/9" }}
      >
        {/* Layer 0: Background SVG */}
        <img
          src={StrategySVG}
          alt="Background"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 0,
          }}
        />

        {/* Layer 1: Content (จัดการแยกซ้าย-ขวา) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8%",
            pointerEvents: "none",
          }}
        >
          {/* ฝั่งซ้าย: กล่องข้อมูล (เปลี่ยนเป็นโปร่งใส Background: Transparent) */}
          <div
            style={{
              width: "54%",
              height: "90%",
              backgroundColor: "transparent", // เปลี่ยนสีเป็นใสตามสั่ง
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "auto",
              gap: "135px"
            }}
          >
            {/* 1. ส่วนชื่อตัวละคร */}
            <div className="flex items-center mb-10 w-full justify-center">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className=" text-5xl text-center UncialFont w-full"
                style={{
                  backgroundColor: "#D3B14D",
                  color: "#902E01",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "500px",
                  border: "none"
                }}
              />
            </div>

            {/* 2. ส่วนเลือกไฟล์ */}
            <div
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {/* แสดงข้อความตามสถานะของไฟล์ */}
              <p
                className=" text-4xl UncialFont"
                ref={(el) => {
                  if (el) {
                    el.style.setProperty("font-size", "60px", "important");
                  }
                }}
                style={{
                  color: "#EEE2B8",
                  padding: "20px",
                  border: "dashed",
                }}
              >
                {fileText ? fileText : "File Text Here"}
                <img
                  src={AddFileSVG}
                  alt= "EditIcon"
                  style={{
                    width:"80px",
                    position: "relative",
                    top: "-5px"
                  }}
                ></img>
              </p>
            </div>

            {/* 3. ส่วน Defense (แก้ให้พิมพ์ได้ปกติ และไม่มีกรอบ) */}
            <div className="flex items-center gap-6 justify-center">
              <span
                className=" text-5xl medieval-Sharp "
                ref={(el) => {
                  if (el) {
                    el.style.setProperty("font-size", "55px", "important");
                  }
                }}
                style={{
                  color: "#EEE2B8",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                }}
              >
                Defense:{" "}
              </span>

              <input
                type="number"
                value={defense}
                onChange={(e) => setDefense(e.target.value)}
                ref={(el) => {
                  if (el) {
                    el.style.setProperty("font-size", "60px", "important");
                  }
                }}
                style={{
                  backgroundColor: "#D3B14D",
                  color: "#902E01",
                  width: "105px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                }}
                className="medieval-Sharp"
              />
            </div>
          </div>

          {/* ฝั่งขวา: รูปมินเนี่ยน */}
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <img
              src={selectedMinion.src}
              alt={selectedMinion.name}
              style={{
                maxHeight: "80%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Layer 2: ปุ่ม Confirm และ Back (ดึง Props และสไตล์เดิมของคุณกลับมา) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            {/* ปุ่ม Confirm (Props เดิมเป๊ะๆ) */}
            <DesignedButton
              onClick={handleConfirm}
              color="#4C5921"
              top="87%"
              left="65%"
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
                navigate("/minions", { state: { minionCount, strategies } })
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
        </div>
      </div>
    </div>
  );
};

export default MinionStrategy;
