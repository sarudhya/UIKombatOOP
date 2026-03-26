import React, { useState, ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: string;
  fontColor?: string;
  onClick: () => void;
  top?: string | number;
  left?: string | number;
  style?: CSSProperties;
  disableHover?: boolean;
}

const DesignedButton = ({
  children,
  onClick,
  color = "#5E1B28",
  fontColor = "#D3B14D",
  top,
  left,
  style = {},
  disableHover = false,
  ...rest
}: Props) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const hoverColor = "#464C10";
  const hoverFont = "#D6B580";

  const activeColor = "#6F92AE";
  const activeFont = "#2A0B11";

  const bgColor = disableHover
    ? color
    : isActive
      ? activeColor
      : isHovered
        ? hoverColor
        : color;

  const textColor = disableHover
    ? fontColor
    : isActive
      ? activeFont
      : isHovered
        ? hoverFont
        : fontColor;

  return (
    <button
      className={`btn medieval-Sharp ${rest.className || ""}`}
      onClick={onClick}

      onMouseEnter={() => !disableHover && setIsHovered(true)}
      onMouseLeave={() => {
        if (!disableHover) {
          setIsHovered(false);
          setIsActive(false);
        }
      }}
      onMouseDown={() => !disableHover && setIsActive(true)}
      onMouseUp={() => !disableHover && setIsActive(false)}

      {...rest}

      style={{
        backgroundColor: bgColor,
        color: textColor,

        position: "absolute",
        top,
        left,

        border: "none",
        outline: "none",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        ...style
      }}
    >
      {children}
    </button>
  );
};

export default DesignedButton;
