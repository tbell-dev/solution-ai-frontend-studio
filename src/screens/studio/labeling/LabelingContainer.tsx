import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { useToast } from "@chakra-ui/react";
import LabelingPresenter from "./LabelingPresenter";
import {
  dataUrlToBlob,
  getDataUrlByCanvasWithImg,
  getDataUrlWithFilter,
  IParamTransform,
} from "../../../utils";
import mergeImages from "merge-images";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import taskApi, { ITask } from "../../../api/taskApi";
import userApi, { IUser } from "../../../api/userApi";
import projectApi, {
  IGetProjectParam,
  IProjectInfo,
} from "../../../api/projectApi";
import { useAppSelector } from "../../../hooks";
import labelingApi, { ILabeling, IAutoLabeling } from "../../../api/labelingApi";
import { fabric } from "fabric";
import { is } from "immer/dist/internal";
import { AnyAaaaRecord } from "dns";
import iconDefault from "../../../assets/images/studio/icon/instanceTools/icon-instance-default.svg";
import iconSmartpen from "../../../assets/images/studio/icon/instanceTools/icon-instance-smartpen.svg";
import iconAutopoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-autopoint.svg";
import iconBoxing from "../../../assets/images/studio/icon/instanceTools/icon-instance-boxing.svg";
import iconPolyline from "../../../assets/images/studio/icon/instanceTools/icon-instance-polyline.svg";
import iconPolygon from "../../../assets/images/studio/icon/instanceTools/icon-instance-polygon.svg";
import iconPoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-point.svg";
import iconBrush from "../../../assets/images/studio/icon/instanceTools/icon-instance-brush.svg";
import icon3Dcube from "../../../assets/images/studio/icon/instanceTools/icon-instance-3Dcube.svg";
import iconSegment from "../../../assets/images/studio/icon/instanceTools/icon-instance-segment.svg";
import iconKeypoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-keypoint.svg";
import iconOD from "../../../assets/images/studio/icon/instanceTools/icon-instance-OD.svg";
import iconIS from "../../../assets/images/studio/icon/instanceTools/icon-instance-IS.svg";
import iconSES from "../../../assets/images/studio/icon/instanceTools/icon-instance-SES.svg";
import iconLock from "../../../assets/images/studio/icon/instanceTools/icon-lock-active.svg";
import iconUnLock from "../../../assets/images/studio/icon/instanceTools/icon-unlock-dark.svg";
import iconVisible from "../../../assets/images/studio/icon/instanceTools/icon-visible-dark.svg";
import iconInvisible from "../../../assets/images/studio/icon/instanceTools/icon-invisible-active.svg";

//let fabric = require("fabric.js");

export const WORKSTATUS_ALL = "전체";
export const WORKSTATUS_1 = "미작업";
export const WORKSTATUS_2 = "진행중";
export const WORKSTATUS_3 = "완료";
export const WORKSTATUS_4 = "반려";
export type WorkStatusType = "전체" | "미작업" | "진행중" | "완료" | "반려";

export const SYMMETRY_LEFT_RIGHT = "LeftRight";
export const SYMMETRY_UP_DOWN = "UpDown";
export type SymmetryType = "HORIZONTAL" | "VERTICAL";
export type RotateType =
  | "ROTATE_90"
  | "ROTATE_180"
  | "ROTATE_270"
  | "ROTATE_360";

//! 가공처리를 이행할때마다 History에 대한 Interface
export interface IDataURLHistory {
  taskId: number;
  order: number;
  dataURL: string;
}

export interface ICanvasHistory {
  currentState: string; 
  stateStack: string[]; //Undo stack
  redoStack: string[]; //Redo stack
  locked: boolean; //Determines if the state can currently be saved.
  maxCount: number;
}

const LabelingContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! project ID를 URL로부터 Get
  const { pId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //**! 기본 state, set */
  const toast = useToast();
  // ! display Matrix on symmetry
  const [dm, setDm] = useState<any>(null);
  // ! effect를 적용 시, 적용 기간동안 loading state가 true가 되고 화면에 로딩 컴포넌트를 뿌려주기 위함
  const [effectLoading, setEffectLoading] = useState<boolean>(false);
  // ! Canvas is on ?
  const [isCanvasOn, setIsCanvasOn] = useState<boolean>(false);
  // ! Canvas set
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  // ! MainCenterBottom의 file select state
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState<boolean>(false);
  // ! 우측 DropBoxContentDescWrapper의 File 정보 노출 state
  const [isFileInfoOpen, setIsFileInfoOpen] = useState<boolean>(false);
  // ! 우측 DropBoxContentDescWrapper의 Instance 정보 노출 state
  const [isInstanceOpen, setIsInstanceOpen] = useState<boolean>(false);
  // ! 우측 DropBoxContentDescWrapper의 History 정보 노출 state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  // ! loading state
  const [loading, setLoading] = useState<boolean>(false);
  // ! Main 화면 File List를 처음 여는지 아닌지 여부 (이거는 처음 렌더링할때 로딩하는 시간이 있어서 로딩 이펙트를 넣어주기 위함)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  // ! MainCenterImagePicker의 파일 리스트
  const [tasks, setTasks] = useState<ITask[]>([]);
  // ! current selected file
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  // ! history about task
  const [dataURLHistory, setDataURLHistory] = useState<IDataURLHistory[]>([]);
  // ! current image data url
  const [currentDataURL, setCurrentDataURL] = useState<string | null>(null);
  // ! work statutes
  const [workStatutes, setWorkStatutes] = useState<WorkStatusType>(
    WORKSTATUS_ALL
  );
  // ! 프로젝트 가공 담당자
  const [labelingAssignee, setLabelingAssignee] = useState<IUser>();
  // ! 프로젝트 검수 담당자
  const [examinee, setExaminee] = useState<IUser>();
  // ! 프로젝트 참여자
  const [projectUser, setProjectUser] = useState<IUser[]>([]);
  // ! 프로젝트 정보
  const [projectInfo, setProjectInfo] = useState<IProjectInfo | null>();
  const [selectedTool, setSelectedTool] = useState("");
  const currentTool = useRef(selectedTool);

  const [canvasHistory, setCanvasHistory] = useState<ICanvasHistory[]>([]);

  let isDown = false, drawMode = false, isDragging = false, selection = false, isSelectObjectOn = false;
  let objId = 0;
  let startX = 0, startY = 0, endX = 0, endY = 0;
  let pointArray: any[] = [];
  let activeLine: any = null;
  let activeShape: any = null;
  let lineArray: any[] = [];

  const [objectId, setObjectId] = useState(0);

  const [instanceWidth, setInstanceWidth] = useState(0);
  const [instanceHeight, setInstanceHeight] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [objectType, setObjectType] = useState("");
  const [selectedObjectId, setSelectedObjectId] = useState(-1);

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const [labelWidth, setLabelWidth] = useState(0);
  const [labelHeight, setLabelHeight] = useState(0);
  const [labelCoordX, setLabelCoordX] = useState(0);
  const [labelCoordY, setLabelCoordY] = useState(0);
  const [labelDiag, setLabelDiag] = useState("");
  const [labelPerWidth, setLabelPerWidth] = useState("");
  const [labelPerHeight, setLabelPerHeight] = useState("");
  const [labelPerDiag, setLabelPerDiag] = useState("");

  const [imgRatio, setimgRatio] = useState(0);
  const [imgWidth, setimgWidth] = useState(0);
  const [imgHeight, setimgHeight] = useState(0);

  const [ObjectListItem, setObjectListItem] = useState([]);
  const currentObjectItem = useRef(ObjectListItem);
  /* const [InstanceListItem, setInstanceListItem] = useState([]);
  const [AnnotationListItem, setAnnotationListItem] = useState([]);
  const [TagListItem, setTagListItem] = useState([]); */
  const [DeleteIDList, setDeleteIDList] = useState([]);
  const [instanceClass, setInstanceClass] = useState("");
  const [instanceGender, setInstanceGender] = useState("");
  const [instanceAge, setInstanceAge] = useState("");

  // Todo: 오토라벨링 Active 체크
  const [isAutoLabelingOn, setAutoLabelingOn] = useState(false);

  const [isDownloadOn, setIsDownloadOnOff] = useState<boolean>(false);
  const [isDownload, setDownload] = useState("");
  const [selectDownload, setSelectDownload] = useState("");

  const [resizingVal, setResizingVal] = useState<string | null>(null);

  const [isMoveOn, setIsMoveOnOff] = useState<boolean>(false);

  const [isTagOn, setIsTagOnOff] = useState<boolean>(false);
  const isTag = useRef(isTagOn);

  const [isClassOn, setIsClassOnOff] = useState<boolean>(false);

  const [isResetOn, setIsResetOnOff] = useState<boolean>(false);

  const [isODOn, setIsODOnOff] = useState<boolean>(false);

  const [isISOn, setIsISOnOff] = useState<boolean>(false);

  const [isSESOn, setIsSESOnOff] = useState<boolean>(false);

  const [isSmartpenOn, setIsSmartpenOnOff] = useState<boolean>(false);

  let autoPointList = [];
  const [isAutopointOn, setIsAutopointOnOff] = useState<boolean>(false);

  const [isBoxingOn, setIsBoxingOnOff] = useState<boolean>(false);

  const [isPolylineOn, setIsPolylineOnOff] = useState<boolean>(false);

  const [isPointOn, setIsPointOnOff] = useState<boolean>(false);

  const [isBrushOn, setIsBrushOnOff] = useState<boolean>(false);

  const [is3DcubeOn, setIs3DcubeOnOff] = useState<boolean>(false);

  const [isSegmentOn, setIsSegmentOnOff] = useState<boolean>(false);

  const [isKeypointOn, setIsKeypointOnOff] = useState<boolean>(false);

  const [isAutoLabeling, setIsAutoLabeling] = useState<boolean>(false);

  const refTools = useRef<any>(undefined);
  const refTop = useRef<any>(undefined);
  const refBottom = useRef<any>(undefined);


  // ! MainCenterBottom의 isOpen state toggle method
  const toggleFileSelector = () => {
    setLoading(true);
    setIsFileSelectorOpen((prev) => !prev);
    setTimeout(() => {
      setLoading(false);
      setIsFirst(false);
    }, 1500);
    return;
  };
  // ! set preProcessingAssignee
  const _setLabelingAssignee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
    // TODO: Toast Popup ??
    doUpdateTaskUser(user, "Worker");
    setLabelingAssignee(user);
    return;
  };
  // ! set examinee
  const _setExaminee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
    // TODO: Toast Popup ??
    doUpdateTaskUser(user, "Validator");
    setExaminee(user);
    return;
  };
  // ! Task의 전처리 담당자 / 검수 담당자를 바꿀 때 호출되는 메소드
  const doUpdateTaskUser = async (
    user: IUser,
    type: "Worker" | "Validator"
  ) => {
    // TODO: role based 권한 처리
    if (pId && selectedTask) {
      const updateTaskParams = {
        project_id: parseInt(pId),
      };
      let updateTaskPayload;
      if (type === "Worker") {
        updateTaskPayload = {
          task_id: selectedTask.taskId,
          task_worker: {
            user_id: user.userId,
          },
        };
      }
      if (type === "Validator") {
        updateTaskPayload = {
          task_id: selectedTask.taskId,
          task_validator: {
            user_id: user.userId,
          },
        };
      }
      console.log(updateTaskPayload);
      await taskApi.updateTask(updateTaskParams, updateTaskPayload);
    } else {
      return;
    }
  };
  // ! toggle File info state on MainRightPanel
  const toggleFileInfoOpen = () => {
    setIsFileInfoOpen((prev) => !prev);
    return;
  };
  const toggleInstanceOpen = () => {
    setIsInstanceOpen((prev) => !prev);
    return;
  };
  const toggleHistoryOpen = () => {
    setIsHistoryOpen((prev) => !prev);
    return;
  };
  // ! set work status on MainBottomPanel
  const _setWorkStatutes = (
    status: "전체" | "미작업" | "완료" | "진행중" | "반려"
  ) => {
    setWorkStatutes(status);
  };
  // ! call api search task then set tasks
  const searchTasks = async (param: any) => {
    const res = await taskApi.searchTaskByProject(param);
    if (res && res.status === 200 && res.statusText === "OK") {
      await cleanTasks(res.data.datas);
    } else {
      // TODO: error handling
    }
  };
  // ! call api search all users
  const searchAllUsers = async (param: any) => {
    const res = await userApi.getAllUsers(param);
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setProjectUser(users);
    } else {
      // TODO: error handling
    }
  };
  // ! call api get project
  const getProject = async (param: IGetProjectParam) => {
    const res = await projectApi.getProject(param);
    if (res && res.status === 200) {
      setProjectInfo({
        projectId: res.data.project_id,
        projectName: res.data.project_name,
      });
    } else {
      // TODO: error handling
    }
  };
  // ! call api OD Labeling
  const getOD = async (param: any) => {
    const res = await labelingApi.getOD(param);
    if (res && res.status === 200) {
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let color = item.annotation_category.annotation_category_color;
          let coordinate = {
            left: item.annotation_data[0],
            top: item.annotation_data[1],
            width: item.annotation_data[2] - item.annotation_data[0],
            height: item.annotation_data[3] - item.annotation_data[1],
          };
          setPositionX(() => item.annotation_data[0]);
          setPositionY(() => item.annotation_data[1]);
          setInstanceWidth(() => item.annotation_data[2] - item.annotation_data[0]);
          setInstanceHeight(() => item.annotation_data[3] - item.annotation_data[1]);
          drawBoxing('OD', coordinate, color, null, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }
  };
  const getIS = async (param: any) => {
    const res = await labelingApi.getIS(param);
    if (res && res.status === 200) {
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          //let color = item.annotation_category.annotation_category_color;
          //let color = Math.floor(Math.random() * 16777215).toString(16);
          //0xffffff = 16777215
          let color = '#';
          for (let c = 0; c < 6; c++) {
            color += Math.round(Math.random() * 0xf).toString(16);
          }
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          drawPolyItem('IS', coordinates, 'polygon', color, null, 0, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }
  };
  const getSES = async (param: any) => {
    const res = await labelingApi.getSES(param);
    if (res && res.status === 200) {
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let color = item.annotation_category.annotation_category_color;
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          //console.log(item.annotation_type.annotation_type_id);
          drawPolyItem('SES', coordinates, 'segment', color, null, 0, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }
  };
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[]) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    let cnt = 0;
    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
      const taskStep = tasks[i].task_status.task_status_step;
      const taskStatus = tasks[i].task_status.task_status_progress;
      const taskStatusName =
        taskStatus === 1
          ? "미작업"
          : taskStatus === 2
          ? "진행중"
          : taskStatus === 3
          ? "완료"
          : taskStatus === 4
          ? "반려"
          : undefined;
      const imageFormat = tasks[i].task_detail.image_format;
      const imageWidth = tasks[i].task_detail.image_width;
      const imageHeight = tasks[i].task_detail.image_height;
      const imageSize = tasks[i].task_detail.image_size;

      // ! task worker info
      let taskWorker = null;
      if (tasks[i].task_worker) {
        const displayName = tasks[i].task_worker.user_display_name;
        const id = tasks[i].task_worker.user_id;
        const email = tasks[i].task_worker.user_email;
        taskWorker = { id, email, displayName };
      }

      // ! task validator info
      let taskValidator = null;
      if (tasks[i].task_validator) {
        const valDisplayName = tasks[i].task_validator.user_display_name;
        const valId = tasks[i].task_validator.user_id;
        const valEmail = tasks[i].task_validator.user_email;
        taskValidator = {
          id: valId,
          email: valEmail,
          displayName: valDisplayName,
        };
      }

      // ! cleanTask는 Task Type이고 Task 타입에 맞게 아래 form을 형성후 cleanTask에 form push
      form = {
        taskId,
        imageName,
        imageThumbnail,
        image: "",
        taskStatus,
        taskStatusName,
        imageFormat,
        imageWidth,
        imageHeight,
        imageSize,
        taskWorker,
        taskValidator,
      };
      cleanedTasks.push(form);
      if(taskStep === 2 || taskStatus === 3) {
        cnt++;
      }
    }
    setTasks(cleanedTasks);
    if(cnt > 3) {
      setAutoLabelingOn(() => true);
    }
  };
  // ! set selected task
  const _setSelectedTask = (task: ITask) => {
    setSelectedTask(task);
  };
  // ! Header 상단 prev 버튼 클릭 시 handler
  const handlePrevTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskId === taskId && i !== 0) {
        setSelectedTask(tasks[i - 1]);
        return;
      }
      if (tasks[i].taskId === taskId && i === 0) {
        toast({
          title: "첫번째 페이지입니다.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  // ! Header 상단 next 버튼 클릭 시 handler
  const handleNextTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskId === taskId && i !== tasks.length - 1) {
        setSelectedTask(tasks[i + 1]);
        return;
      }
      if (tasks[i].taskId === taskId && i === tasks.length - 1) {
        toast({
          title: "마지막 페이지입니다.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  // ! 아래 searchTasks가 실행된 후 task 데이터가 들어와서 tasks 길이에 변화가 생기면 selectedTask에 값을 넣음
  // TODO: 근데 이게 추후에는 최초작업이냐 아니냐에 따라 selectedTask에 값을 넣을지 말지를 정해줘야 하는 작업이 필요
  useEffect(() => {
    const selectedTask = location.search.split("?")[1];
    if (selectedTask) {
      let index: number;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === parseInt(selectedTask.split("=")[1])) {
          index = i;
          break;
        }
      }
      setSelectedTask(tasks[index!]);
    } else {
      setSelectedTask(tasks[0]);
    }
    // eslint-disable-next-line
  }, [tasks.length]);
  // ! dataURLHistory's first order stored when selectedTask changed.
  useEffect(() => {
    if (selectedTask) {
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].order === 0
        )
          return;
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].dataURL === selectedTask.image
        )
          return;
      }
      if (selectedTask.image === "") return;
      const history: IDataURLHistory = {
        taskId: selectedTask.taskId,
        order: 0,
        dataURL: selectedTask.image,
      };
      setDataURLHistory([...dataURLHistory, history]);
    }
    resetTools();
    clearDatas();
    // eslint-disable-next-line
  }, [selectedTask]);

  //! Task의 ID를 받아서 해당 이미지를 getTaskData API를 호출하여 받고 그 바이너리 이미지를 base64로 변환하여 state에 저장
  const setTaskInitImage = async () => {
    if (selectedTask) {
      const res = await taskApi.getTaskData(
        { project_id: pId, task_id: selectedTask.taskId },
        "blob"
      );
      if (res && res.status === 200) {
        const blob = res.data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          if (typeof reader.result === "string") {
            setSelectedTask((prev) => ({
              ...prev!,
              image: reader.result as string,
            }));
            setCurrentDataURL(reader.result);
          }
        };
      } else {
        // TODO: Error handling
      }
    }
  };

  // ! 최초에 selectedTask가 가진 이미지는 없어야 하며 그 때 호출되는 useEffect()
  useEffect(() => {
    if (selectedTask && selectedTask.image === "") {
      setTaskInitImage();
    }
    // eslint-disable-next-line
  }, [selectedTask]);

  // ! 이미지에 새로운 이펙트가 들어가면 그때마다 order를 하나 올려서 히스토리를 저장
  useEffect(() => {
    if (selectedTask && currentDataURL) {
      canvas.off('mouse:wheel');
      setCanvasImage();
      canvas.on('mouse:wheel', handleMouseWheel);
      let lastOrder = 0;
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].dataURL === currentDataURL
        )
          return;
        if (dataURLHistory[i].taskId === selectedTask.taskId) {
          if (dataURLHistory[i].order >= lastOrder)
            lastOrder = dataURLHistory[i].order + 1;
        }
      }
      const newHistory: IDataURLHistory = {
        taskId: selectedTask.taskId,
        order: lastOrder,
        dataURL: currentDataURL,
      };
      setDataURLHistory([...dataURLHistory, newHistory]);
    }
    // eslint-disable-next-line
  }, [currentDataURL]);

  // ! 최초 렌더링 시 searchTasks 실행
  useEffect(() => {
    searchTasks({
      project_id: pId,
      maxResults: 10000,
    });
    searchAllUsers({ maxResults: 50 });
    if (pId) getProject({ project_id: parseInt(pId) });
    setCanvas(initCanvas());
    // eslint-disable-next-line
  }, []);

  const initCanvas = () => new fabric.Canvas("fCanvas", { selection: false });

  useEffect(() => {
    if(canvas) {
      setContext(() => canvas.getContext());
      //canvas.on('mouse:down:before', beforeDownCanvas);
      //canvas.on('mouse:out', outCanvas);
      canvas.on('mouse:down', handleCanvasDown);
      canvas.on('mouse:move', handleCanvasMove);
      canvas.on('mouse:up', handleCanvasUp);
      canvas.on('object:moving', handleMoveObject);
      canvas.on('object:scaling', handleScaleObject);
      canvas.on('object:modified', handleModifiedObject);
      //canvas.on('selection:created', handleSelectionCreated);
      //canvas.on('selection:updated', handleSelectionUpdated);
      //canvas.on('before:selection:cleared', beforeClearSelection);
      //canvas.on('selection:cleared', handleSelectionCleared);
      //canvas.on('mouse:wheel', handleMouseWheel);
      //canvas.on('path:created', createPath);
      //ctx = canvas.getContext();
      fabric.Object.prototype.setControlsVisibility({
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mb: true,
        ml: true,
        mr: true,
        mt: true,
        mtr: false,
      });
      /* canvas.add(lLine);
      canvas.add(rLine);
      canvas.add(tLine);
      canvas.add(dLine); */
    }
  }, [canvas]);

  useEffect(() => {
    //console.log("ctx");
  }, [ctx]);

  const setCanvasImage = async () => {
    if (currentDataURL && canvas) {
      canvas.clear();
      resetTools();
      resetAutoTools();
      clearDatas();
      const res = await labelingApi.searchAnnotationByTask(
        {
          project_id: parseInt(pId),
          task_id: selectedTask.taskId,
          maxResults: 10000,
        }
      );
      for (let j = 0; j < res.data.datas.length; j++) {
        let item = res.data.datas[j];
        if (item.annotation_id) {
          if (item.annotation_type.annotation_type_id === 1) {
            let coord = {
              left: item.annotation_data[0],
              top: item.annotation_data[1],
              width: item.annotation_data[2],
              height: item.annotation_data[3],
            };
            drawBoxing('bbox', coord, '#00ffcc', item.annotation_id, null);
          } else if (
            item.annotation_type.annotation_type_id === 2 ||
            item.annotation_type.annotation_type_id === 3
          ) {
            let items = item.annotation_data;
            let coordinates = [];
            for (let l = 0; l < items.length; l++) {
              coordinates.push(new fabric.Point(items[l++], items[l]));
            }
            drawPolyItem(item.annotation_type.annotation_type_name, coordinates, item.annotation_type.annotation_type_name, '#00ffcc', item.annotation_id, item.annotation_type.annotation_type_id, null);
          }
        }
      }
      //const url = baseUrl + "/task/data?project_id=" + pId + "&task_id=" + selectedTask.taskId;
      /*
      fabric.Image.fromURL(currentDataURL, (image) => {
        canvas.add(image);
        canvas.renderAll();
      });
      */
      fabric.Image.fromURL(currentDataURL, (image) => {
        let width = image.width, height = image.height, ratio = 0;
        if(width && height) {
          if (width > height) {
            ratio = 810 / width;
            if (height * ratio > 540) {
              ratio = 540 / height;
            }
          } else {
            ratio = 540 / height;
            if (width * ratio > 810) {
              ratio = 810 / width;
            }
          }
          image.selectable = false;
          setimgWidth(width);
          setimgHeight(height);
          setimgRatio(ratio);
          //canvas.add(image);
          canvas.setBackgroundImage(image, () => {});
          canvas.setWidth(width * ratio);
          canvas.setHeight(height * ratio);
          //canvasWidth = width * imgRatio;
          //canvasHeight = height * imgRatio;
          canvas.setZoom(ratio);
        }
        //fc.add(image);
        //fc.renderAll();
      }, { crossOrigin: 'anonymous' });
    }
  };

  /* useEffect(() => {
    if(!canvas || !selectObject) return;
    canvas.setActiveObject(selectObject);
    canvas.renderAll();
  }, [selectObject]); */

  let sX = 0, eX = 0, sY = 0, eY = 0;
  let lLine = new fabric.Line([0,0,0,0,], {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });
  let rLine = new fabric.Line([0,0,0,0,], {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });
  let tLine = new fabric.Line([0,0,0,0,], {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });
  let dLine = new fabric.Line([0,0,0,0,], {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });

  const handleMouseMove = (options) => {
    //console.log("over");
    if(!canvas) return;
    let pointer = canvas.getPointer(options);
    eX = canvas.width;
    eY = canvas.height;
    lLine.x1 = sX;
    lLine.y1 = pointer.y;
    lLine.x2 = pointer.x;
    lLine.y2 = pointer.y;
    rLine.x1 = pointer.x;
    rLine.y1 = pointer.y;
    rLine.x2 = eX;
    rLine.y2 = pointer.y;

    tLine.x1 = pointer.x;
    tLine.y1 = sY;
    tLine.x2 = pointer.x;
    tLine.y2 = pointer.y;
    dLine.x1 = pointer.x;
    dLine.y1 = pointer.y;
    dLine.x2 = pointer.x;
    dLine.y2 = eY
    /* console.log(lLine);
    console.log(rLine);
    console.log(tLine);
    console.log(dLine); */
    //
    canvas.renderAll();
  };

  useEffect(() => {
    currentTool.current = selectedTool;
  }, [selectedTool]);

  const handleCanvasDown = (options) => {
    switch(currentTool.current) {
      case "magicwand":
        break;
      case "autopoint":
        handlePointDown(options);
        break;
      case "boxing":
        handleBoxingDown(options);
        break;
      case "polyline":
        handlePolylineDown(options);
        break;
      case "polygon":
        handlePolygonDown(options);
        break;
      case "point":
        handlePointDown(options);
        break;
      case "brush":
        //handleBrushDown(options);
        break;
      case "3Dcube":
        //handle3DcubeDown(options);
        break;
      case "segment":
        handleSegmentDown(options);
        break;
      case "keypoint":
        handleKeypointDown(options);
        break;
    }
  };

  const handleCanvasMove = (options) => {
    switch(currentTool.current) {
      case "magicwand":
        break;
      case "autopoint":
        handlePointMove(options);
        break;
      case "boxing":
        handleBoxingMove(options);
        break;
      case "polyline":
        handlePolylineMove(options);
        break;
      case "polygon":
        handlePolygonMove(options);
        break;
      case "point":
        handlePointMove(options);
        break;
      case "brush":
        //handleBrushMove(options);
        break;
      case "3Dcube":
        //handle3DcubeMove(options);
        break;
      case "segment":
        handleSegmentMove(options);
        break;
      case "keypoint":
        handleKeypointMove(options);
        break;
    }
  };

  const handleCanvasUp = (options) => {
    switch(currentTool.current) {
      case "magicwand":
        break;
      case "autopoint":
        handleAutopointUp(options);
        break;
      case "boxing":
        handleBoxingUp(options);
        break;
      case "polyline":
        handlePolylineUp(options);
        break;
      case "polygon":
        handlePolygonUp(options);
        break;
      case "point":
        handlePointUp(options);
        break;
      case "brush":
        //handleBrushUp(options);
        break;
      case "3Dcube":
        //handle3DcubeUp(options);
        break;
      case "segment":
        handleSegmentUp(options);
        break;
      case "keypoint":
        handleKeypointUp(options);
        break;
    }
  };

  const handleSelectObject = (options) => {
    if(!options.target) return;
    console.log("selcet");
    console.log(currentObjectItem.current);
    isSelectObjectOn = true;
    //console.log(options.target.type);
    setSelectedObject(() => options.target);
    setObjectType(() => options.target.type);
    setSelectedObjectId(() => options.target.id);
  };

  const handleDeSelectObject = (options) => {
    if(!options.target) return;
    console.log("deselcet");
    isSelectObjectOn = false;
    setSelectedObject(() => null);
    setObjectType(() => "");
    setSelectedObjectId(() => -1);
  };

  useEffect(() => {
    document.onkeydown = function (e) {
      let key = e.key || e.keyCode;
      if (key === 46) {
        // || 46 = Delete
        key = 'Delete';
      }
      deleteItem(key);
    };
  }, [selectedObjectId]);

  const handleMoveObject = (options) => {
    if(!options.target) return;
    //console.log(options.target);
    if(options.target.type === "rect") {
      setInstanceWidth(() => options.target.width * options.target.scaleX);
      setInstanceHeight(() => options.target.height * options.target.scaleY);
      setPositionX(() => options.target.left);
      setPositionY(() => options.target.top);
      /* console.log(options.target);
      console.log(ObjectListItem); */
      //
      
      
      console.log(currentObjectItem.current);
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        let tag = currentObjectItem.current[i].tag;
        if (currentObjectItem.current[i].object.id === options.target.id) {
          tag.left =
            options.target.left + options.target.width / 2 - tag.width / 2;
          tag.top =
            options.target.top + options.target.height / 2 - tag.height / 2;
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      }
      /* for (let j = 0; j < AnnotationListItem.length; j++) {
        if (AnnotationListItem[j].id === options.target.id) {
          ObjectListItem[j].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      } */
      //setDataImage(options.target);
    } else if (options.target.tool === 'keypoint') {
      let p = options.target;
      p.line1 && p.line1.set({ x2: p.left, y2: p.top });
      p.line2 && p.line2.set({ x1: p.left, y1: p.top });
      p.line3 && p.line3.set({ x1: p.left, y1: p.top });
      p.line4 && p.line4.set({ x1: p.left, y1: p.top });
      p.line5 && p.line5.set({ x1: p.left, y1: p.top });
    }
  };

  const handleScaleObject = (options) => {
    if(!options.target) return;
    if(options.target.type === "rect") {
      let coords = {
        left: options.target.left,
        top: options.target.top,
        width: options.target.width * options.target.scaleX,
        height: options.target.height * options.target.scaleY,
      };
      setInstanceWidth(() => coords.width);
      setInstanceHeight(() => coords.height);
      setPositionX(() => coords.left);
      setPositionY(() => coords.top);
      options.target.set({
        width: coords.width,
        height: coords.height,
        scaleX: 1,
        scaleY: 1,
      });
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        let tag = currentObjectItem.current[i].tag;
        if (currentObjectItem.current[i].object.id === options.target.id) {
          tag.left =
            options.target.left + options.target.width / 2 - tag.width / 2;
          tag.top =
            options.target.top + options.target.height / 2 - tag.height / 2;
          currentObjectItem.current[i].annotation.annotation_data = [
            coords.left,
            coords.top,
            coords.width,
            coords.height,
          ];
        }
      }
      /* for (let i = 0; i < AnnotationListItem.length; i++) {
        if (AnnotationListItem[i].id === options.target.id) {
          AnnotationListItem[i].annotation.annotation_data = [
            coords.left,
            coords.top,
            coords.width,
            coords.height,
          ];
          //console.log(this.AnnotationListItem[i]);
        }
      } */
    }
    //setDataImage(coords);
    if(canvas) canvas.renderAll();
  };

  const handleModifiedObject = (options) => {
    if(options.target.type === "polygon") {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].objectId.id === options.target.id) {
          console.log(currentObjectItem.current[i]);
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
          /* AnnotationListItem[j].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ]; */
        }
      }
    }
  };

  useEffect(() => {
    if(selectedObject) {
      setLabelHeight(() => Math.round(selectedObject.height));
      setLabelPerHeight(() => ((selectedObject.height / imgHeight * imgRatio) * 100).toFixed(2));
      setLabelWidth(() => Math.round(selectedObject.width));
      setLabelPerWidth(() => ((selectedObject.width / imgWidth * imgRatio) * 100).toFixed(2));
      setLabelDiag(() => Math.sqrt(Math.pow(selectedObject.width, 2) + Math.pow(selectedObject.height, 2)).toFixed(2));
      setLabelPerDiag(() => ((Math.sqrt(Math.pow(selectedObject.width, 2) + Math.pow(selectedObject.height, 2)) / Math.sqrt(Math.pow(imgWidth * imgRatio, 2) + Math.pow(imgHeight * imgRatio, 2))) * 100).toFixed(2));
      setLabelCoordX(() => Math.round(selectedObject.left));
      setLabelCoordY(() => Math.round(selectedObject.top));
    }
  }, [selectedObject]);

  useEffect(() => {
    setLabelHeight(() => Math.round(instanceHeight));
    setLabelPerHeight(() => ((instanceHeight / imgHeight * imgRatio) * 100).toFixed(2));
    setLabelWidth(() => Math.round(instanceWidth));
    setLabelPerWidth(() => ((instanceWidth / imgWidth * imgRatio) * 100).toFixed(2));
    setLabelDiag(() => Math.sqrt(Math.pow(instanceWidth, 2) + Math.pow(instanceHeight, 2)).toFixed(2));
    setLabelPerDiag(() => ((Math.sqrt(Math.pow(instanceWidth, 2) + Math.pow(instanceHeight, 2)) / Math.sqrt(Math.pow(imgWidth * imgRatio, 2) + Math.pow(imgHeight * imgRatio, 2))) * 100).toFixed(2));
    setLabelCoordX(() => Math.round(positionX));
    setLabelCoordY(() => Math.round(positionY));
  }, [instanceWidth, instanceHeight, positionX, positionY]);


  //*************** Header function **********************/

  // ! Download image
  const handleDownloadCoco = () => {
    if (selectedTask && currentDataURL && canvas) {
      let datas = [];
      for (let i = 0; i < ObjectListItem.length; i++) {
        datas.push(ObjectListItem[i].annotation);
      }
      let data = JSON.stringify(datas);
      const a = document.createElement("a");
      let file = new Blob([data], { type: "text/plain" });
      a.href = URL.createObjectURL(file);
      a.download = selectedTask.imageName + ".json";
      a.click();
    }
  };

  // ! Download image
  const handleDownloadImage = () => {
    if (selectedTask && currentDataURL && canvas) {
      const a = document.createElement("a");
      a.setAttribute("download", selectedTask.imageName);
      //a.setAttribute("href", currentDataURL);
      a.setAttribute("href", canvas.toDataURL({
        //format: 'png',
        quality: 1.0,
        //multiplier: 1 / imgRatio,
        }),
      );
      a.click();
    }
  };
  // ! Toggle full screen
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  // ! Filtering only selected task's history
  const getFilteredSelectedTask = (selectedTask: ITask): IDataURLHistory[] => {
    return dataURLHistory.filter(
      (history) => history.taskId === selectedTask.taskId
    );
  };
  // ! Undo
  const handleUnDo = () => {
    if (selectedTask) {
      const currentTaskHistory = getFilteredSelectedTask(selectedTask);
      let pointer;
      for (let i = 0; i < currentTaskHistory.length; i++) {
        if (currentDataURL === currentTaskHistory[i].dataURL) {
          if (currentTaskHistory[i].order === 0) {
            return;
          }
          pointer = currentTaskHistory[i - 1].order;
          break;
        }
      }
      if (pointer !== undefined) {
        setCurrentDataURL(currentTaskHistory[pointer].dataURL);
      }
    }
  };
  // ! Redo
  const handleRedo = () => {
    if (selectedTask) {
      const currentTaskHistory = getFilteredSelectedTask(selectedTask);
      let pointer;
      for (let i = 0; i < currentTaskHistory.length; i++) {
        if (currentDataURL === currentTaskHistory[i].dataURL) {
          if (currentTaskHistory[i].order === currentTaskHistory.length - 1) {
            return;
          }
          pointer = currentTaskHistory[i + 1].order;
          break;
        }
      }
      if (pointer !== undefined) {
        setCurrentDataURL(currentTaskHistory[pointer].dataURL);
      }
    }
  };
  // ! Save (Update)
  const saveStatus = async (status: number) => {
    if (pId && selectedTask) {
      const save = await saveData();
      if(save) {
        const res = await taskApi.updateTaskStatus(
          { 
            project_id: parseInt(pId), 
            task_id: selectedTask.taskId 
          },
          {
            task_status_progress: status,
            comment_body: '',
          },
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          toast({
            title: "작업 저장 완료",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    }
  };
  const saveData = async () => {
    if (pId && selectedTask) {
      let resDelete = 0, resUpdate = 0, resCreate = 0;
      console.log(DeleteIDList);
      console.log(ObjectListItem);
      for (let i = 0; i < DeleteIDList.length; i++) {
        const res = await labelingApi.deleteAnnotation(
          {
            project_id: parseInt(pId), 
            task_id: selectedTask.taskId,
            annotation_id: DeleteIDList[i],
          }
        );
        console.log(res);
        resDelete = res.status;
      }
      for (let i = 0; i < ObjectListItem.length; i++) {
        let data = ObjectListItem[i].annotation;
        console.log(data);
        if (data.annotation_id) {
          const res = await labelingApi.updateAnnotation(
            {
              project_id: parseInt(pId), 
              task_id: selectedTask.taskId,
            }, 
            data
          );
          resUpdate = res.status;
        } else {
          const res = await labelingApi.createAnnotation(
            {
              project_id: parseInt(pId), 
              task_id: selectedTask.taskId,
            },
            data
          );
          resCreate = res.status;
        }
      }
      return resDelete === 200 || resUpdate === 200 || resCreate === 200 ;
    } else {
      return false;
    }
  };


  const isLock = (item: any, index: number) => {
    if(!canvas) return;
    console.log("lock-btn");
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.id === item) {
        ObjectListItem[i].object.selectable =
          !ObjectListItem[i].object.selectable;
          console.log("lock");
        /* if (!ObjectListItem[i].selectable) {
          document.getElementById('lockBtn' + index).classList.add('active');
        } else {
          document
            .getElementById('lockBtn' + index)
            .classList.remove('active');
        } */
        if (!ObjectListItem[i].object.selectable) {
          (document.getElementById('lockBtn' + index) as HTMLImageElement).src = iconLock;
        } else {
          (document.getElementById('lockBtn' + index) as HTMLImageElement).src = iconUnLock;
        }
        /* for (let j = 0; j < InstanceListItem.length; j++) {
          if (InstanceListItem[j].id === item) {
            InstanceListItem[j].selectable = ObjectListItem[i].selectable;
            console.log(InstanceListItem[j]);
          }
        } */
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };
  const isVisible = (item: any, index: number) => {
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.id === item) {
        ObjectListItem[i].object.visible = !ObjectListItem[i].object.visible;
        ObjectListItem[i].tag.visible = ObjectListItem[i].object.visible && isTagOn;
        /* if (!ObjectListItem[i].visible) {
          document
            .getElementById('visibleBtn' + index)
            .classList.add('active');
        } else {
          document
            .getElementById('visibleBtn' + index)
            .classList.remove('active');
        } */
        if (ObjectListItem[i].object.visible) {
          (document.getElementById('visibleBtn' + index) as HTMLImageElement).src = iconVisible;
        } else {
          (document.getElementById('visibleBtn' + index) as HTMLImageElement).src = iconInvisible;
        }
        /* for (let j = 0; j < InstanceListItem.length; j++) {
          if (InstanceListItem[j].id === item) {
            InstanceListItem[j].visible = ObjectListItem[i].visible;
          }
        } */
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };
  const isDelete = (item: any) => {
    deleteItem(item);
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false);
  };
  const deleteItem = (key: any) => {
    if(!canvas) return;
    let check = /^[0-9]+$/;
    if (key === 'Delete') {
      /* for (let i = 0; i < TagListItem.length; i++) {
        let tag = TagListItem[i];
        if (tag.id === selectedObjectId) {
          canvas.remove(tag);
          TagListItem.splice(i, 1);
        }
      } */
      /* for (let i = 0; i < InstanceListItem.length; i++) {
        if (InstanceListItem[i].id === selectedObjectId) {
          InstanceListItem.splice(i, 1);
        }
      } */
      /* for (let i = 0; i < AnnotationListItem.length; i++) {
        if (AnnotationListItem[i].id === selectedObjectId) {
          if (AnnotationListItem[i].annotation.annotation_id) {
            DeleteIDList.push(
              AnnotationListItem[i].annotation.annotation_id,
            );
            console.log(AnnotationListItem[i].annotation.annotation_id);
          } else {
            console.log('no id');
          }
          AnnotationListItem.splice(i, 1);
        }
      } */
      for (let i = 0; i < ObjectListItem.length; i++) {
        if (ObjectListItem[i].object.id === selectedObjectId) {
          if (ObjectListItem[i].annotation.annotation_id) {
            DeleteIDList.push(
              ObjectListItem[i].annotation.annotation_id,
            );
          }
          canvas.remove(ObjectListItem[i].tag)
          canvas.remove(selectedObject);
          ObjectListItem.splice(i, 1);
        }
      }
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    } else if (check.test(key)) {
      /* for (let i = 0; i < TagListItem.length; i++) {
        let tag = TagListItem[i];
        if (tag.id === key) {
          canvas.remove(tag);
          TagListItem.splice(i, 1);
        }
      }
      for (let i = 0; i < InstanceListItem.length; i++) {
        if (InstanceListItem[i].id === key) {
          InstanceListItem.splice(i, 1);
        }
      }
      for (let i = 0; i < AnnotationListItem.length; i++) {
        if (AnnotationListItem[i].id === key) {
          if (AnnotationListItem[i].annotation.annotation_id) {
            DeleteIDList.push(
              AnnotationListItem[i].annotation.annotation_id,
            );
          }
          AnnotationListItem.splice(i, 1);
        }
      } */
      for (let i = 0; i < ObjectListItem.length; i++) {
        if (ObjectListItem[i].object.id === key) {
          if (ObjectListItem[i].annotation.annotation_id) {
            DeleteIDList.push(
              ObjectListItem[i].annotation.annotation_id,
            );
          }
          canvas.remove(ObjectListItem[i].tag)
          canvas.remove(ObjectListItem[i].object);
          ObjectListItem.splice(i, 1);
        }
      }
      //_this.fCanvas.remove(_this.objSelected);
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    }
    canvas.renderAll();
  }

  const handleMouseWheel = (options: any) => {
    if(canvas) {
      //console.log('wheel');
      console.log(imgRatio);
      let delta = options.e.deltaY;
      //let pointer = this.fCanvas.getPointer(options.e);
      let zoom = canvas.getZoom();
      console.log(zoom + ", " + delta);
      zoom *= 0.999 ** delta;
      //zoom *= this.imgRatio;
      if (delta < 0) {
        zoom += 0.1;
      } else {
        zoom -= 0.1;
      }
      /* if (zoom > 2 * imgRatio) zoom = 2 * imgRatio;
      if (zoom < 0.1 * imgRatio) zoom = 0.1 * imgRatio; */
      if (zoom > 2) zoom = 2;
      if (zoom < 0.1) zoom = 0.1;
      //zoom *= this.imgRatio;
      /* let width = selectedTask.imageWidth * zoom;
      let height = selectedTask.imageHeight * zoom; */
      let img = canvas.backgroundImage as fabric.Image;
      console.log(img);
      let width = img.width * zoom;
      let height = img.height * zoom;
      //console.log(width + ", " + height);
      canvas.setWidth(width);
      canvas.setHeight(height);
      /*this.fCanvas.zoomToPoint(
        { x: options.e.offsetX, y: options.e.offsetY },
        zoom,
      );*/
      canvas.setZoom(zoom);
      setResizingVal((zoom * 100).toString());
      /*let range = document.getElementById('zoom-range');
      range.value = (zoom * 100) / imgRatio;*/
      /*options.e.preventDefault();
      options.e.stopPropagation();*/
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  //*************** Main function **********************/

  const currentObjectId = useRef(objectId);
  useEffect(() => {
    currentObjectId.current = objectId;
    console.log(objectId);
    //console.log(currentObjectId.current);
  }, [objectId]);

  const resetAutoTools = () => {
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false);
  }
  const resetTools = () => {
    if(canvas) {
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "crosshair";
    }
    /* setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false); */
    setIsSmartpenOnOff(() => false);
    setIsAutopointOnOff(() => false);
    setIsBoxingOnOff(() => false);
    setIsPolylineOnOff(() => false);
    setIsPolygonOnOff(() => false);
    setIsPointOnOff(() => false);
    setIsBrushOnOff(() => false);
    setIs3DcubeOnOff(() => false);
    setIsSegmentOnOff(() => false);
    setIsKeypointOnOff(() => false);
  }
  const clearDatas = () => {
    setObjectListItem(() => []);
    /* setInstanceListItem(() => []);
    setAnnotationListItem(() => []);
    setTagListItem(() => []); */
    setDeleteIDList(() => []);
    setInstanceClass(() => "");
    setInstanceGender(() => "");
    setInstanceAge(() => "");
    setObjectId(() => 0);
  }
  const clearAutoLabeling = (tool: string) => {
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.tool === tool) {
        let id = ObjectListItem[i].object.id;

        /* for (let j = 0; j < TagListItem.length; j++) {
          let tag = TagListItem[j];
          if (tag.id === id) {
            canvas.remove(tag);
            TagListItem.splice(j, 1);
          }
        }
        for (let k = 0; k < InstanceListItem.length; k++) {
          if (InstanceListItem[k].id === id) {
            InstanceListItem.splice(k, 1);
          }
        }
        for (let l = 0; l < AnnotationListItem.length; l++) {
          if (AnnotationListItem[l].id === id) {
            if (AnnotationListItem[l].annotation.annotation_id) {
              DeleteIDList.push(
                AnnotationListItem[l].annotation.annotation_id,
              );
              console.log(
                AnnotationListItem[l].annotation.annotation_id,
              );
            } else {
              console.log('no id');
            }
            AnnotationListItem.splice(l, 1);
          }
        } */
        if (ObjectListItem[i].annotation.annotation_id) {
          DeleteIDList.push(
            ObjectListItem[i].annotation.annotation_id,
          );
        }
        canvas.remove(ObjectListItem[i].tag);
        canvas.remove(ObjectListItem[i].object);
        //this.ObjectListItem.splice(i, 1);
      }
    }
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.tool === tool) {
        ObjectListItem.splice(i, 1);
      }
    }
  }

  const setObjectItem = (object: fabric.Object, tagText: fabric.Text, annotation: any) => {
    let optionTag = {
      //id: objectId,
      fill: '#ffffff',
      //textBackgroundColor: 'grey',
      fontFamily: 'Comic Sans',
      fontSize: 10 * 1, //(1 / imgRatio),
      visible: isTag.current,
      selectable: false,
    };
    let tag = new fabric.Text('인간 ' + currentObjectId.current, optionTag);
    tag.set('top', object.top + object.height / 2 - tag.height / 2);
    tag.set('left', object.left + object.width / 2 - tag.width / 2);
    canvas.add(tag);

    let ObjectItem = {
      object: object, 
      tag: tag,
      className: 'person',
      attrs: [],
      annotation: annotation,
    };
    setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]);
  };

  useEffect(() => {
    //console.log(ObjectListItem);
    currentObjectItem.current = ObjectListItem;
  }, [ObjectListItem]);

  //**! download */
  const checkIsDownload = () => {
    setIsDownloadOnOff((prev) => !prev);
  };
  const onCancelDownload = () => {
    setIsDownloadOnOff(false);
    setDownload(() => "");
    setSelectDownload(() => "");
  };
  const onSubmitDownload = () => {
    console.log(isDownload);
    switch(isDownload) {
      case "coco":
        handleDownloadCoco();
        break;
      case "yolo":
        // Todo
        break;
      case "image":
        handleDownloadImage();
        break;
    }
    setIsDownloadOnOff(false);
  };
  const _setDownload = (file: string) => {
    setDownload(() => file);
    let txt = "";
    switch(file) {
      case "coco":
        txt = "COCO Dataset Format";
        break;
      case "yolo":
        txt = "YOLO Dataset Format";
        break;
      case "image":
        txt = "Image";
        break;
    }
    setSelectDownload(() => txt);
  };

  //**! resize  */
  const handleResizing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizingVal(e.target.value);
    zoomAdjustment(e.target.value);
  };

  const zoomAdjustment = (value: string) => {
    if(canvas) {
      let zoom = parseInt(value);
      if(zoom < 10) zoom = 10;
      zoom *= imgRatio;
      let width = imgWidth * (zoom / 100);
      let height = imgHeight * (zoom / 100);
      //console.log(width + ", " + height + ", " + imgRatio);
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom / 100);
    }
  };
  /*const setZoomCenter = () => {
    document.getElementById('zoom-range').value = 100;
    canvas.setWidth(inWidth * imgRatio);
    canvas.setHeight(inHeight * imgRatio);
    canvas.setZoom(imgRatio);
  };*/

  //**! move */
  const checkIsMove = () => {
    setIsMoveOnOff((prev) => !prev);
  };
  const onCancelMove = () => {
    setIsMoveOnOff(() => false);
  };
  useEffect(() => {
    if(isMoveOn) {
      canvas.hoverCursor = "move";
    }
  }, [isMoveOn]);

  //**! tag */
  const checkIsTag = () => {
    setIsTagOnOff((prev) => !prev);
  };
  useEffect(() => {
    isTag.current = isTagOn;
    if (!isTagOn) {
      /*let items = this.fCanvas.getObjects();
      for (let i = 0; i < items.length; i++) {
        this.fCanvas.remove(this.TagListItem[i]);
      }*/
      for (let i = 0; i < ObjectListItem.length; i++) {
        ObjectListItem[i].tag.visible = false;
      }
    } else {
      for (let i = 0; i < ObjectListItem.length; i++) {
        //this.fCanvas.add(this.TagListItem[i]);
        ObjectListItem[i].tag.visible = true;
      }
    }
    if(canvas)
      canvas.renderAll();
  }, [isTagOn]);

  //**! class */
  const checkIsClass = () => {
    // 클래스 팝업
    setIsClassOnOff((prev) => !prev);
  };
  const onCancelClass = () => {
    setIsClassOnOff(false);
  };
  const setIsClass = (index: number) => {
    // Todo: Instance 클래스 팝업
    console.log("instance class");
    setIsClassOnOff((prev) => !prev);
    let id = ObjectListItem[index].object.id;
    let object = ObjectListItem[index];
    if(object) {
      setSelectedObject(() => object);
      setSelectedObjectId(() => object.id);
    }
  };

  //**! reset */
  const checkIsReset = () => {
    setIsResetOnOff((prev) => !prev);
  };
  const onCancelReset = () => {
    setIsResetOnOff(false);
  };
  const onSubmitReset = () => {
    // Todo: 리셋 초기화 내용 작업 필요
    resetAutoTools();
    resetTools();
    clearDatas();
    canvas.clear();
    setCanvasImage();
    setIsResetOnOff(false);
  };

  //**! OD */
  const checkIsOD = () => {
    if(isAutoLabelingOn) {
      resetTools();
      setIsODOnOff((prev) => !prev);
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isODOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsISOnOff(() => false);
      setIsSESOnOff(() => false);
      getOD({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 1,
        //maxResults: 10000,
      });
    } else if (!isODOn) {
      clearAutoLabeling('OD');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    }
    setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500);
  }, [isODOn]);

  //**! IS */
  const checkIsIS = () => {
    if(isAutoLabelingOn) {
      resetTools();
      setIsISOnOff((prev) => !prev);
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isISOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsODOnOff(() => false);
      setIsSESOnOff(() => false);
      console.log("IS");
      getIS({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 2,
      });
    } else {
      clearAutoLabeling('IS');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    }
    setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500);
  }, [isISOn]);

  //**! SES */
  const checkIsSES = () => {
    if(isAutoLabelingOn) {
      resetTools();
      setIsSESOnOff((prev) => !prev);
      console.log(isSESOn);
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isSESOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsODOnOff(() => false);
      setIsISOnOff(() => false);
      getSES({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 3,
      });
    } else {
      clearAutoLabeling('SES');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    }
    setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500);
  }, [isSESOn]);

  //**! smartpen */
  const checkIsSmartpen = () => {
    resetTools();
    setIsSmartpenOnOff(!isSmartpenOn);
  };
  const onCancelSmartpen = () => {
    setIsSmartpenOnOff(false);
  };

  useEffect(() => {
    if(isSmartpenOn && canvas) {
      setSelectedTool(() => "magicwand");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isSmartpenOn && canvas) {
    }
  }, [isSmartpenOn]);

  //**! autopoint */
  const checkIsAutopoint = () => {
    resetTools();
    setIsAutopointOnOff((prev) => !prev);
  };
  const onCancelAutopoint = () => {
    setIsAutopointOnOff(false);
  };
  useEffect(() => {
    if(isAutopointOn && canvas) {
      setSelectedTool(() => "autopoint");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isAutopointOn && canvas) {
    }
  }, [isAutopointOn]);
  const handleAutopointUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "autopoint");
  };

  //**! boxing */
  const checkIsBoxing = () => {
    resetTools();
    setIsBoxingOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isBoxingOn && canvas) {
      setSelectedTool(() => "boxing");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isBoxingOn && canvas) {
    }
  }, [isBoxingOn]);
  let tempRect: fabric.Rect = null;
  let TempPointArray = [];
  const handleBoxingDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    tempRect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      strokeWidth: 2,  //2 * (1 / imgRatio),
      stroke: 'rgba(0,0,0,0.3)',
      strokeDashArray: [5, 5],  //[5 * (1 / imgRatio), 5 * (1 / imgRatio)],
      fill: 'transparent',
    });
    canvas.add(tempRect);
    canvas.renderAll();
    isDown = true;
  };
  const handleBoxingMove = (options: any) => {
    if(!canvas || !isDown || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    setDragBox(pointer.x, pointer.y);
  };
  const handleBoxingUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if (
      Math.abs(endX - startX) < 3 &&
      Math.abs(endY - startY) < 3
    ) {
      drawPoints(pointer, "boxing");
      if(autoPointList.length === 2){
        isDown = false;
      }
    } else {
      setRect('bbox');
      //this.drawBoxing();
      isDown = false;
    }
  };
  const setDragBox = (nowX, nowY) => {
    let rTop, rLeft, rBottom, rRight;
    if (startX > nowX) {
      rLeft = nowX;
      rRight = startX;
    } else {
      rLeft = startX;
      rRight = nowX;
    }
    if (startY > nowY) {
      rTop = nowY;
      rBottom = startY;
    } else {
      rTop = startY;
      rBottom = nowY;
    }
    setInstanceWidth(() => rRight - rLeft);
    setInstanceHeight(() => rBottom - rTop);
    setPositionX(() => rLeft);
    setPositionY(() => rTop);

    if(tempRect)
      tempRect.set({
        left: rLeft,
        top: rTop,
        width: rRight - rLeft,
        height: rBottom - rTop,
      });
    //this.DragRectListItem.push(rect);
    canvas.renderAll();
  }
  const setRect = (tool: any) => {
    let rTop, rLeft, rBottom, rRight;
    if (startX > endX) {
      rLeft = endX;
      rRight = startX;
    } else {
      rLeft = startX;
      rRight = endX;
    }
    if (startY > endY) {
      rTop = endY;
      rBottom = startY;
    } else {
      rTop = startY;
      rBottom = endY;
    }
    setInstanceWidth(() => rRight - rLeft);
    setInstanceHeight(() => rBottom - rTop);
    setPositionX(() => rLeft);
    setPositionY(() => rTop);
    let coordinate = {
      left: rLeft,
      top: rTop,
      width: rRight - rLeft,
      height: rBottom - rTop,
    };
    //console.log(coordinate);
    drawBoxing(tool, coordinate, '#000000', null, null);
  }
  const drawBoxing = (tool, coordinate, color, aId, itemId) => {
    canvas.remove(tempRect);
    console.log(tool);
    if(!itemId) {
      itemId = currentObjectId.current;
    }
    let optionRect = {
      id: itemId,
      tool: tool,
      color: color,
      left: coordinate.left,
      top: coordinate.top,
      width: coordinate.width,
      height: coordinate.height,
      strokeWidth: 2, //2 * (1 / imgRatio),
      //stroke: 'rgba(0,0,0,0.5)',
      stroke: color,
      //strokeOpacity: '.5',
      fill: 'transparent',
      //fill: 'rgba(0,0,0,0.3)',
      //fill: color,
      //fillOpacity: '.3',
      //strokeDashArray: [5, 5],
      hoverCursor: 'pointer',
      objectCaching: false,
    };
    let rect = new fabric.Rect(optionRect);
    rect.on('selected', handleSelectObject);
    rect.on('deselected', handleDeSelectObject);

    let optionTag = {
      //id: currentObjectId.current,
      fill: '#ffffff',
      textBackgroundColor: color,
      fontFamily: 'Comic Sans',
      fontSize: 10, // * (1 / imgRatio),
      selectable: false,
      visible: isTag.current,
    };
    /* let tag = new fabric.Text('인간 ' + currentObjectId.current, optionTag);
    tag.set('top', rect.top + rect.height / 2 - tag.height / 2);
    tag.set('left', rect.left + rect.width / 2 - tag.width / 2); */
    //TagListItem.push(tag);
    
    //this.fCanvas.setActiveObject(rect);
    /* InstanceListItem.push({
      id: currentObjectId.current, //category id
      tool: tool,
      cId: 0, //AnnotationListItem id
      className: 'human',
      gender: '',
      age: '',
      attrs: [],
      selectable: true,
      visible: true,
    }); */
    //console.log(this.InstanceListItem);
    /* AnnotationListItem.push({
      id: objId,
      annotation: {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 1,
        },
        annotation_category: {
          annotation_category_id: 0,
          annotation_category_attributes: [],
        },
        annotation_data: [rect.left, rect.top, rect.width, rect.height],
      },
    }); */
    /* let annotation = {
      //id: currentObjectId.current,
      annotation: {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 1,
        },
        annotation_category: {
          annotation_category_id: 0,
          annotation_category_attributes: [],
        },
        annotation_data: [rect.left, rect.top, rect.width, rect.height],
      },
    }; */
    //console.log(annotation);
    /* ObjectListItem.push({
      object: rect, 
      tag: tag,
      className: 'person',
      attrs: [],
    }); */
    /* let ObjectItem = {
      object: rect, 
      tag: tag,
      className: 'person',
      attrs: [],
      annotation: annotation,
    }; */
    /* console.log(ObjectListItem);
    setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]); */
    let annotation = {
      annotation_id: aId,
      annotation_type: {
        annotation_type_id: 1,
      },
      annotation_category: {
        annotation_category_id: 0,
        annotation_category_attributes: [],
      },
      annotation_data: [rect.left, rect.top, rect.width, rect.height],
    };
    setObjectItem(rect, undefined, annotation);
    //AnnotationListItem.push(annotation);
    //console.log(AnnotationListItem);
    //this.setDataImage();
    setObjectId((prev) => prev + 1);
    canvas.add(rect);
    //canvas.add(tag);
    canvas.renderAll();
    canvas.requestRenderAll();
  }

  /* useEffect(() => {
    if(!canvas) return;
    console.log("anno");
    console.log(AnnotationListItem);
    canvas.renderAll();
  }, [AnnotationListItem]); */

  //**! polyline */
  const checkIsPolyline = () => {
    resetTools();
    setIsPolylineOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolylineOn && canvas) {
      setSelectedTool(() => "polyline");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isPolylineOn && canvas) {
    }
  }, [isPolylineOn]);
  const handlePolylineDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    console.log("line");
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[pointArray.length - 1].id) {
        // when click on the first point
        generatePolygon(pointArray, "polyline", "#ff0084");
      } else {
        addPoint(options, "polyline");
      }
    } else {
      toggleDrawPolygon(options, "polyline");
    }
  };
  const handlePolylineMove = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    if (drawMode) {
      if (activeLine && activeLine.type === 'line') {
        activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        if(activeShape) {
          const points = activeShape.get('points');
          points[pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
          };
          activeShape.set({
            points,
          });
        }
      }
      canvas.renderAll();
    }
  };
  const handlePolylineUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    isDragging = false;
    selection = true;
  };

  //**! polygon */
  const [isPolygonOn, setIsPolygonOnOff] = useState<boolean>(false);
  const checkIsPolygon = () => {
    resetTools();
    setIsPolygonOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolygonOn && canvas) {
      setSelectedTool(() => "polygon");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isPolygonOn && canvas) {
    }
  }, [isPolygonOn]);
  const handlePolygonDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    console.log(isSelectObjectOn);
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "polygon", "#0084ff");
      } else {
        addPoint(options, "polygon");
      }
    } else {
      toggleDrawPolygon(options, "polygon");
    }
  };
  const handlePolygonMove = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    if (drawMode) {
      if (activeLine && activeLine.type === 'line') {
        activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        if(activeShape) {
          const points = activeShape.get('points');
          points[pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
          };
          activeShape.set({
            points,
          });
        }
      }
      canvas.renderAll();
    }
  };
  const handlePolygonUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    isDragging = false;
    selection = true;
  };

  //**! point */
  const checkIsPoint = () => {
    resetTools();
    setIsPointOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPointOn && canvas) {
      setSelectedTool(() => "point");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isPointOn && canvas) {
    }
  }, [isPointOn]);
  const handlePointDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
  };
  const handlePointMove = (options: any) => {
    if(!canvas || !isDown || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
  };
  const handlePointUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "point");
  };
  const drawPoints = (point: any, type: string) => {
    if(type === "point") {
      let optionPoint = {
        id: currentObjectId.current,
        tool: type,
        radius: 4,  //4 / imgRatio,
        stroke: 'black',
        strokeWidth: 1, //1 / imgRatio,
        color: '#ff0000',
        fill: '#ff0000',
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        hasControls: false,
        cornerSize: 5,  //5 / imgRatio,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        selectable: true,
      };
      let boxingPoint = new fabric.Circle(optionPoint);
      boxingPoint.on('selected', handleSelectObject);
      boxingPoint.on('deselected', handleDeSelectObject);
      canvas.add(boxingPoint);
      //ObjectListItem.push(boxingPoint);
      //this.fCanvas.setActiveObject(polyItem);
      /* InstanceListItem.push({
        id: currentObjectId.current, //category id
        tool: 'point',
        cId: 0, //AnnotationListItem id
        className: 'human',
        gender: '',
        age: '',
        attrs: [],
        selectable: true,
        visible: true,
      }); */
      //console.log(this.InstanceListItem);
      /* AnnotationListItem.push({
        id: objId,
        annotation: {
          annotation_type: {
            annotation_type_id: 5,
          },
          annotation_category: {
            annotation_category_id: 0,
            annotation_category_attributes: [],
          },
          annotation_data: [point.x, point.y],
        },
      }); */
      let annotation = {
        annotation_type: {
          annotation_type_id: 5,
        },
        annotation_category: {
          annotation_category_id: 0,
          annotation_category_attributes: [],
        },
        annotation_data: [point.x, point.y],
      };
      //setAnnotationListItem(AnnotationListItem => [...AnnotationListItem, annotation]);
      setObjectItem(boxingPoint, undefined, annotation);
      setObjectId((prev) => prev + 1);
      canvas.renderAll();
    //} else if (type === "autopoint") {
    } else {
      let optionAutopoint = {
        //id: currentObjectId.current,
        tool: type,
        radius: 5,  //5 / imgRatio,
        stroke: 'black',
        strokeWidth: 1, //1 / imgRatio,
        color: '#999999',
        fill: '#ffcc00',
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        hasControls: false,
        cornerSize: 5,  //5 / imgRatio,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        selectable: true,
      };
      let autoPoint = new fabric.Circle(optionAutopoint);
      autoPointList.push(autoPoint);
      canvas.add(autoPoint);
      if (autoPointList.length === 2) {
        let ePoint = autoPointList.pop();
        let sPoint = autoPointList.pop();
        startX = sPoint.left;
        startY = sPoint.top;
        endX = ePoint.left;
        endY = ePoint.top;
        //console.log(ePoint);
        //console.log(sPoint);
        canvas.remove(ePoint);
        canvas.remove(sPoint);
        setRect(type);
      }
    } 
  }

  //**! brush */
  const checkIsBrush = () => {
    resetTools();
    setIsBrushOnOff((prev) => !prev);
  };
  const onCancelBrush = () => {
    setIsBrushOnOff(false);
  };

  useEffect(() => {
    if(isBrushOn && canvas) {
      setSelectedTool(() => "brush");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isBrushOn && canvas) {
    }
  }, [isBrushOn]);

  //**! 3Dcube */
  const checkIs3Dcube = () => {
    resetTools();
    setIs3DcubeOnOff((prev) => !prev);
  };
  const onCancel3Dcube = () => {
    setIs3DcubeOnOff(false);
  };

  useEffect(() => {
    if(is3DcubeOn && canvas) {
      setSelectedTool(() => "3Dcube");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!is3DcubeOn && canvas) {
    }
  }, [is3DcubeOn]);

  //**! segment */
  const checkIsSegment = () => {
    resetTools();
    setIsSegmentOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isSegmentOn && canvas) {
      setSelectedTool(() => "segment");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isSegmentOn && canvas) {
    }
  }, [isSegmentOn]);
  const handleSegmentDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "segment", "#eecc55");
      } else {
        addPoint(options, "segment");
      }
    } else {
      toggleDrawPolygon(options, "segment");
    }
  };
  const handleSegmentMove = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    if (drawMode) {
      if (activeLine && activeLine.type === 'line') {
        activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        if(activeShape) {
          const points = activeShape.get('points');
          points[pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
          };
          activeShape.set({
            points,
          });
        }
      }
      canvas.renderAll();
    }
  };
  const handleSegmentUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    isDragging = false;
    selection = true;
  };

  //**! keypoint */
  const checkIsKeypoint = () => {
    resetTools();
    setIsKeypointOnOff((prev) => !prev);
  };
  const onCancelKeypoint = () => {
    setIsKeypointOnOff(false);
  };
  useEffect(() => {
    if(isKeypointOn && canvas) {
      setSelectedTool(() => "keypoint");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isKeypointOn && canvas) {
    }
  }, [isKeypointOn]);

  const handleKeypointDown = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    tempRect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      strokeWidth: 2 * 1, //(1 / imgRatio),
      stroke: 'rgba(0,0,0,0.3)',
      strokeDashArray: [5, 5],  //[5 * (1 / imgRatio), 5 * (1 / imgRatio)],
      fill: 'transparent',
    });
    canvas.add(tempRect);
    isDown = true;
  };
  const handleKeypointMove = (options: any) => {
    if(!canvas || !isDown || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    setDragBox(pointer.x, pointer.y);
  };
  const handleKeypointUp = (options: any) => {
    if(!canvas || isSelectObjectOn) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if (
      Math.abs(endX - startX) > 1 &&
      Math.abs(endY - startY) > 1
    ) {
      drawKeypoint(null);
    }
    isDown = false;
  };

  const drawKeypoint = (aId: number) => {
    canvas.remove(tempRect);
    if (isKeypointOn) {
      let left = startX,
        top = startY,
        right = endX,
        bottom = endY,
        width = endX - startX,
        height = endY - startY,
        centerX = startX + width / 2,
        centerY = startY + height / 2;
      if (endX < startX) {
        left = endX;
        right = startX;
        width = startX - endX;
        centerX = endX + width / 2;
      }
      if (endY < startY) {
        top = endY;
        bottom = startY;
        height = startY - endY;
        centerY = + height / 2;
      }
      console.log(left + ', ' + right + ', ' + centerX);
      console.log(top + ', ' + bottom + ', ' + centerY);
      let headPoint = makeCircle(imgRatio, centerX, top),
        neckPoint = makeCircle(
          imgRatio,
          centerX,
          top + (centerY - top) * 0.3,
        ),
        chestPoint = makeCircle(
          imgRatio,
          centerX,
          top + (centerY - top) * 0.5,
        ),
        lshoulderPoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.5,
          top + (centerY - top) * 0.3,
        ),
        rshoulderPoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.5,
          top + (centerY - top) * 0.3,
        ),
        lelbowPoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.7,
          top + (centerY - top) * 0.7,
        ),
        relbowPoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.7,
          top + (centerY - top) * 0.7,
        ),
        lwrinklePoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.5,
          centerY,
        ),
        rwrinklePoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.5,
          centerY,
        ),
        lhipPoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.2,
          centerY,
        ),
        rhipPoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.2,
          centerY,
        ),
        lkneePoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.3,
          centerY + (bottom - centerY) * 0.5,
        ),
        rkneePoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.3,
          centerY + (bottom - centerY) * 0.5,
        ),
        lanklePoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.3,
          bottom,
        ),
        ranklePoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.3,
          bottom,
        ),
        ltoePoint = makeCircle(
          imgRatio,
          centerX - (centerX - left) * 0.5,
          bottom,
        ),
        rtoePoint = makeCircle(
          imgRatio,
          centerX + (right - centerX) * 0.5,
          bottom,
        );

      let hnLine = makeLine([
          headPoint.left,
          headPoint.top,
          neckPoint.left,
          neckPoint.top,
        ]),
        ncLine = makeLine([
          neckPoint.left,
          neckPoint.top,
          chestPoint.left,
          chestPoint.top,
        ]),
        clsLine = makeLine([
          chestPoint.left,
          chestPoint.top,
          lshoulderPoint.left,
          lshoulderPoint.top,
        ]),
        crsLine = makeLine([
          chestPoint.left,
          chestPoint.top,
          rshoulderPoint.left,
          rshoulderPoint.top,
        ]),
        sleLine = makeLine([
          lshoulderPoint.left,
          lshoulderPoint.top,
          lelbowPoint.left,
          lelbowPoint.top,
        ]),
        sreLine = makeLine([
          rshoulderPoint.left,
          rshoulderPoint.top,
          relbowPoint.left,
          relbowPoint.top,
        ]),
        elwLine = makeLine([
          lelbowPoint.left,
          lelbowPoint.top,
          lwrinklePoint.left,
          lwrinklePoint.top,
        ]),
        erwLine = makeLine([
          relbowPoint.left,
          relbowPoint.top,
          rwrinklePoint.left,
          rwrinklePoint.top,
        ]),
        clhLine = makeLine([
          chestPoint.left,
          chestPoint.top,
          lhipPoint.left,
          lhipPoint.top,
        ]),
        crhLine = makeLine([
          chestPoint.left,
          chestPoint.top,
          rhipPoint.left,
          rhipPoint.top,
        ]),
        hlkLine = makeLine([
          lhipPoint.left,
          lhipPoint.top,
          lkneePoint.left,
          lkneePoint.top,
        ]),
        hrkLine = makeLine([
          rhipPoint.left,
          rhipPoint.top,
          rkneePoint.left,
          rkneePoint.top,
        ]),
        klaLine = makeLine([
          lkneePoint.left,
          lkneePoint.top,
          lanklePoint.left,
          lanklePoint.top,
        ]),
        kraLine = makeLine([
          rkneePoint.left,
          rkneePoint.top,
          ranklePoint.left,
          ranklePoint.top,
        ]),
        altLine = makeLine([
          lanklePoint.left,
          lanklePoint.top,
          ltoePoint.left,
          ltoePoint.top,
        ]),
        artLine = makeLine([
          ranklePoint.left,
          ranklePoint.top,
          rtoePoint.left,
          rtoePoint.top,
        ]);
      /* headPoint.line2 = hnLine;
      neckPoint.line1 = hnLine;
      neckPoint.line2 = ncLine;
      chestPoint.line1 = ncLine;
      chestPoint.line2 = clsLine;
      chestPoint.line3 = crsLine;
      chestPoint.line4 = clhLine;
      chestPoint.line5 = crhLine;
      lshoulderPoint.line1 = clsLine;
      lshoulderPoint.line2 = sleLine;
      rshoulderPoint.line1 = crsLine;
      rshoulderPoint.line2 = sreLine;
      lelbowPoint.line1 = sleLine;
      lelbowPoint.line2 = elwLine;
      relbowPoint.line1 = sreLine;
      relbowPoint.line2 = erwLine;
      lwrinklePoint.line1 = elwLine;
      rwrinklePoint.line1 = erwLine;
      lhipPoint.line1 = clhLine;
      lhipPoint.line2 = hlkLine;
      rhipPoint.line1 = crhLine;
      rhipPoint.line2 = hrkLine;
      lkneePoint.line1 = hlkLine;
      lkneePoint.line2 = klaLine;
      rkneePoint.line1 = hrkLine;
      rkneePoint.line2 = kraLine;
      lanklePoint.line1 = klaLine;
      lanklePoint.line2 = altLine;
      ranklePoint.line1 = kraLine;
      ranklePoint.line2 = artLine;
      ltoePoint.line1 = altLine;
      rtoePoint.line1 = artLine; */
      setLine(headPoint, null, hnLine);
      setLine(neckPoint, hnLine, ncLine);
      setLine(chestPoint, ncLine, clsLine, crsLine, clhLine, crhLine);
      setLine(lshoulderPoint, clsLine, sleLine);
      setLine(rshoulderPoint, crsLine, sreLine);
      setLine(lelbowPoint, sleLine, elwLine);
      setLine(relbowPoint, sreLine, erwLine);
      setLine(lwrinklePoint, elwLine, null);
      setLine(rwrinklePoint, erwLine, null);
      setLine(lhipPoint, clhLine, hlkLine);
      setLine(rhipPoint, crhLine, hrkLine);
      setLine(lkneePoint, hlkLine, klaLine);
      setLine(rkneePoint, hrkLine, kraLine);
      setLine(lanklePoint, klaLine, altLine);
      setLine(ranklePoint, kraLine, artLine);
      setLine(ltoePoint, altLine, null);
      setLine(rtoePoint, artLine, null);

      canvas.add(
        hnLine,
        ncLine,
        clsLine,
        crsLine,
        sleLine,
        sreLine,
        elwLine,
        erwLine,
        clhLine,
        crhLine,
        hlkLine,
        hrkLine,
        klaLine,
        kraLine,
        altLine,
        artLine,
      );

      canvas.add(
        headPoint,
        neckPoint,
        chestPoint,
        lshoulderPoint,
        rshoulderPoint,
        lelbowPoint,
        relbowPoint,
        lwrinklePoint,
        rwrinklePoint,
        lhipPoint,
        rhipPoint,
        lkneePoint,
        rkneePoint,
        lanklePoint,
        ranklePoint,
        ltoePoint,
        rtoePoint,
      );

      /* InstanceListItem.push({
        id: currentObjectId.current, //category id
        tool: 'keypoint',
        cId: 0, //AnnotationListItem id
        className: 'human',
        gender: '',
        age: '',
        attrs: [],
        selectable: true,
        visible: true,
      }); */

      let cData = [
        headPoint.left,
        headPoint.top,
        2,
        neckPoint.left,
        neckPoint.top,
        2,
        chestPoint.left,
        chestPoint.top,
        2,
        lshoulderPoint.left,
        lshoulderPoint.top,
        2,
        rshoulderPoint.left,
        rshoulderPoint.top,
        2,
        lelbowPoint.left,
        lelbowPoint.top,
        2,
        relbowPoint.left,
        relbowPoint.top,
        2,
        lwrinklePoint.left,
        lwrinklePoint.top,
        2,
        rwrinklePoint.left,
        rwrinklePoint.top,
        2,
        lhipPoint.left,
        lhipPoint.top,
        2,
        rhipPoint.left,
        rhipPoint.top,
        2,
        lkneePoint.left,
        lkneePoint.top,
        2,
        rkneePoint.left,
        rkneePoint.top,
        2,
        lanklePoint.left,
        lanklePoint.top,
        2,
        ranklePoint.left,
        ranklePoint.top,
        2,
        ltoePoint.left,
        ltoePoint.top,
        2,
        rtoePoint.left,
        rtoePoint.top,
        2,
      ];
      console.log(cData);
      /* AnnotationListItem.push({
        id: objId,
        annotation: {
          annotation_id: aId,
          annotation_type: {
            annotation_type_id: 10,
            annotation_type_name: 'keypoint',
          },
          annotation_category: {
            annotation_category_id: 0,
            annotation_category_attributes: [],
          },
          annotation_data: cData,
        },
      }); */
      /* let annotation = {
        id: currentObjectId.current,
        annotation: {
          annotation_id: aId,
          annotation_type: {
            annotation_type_id: 10,
            annotation_type_name: 'keypoint',
          },
          annotation_category: {
            annotation_category_id: 0,
            annotation_category_attributes: [],
          },
          annotation_data: cData,
        },
      };
      setAnnotationListItem(AnnotationListItem => [...AnnotationListItem, annotation]); */
      setObjectId((prev) => prev + 1);
      canvas.renderAll();
    }
  };

  //**! polygon module */
  const toggleDrawPolygon = (options, type: string) => {
    if(!canvas) return;
    if (drawMode) {
      // stop draw mode
      activeLine = null;
      activeShape = null;
      lineArray = [];
      pointArray = [];
      //canvas.selection = true;
      //drawMode = false;
    } else {
      // start draw mode
      canvas.selection = false;
      drawMode = true;
      if(options)
        addPoint(options, type);
    }
  };

  const drawPolyItem = (tool: any, coordinate: any, type: any, color: any, aId: any, type_id: any, itemId: number) => {
    if(!canvas) return;
    if(!itemId) {
      itemId = currentObjectId.current;
    }
    let fill = 'transparent';
    if(type === "segment") {
      fill = color + "4D";
    }
    let option = {
      id: itemId,
      tool: tool,
      type: type,
      color: color,
      fill: fill,
      selectable: true,
      strokeWidth: 2 * 1, //(1 / imgRatio),
      //strokeLinejoin: 'round',
      //stroke: 'rgba(0,0,0,0.5)',
      stroke: color,
      objectCaching: false,
      edit: true,
      hoverCursor: 'pointer',
      hasBorders: false,
      //hasControls: false,
    };
    let polyItem = new fabric.Polygon(coordinate, option);
    if (type === "polyline") {
      polyItem = new fabric.Polyline(coordinate, option);
    }
    /* let optionTag = {
      //id: objectId,
      fill: '#ffffff',
      //textBackgroundColor: 'grey',
      fontFamily: 'Comic Sans',
      fontSize: 10 * 1, //(1 / imgRatio),
      visible: isTag.current,
      selectable: false,
    };
    let tag = new fabric.Text('인간 ' + currentObjectId.current, optionTag);
    tag.set('top', polyItem.top + polyItem.height / 2 - tag.height / 2);
    tag.set('left', polyItem.left + polyItem.width / 2 - tag.width / 2); */
    canvas.add(polyItem);
    //canvas.add(tag);
    polyItem.on('selected', handleSelectObject);
    polyItem.on('deselected', handleDeSelectObject);
    //polyItem.on('modified', modifyObject);
    /* ObjectListItem.push(polyItem);
    TagListItem.push(tag); */
    //this.fCanvas.setActiveObject(polyItem);
    /* InstanceListItem.push({
      id: objectId, //category id
      tool: tool,
      cId: 0, //AnnotationListItem id
      className: 'human',
      gender: '',
      age: '',
      attrs: [],
      selectable: true,
      visible: true,
    }); */
    //console.log(this.InstanceListItem);
    //console.log(coordinate);
    let cData = [];
    for (let i = 0; i < coordinate.length; i++) {
      cData.push(coordinate[i].x);
      cData.push(coordinate[i].y);
    }
    //console.log(cData);
    /* AnnotationListItem.push({
      id: objId,
      annotation: {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: type_id,
          annotation_type_name: type,
        },
        annotation_category: {
          annotation_category_id: 0,
          annotation_category_attributes: [],
        },
        annotation_data: cData,
      },
    }); */
    let annotation = {
      annotation_id: aId,
      annotation_type: {
        annotation_type_id: type_id,
        annotation_type_name: type,
      },
      annotation_category: {
        annotation_category_id: 0,
        annotation_category_attributes: [],
      },
      annotation_data: cData,
    };
    /* setAnnotationListItem(AnnotationListItem => [...AnnotationListItem, annotation]); */
    setObjectItem(polyItem, undefined, annotation);
    if (type === 'polygon' || type === 'segment' || type === 'polyline') {
      editPolygon(polyItem);
    }
    setObjectId((prev) => prev + 1);
    canvas.renderAll();
  };
  const addPoint = (options: any, type: string) => {
    if(!canvas) return;
    let pointer = canvas.getPointer(options);
    const pointOption = {
      id: new Date().getTime(),
      radius: 5 * 1,  //(1 / imgRatio),
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 0.5,
      left: pointer.x,
      top: pointer.y,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
    };
    const point = new fabric.Circle(pointOption);

    if (pointArray.length === 0) {
      // fill first point with red color
      /*point.set({
        fill: 'red',
      });*/
      point.fill = 'red';
    }

    const linePoints = [pointer.x, pointer.y, pointer.x, pointer.y];
    const lineOption = {
      strokeWidth: 2,
      fill: 'transparent',
      stroke: '#999999',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
    };
    const line = new fabric.Line(linePoints, lineOption);
    //line.class = 'line';
    console.log(type);
    if(type !== "polyline") {
      if (activeShape) {
        const pos = canvas.getPointer(options.e);
        const points = activeShape.get('points');
        points.push({
          x: pos.x,
          y: pos.y,
        });
        const polygon = new fabric.Polygon(points, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        canvas.remove(activeShape);
        canvas.add(polygon);
        activeShape = polygon;
        canvas.renderAll();
      } else {
        const polyPoint = [
          {
            x: pointer.x,
            y: pointer.y,
          },
        ];
        const polygon = new fabric.Polygon(polyPoint, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        activeShape = polygon;
        canvas.add(polygon);
      }
    }
    activeLine = line;
    pointArray.push(point);
    lineArray.push(line);

    canvas.add(line);
    canvas.add(point);
    console.log(canvas);
  };
  const generatePolygon = (pointArray: any, type: string, color: string) => {
    if(!canvas) return;
    const points = [];
    // collect points and remove them from canvas
    for (const point of pointArray) {
      points.push({
        x: point.left,
        y: point.top,
      });
      canvas.remove(point);
    }

    // remove lines from canvas
    for (const line of lineArray) {
      canvas.remove(line);
    }

    // remove selected Shape and Line
    canvas.remove(activeShape).remove(activeLine);

    drawPolyItem(type, points, type, color, null, 0, null);
    toggleDrawPolygon(null, "");
  };
  /**
   * define a function that can locate the controls.
   * this function will be used both for drawing and for interaction.
   */
  function polygonPositionHandler(dim: any, finalMatrix: any, fabricObject: any) {
    let x =
        fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return fabric.util.transformPoint(
      //{ x: x, y: y },
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix(),
      ),
    );
  };
  /**
   * define a function that will define what the control does
   * this function will be called on every mouse move after a control has been
   * clicked and is being dragged.
   * The function receive as argument the mouse event, the current trasnform object
   * and the current position in canvas coordinate
   * transform.target is a reference to the current object being transformed,
   */
  function actionHandler (eventData: any, transform: any, x: any, y: any) {
    let polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        'center',
        'center',
      ),
      polygonBaseSize = polygon._getNonTransformedDimensions(),
      size = polygon._getTransformedDimensions(0, 0);
    polygon.points[currentControl.pointIndex] = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    };
    return true;
  };
  /**
   * define a function that can keep the polygon in the same position when we change its
   * width/height/top/left.
   */
  function anchorWrapper (anchorIndex: any, fn: any) {
    return function (eventData: any, transform: any, x: any, y: any) {
      let fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
            type: "",
            add: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            addEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarAdd: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarAddEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            subtract: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            subtractEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarSubtract: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarSubtractEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            multiply: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            multiplyEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            divide: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            divideEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            eq: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lt: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lte: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            gt: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            gte: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lerp: function (that: fabric.IPoint, t: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            distanceFrom: function (that: fabric.IPoint): number {
              throw new Error("Function not implemented.");
            },
            midPointFrom: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            min: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            max: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setXY: function (x: number, y: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setX: function (x: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setY: function (y: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setFromPoint: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            swap: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            clone: function (): fabric.Point {
              throw new Error("Function not implemented.");
            }
          },
          fabricObject.calcTransformMatrix(),
        ),
        actionPerformed = fn(eventData, transform, x, y),
        // eslint-disable-next-line no-unused-vars
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = fabricObject._getNonTransformedDimensions(),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };
  const editPolygon = (object: any) => {
    if(!canvas) return;
    let activeObject = object;
    if (object === null || object === undefined) {
      activeObject = canvas.getActiveObject();
    }
    if (!activeObject) {
      activeObject = canvas.getObjects()[0];
      canvas.setActiveObject(activeObject);
    }

    activeObject.edit = true;
    activeObject.objectCaching = false;

    const lastControl = activeObject.points.length - 1;
    activeObject.cornerStyle = 'circle';
    activeObject.controls = activeObject.points.reduce(
      (acc: any, point: any, index: number) => {
        acc['p' + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler,
          ),
          actionName: 'modifyPolygon',
          pointIndex: index,
          x: point.x,
          y: point.y,
        });
        //console.log(index);
        return acc;
      },
      {},
    );
    activeObject.hasBorders = false;
    canvas.requestRenderAll();
  };

  //**! original image */
  const onOriginalImage = () => {
    if (selectedTask) {
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].order === 0
        ) {
          if (dataURLHistory[i].dataURL.includes("data:image")) {
            setCurrentDataURL(dataURLHistory[i].dataURL);
          } else {
            setCurrentDataURL(
              `data:image/${selectedTask.imageFormat};base64,` +
                dataURLHistory[i].dataURL
            );
          }
        }
      }
    }
  };
  
  // ! MainCenterBottom의 file select state
  const makeCircle = (ratio: number, left: number, top: number) => {
    let optionCircle = {
      id: 0,
      tool: 'keypoint',
      left: left,
      top: top,
      strokeWidth: 2 / ratio,
      radius: 4 / ratio,
      fill: '#fff',
      stroke: '#666',
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      line5: '',
    };
    let c = new fabric.Circle(optionCircle);
    c.hasControls = c.hasBorders = false;
    c.on('selected', handleSelectObject);
    c.on('deselected', handleDeSelectObject);
    return c;
  };
  const setLine = (c: any, line1: any, line2: any, line3?: any, line4?: any, line5?: any) => {
    let optionCircle = {
      line1: line1,
      line2: line2,
      line3: line3,
      line4: line4,
      line5: line5,
    };
    c.set(optionCircle);
  };
  const makeLine = (coords: Array<number>) => {
    let optionLine = {
      tool: 'keypoint',
      fill: 'red',
      stroke: 'red',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    };
    return new fabric.Line(coords, optionLine);
  };

  // ! why same

  useLayoutEffect(() => {
    const { current } = refTools;
    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;
      if (hasOverflow) {
        document.getElementById("arrowToolsTop").style.display = "flex";
        document.getElementById("arrowToolsBottom").style.display = "flex";
      } else {
        document.getElementById("arrowToolsTop").style.display = "none";
        document.getElementById("arrowToolsBottom").style.display = "none";
      }
    };
    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }
      trigger();
    }
  }, [refTools, refTools.current, refTools.current?.scrollHeight, refTools.current?.clientHeight]);

  const onMoveToToolsTop = () => {
    refTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsEnd = () => {
    refBottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  let imgIndexLeft = 0, imgIndexRight = 5;

  const refPicker = useRef<any>(undefined);

  useLayoutEffect(() => {
    const { current } = refPicker;
    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      if (hasOverflow) {
        if(imgIndexLeft <= 0) {
          document.getElementById("arrowPickerLeft").style.display = "none";
        } else {
          document.getElementById("arrowPickerLeft").style.display = "flex";
        }
        if(imgIndexRight >= tasks.length - 1) {
          document.getElementById("arrowPickerRight").style.display = "none";
        } else {
          document.getElementById("arrowPickerRight").style.display = "flex";
        }
      }
    };
    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }
      trigger();
    }
    let picker = document.getElementById("imgPicker"); 
    if(picker)
      picker.addEventListener("scroll", handlePickerScroll);
  }, [refPicker, refPicker.current, refPicker.current?.scrollWidth, refPicker.current?.clientWidth]);

  const handlePickerScroll = () => {
    let scrollLocation = refPicker.current.scrollLeft; // 현재 스크롤바 위치
	  let fullWidth = refPicker.current.scrollWidth; // 전체 길이
    let clientWidth = refPicker.current.clientWidth; // 보이는 길이

    let boundary = refPicker.current.scrollWidth / tasks.length;
    
    imgIndexLeft = Math.round(scrollLocation / boundary);
    imgIndexRight = imgIndexLeft + 5;

    //console.log(imgIndexLeft + " : " + imgIndexRight);

    if(imgIndexLeft <= 0) {
      document.getElementById("arrowPickerLeft").style.display = "none";
    } else {
      document.getElementById("arrowPickerLeft").style.display = "flex";
    }
    if(imgIndexRight >= tasks.length - 1) {
      document.getElementById("arrowPickerRight").style.display = "none";
    } else {
      document.getElementById("arrowPickerRight").style.display = "flex";
    }
  };

  const onMoveToToolsLeft = () => {
    if(imgIndexLeft < 5){
      imgIndexLeft = 0; 
      imgIndexRight = 5;
    } else {
      imgIndexLeft -= 5;
      imgIndexRight -= 5; 
    }
    let left = document.getElementById("img"+imgIndexLeft);
    left.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsRight = () => {
    if(imgIndexRight > tasks.length - 5){
      imgIndexLeft = tasks.length - 6; 
      imgIndexRight = tasks.length - 1;
    } else {
      imgIndexLeft += 5;
      imgIndexRight += 5; 
    }
    let right = document.getElementById("img"+imgIndexRight);
    right.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const setInstanceIcon = (tool: string) => {
    let icon = iconDefault;
    switch(tool) {
      case "OD":
        icon = iconOD;
        break;
      case "IS":
        icon = iconIS;
        break;
      case "SES":
        icon = iconSES;
        break;
      case "autopoint":
        icon = iconAutopoint;
        break;
      case "smartpen":
        icon = iconSmartpen;
        break;
      case "bbox":
        icon = iconBoxing;
        break;
      case "polyline":
        icon = iconPolyline;
        break;
      case "polygon":
        icon = iconPolygon;
        break;
      case "point":
        icon = iconPoint;
        break;
      case "brush":
        icon = iconBrush;
        break;
      case "3Dcube":
        icon = icon3Dcube;
        break;
      case "segment":
        icon = iconSegment;
        break;
      case "keypoint":
        icon = iconKeypoint;
        break;
    }
    return icon;
  };

  const refBtnLock = useRef<any>(undefined);
  const refBtnVisible = useRef<any>(undefined);
  const refBtnDelete = useRef<any>(undefined);

  // ! 완료 버튼 클릭 시 호출
  const handleCompleted = async () => {
    if (pId && selectedTask && currentDataURL) {
      const currentStep = selectedTask.taskStep;
      if (currentStep === 2) {
        if (!selectedTask.taskValidator) {
          toast({
            title: "Task의 검수 담당자가 아닙니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        if (
          selectedTask.taskValidator &&
          loggedInUser.id !== selectedTask.taskValidator.id
        ) {
          toast({
            title: "Task의 검수 담당자만 가능한 작업입니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      }

      const dataSaveRes = await saveData();

      if (dataSaveRes) {
        const res = await taskApi.updateTaskStatus(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          { task_status_progress: 3 },
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          toast({
            title: "Task 업데이트 완료",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          switch (currentStep) {
            case 1:
              setSelectedTask((prev) => ({
                ...prev!,
                taskStep: 2,
                taskStatus: 1,
              }));
              break;
            case 2:
              setSelectedTask((prev) => ({
                ...prev!,
                taskStatus: 3,
              }));
              break;
          }
        }
      }
    }
  };
  // ! 반려 팝업 노출 상태 state
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  // ! 반려 팝업에서 반려 사유 입력 내용 저장 state
  const [rejectText, setRejectText] = useState<string>();
  // ! 반려 버튼 클릭 시 반려 팝업 노출 on
  const handleOpenReject = () => {
    setIsOpenReject(true);
  };
  // ! 반려 팝업 닫기 버튼 클릭 시 팝업 미노출 on
  const handleCancelReject = () => {
    setIsOpenReject(false);
  };
  // ! 반려 팝업에서 적용 버튼 클릭 시 호출 function
  const onSubmitReject = async () => {
    if (pId && selectedTask && rejectText && rejectText !== "") {
      const res = await taskApi.updateTaskStatus(
        { project_id: parseInt(pId), task_id: selectedTask.taskId },
        { task_status_progress: 4, comment_body: rejectText },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        toast({
          title: "반려 처리 완료",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setSelectedTask((prev) => ({
          ...prev!,
          taskStatus: 4,
        }));
      }
    }
    setIsOpenReject(false);
  };
  // ! 반려 팝업에서 textarea의 입력 내용 handle change
  const handleSetRejectText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectText(e.target.value);
  };
  // ! 반려 상태일 때 반려 사유 보기 버튼 클릭에 관한 state
  const [showRejectComment, setShowRejectComment] = useState<boolean>(false);
  // ! 반려 사유 보기 팝업 닫기 시 호출
  const handleCancelRejectComment = () => {
    setShowRejectComment(false);
    setRejectComment(undefined);
  };
  // ! 반려 사유 보기 팝업의 반려 사유 내용 저장 state
  const [rejectComment, setRejectComment] = useState<string>();
  // !
  // ! 반려 사유 보기 버튼 클릭 시 호출되며 반려 사유를 서버로부터 받아온다.
  const handleShowRejctHelp = async () => {
    if (pId && selectedTask) {
      const res = await taskApi.getTaskRejectComment(
        {
          project_id: parseInt(pId),
          task_id: selectedTask.taskId,
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        setRejectComment(res.data.comment_body);
        setShowRejectComment(true);
      }
    }
  };

  if (pId) {
    return (
      <LabelingPresenter
        currentUser={loggedInUser}
        currentDataURL={currentDataURL}
        projectInfo={projectInfo}
        examinee={examinee}
        tasks={tasks}
        isFileSelectorOpen={isFileSelectorOpen}
        labelingAssignee={labelingAssignee}
        projectUser={projectUser}
        isFileInfoOpen={isFileInfoOpen}
        workStatutes={workStatutes}
        selectedTask={selectedTask}
        loading={loading}
        isFirst={isFirst}
        effectLoading={effectLoading}
        isCanvasOn={isCanvasOn}
        resizingVal={resizingVal}
        _setExaminee={_setExaminee}
        _setLabelingAssignee={_setLabelingAssignee}
        toggleFileSelector={toggleFileSelector}
        toggleFileInfoOpen={toggleFileInfoOpen}
        _setWorkStatutes={_setWorkStatutes}
        _setSelectedTask={_setSelectedTask}
        handlePrevTask={handlePrevTask}
        handleNextTask={handleNextTask}
        onCancelMove={onCancelMove}
        onCancelClass={onCancelClass}
        onCancelReset={onCancelReset}
        onSubmitReset={onSubmitReset}
        onCancelSmartpen={onCancelSmartpen}
        onCancelAutopoint={onCancelAutopoint}
        onCancelBrush={onCancelBrush}
        onCancel3Dcube={onCancel3Dcube}
        onCancelKeypoint={onCancelKeypoint}
        handleResizing={handleResizing}
        onOriginalImage={onOriginalImage}
        handleDownloadImage={handleDownloadImage}
        handleToggleFullScreen={handleToggleFullScreen}
        handleUnDo={handleUnDo}
        handleRedo={handleRedo}
        saveStatus={saveStatus}
        goBack={goBack}
        isMoveOn={isMoveOn}
        isTagOn={isTagOn}
        isClassOn={isClassOn}
        isResetOn={isResetOn}
        isODOn={isODOn}
        isISOn={isISOn}
        isSESOn={isSESOn}
        isSmartpenOn={isSmartpenOn}
        isAutopointOn={isAutopointOn}
        isBoxingOn={isBoxingOn}
        isPolylineOn={isPolylineOn}
        isPolygonOn={isPolygonOn}
        isPointOn={isPointOn}
        isBrushOn={isBrushOn}
        is3DcubeOn={is3DcubeOn}
        isSegmentOn={isSegmentOn}
        isKeypointOn={isKeypointOn}
        isInstanceOpen={isInstanceOpen}
        isHistoryOpen={isHistoryOpen}
        toggleInstanceOpen={toggleInstanceOpen}
        toggleHistoryOpen={toggleHistoryOpen}
        checkIsMove={checkIsMove}
        checkIsTag={checkIsTag}
        checkIsClass={checkIsClass}
        checkIsReset={checkIsReset}
        checkIsOD={checkIsOD}
        checkIsIS={checkIsIS}
        checkIsSES={checkIsSES}
        checkIsSmartpen={checkIsSmartpen}
        checkIsAutopoint={checkIsAutopoint}
        checkIsBoxing={checkIsBoxing}
        checkIsPolyline={checkIsPolyline}
        checkIsPolygon={checkIsPolygon}
        checkIsPoint={checkIsPoint}
        checkIsBrush={checkIsBrush}
        checkIs3Dcube={checkIs3Dcube}
        checkIsSegment={checkIsSegment}
        checkIsKeypoint={checkIsKeypoint}
        canvas={canvas}
        _setDownload={_setDownload}
        onCancelDownload={onCancelDownload}
        onSubmitDownload={onSubmitDownload}
        checkIsDownload={checkIsDownload}
        setIsClass={setIsClass}
        isLock={isLock}
        isVisible={isVisible}
        isDelete={isDelete}
        isDownloadOn={isDownloadOn}
        isDownload={isDownload}
        selectDownload={selectDownload} 
        labelWidth={labelWidth} 
        labelHeight={labelHeight} 
        labelDiag={labelDiag} 
        labelCoordX={labelCoordX} 
        labelCoordY={labelCoordY} 
        labelPerWidth={labelPerWidth} 
        labelPerHeight={labelPerHeight} 
        labelPerDiag={labelPerDiag}      
        ObjectListItem={ObjectListItem}
        isAutoLabelingOn={isAutoLabelingOn}
        objectType={objectType}
        refTools={refTools}
        refPicker={refPicker}
        refTop={refTop}
        refBottom={refBottom}
        onMoveToToolsTop={onMoveToToolsTop}
        onMoveToToolsEnd={onMoveToToolsEnd}
        onMoveToToolsLeft={onMoveToToolsLeft}
        onMoveToToolsRight={onMoveToToolsRight}
        setInstanceIcon={setInstanceIcon}
        refBtnLock={refBtnLock}
        refBtnVisible={refBtnVisible}
        refBtnDelete={refBtnDelete}
        isOpenReject={isOpenReject}
        rejectComment={rejectComment}
        showRejectComment={showRejectComment}
        handleCompleted={handleCompleted}
        handleOpenReject={handleOpenReject}
        handleCancelReject={handleCancelReject}
        onSubmitReject={onSubmitReject}
        handleSetRejectText={handleSetRejectText}
        handleShowRejctHelp={handleShowRejctHelp}
        handleCancelRejectComment={handleCancelRejectComment}
        isAutoLabeling={isAutoLabeling}
      />
    );
  }
  return null;
};

export default LabelingContainer;