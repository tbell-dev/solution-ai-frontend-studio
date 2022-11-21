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
import iconClose from "../../../assets/images/studio/icon/icon-close.svg";
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import iconMove from "../../../assets/images/studio/icon/icon-move-dark.svg";
import iconMoveSelected from "../../../assets/images/studio/icon/icon-move-selected.svg";
import iconTag from "../../../assets/images/studio/icon/icon-tag-dark.svg";
import iconTagSelected from "../../../assets/images/studio/icon/icon-tag-selected.svg";
import iconClass from "../../../assets/images/studio/icon/icon-class-dark.svg";
import iconClassSelected from "../../../assets/images/studio/icon/icon-class-selected.svg";
import iconReset from "../../../assets/images/studio/icon/icon-reset-dark.svg";
import iconResetSelected from "../../../assets/images/studio/icon/icon-reset-selected.svg";
import iconOD from "../../../assets/images/studio/icon/icon-OD-dark.svg";
import iconODActive from "../../../assets/images/studio/icon/icon-OD-active.svg";
import iconODSelected from "../../../assets/images/studio/icon/icon-OD-selected.svg";
import iconIS from "../../../assets/images/studio/icon/icon-IS-dark.svg";
import iconISActive from "../../../assets/images/studio/icon/icon-IS-active.svg";
import iconISSelected from "../../../assets/images/studio/icon/icon-IS-selected.svg";
import iconSES from "../../../assets/images/studio/icon/icon-SES-dark.svg";
import iconSESActive from "../../../assets/images/studio/icon/icon-SES-active.svg";
import iconSESSelected from "../../../assets/images/studio/icon/icon-SES-selected.svg";
import iconSmartpen from "../../../assets/images/studio/icon/icon-smartpen-dark.svg";
import iconSmartpenSelected from "../../../assets/images/studio/icon/icon-smartpen-selected.svg";
import iconAutopoint from "../../../assets/images/studio/icon/icon-autopoint-dark.svg";
import iconAutopointSelected from "../../../assets/images/studio/icon/icon-autopoint-selected.svg";
import iconBoxing from "../../../assets/images/studio/icon/icon-boxing-dark.svg";
import iconBoxingSelected from "../../../assets/images/studio/icon/icon-boxing-selected.svg";
import iconPolyline from "../../../assets/images/studio/icon/icon-polyline-dark.svg";
import iconPolylineSelected from "../../../assets/images/studio/icon/icon-polyline-selected.svg";
import iconPolygon from "../../../assets/images/studio/icon/icon-polygon-dark.svg";
import iconPolygonSelected from "../../../assets/images/studio/icon/icon-polygon-selected.svg";
import iconPoint from "../../../assets/images/studio/icon/icon-point-dark.svg";
import iconPointSelected from "../../../assets/images/studio/icon/icon-point-selected.svg";
import iconBrush from "../../../assets/images/studio/icon/icon-brush-group-dark.svg";
import iconBrushSelected from "../../../assets/images/studio/icon/icon-brush-group-selected.svg";
import icon3Dcube from "../../../assets/images/studio/icon/icon-3dcube-dark.svg";
import icon3DcubeSelected from "../../../assets/images/studio/icon/icon-3dcube-selected.svg";
import iconSegment from "../../../assets/images/studio/icon/icon-segment-dark.svg";
import iconSegmentSelected from "../../../assets/images/studio/icon/icon-segment-selected.svg";
import iconKeypoint from "../../../assets/images/studio/icon/icon-keypoint-dark.svg";
import iconKeypointSelected from "../../../assets/images/studio/icon/icon-keypoint-selected.svg";
import iconArrowTop from "../../../assets/images/studio/icon/icon-scroll-up-dark.svg";
import iconArrowBottom from "../../../assets/images/studio/icon/icon-scroll-down-dark.svg"
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
  Modal as Popup,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";
