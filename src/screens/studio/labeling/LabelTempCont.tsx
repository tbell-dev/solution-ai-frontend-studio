import React, {
  useEffect,
  useState,
} from "react";
import LabelTempPrest from "./LabelTempPrest";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";

const LabelTempCont = () => {
  const { pId } = useParams();
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    setCanvasAttr();
  });

  const initCanvas = () => new fabric.Canvas("fcanvas", { selection: false });

  const setCanvasAttr = () => {
    console.log(canvas);
    canvas?.setBackgroundColor("red", () => {});
  };

  if (pId) {
    return (
      <LabelTempPrest
        canvas={canvas}
      />
    );
  }
  return null;
};

export default LabelTempCont;