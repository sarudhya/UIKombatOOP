import React from 'react'
import BoardSVG from "../SVG/Board.svg"

const Board = () => {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#e5e5e5] overflow-hidden">
      {/* กล่องจัดสัดส่วน 16:9 */}
      <div style={{ position: "relative", height: "100%", aspectRatio: "16/9" }}>
        
        {/* รูปพื้นหลัง SVG */}
        <img
          src={BoardSVG}
          alt="Background"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  )
}

export default Board