import SmallTask from "../../../components/studio/SmallTask";
import Modal from "../../../components/studio/Modal";
import AlertModal from "../../../components/studio/AlertModal";
import { IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { ITask } from "../../../api/taskApi";
import { fabric } from "fabric";

interface ILabelingPresenter {
    currentDataURL: string | null;
    projectInfo: IProjectInfo | null | undefined;
    isFileSelectorOpen: boolean;
    toggleFileSelector: () => void;
    tasks: ITask[];
    labelingAssignee: IUser | undefined;
    projectUser: IUser[];
    _setLabelingAssignee: (
      user: IUser
    ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
    examinee: IUser | undefined;
    _setExaminee: (
      user: IUser
    ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
    isFileInfoOpen: boolean;
    isInstanceOpen: boolean;
    isHistoryOpen: boolean;
    toggleFileInfoOpen: () => void;
    toggleInstanceOpen: () => void;
    toggleHistoryOpen: () => void;
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
    effectLoading: boolean;
    isCanvasOn: boolean;
    onCancelMove: () => void;
    onCancelClass: () => void;
    onCancelReset: () => void;
    onSubmitReset: () => void;
    onCancelSmartpen: () => void;
    onCancelAutopoint: () => void;
    onCancelBrush: () => void;
    onCancel3Dcube: () => void;
    onCancelKeypoint: () => void;
    resizingVal: string | null;
    handleResizing: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOriginalImage: () => void;
    handleDownloadImage: () => void;
    handleToggleFullScreen: () => void;
    handleUnDo: () => void;
    handleRedo: () => void;
    saveData: () => Promise<void>;
    goBack: () => void;
    checkIsMove: () => void;
    checkIsTag: () => void;
    checkIsClass: () => void;
    checkIsReset: () => void;
    checkIsOD: () => void;
    checkIsIS: () => void;
    checkIsSES: () => void;
    checkIsSmartpen: () => void;
    checkIsAutopoint: () => void;
    checkIsBoxing: () => void;
    checkIsPolyline: () => void;
    checkIsPolygon: () => void;
    checkIsPoint: () => void;
    checkIsBrush: () => void;
    checkIs3Dcube: () => void;
    checkIsSegment: () => void;
    checkIsKeypoint: () => void;
    isMoveOn: boolean;
    isTagOn: boolean;
    isClassOn: boolean;
    isResetOn: boolean;
    isODOn: boolean;
    isISOn: boolean;
    isSESOn: boolean;
    isSmartpenOn: boolean;
    isAutopointOn: boolean;
    isBoxingOn: boolean;
    isPolylineOn: boolean;
    isPolygonOn: boolean;
    isPointOn: boolean;
    isBrushOn: boolean;
    is3DcubeOn: boolean;
    isSegmentOn: boolean;
    isKeypointOn: boolean;
    canvas: fabric.Canvas | undefined;
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
  const MainLeftWrap = styled.div`
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
  `;
  const MainLeft = styled.div`
    &::-webkit-scrollbar {
      appearance: none;
      display: none;
    }
    width: 100px;
    height: 100%;
    background-color: #e2e4e7;
    display: flex;
    padding: 15px;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  `;
  const LeftListArrow = styled.div`
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; 
    padding-top: 3px;
    padding-bottom: 3px;
    background: #A4A8AD;
    box-sizing: border-box;
    cursor: pointer;
  `;
  const LeftItemContainer = styled.div`
    width: 70px;
    height: 59px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;
  const LeftItemText = styled.span`
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    margin-top: 5px;
    margin-bottom: 10px;
    color: #5f6164;
  `;
  const UnderBar = styled.span`
    width: 100%;
    height: 0px;
    margin: 10px 0;
    border: 1px solid #A4A8AD;
    transform: rotate(-180deg);
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
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
          ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
          : "810px"
        : props.resizingVal
        ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
        : "900px"};
    height: ${(props) =>
      props.isFileSelectorOpen
        ? props.resizingVal
          ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
          : "540px"
        : props.resizingVal
        ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"};
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
  const Input = styled.input`
    text-align: center;
    width: 80%;
    padding: 8px 8px;
    :focus {
      outline: none;
    }
    border-radius: 10px;
  `;
  const Canvas = styled.canvas<{
    isFileSelectorOpen: boolean;
    resizingVal?: string | null;
  }>`
    width: ${(props) =>
      props.isFileSelectorOpen
        ? props.resizingVal
          ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
          : "900px"
        : props.resizingVal
        ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
        : "810px"};
    height: ${(props) =>
      props.isFileSelectorOpen
        ? props.resizingVal
          ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
          : "600px"
        : props.resizingVal
        ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
        : "540px"};
  `;

  const LabelingPresenter: React.FC<ILabelingPresenter> = ({
    canvas = new fabric.Canvas("fCanvas"),
    currentDataURL,
    projectInfo,
    isFileSelectorOpen,
    tasks,
    labelingAssignee,
    projectUser,
    examinee,
    isFileInfoOpen,
    isInstanceOpen,
    isHistoryOpen,
    workStatutes,
    selectedTask,
    loading,
    isFirst,
    isCanvasOn,
    resizingVal,
    isMoveOn,
    isTagOn,
    isClassOn,
    isResetOn,
    isODOn,
    isISOn,
    isSESOn,
    isSmartpenOn,
    isAutopointOn,
    isBoxingOn,
    isPolylineOn,
    isPolygonOn,
    isPointOn,
    isBrushOn,
    is3DcubeOn,
    isSegmentOn,
    isKeypointOn,
    _setLabelingAssignee,
    _setExaminee,
    toggleFileInfoOpen,
    toggleInstanceOpen,
    toggleHistoryOpen,
    _setWorkStatutes,
    _setSelectedTask,
    handlePrevTask,
    handleNextTask,
    onCancelMove,
    onCancelClass,
    onCancelReset,
    onSubmitReset,
    onCancelSmartpen,
    onCancelAutopoint,
    onCancelBrush,
    onCancel3Dcube,
    onCancelKeypoint,
    toggleFileSelector,
    handleResizing,
    handleDownloadImage,
    handleToggleFullScreen,
    handleUnDo,
    handleRedo,
    saveData,
    goBack,
    checkIsMove,
    checkIsTag,
    checkIsClass,
    checkIsReset,
    checkIsOD,
    checkIsIS,
    checkIsSES,
    checkIsSmartpen,
    checkIsAutopoint,
    checkIsBoxing,
    checkIsPolyline,
    checkIsPolygon,
    checkIsPoint,
    checkIsBrush,
    checkIs3Dcube,
    checkIsSegment,
    checkIsKeypoint,
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
                <NavButton 
                  style={{ cursor: "pointer" }} 
                  onClick={saveData}
                >
                  <Icon
                    src={iconSave}
                    alt="icon-save"
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
                <NavButton 
                  style={{ cursor: "pointer" }}
                  onClick={goBack}
                >
                  <Icon
                    src={iconLogout}
                    alt="icon-logout"
                    style={{ width: 20, height: 18 }}
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
                      <NormalText>가공</NormalText>
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
                    id={"zoom-range"}
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
              <MainLeftWrap>
                <LeftListArrow>
                  <Icon 
                    src={iconArrowTop}
                  />
                </LeftListArrow>
                <MainLeft>
                  <LeftItemContainer onClick={checkIsMove}>
                    <Icon
                      src={isMoveOn ? iconMoveSelected : iconMove}
                    />
                    <LeftItemText>이동</LeftItemText>
                    <AlertModal
                      isOpen={isMoveOn}
                      onClose={onCancelMove}
                      title={"이동"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsTag}>
                    <Icon
                      src={isTagOn ? iconTagSelected : iconTag}
                    />
                    <LeftItemText>태그</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsClass}>
                    <Icon
                      src={isClassOn ? iconClassSelected : iconClass}
                    />
                    <LeftItemText>클래스</LeftItemText>
                    <>
                      <Popup
                        onClose={onCancelClass}
                        isOpen={isClassOn}
                        isCentered
                        closeOnOverlayClick={false}
                        closeOnEsc={false}
                      >
                        <ModalContent 
                          bgColor={"#5F6164"}
                          position={"absolute"} 
                          top={"20px"} 
                          left={"120px"}
                          width={"280px"}
                        >
                          <ModalHeader
                            color={"#E2E4E7"}
                            lineHeight={"16px"}
                            fontSize={"xl"}
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            {"클래스 설정"}
                            <Icon
                              src={iconClose}
                              style={{ width: 20, height: 20, cursor: "pointer" }}
                              onClick={onCancelClass}
                            />
                          </ModalHeader>
                          <ModalBody
                            display={"flex"}
                            width={"full"}
                            //py={"12"}
                            color={"#E2E4E7"}
                            lineHeight={"16px"}
                            fontSize={"xl"}
                            alignItems={"center"}
                            //justifyContent={"center"}
                            flexDirection={"column"}
                          >
                            <Button 
                              margin={"0 10px 8px 0"}
                              height={"26px"}
                              background={"#414244"}
                              fontSize={"md"}
                              color={"#E2E4E7"}
                              border-radius={"4px"}
                              padding={"0 10px"}
                            >
                              인간
                            </Button>
                            {"성별"}
                            <Button>여자</Button>
                            <Button>남자</Button>
                            <Button>알 수 없음</Button>
                          </ModalBody>
                        </ModalContent>
                      </Popup>
                    </>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsReset}>
                    <Icon
                      src={isResetOn ? iconResetSelected : iconReset}
                    />
                    <LeftItemText>리셋</LeftItemText>
                    <Modal
                      isOpen={isResetOn}
                      onClose={onCancelReset}
                      title={"리셋"}
                      onSubmit={onSubmitReset}
                    >
                      <>
                        <p>
                          {"작업 내용을 초기화하시겠습니까?"}
                        </p>
                      </>
                    </Modal>
                  </LeftItemContainer>
                  <UnderBar></UnderBar>
                  <LeftItemContainer onClick={checkIsOD}>
                    <Icon
                      src={isODOn ? iconODSelected : iconOD}
                    />
                    <LeftItemText>OD</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsIS}>
                    <Icon
                      src={isISOn ? iconISSelected : iconIS}
                    />
                    <LeftItemText>IS</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsSES}>
                    <Icon
                      src={isSESOn ? iconSESSelected : iconSES}
                    />
                    <LeftItemText>SES</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsSmartpen}>
                    <Icon
                      src={isSmartpenOn ? iconSmartpenSelected : iconSmartpen}
                    />
                    <LeftItemText>스마트펜</LeftItemText>
                    <AlertModal
                      isOpen={isSmartpenOn}
                      onClose={onCancelSmartpen}
                      title={"스마트펜"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsAutopoint}>
                    <Icon
                      src={isAutopointOn ? iconAutopointSelected : iconAutopoint}
                    />
                    <LeftItemText>오토포인트</LeftItemText>
                    {/* <AlertModal
                      isOpen={isAutopointOn}
                      onClose={onCancelAutopoint}
                      title={"오토포인트"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal> */}
                  </LeftItemContainer>
                  <UnderBar></UnderBar>
                  <LeftItemContainer onClick={checkIsBoxing}>
                    <Icon
                      src={isBoxingOn ? iconBoxingSelected : iconBoxing}
                    />
                    <LeftItemText>박싱</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsPolyline}>
                    <Icon
                      src={isPolylineOn ? iconPolylineSelected : iconPolyline}
                    />
                    <LeftItemText>폴리라인</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsPolygon}>
                    <Icon
                      src={isPolygonOn ? iconPolygonSelected : iconPolygon}
                    />
                    <LeftItemText>폴리곤</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsPoint}>
                    <Icon
                      src={isPointOn ? iconPointSelected : iconPoint}
                    />
                    <LeftItemText>포인트</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsBrush}>
                    <Icon
                      src={isBrushOn ? iconBrushSelected : iconBrush}
                    />
                    <LeftItemText>브러쉬</LeftItemText>
                    <AlertModal
                      isOpen={isBrushOn}
                      onClose={onCancelBrush}
                      title={"브러쉬"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIs3Dcube}>
                    <Icon
                      src={is3DcubeOn ? icon3DcubeSelected : icon3Dcube}
                    />
                    <LeftItemText>3D 큐브</LeftItemText>
                    <AlertModal
                      isOpen={is3DcubeOn}
                      onClose={onCancel3Dcube}
                      title={"3D큐브"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsSegment}>
                    <Icon
                      src={isSegmentOn ? iconSegmentSelected : iconSegment}
                    />
                    <LeftItemText>세그먼트</LeftItemText>
                  </LeftItemContainer>
                  <LeftItemContainer onClick={checkIsKeypoint}>
                    <Icon
                      src={isKeypointOn ? iconKeypointSelected : iconKeypoint}
                    />
                    <LeftItemText>키포인트</LeftItemText>
                    <AlertModal
                      isOpen={isKeypointOn}
                      onClose={onCancelKeypoint}
                      title={"키포인트"}
                    >
                      <>
                        <p>
                          {"준비중입니다."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                </MainLeft>
                <LeftListArrow>
                  <Icon 
                    src={iconArrowBottom}
                  />
                </LeftListArrow>
              </MainLeftWrap>
              <MainCenterWrapper>
                <MainCenterUpper
                  id={"mainCenterUpper"}
                  isFileSelectorOpen={isFileSelectorOpen}
                >
                  {/*//! 아래는 데이터를 서버로부터 받으면 화면 중앙에 뿌려주는 이미지 */}
                  {selectedTask &&
                    (currentDataURL ? (
                      <MainImage
                        id={"mainImage"}
                        isFileSelectorOpen={isFileSelectorOpen}
                        resizingVal={resizingVal}
                        style={{
                          display: "none",
                          filter: undefined,
                        }}
                        src={currentDataURL ? currentDataURL : selectedTask.image}
                      />
                    ) : (
                      <Spinner />
                    ))}
                  {/*//! Canvas */}
                  <div>
                    <Canvas
                      id={"fCanvas"}
                      isFileSelectorOpen={isFileSelectorOpen}
                      resizingVal={resizingVal}
                    />
                  </div>
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
                              <DropBoxBoldText>가공 담당자</DropBoxBoldText>
                              <Divider
                                style={{ marginLeft: 8, marginRight: 8 }}
                              />
                              <DropBoxNormalText>
                                {labelingAssignee
                                  ? labelingAssignee.userDisplayName
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
                                if (user === labelingAssignee) return null;
                                return (
                                  <MenuItem
                                    key={index}
                                    _hover={{ bgColor: "#CFD1D4" }}
                                    _focusWithin={{ bgColor: "#CFD1D4" }}
                                    onClick={() =>
                                      _setLabelingAssignee(user)
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
                        <ArrowDropDownText>File Info.</ArrowDropDownText>
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
                            파일명
                          </DropBoxBoldText>
                          <DropBoxBoldText style={{ marginBottom: 8 }}>
                            파일크기
                          </DropBoxBoldText>
                          <DropBoxBoldText style={{ marginBottom: 8 }}>
                            용량
                          </DropBoxBoldText>
                        </DropBoxContentDescLeft>
                        <DropBoxContentDescRight>
                          <DropBoxNormalText style={{ marginBottom: 8 }}>
                            {selectedTask &&
                            selectedTask.imageName
                              ? `${selectedTask.imageName}`
                              : "file.png"}
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
                          <DropBoxNormalText style={{ marginBottom: 8 }}>
                            {selectedTask &&
                            selectedTask.imageSize
                              ? `${selectedTask.imageSize}KB`
                              : "123KB"}
                          </DropBoxNormalText>
                        </DropBoxContentDescRight>
                      </DropBoxContentDescWrapper>
                    )}
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
                      <DropBoxContentTitle onClick={toggleInstanceOpen}>
                        <Icon
                          src={isInstanceOpen ? arrowDown : arrowUp}
                          style={{ marginRight: 17 }}
                        />
                        <ArrowDropDownText>Isntance</ArrowDropDownText>
                      </DropBoxContentTitle>
                    </DropBoxContentWrapper>
                    {isInstanceOpen && (
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
                  <DropBoxContainer style={{ padding: 0, borderBottom: 0 }}>
                    <DropBoxContentWrapper
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 12,
                        paddingBottom: 12,
                      }}
                    >
                      <DropBoxContentTitle onClick={toggleHistoryOpen}>
                        <Icon
                          src={isHistoryOpen ? arrowDown : arrowUp}
                          style={{ marginRight: 17 }}
                        />
                        <ArrowDropDownText>History</ArrowDropDownText>
                      </DropBoxContentTitle>
                    </DropBoxContentWrapper>
                    {isHistoryOpen && (
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

  export default LabelingPresenter;