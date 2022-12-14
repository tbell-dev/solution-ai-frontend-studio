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
import iconToolMove from "../../../assets/images/studio/icon/icon-move-dark.svg";
import iconToolMoveSelected from "../../../assets/images/studio/icon/icon-move-selected.svg";
import iconToolTag from "../../../assets/images/studio/icon/icon-tag-dark.svg";
import iconToolTagSelected from "../../../assets/images/studio/icon/icon-tag-selected.svg";
import iconToolClass from "../../../assets/images/studio/icon/icon-class-dark.svg";
import iconToolClassSelected from "../../../assets/images/studio/icon/icon-class-selected.svg";
import iconToolReset from "../../../assets/images/studio/icon/icon-reset-dark.svg";
import iconToolResetSelected from "../../../assets/images/studio/icon/icon-reset-selected.svg";
import iconToolHD from "../../../assets/images/studio/icon/icon-HD-dark.svg";
import iconToolHDworking from "../../../assets/images/studio/icon/icon-HD-working.svg";
import iconToolHDlearning from "../../../assets/images/studio/icon/icon-HD-learning.svg";
import iconToolHDActive from "../../../assets/images/studio/icon/icon-HD-active.svg";
import iconToolOD from "../../../assets/images/studio/icon/icon-OD-dark.svg";
import iconToolODActive from "../../../assets/images/studio/icon/icon-OD-active.svg";
import iconToolODSelected from "../../../assets/images/studio/icon/icon-OD-selected.svg";
import iconToolIS from "../../../assets/images/studio/icon/icon-IS-dark.svg";
import iconToolISActive from "../../../assets/images/studio/icon/icon-IS-active.svg";
import iconToolISSelected from "../../../assets/images/studio/icon/icon-IS-selected.svg";
import iconToolSES from "../../../assets/images/studio/icon/icon-SES-dark.svg";
import iconToolSESActive from "../../../assets/images/studio/icon/icon-SES-active.svg";
import iconToolSESSelected from "../../../assets/images/studio/icon/icon-SES-selected.svg";
import iconToolSmartpen from "../../../assets/images/studio/icon/icon-smartpen-dark.svg";
import iconToolSmartpenSelected from "../../../assets/images/studio/icon/icon-smartpen-selected.svg";
import iconToolAutopoint from "../../../assets/images/studio/icon/icon-autopoint-dark.svg";
import iconToolAutopointSelected from "../../../assets/images/studio/icon/icon-autopoint-selected.svg";
import iconToolBoxing from "../../../assets/images/studio/icon/icon-boxing-dark.svg";
import iconToolBoxingSelected from "../../../assets/images/studio/icon/icon-boxing-selected.svg";
import iconToolPolyline from "../../../assets/images/studio/icon/icon-polyline-dark.svg";
import iconToolPolylineSelected from "../../../assets/images/studio/icon/icon-polyline-selected.svg";
import iconToolPolygon from "../../../assets/images/studio/icon/icon-polygon-dark.svg";
import iconToolPolygonSelected from "../../../assets/images/studio/icon/icon-polygon-selected.svg";
import iconToolPoint from "../../../assets/images/studio/icon/icon-point-dark.svg";
import iconToolPointSelected from "../../../assets/images/studio/icon/icon-point-selected.svg";
import iconToolBrush from "../../../assets/images/studio/icon/icon-brush-group-dark.svg";
import iconToolBrushSelected from "../../../assets/images/studio/icon/icon-brush-group-selected.svg";
import iconTool3Dcube from "../../../assets/images/studio/icon/icon-3dcube-dark.svg";
import iconTool3DcubeSelected from "../../../assets/images/studio/icon/icon-3dcube-selected.svg";
import iconToolSegment from "../../../assets/images/studio/icon/icon-segment-dark.svg";
import iconToolSegmentSelected from "../../../assets/images/studio/icon/icon-segment-selected.svg";
import iconToolKeypoint from "../../../assets/images/studio/icon/icon-keypoint-dark.svg";
import iconToolKeypointSelected from "../../../assets/images/studio/icon/icon-keypoint-selected.svg";
import iconArrowTop from "../../../assets/images/studio/icon/icon-scroll-up-dark.svg";
import iconArrowBottom from "../../../assets/images/studio/icon/icon-scroll-down-dark.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-scroll-left-dark.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-scroll-right-dark.svg";
import iconLock from "../../../assets/images/studio/icon/instanceTools/icon-lock-active.svg";
import iconUnLock from "../../../assets/images/studio/icon/instanceTools/icon-unlock-dark.svg";
import iconVisible from "../../../assets/images/studio/icon/instanceTools/icon-visible-dark.svg";
import iconInvisible from "../../../assets/images/studio/icon/instanceTools/icon-invisible-active.svg";
import iconDelete from "../../../assets/images/studio/icon/instanceTools/icon-delete-dark.svg";
import iconBoxingOn from "../../../assets/images/studio/icon/icon-boxing02.svg";
import iconBoxingOff from "../../../assets/images/studio/icon/icon-boxing03.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import rejectBtn from "../../../assets/images/studio/reject-text.svg";
import { Link } from "react-router-dom";
import {
  Button,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import SmallTask from "../../../components/studio/SmallTask";
import Modal from "../../../components/studio/Modal";
import AlertModal from "../../../components/studio/AlertModal";
import { IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { ITask } from "../../../api/taskApi";
import { IUserState } from "../../../redux/user/users";
import { fabric } from "fabric";

interface ILabelingPresenter {
  currentUser: IUserState;
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
  workStatutes: "??????" | "?????????" | "??????" | "?????????" | "??????";
  _setWorkStatutes: (
    status: "??????" | "?????????" | "??????" | "?????????" | "??????"
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
  _setDownload: (file: string) => void;
  onCancelDownload: () => void;
  onSubmitDownload: () => void;
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
  saveStatus: (status: number) => Promise<void>;
  goBack: () => void;

  handleCompleted: () => Promise<void>
  isOpenReject: boolean;
  handleOpenReject: () => void;
  handleCancelReject: () => void;
  onSubmitReject: () => void;
  handleSetRejectText: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleShowRejctHelp: () => Promise<void>;
  rejectComment: string | undefined;
  showRejectComment: boolean;
  handleCancelRejectComment: () => void;

  checkIsDownload: () => void;
  checkIsMove: () => void;
  checkIsTag: () => void;
  checkIsClass: () => void;
  checkIsReset: () => void;
  checkIsHD: () => void;
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
  setIsClass: (index: number) => void;
  isLock: (id: number, index: number) => void;
  isVisible: (id: number, index: number) => void;
  isDelete: (id: number) => void;
  setInstanceIcon: (tool: string) => string;
  setInstanceClass: (data: string) => void;
  setInstanceAttr: (attr: string) => void;
  isDownload: string;
  selectDownload: string;
  isDownloadOn: boolean;
  isMoveOn: boolean;
  isTagOn: boolean;
  isClassOn: boolean;
  isResetOn: boolean;
  isHDOn: boolean;
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
  labelWidth: number; 
  labelHeight: number;  
  labelDiag: string;  
  labelCoordX: number;  
  labelCoordY: number; 
  labelPerWidth: string; 
  labelPerHeight: string; 
  labelPerDiag: string;
  ObjectListItem: any[];
  isAutoLabelingOn: boolean;
  objectType: string;
  refTools: any;
  refPicker: any;
  refTop: any;
  refBottom: any;
  refBtnLock: any;
  refBtnVisible: any;
  refBtnDelete: any;
  onMoveToToolsTop: () => void;
  onMoveToToolsEnd: () => void;
  onMoveToToolsLeft: () => void;
  onMoveToToolsRight: () => void;
  isAutoLabeling: boolean;
  isDeleteInstance: boolean;
  checkIsDeleteInstance: () => void;
  onCancelDelete: () => void;
  selectedObjectId: number;
  selectedObject: fabric.Object;
  isHDLabelingOn: boolean;
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
const MainCenterImagePickerWrapper = styled.div`
  display: flex;
`;
const MainCenterImagePicker = styled.div`
&::-webkit-scrollbar {
  height: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  height: 10px;
}
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
  background-color: #00000000;
  background: #00000000;
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
const ImageWrapper = styled.div`
`;
const ImagePickerListContainer = styled.div`
  display: flex;
  align-items: center;
`;
const FileListArrow = styled.div`
  width: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  padding-left: 3px;
  padding-right: 3px;
  background: #A4A8AD;
  box-sizing: border-box;
  cursor: pointer;
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
const MainRightContainer = styled.div`
&::-webkit-scrollbar {
  width: 10px;
  display: none;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
:focus {
  background: #5f6164;
}
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100% - 142px);
  overflow-y: auto;
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
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;
const DropBoxContentWrapper = styled.div`
  width: 100%;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxContentTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const DropBoxContentDescWrapper = styled.div`
  padding: 15px 20px 10px;
  display: flex;
`;
const DropBoxInstanceDescWrapper = styled.div`
  padding: 15px 20px 10px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
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
const InstanceBoldText = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
`;
const InstanceNormalText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;
const DropBoxInstanceDescRow = styled.div`
  display: flex;
`;
const DropBoxInstanceDescLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
`;
const DropBoxInstanceDescRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`;
const DropBoxInstanceWrapper = styled.div`
&::-webkit-scrollbar {
  width: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
:focus {
  background: #5f6164;
}
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxInstanceItem = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
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
const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 10px;
  padding: 5px 10px;
  :focus {
    outline: none;
  }
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
const TopCanvas = styled.canvas<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
`;

const LabelingPresenter: React.FC<ILabelingPresenter> = ({
  currentUser,
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
  resizingVal,
  isDownloadOn,
  isDownload,
  selectDownload,
  isMoveOn,
  isTagOn,
  isClassOn,
  isResetOn,
  isHDOn,
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
  labelWidth, 
  labelHeight, 
  labelDiag, 
  labelCoordX, 
  labelCoordY,
  labelPerWidth, 
  labelPerHeight, 
  labelPerDiag,
  ObjectListItem,
  isAutoLabelingOn,
  objectType,
  refTools,
  refPicker,
  refTop,
  refBottom,
  refBtnLock,
  refBtnVisible,
  refBtnDelete,
  isAutoLabeling,

  isOpenReject,
  rejectComment,
  showRejectComment,
  isHDLabelingOn,

  selectedObjectId,
  selectedObject,

  isLock,
  isVisible,
  isDelete,
  _setLabelingAssignee,
  _setExaminee,
  toggleFileInfoOpen,
  toggleInstanceOpen,
  toggleHistoryOpen,
  _setWorkStatutes,
  _setSelectedTask,
  handlePrevTask,
  handleNextTask,
  _setDownload,
  onCancelDownload,
  onSubmitDownload,
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
  saveStatus,
  goBack,

  handleCompleted,
  handleOpenReject,
  handleCancelReject,
  onSubmitReject,
  handleSetRejectText,
  handleShowRejctHelp,
  handleCancelRejectComment,

  checkIsDownload,
  checkIsMove,
  checkIsTag,
  checkIsClass,
  checkIsReset,
  checkIsHD,
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
  setIsClass,
  onMoveToToolsTop,
  onMoveToToolsEnd,
  onMoveToToolsLeft,
  onMoveToToolsRight,
  setInstanceIcon,
  isDeleteInstance,
  checkIsDeleteInstance,
  onCancelDelete,
  setInstanceClass,
  setInstanceAttr,
}) => {
  const tooltipTextHD = "Human Detection";
  const tooltipContentsHD = 
    <Icon src={iconToolHD} />;
  {/* <Stack>
    <Text>Human Detection</Text>
    <Text>(OD + IS + SES)</Text>
    <Icon src={iconToolHD} />
  </Stack>; */}
  const tooltipTextOD = "Object Detection";
  const tooltipTextIS = "Instance Segmentation";
  const tooltipTextSES = "Semantic Segmentation";
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
                  style={{ width: 20, height: 17 }} />
              </NavLink>
              <NavButton
                style={{ cursor: "pointer" }}
                //onClick={handleDownloadImage}
                onClick={checkIsDownload}
              >
                <Icon
                  src={iconLink}
                  alt="icon-download"
                  style={{ width: 17.38, height: 17.67 }} />
                <Modal
                  isOpen={isDownloadOn}
                  onClose={onCancelDownload}
                  title={"????????? ????????????"}
                  txtSubmit={"????????????"}
                  onSubmit={onSubmitDownload}
                >
                  <>
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
                            width={"100%"}
                            _focus={{ bgColor: "#e2e4e7" }}
                            _hover={{ bgColor: "#e2e4e7" }}
                            _expanded={{ bgColor: "#e2e4e7" }}
                            isActive={isOpen}
                            as={Button}
                            rightIcon={isOpen ? (
                              <Icon src={arrowUp} />
                            ) : (
                              <Icon src={arrowDown} />
                            )}
                          >
                            <DropBoxTextWrapper>
                              <DropBoxNormalText style={{ height: 20 }}>
                                {isDownload !== "" ? selectDownload : "??????????????? ?????? ????????? ??????????????????."}
                              </DropBoxNormalText>
                            </DropBoxTextWrapper>
                          </MenuButton>
                          <MenuList
                            bgColor={"#e2e4e7"}
                            border={"1px"}
                            alignItems={"center"}
                            width={"100%"}
                            borderColor={"#c0c3c7"}
                            borderRadius={"none"}
                          >
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("coco")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"COCO Dataset Format"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("yolo")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"YOLO Dataset Format"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("image")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"Image"}
                              </DropBoxNormalText>
                            </MenuItem>
                          </MenuList>
                        </>
                      )}
                    </Menu>
                  </>
                </Modal>
              </NavButton>
              {selectedTask /* &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) */ ?
                <NavButton style={{ cursor: "pointer" }} onClick={() => saveStatus(2)}>
                  <Icon
                    src={iconSave}
                    alt="icon-save"
                    style={{ width: 18, height: 18 }}
                  />
              </NavButton> : <NavButton style={{ cursor: "not-allowed" }}>
                  <Icon
                    src={iconSave}
                    alt="icon-save"
                    style={{ width: 18, height: 18 }}
                  />
              </NavButton>}
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
                  onClick={selectedTask
                    ? () => handlePrevTask(selectedTask.taskId)
                    : undefined} />
                <HeaderCenterTextContainer>
                  <HeaderCenterText>
                    {projectInfo ? projectInfo.projectName : "???????????? ???"}
                  </HeaderCenterText>
                  <HeaderCenterImageTitle>
                    {selectedTask ? selectedTask.imageName : ""}
                  </HeaderCenterImageTitle>
                </HeaderCenterTextContainer>
                <Icon
                  src={iconNext}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={selectedTask
                    ? () => handleNextTask(selectedTask.taskId)
                    : undefined} />
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>????????????</BoldText>
                  </ProgressTextBox>
                  <Divider style={{ marginLeft: 4 }} />
                  <ProgressTextBox>
                    <NormalText>{selectedTask && selectedTask.taskStep === 1 ? "??????" : "??????"}</NormalText>
                  </ProgressTextBox>
                </ProgressContainer>
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>????????????</BoldText>
                  </ProgressTextBox>
                  <Divider />
                  <ProgressTextBox>
                    {selectedTask && selectedTask.taskStatus === 1 && (
                      <>
                        <Ball style={{ backgroundColor: "#E2772A" }} />
                        <NormalText style={{ color: "#E2772A" }}>
                          ?????????
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 2 && (
                      <>
                        <Ball style={{ backgroundColor: "#3580E3" }} />
                        <NormalText style={{ color: "#3580E3" }}>
                          ?????????
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 3 && (
                      <>
                        <Ball style={{ backgroundColor: "#2EA090" }} />
                        <NormalText style={{ color: "#2EA090" }}>
                          ????????????
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 4 && (
                      <>
                        <Ball style={{ backgroundColor: "#FF4343" }} />
                        <NormalText style={{ color: "#FF4343" }}>
                          ??????
                        </NormalText>
                        <Icon src={rejectBtn}
                          style={{ marginLeft: 5, cursor: "pointer" }}
                          onClick={handleShowRejctHelp} />
                        <Modal
                          isOpen={showRejectComment}
                          onClose={handleCancelRejectComment}
                          title={"????????????"}
                          onSubmit={onSubmitReject}
                          noSubmit={true}
                          txtSubmit={""}
                        >
                          <>
                            <BoldText>{rejectComment}</BoldText>
                          </>
                        </Modal>
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
                  min={10}
                  max={200}
                  //defaultValue={"100"}
                  value={resizingVal === null ? "100" : resizingVal}
                  onChange={handleResizing} />
                <Icon src={iconZoomInc} />
              </ZoomBox>
            </HeaderRight>
          </StudioHeader>
          <Main>
            <MainLeftWrap>
              <LeftListArrow id={"arrowToolsTop"} onClick={() => onMoveToToolsTop()}>
                <Icon
                  src={iconArrowTop} />
              </LeftListArrow>
              <MainLeft id={"toolsWrap"} ref={refTools}>
                <Tooltip hasArrow label="??????" placement="right">
                  <LeftItemContainer onClick={checkIsMove} ref={refTop}>
                    <Icon
                      src={isMoveOn ? iconToolMoveSelected : iconToolMove} />
                    <LeftItemText>??????</LeftItemText>
                    {/* <AlertModal
      isOpen={isMoveOn}
      onClose={onCancelMove}
      title={"??????"}
    >
      <>
        <p>
          {"??????????????????."}
        </p>
      </>
    </AlertModal> */}
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="??????" placement="right">
                  <LeftItemContainer onClick={checkIsTag}>
                    <Icon
                      src={isTagOn ? iconToolTagSelected : iconToolTag} />
                    <LeftItemText>??????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="?????????" placement="right">
                  <LeftItemContainer onClick={checkIsClass}>
                    <Icon
                      src={isClassOn ? iconToolClassSelected : iconToolClass} />
                    <LeftItemText>?????????</LeftItemText>
                    {/* <>
      <Popup
        onClose={onCancelClass}
        isOpen={isClassOn}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
                        <ModalContent 
        <ModalContent
          bgColor={"#5F6164"}
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
                          position={"absolute"} 
          position={"absolute"}
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
          top={"20px"}
                          top={"20px"} 
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
            {"????????? ??????"}
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
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
                            <Button 
            <Button
              margin={"0 10px 8px 0"}
              height={"26px"}
              background={"#414244"}
              fontSize={"md"}
              color={"#E2E4E7"}
              border-radius={"4px"}
              padding={"0 10px"}
            >
              ??????
            </Button>
            {"??????"}
            <Button>??????1</Button>
          </ModalBody>
        </ModalContent>
      </Popup>
    </> */}
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="??????" placement="right">
                  <LeftItemContainer onClick={checkIsReset}>
                    <Icon
                      src={isResetOn ? iconToolResetSelected : iconToolReset} />
                    <LeftItemText>??????</LeftItemText>
                    <Modal
                      isOpen={isResetOn}
                      onClose={onCancelReset}
                      title={"??????"}
                      txtSubmit={"??????"}
                      onSubmit={onSubmitReset}
                    >
                      <>
                        <p>
                          {"?????? ????????? ????????????????????????????"}
                        </p>
                      </>
                    </Modal>
                  </LeftItemContainer>
                </Tooltip>
                <UnderBar></UnderBar>
                <Tooltip hasArrow label={tooltipTextHD} placement="right">
                  <LeftItemContainer onClick={checkIsHD}>
                    {/* // Todo: Active, Learning, Working, Inactive */}
                    <Icon
                      src={isAutoLabelingOn ? isHDOn ? iconToolHDActive : iconToolHDActive : iconToolHD} />
                    <LeftItemText>HD</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label={tooltipTextOD} placement="right">
                  <LeftItemContainer onClick={checkIsOD}>
                    <Icon
                      src={isAutoLabelingOn ? isODOn ? iconToolODSelected : iconToolODActive : iconToolOD} />
                    <LeftItemText>OD</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label={tooltipTextIS} placement="right">
                  <LeftItemContainer onClick={checkIsIS}>
                    <Icon
                      src={isAutoLabelingOn ? isISOn ? iconToolISSelected : iconToolISActive : iconToolIS} />
                    <LeftItemText>IS</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label={tooltipTextSES} placement="right">
                  <LeftItemContainer onClick={checkIsSES}>
                    <Icon
                      src={isAutoLabelingOn ? isSESOn ? iconToolSESSelected : iconToolSESActive : iconToolSES} />
                    <LeftItemText>SES</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="????????????" placement="right">
                  <LeftItemContainer onClick={checkIsSmartpen}>
                    <Icon
                      src={isSmartpenOn ? iconToolSmartpenSelected : iconToolSmartpen} />
                    <LeftItemText>????????????</LeftItemText>
                    {/* <AlertModal
      isOpen={isSmartpenOn}
      onClose={onCancelSmartpen}
      title={"????????????"}
    >
      <>
        <p>
          {"??????????????????."}
        </p>
      </>
    </AlertModal> */}
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="???????????????" placement="right">
                  <LeftItemContainer onClick={checkIsAutopoint}>
                    <Icon
                      src={isAutopointOn ? iconToolAutopointSelected : iconToolAutopoint} />
                    <LeftItemText>???????????????</LeftItemText>
                    {/* <AlertModal
      isOpen={isAutopointOn}
      onClose={onCancelAutopoint}
      title={"???????????????"}
    >
      <>
        <p>
          {"??????????????????."}
        </p>
      </>
    </AlertModal> */}
                  </LeftItemContainer>
                </Tooltip>
                <UnderBar></UnderBar>
                <Tooltip hasArrow label="??????" placement="right">
                  <LeftItemContainer onClick={checkIsBoxing}>
                    <Icon
                      src={isBoxingOn ? iconToolBoxingSelected : iconToolBoxing} />
                    <LeftItemText>??????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="????????????" placement="right">
                  <LeftItemContainer onClick={checkIsPolyline}>
                    <Icon
                      src={isPolylineOn ? iconToolPolylineSelected : iconToolPolyline} />
                    <LeftItemText>????????????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="?????????" placement="right">
                  <LeftItemContainer onClick={checkIsPolygon}>
                    <Icon
                      src={isPolygonOn ? iconToolPolygonSelected : iconToolPolygon} />
                    <LeftItemText>?????????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="?????????" placement="right">
                  <LeftItemContainer onClick={checkIsPoint}>
                    <Icon
                      src={isPointOn ? iconToolPointSelected : iconToolPoint} />
                    <LeftItemText>?????????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="?????????" placement="right">
                  <LeftItemContainer onClick={checkIsBrush}>
                    <Icon
                      src={isBrushOn ? iconToolBrushSelected : iconToolBrush} />
                    <LeftItemText>?????????</LeftItemText>
                    <AlertModal
                      isOpen={isBrushOn}
                      onClose={onCancelBrush}
                      title={"?????????"}
                    >
                      <>
                        <p>
                          {"??????????????????."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="3D??????" placement="right">
                  <LeftItemContainer onClick={checkIs3Dcube}>
                    <Icon
                      src={is3DcubeOn ? iconTool3DcubeSelected : iconTool3Dcube} />
                    <LeftItemText>3D ??????</LeftItemText>
                    <AlertModal
                      isOpen={is3DcubeOn}
                      onClose={onCancel3Dcube}
                      title={"3D??????"}
                    >
                      <>
                        <p>
                          {"??????????????????."}
                        </p>
                      </>
                    </AlertModal>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="????????????" placement="right">
                  <LeftItemContainer onClick={checkIsSegment}>
                    <Icon
                      src={isSegmentOn ? iconToolSegmentSelected : iconToolSegment} />
                    <LeftItemText>????????????</LeftItemText>
                  </LeftItemContainer>
                </Tooltip>
                <Tooltip hasArrow label="????????????" placement="right">
                  <LeftItemContainer onClick={checkIsKeypoint} ref={refBottom}>
                    <Icon
                      src={isKeypointOn ? iconToolKeypointSelected : iconToolKeypoint} />
                    <LeftItemText>????????????</LeftItemText>
                    {/* <AlertModal
      isOpen={isKeypointOn}
      onClose={onCancelKeypoint}
      title={"????????????"}
    >
      <>
        <p>
          {"??????????????????."}
        </p>
      </>
    </AlertModal> */}
                  </LeftItemContainer>
                </Tooltip>
              </MainLeft>
              <LeftListArrow id={"arrowToolsBottom"} onClick={() => onMoveToToolsEnd()}>
                <Icon
                  src={iconArrowBottom} />
              </LeftListArrow>
            </MainLeftWrap>
            <MainCenterWrapper>
              {loading && isAutoLabeling ? (
                <SpinnerWrapper>
                  <Spinner speed="0.35s" />
                </SpinnerWrapper>
              ) : (<></>)}
              <MainCenterUpper
                id={"mainCenterUpper"}
                isFileSelectorOpen={isFileSelectorOpen}
              >
                {/*//! ????????? ???????????? ??????????????? ????????? ?????? ????????? ???????????? ????????? */}
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
                      src={currentDataURL ? currentDataURL : selectedTask.image} />
                  ) : (
                    <Spinner speed="0.35s" />
                  ))}
                {/*//! Canvas */}
                <div style={{ position: "relative" }}>
                  <Canvas
                    id={"fCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal} />
                  <TopCanvas
                    id={"magicCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal}
                    style={{ display: "none" }} />
                </div>
                {isClassOn && (
                  <>
                    <div className="class-setting">
                      <ul className="class-setting-contents">
                        <li>
                          <h3>????????? ??????</h3>
                        </li>
                        <li>
                          <button
                            id="human"
                            className="class-contents-obj"
                            onClick={() => setInstanceClass("")}
                            >
                            ??????
                          </button>
                        </li>
                      </ul>
                      <ul className="class-setting-contents">
                        <li>
                          <h3>??????</h3>
                        </li>
                        <li>
                          <button
                            id="female"
                            className="class-contents-gender"
                            onClick={() => setInstanceAttr("")}
                            >
                            ??????
                          </button>
                        </li>
                      </ul>
                      <Icon src={iconClose} onClick={() => checkIsClass}/>
                    </div>
                  </>
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
                            ????????????
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
                        {["??????", "?????????", "??????", "?????????", "??????"].map(
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
                <MainCenterImagePickerWrapper>
                <FileListArrow id={"arrowPickerLeft"} onClick={() => onMoveToToolsLeft()}>
                  <Icon
                    src={iconArrowLeft} />
                </FileListArrow>
                <MainCenterImagePicker id={"imgPicker"} ref={refPicker}>
                    {loading && isFirst ? (
                      <SpinnerWrapper>
                        <Spinner speed="0.35s" />
                      </SpinnerWrapper>
                    ) : (
                      <>
                        {/* <PickedImageContainer>
            {selectedTask && workStatutes === "??????" ? (
              <SmallTask task={selectedTask} isSelected={true} />
            ) : (
              selectedTask &&
              selectedTask.taskStatusName === workStatutes && (
                <SmallTask task={selectedTask} isSelected={true} />
              )
            )}
          </PickedImageContainer> */}
                        <ImagePickerListContainer>
                          {workStatutes === "??????" &&
                            tasks.map((task, index) => {
                              if (selectedTask &&
                                task.taskId === selectedTask.taskId)
                                return (
                                  <ImageWrapper
                                    //onClick={() => _setSelectedTask(task)}
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={selectedTask} isSelected={true} />
                                  </ImageWrapper>
                                );
                              return (
                                <ImageWrapper
                                  id={"img" + index}
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </ImageWrapper>
                              );
                            })}
                          {workStatutes === "?????????" &&
                            tasks
                              .filter((t) => t.taskStatus === 1)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
                                      //onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={selectedTask} isSelected={true} />
                                    </ImageWrapper>
                                  );
                                return (
                                  <ImageWrapper
                                    onClick={() => _setSelectedTask(task)}
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={task} isSelected={false} />
                                  </ImageWrapper>
                                );
                              })}
                          {workStatutes === "?????????" &&
                            tasks
                              .filter((t) => t.taskStatus === 2)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
                                      //onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={selectedTask} isSelected={true} />
                                    </ImageWrapper>
                                  );
                                return (
                                  <ImageWrapper
                                    onClick={() => _setSelectedTask(task)}
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={task} isSelected={false} />
                                  </ImageWrapper>
                                );
                              })}
                          {workStatutes === "??????" &&
                            tasks
                              .filter((t) => t.taskStatus === 3)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
                                      //onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={selectedTask} isSelected={true} />
                                    </ImageWrapper>
                                  );
                                return (
                                  <ImageWrapper
                                    onClick={() => _setSelectedTask(task)}
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={task} isSelected={false} />
                                  </ImageWrapper>
                                );
                              })}
                          {workStatutes === "??????" &&
                            tasks
                              .filter((t) => t.taskStatus === 4)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
                                      //onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={selectedTask} isSelected={true} />
                                    </ImageWrapper>
                                  );
                                return (
                                  <ImageWrapper
                                    onClick={() => _setSelectedTask(task)}
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={task} isSelected={false} />
                                  </ImageWrapper>
                                );
                              })}
                        </ImagePickerListContainer>
                      </>
                    )}
                  </MainCenterImagePicker>
                  <FileListArrow id={"arrowPickerRight"} onClick={() => onMoveToToolsRight()}>
                    <Icon
                      src={iconArrowRight} />
                  </FileListArrow>
                  </MainCenterImagePickerWrapper>
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
                          disabled={!currentUser.isAdmin}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>?????? ?????????</DropBoxBoldText>
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
                          disabled={!currentUser.isAdmin}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>?????? ?????????</DropBoxBoldText>
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
                <MainRightContainer>
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
                        {/* <DropBoxBoldText style={{ marginBottom: 8 }}>
                          ?????????
                        </DropBoxBoldText> */}
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          ????????????
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          ??????
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      <DropBoxContentDescRight>
                        {/* <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageName
                            ? `${selectedTask.imageName}`
                            : "file.png"}
                        </DropBoxNormalText> */}
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageWidth &&
                          selectedTask.imageHeight
                            ? `${selectedTask.imageWidth}px*${
                                selectedTask.imageHeight
                              }px`
                            : "1600px*900px"} 
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
                      <ArrowDropDownText>Instance</ArrowDropDownText>
                    </DropBoxContentTitle>
                  </DropBoxContentWrapper>
                  {/* {isInstanceOpen && (
                    <DropBoxContentDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxContentDescLeft>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          ?????????
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                            {AttrList.attrName}
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      {selectedObject && (
                        <DropBoxContentDescRight>
                          <DropBoxNormalText style={{ marginBottom: 8 }}>
                            <Ball style={{ backgroundColor: "blue" }} />
                            {ObjectListItem[selectedObjectId].annotation.annotation_category.annotation_category_id}
                          </DropBoxNormalText>
                          <DropBoxNormalText style={{ marginBottom: 8 }}>
                              {AttrList.attrValue}
                          </DropBoxNormalText>
                        </DropBoxContentDescRight>
                      )}
                    </DropBoxContentDescWrapper>
                  )} */}
                  {isInstanceOpen && (
                    <DropBoxContentDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxInstanceDescRow>
                        <DropBoxContentDescLeft>
                          <DropBoxBoldText style={{ marginBottom: 8 }}>
                            ?????????
                          </DropBoxBoldText>
                        </DropBoxContentDescLeft>
                        {/* <DropBoxContentDescRight>
                          {selectedObject && selectedObject.annotation && (
                          <DropBoxNormalText style={{ marginBottom: 8 }}>
                            <Ball style={{ backgroundColor: "blue" }} />
                            {selectedObject.annotation.annotation_category.annotation_category_id}
                          </DropBoxNormalText>
                          )}
                        </DropBoxContentDescRight> */}
                      </DropBoxInstanceDescRow>
                      {/* {selectedObject && selectedObject.annotation &&(
                        selectedObject.annotation.annotation_category.annotation_category_attributes.map((item, index) => {
                              return <DropBoxInstanceDescRow
                              key={index}
                            >
                          <DropBoxContentDescLeft>
                            <DropBoxBoldText style={{ marginBottom: 8 }}>
                               
                                {item.annotation_category_attr_name}
                            </DropBoxBoldText>
                          </DropBoxContentDescLeft>
                          <DropBoxContentDescRight>
                            <DropBoxNormalText style={{ marginBottom: 8 }}>
                              
                              {item.annotation_category_attr_val}
                            </DropBoxNormalText>
                          </DropBoxContentDescRight>
                        </DropBoxInstanceDescRow>
                        })
                      )} */}
                    </DropBoxContentDescWrapper>
                  )}
                  {isInstanceOpen && ObjectListItem.length > 0 && (
                    <DropBoxInstanceWrapper>
                      {ObjectListItem.map((item, index) => {
                            return <DropBoxInstanceItem
                          key={index}
                          id={"instance" + index}
                          //_hover={{ bgColor: "#CFD1D4" }}
                          //_focusWithin={{ bgColor: "#CFD1D4" }}
                          //onClick={() => setIsClass(index)}
                          style={{
                            borderBottom: 2,
                            borderBottomColor: "#c0c3c7",
                            borderBottomStyle: "solid",
                          }}
                        >
                          <DropBoxTextWrapper onClick={() => setIsClass(index)}>
                            <Icon
                              src={setInstanceIcon(item.object.tool)}
                              style={{ marginLeft: 10, marginRight: 10 }}
                            />
                            <DropBoxNormalText>
                              {item.object.id + ": " + item.className}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                          <Icon
                            id={"lockBtn" + index}
                            ref={refBtnLock}
                            src={item.object.selectable ? iconUnLock : iconLock}
                            style={{ marginLeft: 10, marginRight: 5 }}
                            onClick={() => isLock(item.object.id, index)}
                          />
                          <Icon
                            id={"visibleBtn" + index}
                            ref={refBtnVisible}
                            src={item.object.visible ? iconVisible : iconInvisible}
                            style={{ marginLeft: 5, marginRight: 5 }}
                            onClick={() => isVisible(item.object.id, index)}
                          />
                          <div>
                          <Icon
                            id={"deleteBtn" + index}
                            ref={refBtnDelete}
                            src={iconDelete}
                            style={{ marginLeft: 5, marginRight: 5 }}
                            //onClick={checkIsDeleteInstance}
                            onClick={() => isDelete(item.object.id)}
                          /> 
                          {/* <Modal
                            isOpen={isDeleteInstance}
                            onClose={onCancelDelete}
                            title={"Instance ??????"}
                            onSubmit={() => isDelete(item.object.id)}
                            txtSubmit={"??????"}
                          >
                            <>
                              <BoldText>{"Instance??? ?????????????????????????"}</BoldText>
                            </>
                          </Modal> */}
                          </div>
                        </DropBoxInstanceItem>
                      })}
                    </DropBoxInstanceWrapper>
                  )}
                  {isInstanceOpen && objectType === "rect" && (
                    <DropBoxInstanceDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxInstanceDescRow>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            ??????
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelHeight}px<br></br>({labelPerHeight}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            ?????????
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelDiag}px<br></br>({labelPerDiag}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                      </DropBoxInstanceDescRow>
                      <DropBoxInstanceDescRow>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            ??????
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelWidth}px<br></br>({labelPerWidth}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            ??????
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            x: {labelCoordX}px<br></br> y: {labelCoordY}px
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                      </DropBoxInstanceDescRow>
                    </DropBoxInstanceDescWrapper>
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
                  {/* {isHistoryOpen && HistoryListItem.length > 0 && (
                    <DropBoxInstanceWrapper>
                      {HistoryListItem.map((history, index) => {
                            return <DropBoxInstanceItem
                          key={index}
                          id={"instance"+index}
                          //_hover={{ bgColor: "#CFD1D4" }}
                          //_focusWithin={{ bgColor: "#CFD1D4" }}
                          onClick={() => setIsClass(index)}
                          style={{
                            borderBottom: 2,
                            borderBottomColor: "#c0c3c7",
                            borderBottomStyle: "solid",
                          }}
                        >
                          <Icon
                            // Todo: ????????? ?????? ???????????? ??????
                            src={isHistoryOpen ? iconBoxingOn : iconBoxingOff}
                            style={{ marginLeft: 10, marginRight: 10 }}
                          />
                          <DropBoxTextWrapper>
                            <DropBoxNormalText>
                              {history.id + ": " + history.name}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </DropBoxInstanceItem>
                      })}
                    </DropBoxInstanceWrapper>
                  )} */}
                  {isHistoryOpen && ObjectListItem.length > 0 && (
                  <DropBoxInstanceWrapper>
                      {ObjectListItem.map((item, index) => {
                            return <DropBoxInstanceItem
                          key={index}
                          id={"instance" + index}
                          style={{
                            borderBottom: 2,
                            borderBottomColor: "#c0c3c7",
                            borderBottomStyle: "solid",
                          }}
                        >
                          <DropBoxTextWrapper>
                            <Icon
                              src={setInstanceIcon(item.object.tool)}
                              style={{ marginLeft: 10, marginRight: 10 }}
                            />
                            <DropBoxNormalText>
                              {item.object.id + ": " + item.className}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                          <Icon
                            src={item.object.selectable ? iconUnLock : iconLock}
                            style={{ marginLeft: 10, marginRight: 5 }}
                          />
                          <Icon
                            src={item.object.visible ? iconVisible : iconInvisible}
                            style={{ marginLeft: 5, marginRight: 5 }}
                          />
                          <Icon
                            src={iconDelete}
                            style={{ marginLeft: 5, marginRight: 5 }}
                          /> 
                        </DropBoxInstanceItem>
                      })}
                    </DropBoxInstanceWrapper>
                  )}
                </DropBoxContainer>
                </MainRightContainer>
              </MainRightUpper>
              <MainRightBottom>
                {selectedTask &&
                !(selectedTask.taskStep === 2 && selectedTask.taskStatus === 3) &&
                (currentUser.id === selectedTask.taskValidator?.id || currentUser.id === selectedTask.taskWorker?.id) &&
                <FinishButton onClick={handleCompleted}>??????</FinishButton>}
                {selectedTask &&
                  currentUser.id !== selectedTask.taskValidator?.id &&
                  currentUser.id !== selectedTask.taskWorker?.id &&
                <FinishButton style={{ cursor: "not-allowed", backgroundColor: "#c0c3c7"}}>??????</FinishButton>}
                {selectedTask &&
                  selectedTask.taskValidator &&
                  selectedTask.taskStep === 2 &&
                  selectedTask.taskValidator.id === currentUser.id && (
                    <>
                      <RejectButton onClick={handleOpenReject}>??????</RejectButton>
                      <Modal
                        isOpen={isOpenReject}
                        onClose={handleCancelReject}
                        title={"??????"}
                        onSubmit={onSubmitReject}
                        txtSubmit={"??????"}
                      >
                        <>
                          <TextArea 
                            placeholder="??????????????? ???????????????." 
                            rows={5} 
                            autoFocus={false}
                            onChange={handleSetRejectText}
                          />
                        </>
                    </Modal>
                </>
                  )}
              </MainRightBottom>
            </MainRight>
          </Main>
        </StudioWrapper>
      </ChakraProvider>
    </>
  );
};

export default LabelingPresenter;