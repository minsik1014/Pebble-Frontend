import { useEffect, useState } from "react";

const DESIGN_LAYOUT_WIDTH = 1416;
const DESIGN_LAYOUT_HEIGHT = 1000;
const DESIGN_SAFE_MARGIN = 24;
const MIN_MODAL_SCALE = 0.5;

export const useModalViewportScale = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - DESIGN_SAFE_MARGIN;
      const availableHeight = window.innerHeight - DESIGN_SAFE_MARGIN;
      const widthScale = availableWidth / DESIGN_LAYOUT_WIDTH;
      const heightScale = availableHeight / DESIGN_LAYOUT_HEIGHT;
      const nextScale = Math.min(widthScale, heightScale, 1);

      setScale(Math.max(MIN_MODAL_SCALE, nextScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return scale;
};
