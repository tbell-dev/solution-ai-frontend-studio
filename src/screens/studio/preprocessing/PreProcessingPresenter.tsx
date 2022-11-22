import React, { ChangeEvent, MouseEventHandler } from "react";
import styled from "styled-components";
import "react-image-crop/dist/ReactCrop.css";
import iconHome from "../../../assets/images/studio/header/icon-home-gray.svg";
import iconLink from "../../../assets/images/studio/header/icon-link-gray.svg";
import iconSave from "../../../assets/images/studio/header/icon-save-gray.svg";
import iconFullScreen from "../../../assets/images/studio/header/icon-fullscreen-gray.svg";
import iconLogout from "../../../assets/images/studio/header/icon-logout-gray.svg";
import iconPrev from "../../../assets/images/studio/header/icon-prev-gray.svg";
import iconNext from "../../../assets/images/studio/header/icon-next-gray.svg";
import iconUndo from "../../../assets/images/studio/header/icon-undo-gray.svg";
import iconDo from "../../../assets/images/studio/header/icon-do-gray.svg";
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import iconOriginal from "../../../assets/images/studio/header/icon-original.svg";
import iconGrayscale from "../../../assets/images/studio/header/icon-grayscale.svg";
import iconGrayscaleSelected from "../../../assets/images/studio/header/icon-grayscale-selected.svg";
import iconThresholding from "../../../assets/images/studio/header/icon-thresholding.svg";
import iconThresholdingSelected from "../../../assets/images/studio/header/icon-thresholding-selected.svg";
import iconZoomInOut from "../../../assets/images/studio/header/icon-zoominout.svg";
import iconZoomInOutSelected from "../../../assets/images/studio/header/icon-zoominout-selected.svg";
import iconRotate from "../../../assets/images/studio/header/icon-rotate.svg";
import iconRotateSelected from "../../../assets/images/studio/header/icon-rotate-selected.svg";
import iconTransfer from "../../../assets/images/studio/header/icon-transfer.svg";
import iconTransferSelected from "../../../assets/images/studio/header/icon-transfer-selected.svg";
import iconBrighten from "../../../assets/images/studio/header/icon-brighten.svg";
import iconBrightenSelected from "../../../assets/images/studio/header/icon-brighten-selected.svg";
import iconCut from "../../../assets/images/studio/header/icon-cut.svg";
import iconCutSelected from "../../../assets/images/studio/header/icon-cut-selected.svg";
import iconNoiseRemove from "../../../assets/images/studio/header/icon-noiseremove.svg";
import iconNoiseRemoveSelected from "../../../assets/images/studio/header/icon-noiseremove-selected.svg";
import iconBackgroundRemove from "../../../assets/images/studio/header/icon-backgroundremove.svg";
import iconBackgroundRemoveSelected from "../../../assets/images/studio/header/icon-backgroundremove-selected.svg";
import iconNonIdentify from "../../../assets/images/studio/header/icon-nonidentify.svg";
import iconNonIdentifySelected from "../../../assets/images/studio/header/icon-nonidentify-selected.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-arrow-left.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-arrow-right.svg";
import iconArrowUp from "../../../assets/images/studio/icon/icon-arrow_up.svg";
import iconArrowDown from "../../../assets/images/studio/icon/icon-arrow_down.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import { Link } from "react-router-dom";
import {
  Button,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { RotateType, SymmetryType, TransType } from "./PreProcessingContainer";
import SmallTask from "../../../components/studio/SmallTask";
import Modal from "../../../components/studio/Modal";
import ReactCrop, { Crop } from "react-image-crop";
import { IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { ITask } from "../../../api/taskApi";

interface IPreProcessingPresenter {
  currentDataURL: string | null;
  projectInfo: IProjectInfo | null | undefined;
  isFileSelectorOpen: boolean;
  toggleFileSelector: () => void;
  tasks: ITask[];
  preProcessingAssignee: IUser | undefined;
  projectUser: IUser[];
  _setPreProcessingAssignee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  examinee: IUser | undefined;
  _setExaminee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  isFileInfoOpen: boolean;
  toggleFileInfoOpen: () => void;
  workStatutes: "전체" | "미작업" | "완료" | "진행중" | "반려";
  _setWorkStatutes: (
    status: "전체" | "미작업" | "완료" | "진행중" | "반려"
  ) => void;
  selectedTask: ITask | null;
  _setSelectedTask: (task: ITask) => void;
  loading: boolean;
  isFirst: boolean;
  handlePrevTask: (
    taskId: number
  ) => MouseEventHandler<HTMLImageElement> | undefined;
  handleNextTask: (
    taskId: number
  ) => MouseEventHandler<HTMLImageElement> | undefined;
  onOpenRotateSymmetry: () => void;
  isRotateSymmetry: boolean;
  onSubmitRotateSymmetry: () => void;
  effectLoading: boolean;
  doSymmetry: (type: SymmetryType) => void;
  doRotate: (type: RotateType) => void;
  isCanvasOn: boolean;
  onCancelRotateSymmetry: () => void;
  isThresholding: boolean;
  threshValue: string | null;
  showThresholding: boolean;
  onOpenThresholding: () => void;
  onCancelThresholding: () => void;
  onSubmitThresholding: () => void;
  handleChangeThresholding: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCaptureThresholding: (e: React.MouseEvent<HTMLInputElement>) => void;
  isGrayscale: boolean;
  grayscaleVal: string | null;
  handleGrayscaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGrayscale: () => void;
  onCancelGrayscale: () => void;
  onSubmitGrayscale: () => void;
  isBCOpen: boolean;
  bcVal: string | null;
  handleBCChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenBC: () => void;
  onCancelBC: () => void;
  onSubmitBC: () => void;
  isResizing: boolean;
  resizingVal: string | null;
  handleResizing: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenResizing: () => void;
  onCancelResizing: () => void;
  onSubmitResizing: () => void;
  crop: Crop | undefined;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  startCrop: boolean;
  handleCrop: (e: PointerEvent) => void;
  toggleCrop: () => void;
  isOpenRemoveBg: boolean;
  removedBgImage: any;
  removeBgLoading: boolean;
  doRemoveBg: () => Promise<void>;
  onOpenRemoveBg: () => void;
  onCancelRemoveBg: () => void;
  onSubmitRemoveBg: () => void;
  startBlurCrop: boolean;
  cropBlurPart: Crop | undefined;
  setCropBlurPart: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  toggleBlurCrop: () => void;
  handleBlurCrop: () => Promise<void>;
  isNoiseRemove: boolean;
  removedNoise: string | null;
  onOpenNoiseRemove: () => void;
  onCancelNoiseRemove: () => void;
  onSubmitNoiseRemove: () => void;
  noiseRemove: () => void;
  onOriginalImage: () => void;
  handleDownloadImage: () => void;
  handleToggleFullScreen: () => void;
  handleUnDo: () => void;
  handleRedo: () => void;
  saveImage: () => Promise<void>;
  isTransform: boolean;
  transType: TransType;
  scaleX: string;
  scaleY: string;
  translationXY: { x: number; y: number };
  handleLeftTX: () => void;
  handleRightTX: () => void;
  handleUpTX: () => void;
  handleDownTX: () => void;
  handleChangeScaleX: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeScaleY: (e: ChangeEvent<HTMLInputElement>) => void;
  cleanTransformEffect: () => void;
  handleTransTypeToTranslation: () => void;
  handleTransTypeToScale: () => void;
  onOpenTransform: () => void;
  onCancelTransform: () => void;
  onSubmitTransform: () => void;
  goBack: () => void;
}

const StudioWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #c0c3c7;
  font-family: NanumSquare;
`;
const StudioHeader = styled.div`
  height: 70px;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #e2e4e7;
  display: flex;
`;
const HeaderLeft = styled.div`
  width: 20%;
  display: flex;
  height: 100%;
`;
const NavLink = styled(Link)`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c0c3c7;
`;
const NavButton = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c0c3c7;
`;
const Icon = styled.img``;
const HeaderCenter = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
`;
const HeaderCenterLeft = styled.div`
  width: 20%;
  height: 100%;
`;
const HeaderCenterRight = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
`;
const HeaderCenterTextContainer = styled.div`
  width: 49%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const HeaderCenterText = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  color: #5f6164;
`;
const HeaderCenterImageTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  line-height: 20px;
  color: #5f6164;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  width: 25%;
`;
const ProgressTextBox = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BoldText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
  color: #5f6164;
`;
const Divider = styled.div`
  width: 0;
  height: 16px;
  border: 1px solid #a4a8ad;
`;
const Ball = styled.span`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin-right: 10px;
`;
const NormalText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 700;
  color: #5f6164;
`;
const HeaderRight = styled.div`
  height: 100%;
  width: 20%;
  display: flex;
`;
const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20%;
  border-left: 1px solid #c0c3c7;
  border-right: 1px solid #c0c3c7;
`;
const ZoomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
`;
const ZoomInput = styled.input`
  &::-webkit-slider-thumb {
    appearance: none;
    width: 8px;
    height: 18px;
    border-radius: 3px;
    border: 2px solid #5f6164;
    background: #5f6164;
    user-select: unset;
    :focus {
      outline: none;
    }
  }
  :focus {
    outline: none;
  }
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  letter-spacing: -0.3px;
  background: linear-gradient(to right, #5f6164, #5f6164);
  margin: 0 15px;
`;
const Main = styled.div`
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  overflow: hidden;
`;
const MainLeft = styled.div`
  width: 100px;
  height: 100%;
  background-color: #e2e4e7;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LeftItemContainer = styled.div`
  width: 70px;
  height: 59px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 7px;
  cursor: pointer;
`;
const LeftItemText = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  margin-top: 11.02px;
  color: #5f6164;
`;
const MainCenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 900px;
`;
const MainCenterUpper = styled.div<{ isFileSelectorOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 900px;
  width: 100%;
  overflow: hidden;
  height: ${(props) =>
    props.isFileSelectorOpen ? "calc(100% - 210px)" : "calc(100% - 50px)"};
`;
const MainImage = styled.img<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  width: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"
      : props.resizingVal
      ? `${parseInt("800") + (parseInt(props.resizingVal) - 100)}px`
      : "800px"};
  height: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"
      : props.resizingVal
      ? `${parseInt("800") + (parseInt(props.resizingVal) - 100)}px`
      : "800px"};
`;
const MainCenterBottom = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 40px;
  background-color: #e2e4e7;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #c0c3c7;
  display: flex;
  align-items: center;
`;
const ArrowDropDownBox = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 24px;
  cursor: pointer;
`;
const ArrowDropDownText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
  color: #5f6164;
`;
const MainCenterImagePicker = styled.div`
  display: flex;
  width: 100%;
  height: 160px;
  padding: 0 20px;
  background-color: #e2e4e7;
  border-left: 1px solid #c0c3c7;
  overflow-x: scroll;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const PickedImageContainer = styled.div`
  height: 100%;
  width: 180px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
`;
const NonPickedImageWrapper = styled.div`
  height: 100%;
  width: 180px;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  margin-right: 7px;
`;
const ImagePickerListContainer = styled.div`
  display: flex;
  align-items: center;
`;
const MainRight = styled.div`
  height: 100%;
  width: 250px;
  background-color: #e2e4e7;
`;
const MainRightUpper = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;
const DropBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  border-bottom: 2px solid #c0c3c7;
`;
const VerticalDivider = styled.div`
  height: 20px;
`;
const DropBoxTextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;
const DropBoxBoldText = styled.span`
  font-size: 14px;
  font-weight: 800;
  line-height: 16px;
`;
const DropBoxNormalText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  overflow-x: hidden;
`;
const DropBoxContentWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxContentTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const DropBoxContentDescWrapper = styled.div`
  padding: 20px;
  display: flex;
`;
const DropBoxContentDescLeft = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;
const DropBoxContentDescRight = styled.div`
  display: flex;
  flex-direction: column;
`;
const MainRightBottom = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;
const FinishButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: #3580e3;
  color: white;
  font-size: 18px;
  font-weight: 800;
  line-height: 20px;
`;
const RejectButton = styled(FinishButton)`
  background-color: #f28f40;
`;
const EffectValueContainer = styled.div`
  width: 80%;
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #c0c3c7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
`;
const EffectValue = styled.span`
  color: #414244;
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
`;
const RotatesSymmetryContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const RotateSymmetryCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  cursor: pointer;
`;
const TransfromUpperContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: -40px;
`;
const RoundedButton = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 20px;
  justify-content: center;
  border: 1px solid #5f6164;
  width: 100px;
  height: 36px;
  transition: color 0.3s linear;
  transition: background-color 0.3s linear;
  color: ${(props) => (props.isSelected ? "#FFFFFF" : "#5F6164")};
  background-color: ${(props) => (props.isSelected ? "#414244" : "none")};
`;
const TransFormCenterContainer = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
`;
const TransFormImageWrapper = styled.div`
  width: 400px;
  height: 400px;
  background-color: black;
  overflow: hidden;
`;
const TransFormTempImg = styled.img<{
  tXY: { x: number; y: number };
  sX: number;
  sY: number;
}>`
  width: 400px;
  height: 400px;
  transition: transform 0.2s linear;
  transform: ${(props) =>
    `translate(${props.tXY.x}px, ${props.tXY.y}px) scale(${props.sX}, ${
      props.sY
    })`};
  //transform: ${(props) => ``};
`;
const TransFormBottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;
const TransFormButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  color: #243654;
  :focus {
    user-select: none;
  }
`;
const TransFormSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
const Input = styled.input`
  text-align: center;
  width: 80%;
  padding: 8px 8px;
  :focus {
    outline: none;
  }
  border-radius: 10px;
`;
const Canvas = styled.canvas<{ isFileSelectorOpen: boolean }>``;

const PreProcessingPresenter: React.FC<IPreProcessingPresenter> = ({
  currentDataURL,
  projectInfo,
  isFileSelectorOpen,
  tasks,
  preProcessingAssignee,
  projectUser,
  examinee,
  isFileInfoOpen,
  workStatutes,
  selectedTask,
  loading,
  isFirst,
  isRotateSymmetry,
  effectLoading,
  isCanvasOn,
  isThresholding,
  threshValue,
  showThresholding,
  isGrayscale,
  grayscaleVal,
  isBCOpen,
  bcVal,
  isResizing,
  resizingVal,
  crop,
  startCrop,
  isOpenRemoveBg,
  removedBgImage,
  removeBgLoading,
  startBlurCrop,
  cropBlurPart,
  isNoiseRemove,
  removedNoise,
  isTransform,
  transType,
  scaleX,
  scaleY,
  translationXY,
  _setPreProcessingAssignee,
  _setExaminee,
  toggleFileInfoOpen,
  _setWorkStatutes,
  _setSelectedTask,
  handlePrevTask,
  handleNextTask,
  onOpenRotateSymmetry,
  onSubmitRotateSymmetry,
  doSymmetry,
  onCancelRotateSymmetry,
  doRotate,
  onOpenThresholding,
  onCancelThresholding,
  onSubmitThresholding,
  handleChangeThresholding,
  onChangeCaptureThresholding,
  handleGrayscaleChange,
  onOpenGrayscale,
  onCancelGrayscale,
  onSubmitGrayscale,
  handleBCChange,
  onOpenBC,
  onCancelBC,
  toggleFileSelector,
  onSubmitBC,
  handleResizing,
  onOpenResizing,
  onCancelResizing,
  onSubmitResizing,
  setCrop,
  handleCrop,
  toggleCrop,
  doRemoveBg,
  onOpenRemoveBg,
  onCancelRemoveBg,
  onSubmitRemoveBg,
  setCropBlurPart,
  toggleBlurCrop,
  handleBlurCrop,
  onOpenNoiseRemove,
  onCancelNoiseRemove,
  onSubmitNoiseRemove,
  noiseRemove,
  onOriginalImage,
  handleDownloadImage,
  handleToggleFullScreen,
  handleUnDo,
  handleRedo,
  saveImage,
  handleLeftTX,
  handleRightTX,
  handleUpTX,
  handleDownTX,
  handleChangeScaleX,
  handleChangeScaleY,
  cleanTransformEffect,
  handleTransTypeToTranslation,
  handleTransTypeToScale,
  onOpenTransform,
  onCancelTransform,
  onSubmitTransform,
  goBack,
}) => {
  return (
    <>
      <ChakraProvider>
        <StudioWrapper>
          <StudioHeader>
            <HeaderLeft>
              <NavLink to={"/"}>
                <Icon
                  src={iconHome}
                  alt="icon-home"
                  style={{ width: 20, height: 17 }}
                />
              </NavLink>
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={handleDownloadImage}
              >
                <Icon
                  src={iconLink}
                  alt="icon-download"
                  style={{ width: 17.38, height: 17.67 }}
                />
              </NavButton>
              <NavButton style={{ cursor: "pointer" }} onClick={saveImage}>
                <Icon
                  src={iconSave}
                  alt="icon-home"
                  style={{ width: 18, height: 18 }}
                />
              </NavButton>
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={handleToggleFullScreen}
              >
                <Icon
                  src={iconFullScreen}
                  alt="icon-fullscreen"
                  style={{ width: 14, height: 14 }}
                />
              </NavButton>
              <NavButton>
                <Icon
                  src={iconLogout}
                  alt="icon-home"
                  onClick={goBack}
                  style={{ width: 20, height: 18, cursor: "pointer" }}
                />
              </NavButton>
            </HeaderLeft>
            <HeaderCenter>
              <HeaderCenterLeft />
              <HeaderCenterRight>
                <Icon
                  src={iconPrev}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={
                    selectedTask
                      ? () => handlePrevTask(selectedTask.taskId)
                      : undefined
                  }
                />
                <HeaderCenterTextContainer>
                  <HeaderCenterText>
                    {projectInfo ? projectInfo.projectName : "프로젝트 명"}
                  </HeaderCenterText>
                  <HeaderCenterImageTitle>
                    {selectedTask ? selectedTask.imageName : ""}
                  </HeaderCenterImageTitle>
                </HeaderCenterTextContainer>
                <Icon
                  src={iconNext}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={
                    selectedTask
                      ? () => handleNextTask(selectedTask.taskId)
                      : undefined
                  }
                />
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>작업단계</BoldText>
                  </ProgressTextBox>
                  <Divider style={{ marginLeft: 4 }} />
                  <ProgressTextBox>
                    <NormalText>전처리</NormalText>
                  </ProgressTextBox>
                </ProgressContainer>
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>작업상태</BoldText>
                  </ProgressTextBox>
                  <Divider />
                  <ProgressTextBox>
                    {selectedTask && selectedTask.taskStatus === 1 && (
                      <>
                        <Ball style={{ backgroundColor: "#E2772A" }} />
                        <NormalText style={{ color: "#E2772A" }}>
                          미작업
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 2 && (
                      <>
                        <Ball style={{ backgroundColor: "#3580E3" }} />
                        <NormalText style={{ color: "#3580E3" }}>
                          진행중
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 3 && (
                      <>
                        <Ball style={{ backgroundColor: "#2EA090" }} />
                        <NormalText style={{ color: "#2EA090" }}>
                          작업완료
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 4 && (
                      <>
                        <Ball style={{ backgroundColor: "#FF4343" }} />
                        <NormalText style={{ color: "#FF4343" }}>
                          반려
                        </NormalText>
                      </>
                    )}
                  </ProgressTextBox>
                </ProgressContainer>
              </HeaderCenterRight>
            </HeaderCenter>
            <HeaderRight>
              <IconBox
                style={{ borderRight: 0, cursor: "pointer" }}
                onClick={handleUnDo}
              >
                <Icon src={iconUndo} />
              </IconBox>
              <IconBox style={{ cursor: "pointer" }} onClick={handleRedo}>
                <Icon src={iconDo} />
              </IconBox>
              <ZoomBox>
                <Icon src={iconZoomDec} />
                <ZoomInput
                  type={"range"}
                  min={0}
                  max={200}
                  defaultValue={resizingVal === null ? "100" : resizingVal}
                  onChange={handleResizing}
                />
                <Icon src={iconZoomInc} />
              </ZoomBox>
            </HeaderRight>
          </StudioHeader>
          <Main>
            <MainLeft>
              <LeftItemContainer onClick={onOriginalImage}>
                <Icon src={iconOriginal} />
                <LeftItemText>원본 이미지</LeftItemText>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenGrayscale}>
                <Icon
                  src={isGrayscale ? iconGrayscaleSelected : iconGrayscale}
                />
                <LeftItemText>그레이스케일</LeftItemText>
                <Modal
                  isOpen={isGrayscale}
                  onClose={onCancelGrayscale}
                  title={"그레이스케일"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitGrayscale}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>
                        {grayscaleVal ? grayscaleVal : 0}%
                      </EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={100}
                        defaultValue={
                          grayscaleVal === null ? "0" : grayscaleVal
                        }
                        style={{ width: "100%" }}
                        onChange={handleGrayscaleChange}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenThresholding}>
                <Icon
                  src={
                    isThresholding ? iconThresholdingSelected : iconThresholding
                  }
                />
                <LeftItemText>이진화</LeftItemText>
                <Modal
                  isOpen={isThresholding}
                  onClose={onCancelThresholding}
                  title={"이진화"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitThresholding}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>{threshValue ? threshValue : 0}</EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={255}
                        defaultValue={threshValue === null ? "0" : threshValue}
                        style={{ width: "100%" }}
                        onChange={handleChangeThresholding}
                        onMouseUp={onChangeCaptureThresholding}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenResizing}>
                <Icon
                  src={isResizing ? iconZoomInOutSelected : iconZoomInOut}
                />
                <LeftItemText>확대 / 축소</LeftItemText>
                <Modal
                  isOpen={isResizing}
                  onClose={onCancelResizing}
                  title={"확대 / 축소"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitResizing}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>
                        {resizingVal ? resizingVal : 100}%
                      </EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={200}
                        defaultValue={
                          resizingVal === null ? "100" : resizingVal
                        }
                        style={{ width: "100%" }}
                        onChange={handleResizing}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenRotateSymmetry}>
                <Icon
                  src={isRotateSymmetry ? iconRotateSelected : iconRotate}
                />
                <LeftItemText>회전 / 대칭</LeftItemText>
                <Modal
                  isOpen={isRotateSymmetry}
                  onClose={onCancelRotateSymmetry}
                  title={"회전 / 대칭"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitRotateSymmetry}
                  loading={effectLoading}
                >
                  <>
                    <RotatesSymmetryContainer style={{ marginBottom: 60 }}>
                      <RotateSymmetryCard onClick={() => doRotate("ROTATE_90")}>
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          90도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_180")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          180도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_270")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          270도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_360")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          360도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                    </RotatesSymmetryContainer>
                    <RotatesSymmetryContainer>
                      <RotateSymmetryCard
                        onClick={() => doSymmetry("HORIZONTAL")}
                      >
                        <Icon src={iconTransfer} />
                        <NormalText style={{ fontSize: "10px" }}>
                          좌우 대칭
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doSymmetry("VERTICAL")}
                      >
                        <Icon src={iconTransfer} />
                        <NormalText style={{ fontSize: "10px" }}>
                          상하 대칭
                        </NormalText>
                      </RotateSymmetryCard>
                    </RotatesSymmetryContainer>
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenTransform}>
                <Icon src={isTransform ? iconTransferSelected : iconTransfer} />
                <LeftItemText>변환</LeftItemText>
                <Modal
                  isOpen={isTransform}
                  onClose={onCancelTransform}
                  title={"변환"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitTransform}
                  loading={effectLoading}
                >
                  <>
                    <TransfromUpperContainer>
                      <RoundedButton
                        onClick={handleTransTypeToTranslation}
                        isSelected={transType === TransType.translation}
                      >
                        트랜스레이션
                      </RoundedButton>
                      <RoundedButton
                        onClick={handleTransTypeToScale}
                        isSelected={transType === TransType.scale}
                      >
                        스케일링
                      </RoundedButton>
                    </TransfromUpperContainer>
                    <TransFormCenterContainer>
                      {selectedTask ? (
                        <TransFormImageWrapper>
                          <TransFormTempImg
                            id={"transformImg"}
                            tXY={translationXY}
                            sX={parseFloat(scaleX) || 1}
                            sY={parseFloat(scaleY) || 1}
                            src={
                              currentDataURL
                                ? currentDataURL
                                : selectedTask.image
                            }
                          />
                        </TransFormImageWrapper>
                      ) : (
                        <Spinner />
                      )}
                    </TransFormCenterContainer>
                    {transType === TransType.translation && (
                      <TransFormBottomContainer>
                        <TransFormButton
                          style={{ width: 70 }}
                          onClick={cleanTransformEffect}
                        >
                          초기화
                        </TransFormButton>
                        <TransFormButton onClick={handleLeftTX}>
                          <Icon
                            src={iconArrowLeft}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleRightTX}>
                          <Icon
                            src={iconArrowRight}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleUpTX}>
                          <Icon
                            src={iconArrowUp}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleDownTX}>
                          <Icon
                            src={iconArrowDown}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                      </TransFormBottomContainer>
                    )}
                    {transType === TransType.scale && (
                      <>
                        <TransFormBottomContainer>
                          <TransFormSection>
                            <NormalText>X:</NormalText>
                            <Input
                              onChange={handleChangeScaleX}
                              value={scaleX}
                              type={"text"}
                              placeholder={"1.0"}
                            />
                          </TransFormSection>
                        </TransFormBottomContainer>
                        <TransFormBottomContainer>
                          <TransFormSection>
                            <NormalText>Y:</NormalText>
                            <Input
                              type={"text"}
                              placeholder={"1.0"}
                              onChange={handleChangeScaleY}
                              value={scaleY}
                            />
                          </TransFormSection>
                        </TransFormBottomContainer>
                      </>
                    )}
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenBC}>
                <Icon src={isBCOpen ? iconBrightenSelected : iconBrighten} />
                <LeftItemText>밝기 / 대비</LeftItemText>
                <Modal
                  isOpen={isBCOpen}
                  onClose={onCancelBC}
                  title={"밝기 / 대비"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitBC}
                  loading={effectLoading}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>{bcVal ? bcVal : 100}%</EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={200}
                        defaultValue={bcVal === null ? "100" : bcVal}
                        style={{ width: "100%" }}
                        onChange={handleBCChange}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={toggleCrop}>
                <Icon src={startCrop ? iconCutSelected : iconCut} />
                <LeftItemText>자르기</LeftItemText>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenNoiseRemove}>
                <Icon
                  src={
                    isNoiseRemove ? iconNoiseRemoveSelected : iconNoiseRemove
                  }
                />
                <LeftItemText>노이즈 제거</LeftItemText>
                <Modal
                  isOpen={isNoiseRemove}
                  onClose={onCancelNoiseRemove}
                  title={"노이즈 제거"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitNoiseRemove}
                  removeEffect={true}
                  removeEffectFn={noiseRemove}
                  loading={effectLoading}
                >
                  <></>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={onOpenRemoveBg}>
                <Icon
                  src={
                    isOpenRemoveBg
                      ? iconBackgroundRemoveSelected
                      : iconBackgroundRemove
                  }
                />
                <LeftItemText>배경 제거</LeftItemText>
                <Modal
                  isOpen={isOpenRemoveBg}
                  onClose={onCancelRemoveBg}
                  title={"배경 제거"}
                  txtSubmit={"적용"}
                  onSubmit={onSubmitRemoveBg}
                  loading={effectLoading}
                  removeEffect={true}
                  removeEffectFn={doRemoveBg}
                >
                  <>
                    {removeBgLoading && (
                      <ZoomBox style={{ width: "80%" }}>
                        <Spinner />
                      </ZoomBox>
                    )}
                  </>
                </Modal>
              </LeftItemContainer>
              <LeftItemContainer onClick={toggleBlurCrop}>
                <Icon
                  src={
                    startBlurCrop ? iconNonIdentifySelected : iconNonIdentify
                  }
                />
                <LeftItemText>비식별화</LeftItemText>
              </LeftItemContainer>
            </MainLeft>
            <MainCenterWrapper>
              <MainCenterUpper
                id={"mainCenterUpper"}
                isFileSelectorOpen={isFileSelectorOpen}
              >
                {/*//! 아래는 데이터를 서버로부터 받으면 화면 중앙에 뿌려주는 이미지 */}
                {selectedTask &&
                  !startCrop &&
                  !showThresholding &&
                  !removedBgImage &&
                  !startBlurCrop &&
                  !removedNoise &&
                  (currentDataURL ? (
                    <MainImage
                      id={"mainImage"}
                      isFileSelectorOpen={isFileSelectorOpen}
                      resizingVal={resizingVal}
                      style={{
                        display: isCanvasOn ? "none" : "block",
                        filter:
                          grayscaleVal !== null
                            ? `grayscale(${grayscaleVal}%)`
                            : undefined || bcVal !== null
                            ? `brightness(${bcVal}%)`
                            : undefined,
                      }}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                    />
                  ) : (
                    <Spinner />
                  ))}

                {/*//! 이진화 작업 시 작업에 대한 결과를 Canvas에 잠시 뿌려주고 팝업의 취소 또는 적용 버튼 클릭 시 disappeared */}
                {isThresholding && (
                  <Canvas
                    id={"thCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    style={{ display: showThresholding ? "block" : "none" }}
                  />
                )}

                {/*//! 회전/대칭 작업 시 작업에 대한 결과를 Canvas에 잠시 뿌려주고 팝업의 취소 또는 적용 버튼 클릭 시 disappeared */}
                {isRotateSymmetry && (
                  <Canvas
                    id={"rsCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    style={{ display: isCanvasOn ? "block" : "none" }}
                  />
                )}

                {/*//! 자르기를 실행하면 이 부분이 화면에 뿌려짐, 자른 후 호출되는 handleCrop이 끝나면 disappeared */}
                {selectedTask && startCrop && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onDragEnd={handleCrop}
                  >
                    <MainImage
                      id={"cropImage"}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                      isFileSelectorOpen={isFileSelectorOpen}
                      resizingVal={resizingVal}
                    />
                  </ReactCrop>
                )}

                {/*//! 비식별화를 실행하면 이 부분이 화면에 뿌려짐, 비식별할 부분을 드래그한 후 호출되는 handleBlurCrop이 끝나면 disappeared */}
                {selectedTask && startBlurCrop && (
                  <ReactCrop
                    crop={cropBlurPart}
                    onChange={(c) => setCropBlurPart(c)}
                    onDragEnd={handleBlurCrop}
                  >
                    <MainImage
                      id={"cropBlurImage"}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                      isFileSelectorOpen={isFileSelectorOpen}
                      resizingVal={resizingVal}
                    />
                  </ReactCrop>
                )}

                {/*//! 배경제거를 하면 배경제거가 된 이미지를 보여주기 위해 잠시 노출시킨 후 취소 또는 적용 버튼을 누르면 disappeared */}
                {removedBgImage && (
                  <MainImage
                    style={{
                      border: 1,
                      borderColor: "#e2e4e7",
                      borderStyle: "solid",
                    }}
                    src={removedBgImage.src}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal}
                  />
                )}

                {/*//! 노이즈제거를 실행하면 해당 이미지를 보여주기 위해 잠시 노출시킨 후 취소 또는 적용 버튼을 누르면 disappeared */}
                {removedNoise && (
                  <MainImage
                    src={removedNoise}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal}
                  />
                )}
              </MainCenterUpper>
              <MainCenterBottom>
                <ArrowDropDownBox onClick={toggleFileSelector}>
                  <Icon
                    src={isFileSelectorOpen ? arrowDown : arrowUp}
                    style={{ marginRight: 17 }}
                  />
                  <ArrowDropDownText>{`File List (${
                    tasks.length
                  })`}</ArrowDropDownText>
                </ArrowDropDownBox>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        bgColor={"#e2e4e7"}
                        border={"1px"}
                        borderColor={"#737680"}
                        borderRadius={20}
                        width={"145px"}
                        height={"24px"}
                        ml={30}
                        py={"4"}
                        _focus={{ bgColor: "#e2e4e7" }}
                        _hover={{ bgColor: "#e2e4e7" }}
                        _expanded={{ bgColor: "#e2e4e7" }}
                        isActive={isOpen}
                        as={Button}
                        rightIcon={
                          isOpen ? (
                            <Icon src={arrowUp} />
                          ) : (
                            <Icon src={arrowDown} />
                          )
                        }
                      >
                        <DropBoxTextWrapper>
                          <DropBoxNormalText style={{ marginRight: 12 }}>
                            작업상태
                          </DropBoxNormalText>
                          <DropBoxNormalText>{workStatutes}</DropBoxNormalText>
                        </DropBoxTextWrapper>
                      </MenuButton>
                      <MenuList
                        bgColor={"#e2e4e7"}
                        border={"1px"}
                        borderColor={"#c0c3c7"}
                        borderRadius={"none"}
                      >
                        {["전체", "미작업", "완료", "진행중", "반려"].map(
                          (status, index) => {
                            if (status === workStatutes) return null;
                            return (
                              <MenuItem
                                key={index}
                                _hover={{ bgColor: "#CFD1D4" }}
                                _focusWithin={{ bgColor: "#CFD1D4" }}
                                onClick={() => _setWorkStatutes(status as any)}
                              >
                                <DropBoxNormalText>{status}</DropBoxNormalText>
                              </MenuItem>
                            );
                          }
                        )}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </MainCenterBottom>
              {isFileSelectorOpen && (
                <MainCenterImagePicker>
                  {loading && isFirst ? (
                    <SpinnerWrapper>
                      <Spinner speed="0.35s" />
                    </SpinnerWrapper>
                  ) : (
                    <>
                      <PickedImageContainer>
                        {selectedTask && workStatutes === "전체" ? (
                          <SmallTask task={selectedTask} isSelected={true} />
                        ) : (
                          selectedTask &&
                          selectedTask.taskStatusName === workStatutes && (
                            <SmallTask task={selectedTask} isSelected={true} />
                          )
                        )}
                      </PickedImageContainer>
                      <ImagePickerListContainer>
                        {workStatutes === "전체" &&
                          tasks.map((task, index) => {
                            if (
                              selectedTask &&
                              task.taskId === selectedTask.taskId
                            )
                              return null;
                            return (
                              <NonPickedImageWrapper
                                onClick={() => _setSelectedTask(task)}
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                <SmallTask task={task} isSelected={false} />
                              </NonPickedImageWrapper>
                            );
                          })}
                        {workStatutes === "미작업" &&
                          tasks
                            .filter((t) => t.taskStatus === 1)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "진행중" &&
                          tasks
                            .filter((t) => t.taskStatus === 2)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "완료" &&
                          tasks
                            .filter((t) => t.taskStatus === 3)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "반려" &&
                          tasks
                            .filter((t) => t.taskStatus === 4)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                      </ImagePickerListContainer>
                    </>
                  )}
                </MainCenterImagePicker>
              )}
            </MainCenterWrapper>
            <MainRight>
              <MainRightUpper>
                <DropBoxContainer>
                  <Menu>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          display={"flex"}
                          flexDirection={"row"}
                          alignItems={"center"}
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                          width={"210px"}
                          _focus={{ bgColor: "#e2e4e7" }}
                          _hover={{ bgColor: "#e2e4e7" }}
                          _expanded={{ bgColor: "#e2e4e7" }}
                          isActive={isOpen}
                          as={Button}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>전처리 담당자</DropBoxBoldText>
                            <Divider
                              style={{ marginLeft: 8, marginRight: 8 }}
                            />
                            <DropBoxNormalText>
                              {preProcessingAssignee
                                ? preProcessingAssignee.userDisplayName
                                : selectedTask && selectedTask.taskWorker
                                ? selectedTask.taskWorker.displayName
                                : ""}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </MenuButton>
                        <MenuList
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                        >
                          {projectUser &&
                            projectUser.length > 0 &&
                            projectUser.map((user, index) => {
                              if (user === preProcessingAssignee) return null;
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bgColor: "#CFD1D4" }}
                                  _focusWithin={{ bgColor: "#CFD1D4" }}
                                  onClick={() =>
                                    _setPreProcessingAssignee(user)
                                  }
                                >
                                  <DropBoxNormalText>
                                    {user.userDisplayName}
                                  </DropBoxNormalText>
                                </MenuItem>
                              );
                            })}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <VerticalDivider />
                  <Menu>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          display={"flex"}
                          flexDirection={"row"}
                          alignItems={"center"}
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                          width={"210px"}
                          _focus={{ bgColor: "#e2e4e7" }}
                          _hover={{ bgColor: "#e2e4e7" }}
                          _expanded={{ bgColor: "#e2e4e7" }}
                          isActive={isOpen}
                          as={Button}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>검수 담당자</DropBoxBoldText>
                            <Divider
                              style={{ marginLeft: 8, marginRight: 8 }}
                            />
                            <DropBoxNormalText>
                              {examinee
                                ? examinee.userDisplayName
                                : selectedTask && selectedTask.taskValidator
                                ? selectedTask.taskValidator.displayName
                                : ""}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </MenuButton>
                        <MenuList
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                        >
                          {projectUser &&
                            projectUser.length > 0 &&
                            projectUser.map((user, index) => {
                              if (user === examinee) return null;
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bgColor: "#CFD1D4" }}
                                  _focusWithin={{ bgColor: "#CFD1D4" }}
                                  onClick={() => _setExaminee(user)}
                                >
                                  <DropBoxNormalText>
                                    {user.userDisplayName}
                                  </DropBoxNormalText>
                                </MenuItem>
                              );
                            })}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </DropBoxContainer>
                <DropBoxContainer style={{ padding: 0, borderBottom: 0 }}>
                  <DropBoxContentWrapper
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 12,
                      paddingBottom: 12,
                    }}
                  >
                    <DropBoxContentTitle onClick={toggleFileInfoOpen}>
                      <Icon
                        src={isFileInfoOpen ? arrowDown : arrowUp}
                        style={{ marginRight: 17 }}
                      />
                      <ArrowDropDownText>File</ArrowDropDownText>
                    </DropBoxContentTitle>
                  </DropBoxContentWrapper>
                  {isFileInfoOpen && (
                    <DropBoxContentDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxContentDescLeft>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          해상도
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          용량
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          파일크기
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      <DropBoxContentDescRight>
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          720dpi
                        </DropBoxNormalText>
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          123kb
                        </DropBoxNormalText>
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageWidth &&
                          selectedTask.imageHeight
                            ? `${selectedTask.imageWidth}px*${
                                selectedTask.imageHeight
                              }px`
                            : "900px*1600px"}
                        </DropBoxNormalText>
                      </DropBoxContentDescRight>
                    </DropBoxContentDescWrapper>
                  )}
                </DropBoxContainer>
              </MainRightUpper>
              <MainRightBottom>
                <FinishButton>완료</FinishButton>
                <RejectButton>반려</RejectButton>
              </MainRightBottom>
            </MainRight>
          </Main>
        </StudioWrapper>
      </ChakraProvider>
    </>
  );
};

export default PreProcessingPresenter;
