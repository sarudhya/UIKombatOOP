import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props{
  message:string
  color?:string
  fontColor?:string
  fontSize?:string
  boxWidth?: string | number;
  boxHeight?: string | number;
  boxPadding?: string | number;
  top?: string | number;
  left?: string | number;
  className?: string;
  fontClassName?: string;
  onClose:()=>void
}

const CustomAlert = ({
  message,
  color="#902E01",
  fontColor="#D3B14D",
  fontSize="40px",
  boxWidth,
  boxHeight,
  boxPadding,
  top,
  left,
  className = "",
  fontClassName = "medieval-Sharp",
  onClose
}:Props)=>{
  const alertBoxRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLSpanElement>(null);
  const [fittedFontSize, setFittedFontSize] = useState(fontSize);

  const getBaseFontSizePx = () => {
    const parsed = Number.parseFloat(fontSize);
    return Number.isFinite(parsed) ? parsed : 40;
  };

  useLayoutEffect(() => {
    const box = alertBoxRef.current;
    const text = messageRef.current;
    if (!box || !text) return;

    const fitTextToSingleLine = () => {
      const computedStyle = window.getComputedStyle(box);
      const paddingLeft = Number.parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(computedStyle.paddingRight) || 0;
      const availableWidth = box.clientWidth - paddingLeft - paddingRight;

      const baseSize = getBaseFontSizePx();
      const minSize = 14;
      let nextSize = baseSize;

      text.style.fontSize = `${nextSize}px`;
      while (text.scrollWidth > availableWidth && nextSize > minSize) {
        nextSize -= 1;
        text.style.fontSize = `${nextSize}px`;
      }

      setFittedFontSize(`${nextSize}px`);
    };

    fitTextToSingleLine();

    const resizeObserver = new ResizeObserver(() => {
      fitTextToSingleLine();
    });

    resizeObserver.observe(box);

    return () => {
      resizeObserver.disconnect();
    };
  }, [message, fontSize]);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      onClose()
    },3000)

    return ()=>clearTimeout(timer)
  },[onClose])

  return(
    <div className={`alert-container ${fontClassName}`.trim()}>

      <div
        ref={alertBoxRef}
        className={`alert-box ${className}`.trim()}
        style={{
          background:color,
          color:fontColor,
          fontSize:fittedFontSize,
          width: boxWidth,
          height: boxHeight,
          padding: boxPadding,
          top,
          left,

        }}
      >
        <span ref={messageRef} className="alert-message">{message}</span>

        <div className="alert-progress"></div>

      </div>

    </div>
  )
}

export default CustomAlert