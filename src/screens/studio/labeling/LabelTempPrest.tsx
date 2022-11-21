import styled from "styled-components";
interface ILabelingPresenter {
  canvas: fabric.Canvas | undefined;
}
const Canvas = styled.canvas``;
const LabelingPresenter: React.FC<ILabelingPresenter> = ({
  canvas,
}) => {
  return (
    <div>
      <Canvas id={"fcanvas"} />
    </div>
  );
};

export default LabelingPresenter;