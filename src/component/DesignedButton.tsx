import React, { Children, useState, ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";
  
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: string;
  fontColor?: string;
  onClick: () => void;
  top?: string | number;
  left?: string | number;
  style?: CSSProperties;
}

const DesignedButton = ({
  children,
  onClick,
  color = "#5E1B28",
  fontColor = "#D3B14D",
  top,
  left,
  style,
  ...rest
}: Props) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const hoverColor = "#464C10"; 
    const hoverFont = "#D6B580"
    const activeColor = "#6F92AE";
    const activeFont = "#2A0B11";

  return (
    <button
      className="btn medieval-Sharp"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...rest}
      style={{
        backgroundColor: isActive ? activeColor : (isHovered ? hoverColor : color),
        color: isActive ? activeFont : (isHovered ? hoverFont :fontColor),
        
        position: "absolute",
        top: top,
        left: left,
        
        border: "none",
        outline: "none",
        
        borderRadius: 35,
        width: 455,
        height: 128,
        display: "flex",          
        justifyContent: "center", // จัดกึ่งกลางแนวนอน (X)
        alignItems: "center",     // จัดกึ่งกลางแนวตั้ง (Y)
        padding: 25,

        ...style,        
      }}
    >
      {children}
    </button>
  );
};
    
export default DesignedButton;
