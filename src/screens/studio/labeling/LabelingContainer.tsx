import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
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
import { fabric } from "fabric";

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

const LabelingContainer = () => {
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
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[]) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
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
    }
    setTasks(cleanedTasks);
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
      setCanvasImage();
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
      //canvas.on('mouse:down:before', beforeDownCanvas);
      //canvas.on('mouse:out', outCanvas);
      //canvas.on('object:moving', handleObjectMoving);
      //canvas.on('object:scaling', handleObjectScaling);
      //canvas.on('selection:created', handleSelectionCreated);
      //canvas.on('selection:updated', handleSelectionUpdated);
      //canvas.on('before:selection:cleared', beforeClearSelection);
      //canvas.on('selection:cleared', handleSelectionCleared);
      //canvas.on('mouse:wheel', handleMouseWheel);
      //canvas.on('path:created', createPath);
      //ctx = canvas.getContext();
      setContext(() => canvas.getContext());
    }
  }, [canvas]);

  const [imgRatio, setimgRatio] = useState(0);
  const [imgWidth, setimgWidth] = useState(0);
  const [imgHeight, setimgHeight] = useState(0);
  const setCanvasImage = () => {
    if (currentDataURL && canvas) {
      canvas.clear();
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

  //const [isDown, setDown] = useState<boolean>(false);
  let isDown = false, drawMode = false, isDragging = false, selection = false, isSelectObject = false;
  let startX = 0, startY = 0, endX = 0, endY = 0;
  let instanceWidth = 0, instanceHeight = 0, positionX = 0, positionY =0;
  let pointArray: any[] = [];
  let activeLine: any = null;
  let activeShape: any = null;
  let lineArray: any[] = [];
  const handleCanvasDown = (options: any) => {
    isDown = true;
    if(!canvas) return;
    console.log("down-" + isPolygonOn);
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    //stX = pointer.x;
    //stY = pointer.y;
  };

  const selectObject = (options) => {
    isSelectObject = true;
  }

  const deselectObject = (options) => {
    isSelectObject = false;
  }

  const toggleDrawPolygon = (options) => {
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
        addPoint(options);
    }
  };
  let objId = 0;
  const drawPolyItem = (tool: any, coordinate: any, type: any, color: any, aId: any, type_id: any) => {
    if(!canvas) return;
    let fill = 'transparent';
    let option = {
      id: objId,
      tool: tool,
      type: type,
      color: color,
      fill: fill,
      selectable: true,
      strokeWidth: 2 * (1 / imgRatio),
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
    /*if (isPolylineOn) {
      polyItem = new fabric.Polyline(coordinate, option);
    }
    
    let tag = new fabric.Text('human ' + objId, {
      id: objId,
      fill: '#ffffff',
      //textBackgroundColor: 'grey',
      fontFamily: 'Comic Sans',
      fontSize: 10 * (1 / imgRatio),
      visible: isTagOn,
      selectable: false,
    });
    tag.set('top', polyItem.top + polyItem.height / 2 - tag.height / 2);
    tag.set('left', polyItem.left + polyItem.width / 2 - tag.width / 2);*/
    canvas.add(polyItem);
    //canvas.add(tag);
    polyItem.on('selected', selectObject);
    polyItem.on('deselected', deselectObject);
    //polyItem.on('modified', modifyObject);
    /*ObjectListItem.push(polyItem);
    TagListItem.push(tag);*/
    //this.fCanvas.setActiveObject(polyItem);
    /*InstanceListItem.push({
      id: objId, //category id
      tool: tool,
      cId: 0, //AnnotationListItem id
      className: 'human',
      gender: '',
      age: '',
      attrs: [],
    });
    //console.log(this.InstanceListItem);
    //console.log(coordinate);
    let cData = [];
    for (let i = 0; i < coordinate.length; i++) {
      cData.push(coordinate[i].x);
      cData.push(coordinate[i].y);
    }
    //console.log(cData);
    AnnotationListItem.push({
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
    });*/
    if (type === 'polygon' || type === 'segment') {
      editPolygon(polyItem);
    }
    objId++;
  };
  const addPoint = (options: any) => {
    if(!canvas) return;
    let pointer = canvas.getPointer(options);
    const pointOption = {
      id: new Date().getTime(),
      radius: 5 * (1 / imgRatio),
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

    activeLine = line;
    pointArray.push(point);
    lineArray.push(line);

    canvas.add(line);
    canvas.add(point);
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

    drawPolyItem("polygon", points, type, color, null, 0);
    toggleDrawPolygon(null);
  };
  /**
   * define a function that can locate the controls.
   * this function will be used both for drawing and for interaction.
   *//*
  const polygonPositionHandler = (dim: any, finalMatrix: any, fabricObject: any) => {
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
  };*/
  /**
   * define a function that will define what the control does
   * this function will be called on every mouse move after a control has been
   * clicked and is being dragged.
   * The function receive as argument the mouse event, the current trasnform object
   * and the current position in canvas coordinate
   * transform.target is a reference to the current object being transformed,
   */
  const actionHandler = (eventData: any, transform: any, x: any, y: any) => {
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
  const anchorWrapper = (anchorIndex: any, fn: any) => {
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
      (acc: any, point: any, index: any) => {
        acc['p' + index] = new fabric.Control({
          //positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler,
          ),
          actionName: 'modifyPolygon',
        });
        //console.log(index);
        return acc;
      },
      {},
    );
    activeObject.hasBorders = false;
    canvas.requestRenderAll();
  };

  //*************** Header function **********************/

  // ! Download image
  const handleDownloadImage = () => {
    // Todo: 다운로드 데이터 선택
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
  const saveData = async () => {
    // TODO: 아래처럼 구현하면 업로드는 진행되는데 파일명이 blob.png로 떨어짐 이거는 추후 수정
    // ! 서버에 상태 및 라벨링 데이터 저장 기능
    /*if (currentDataURL) {
      const file = dataUrlToBlob(currentDataURL);
      let formdata = new FormData();
      formdata.append("image", file);

      if (pId && selectedTask) {
        const res = await taskApi.updateTaskData(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          formdata
        );
        if (res && res.status === 200) {
          toast({
            title: "Task Image 업데이트 완료",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    }*/
  };
  const goBack = () => {
    navigate(-1);
  };

  //*************** Main function **********************/
  let ObjectListItem = [],
    InstanceListItem = [],
    AnnotationListItem = [],
    TagListItem = [],
    DeleteIDList = [],
    instanceClass = "",
    instanceGender = "",
    instanceAge = "";

  const resetTools = () => {
    canvas.defaultCursor = "default";
    canvas.hoverCursor = "crosshair";
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false);
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
    ObjectListItem = [];
    InstanceListItem = [];
    AnnotationListItem = [];
    TagListItem = [];
    instanceClass = "";
    instanceGender = "";
    instanceAge = "";
    objId = 0;
  }
  const clearAutoLabeling = (tool: string) => {
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].tool === tool) {
        let id = ObjectListItem[i].id;

        for (let j = 0; j < TagListItem.length; j++) {
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
        }

        canvas.remove(ObjectListItem[i]);
        //this.ObjectListItem.splice(i, 1);
      }
    }
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].tool === tool) {
        ObjectListItem.splice(i, 1);
      }
    }
  }

  //**! resize  */
  const [resizingVal, setResizingVal] = useState<string | null>(null);
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
      console.log(width + ", " + height + ", " + imgRatio);
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
  const [isMoveOn, setIsMoveOnOff] = useState<boolean>(false);
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
  const [isTagOn, setIsTagOnOff] = useState<boolean>(false);
  const checkIsTag = () => {
    setIsTagOnOff((prev) => !prev);
  };
  useEffect(() => {
    if (!isTagOn) {
      /*let items = this.fCanvas.getObjects();
      for (let i = 0; i < items.length; i++) {
        this.fCanvas.remove(this.TagListItem[i]);
      }*/
      for (let i = 0; i < TagListItem.length; i++) {
        TagListItem[i].visible = false;
      }
    } else {
      for (let i = 0; i < TagListItem.length; i++) {
        //this.fCanvas.add(this.TagListItem[i]);
        TagListItem[i].visible = true;
      }
    }
    canvas.renderAll();
  }, [isTagOn]);
  //**! class */
  const [isClassOn, setIsClassOnOff] = useState<boolean>(false);
  const checkIsClass = () => {
    // 클래스 팝업
    setIsClassOnOff((prev) => !prev);
  };
  const onCancelClass = () => {
    setIsClassOnOff(false);
  };
  //**! reset */
  const [isResetOn, setIsResetOnOff] = useState<boolean>(false);
  const checkIsReset = () => {
    setIsResetOnOff((prev) => !prev);
  };
  const onCancelReset = () => {
    setIsResetOnOff(false);
  };
  const onSubmitReset = () => {
    // Todo: 리셋 초기화 내용 작업 필요
    resetTools();
    clearDatas();
    canvas.clear();
    setCanvasImage();
    setIsResetOnOff(false);
  };
  //**! OD */
  const [isODOn, setIsODOnOff] = useState<boolean>(false);
  const checkIsOD = () => {
    resetTools();
    setIsODOnOff((prev) => !prev);
  };
  const [isISOn, setIsISOnOff] = useState<boolean>(false);
  //**! IS */
  const checkIsIS = () => {
    resetTools();
    setIsISOnOff((prev) => !prev);
  };
  //**! SES */
  const [isSESOn, setIsSESOnOff] = useState<boolean>(false);
  const checkIsSES = () => {
    resetTools();
    setIsSESOnOff((prev) => !prev);
  };
  //**! smartpen */
  const [isSmartpenOn, setIsSmartpenOnOff] = useState<boolean>(false);
  const checkIsSmartpen = () => {
    resetTools();
    setIsSmartpenOnOff(!isSmartpenOn);
  };
  const onCancelSmartpen = () => {
    setIsSmartpenOnOff(false);
  };
  //**! autopoint */
  let autoPointList = [];
  const [isAutopointOn, setIsAutopointOnOff] = useState<boolean>(false);
  const checkIsAutopoint = () => {
    resetTools();
    setIsAutopointOnOff((prev) => !prev);
  };
  const onCancelAutopoint = () => {
    setIsAutopointOnOff(false);
  };
  useEffect(() => {
    if(isAutopointOn && canvas) {
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.on("mouse:down", handlePointDown);
      canvas.on("mouse:move", handlePointMove);
      canvas.on("mouse:up", handleAutopointUp);
    } else if(!isAutopointOn && canvas) {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    }
  }, [isAutopointOn]);
  const handleAutopointUp = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "autopoint");
  };
  //**! boxing */
  const [isBoxingOn, setIsBoxingOnOff] = useState<boolean>(false);
  const checkIsBoxing = () => {
    resetTools();
    setIsBoxingOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isBoxingOn && canvas) {
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.on("mouse:down", handleBoxingDown);
      canvas.on("mouse:move", handleBoxingMove);
      canvas.on("mouse:up", handleBoxingUp);
    } else if(!isBoxingOn && canvas) {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    }
  }, [isBoxingOn]);
  let tempRect: fabric.Rect = null;
  const handleBoxingDown = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    tempRect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      strokeWidth: 2 * (1 / imgRatio),
      stroke: 'rgba(0,0,0,0.3)',
      strokeDashArray: [5 * (1 / imgRatio), 5 * (1 / imgRatio)],
      fill: 'transparent',
    });
    canvas.add(tempRect);
    isDown = true;
  };
  const handleBoxingMove = (options: any) => {
    if(!canvas || !isDown || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    setDragBox(pointer.x, pointer.y);
  };
  const handleBoxingUp = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if (
      Math.abs(endX - startX) > 1 &&
      Math.abs(endY - startY) > 1
    ) {
      setRect();
      //this.drawBoxing();
    }
    isDown = false;
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
    instanceWidth = rRight - rLeft;
    instanceHeight = rBottom - rTop;
    positionX = rLeft;
    positionY = rTop;

    if(tempRect)
      tempRect.set({
        left: positionX,
        top: positionY,
        width: rRight - rLeft,
        height: rBottom - rTop,
      });
    //this.DragRectListItem.push(rect);
    canvas.renderAll();
  }
  const setRect = () => {
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
    instanceWidth = rRight - rLeft;
    instanceHeight = rBottom - rTop;
    positionX = rLeft;
    positionY = rTop;
    let coordinate = {
      left: positionX,
      top: positionY,
      width: rRight - rLeft,
      height: rBottom - rTop,
    };
    //console.log(coordinate);
    drawBoxing('bbox', coordinate, '#000000', null);
  }
  const drawBoxing = (tool, coordinate, color, aId) => {
    canvas.remove(tempRect);
    let optionRect = {
      id: objId,
      tool: tool,
      color: color,
      left: coordinate.left,
      top: coordinate.top,
      width: coordinate.width,
      height: coordinate.height,
      strokeWidth: 2 * (1 / imgRatio),
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
    rect.on('selected', selectObject);
    rect.on('deselected', deselectObject);
    let optionTag = {
      id: objId,
      fill: '#ffffff',
      //textBackgroundColor: 'grey',
      fontFamily: 'Comic Sans',
      fontSize: 10 * (1 / imgRatio),
      visible: isTagOn,
    };
    /*let tag = new fabric.Text('human ' + objId, optionTag);

    tag.set('top', rect.top + rect.height / 2 - tag.height / 2);
    tag.set('left', rect.left + rect.width / 2 - tag.width / 2);*/
    /*ObjectListItem.push(rect);
    TagListItem.push(tag);*/
    canvas.add(rect);
    //canvas.add(tag);
    //this.fCanvas.setActiveObject(rect);
    /*InstanceListItem.push({
      id: objId, //category id
      tool: tool,
      cId: 0, //AnnotationListItem id
      className: 'human',
      gender: '',
      age: '',
      attrs: [],
    });
    //console.log(this.InstanceListItem);
    AnnotationListItem.push({
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
    });*/
    //console.log(this.AnnotationListItem);
    //this.setDataImage();
    objId++;
  }
  //**! polyline */
  const [isPolylineOn, setIsPolylineOnOff] = useState<boolean>(false);
  const checkIsPolyline = () => {
    resetTools();
    setIsPolylineOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolylineOn) {
      canvas.hoverCursor = "crosshair";
    }
  }, [isPolylineOn]);
  //**! polygon */
  const [isPolygonOn, setIsPolygonOnOff] = useState<boolean>(false);
  const checkIsPolygon = () => {
    resetTools();
    setIsPolygonOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolygonOn && canvas) {
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.on("mouse:down", handlePolygonDown);
      canvas.on("mouse:move", handlePolyItemMove);
      canvas.on("mouse:up", handlePolyItemUp);
    } else if(!isPolygonOn && canvas) {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    }
  }, [isPolygonOn]);
  const handlePolygonDown = (options: any) => {
    if(!canvas || isSelectObject) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "polygon", "#0084ff");
      } else {
        addPoint(options);
      }
    } else {
      toggleDrawPolygon(options);
    }
  };
  const handlePolyItemMove = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    if (drawMode) {
      if (activeLine && activeLine.type === 'line') {
        activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        const points = activeShape.get('points');
        points[pointArray.length] = {
          x: pointer.x,
          y: pointer.y,
        };
        activeShape.set({
          points,
        });
      }
      canvas.renderAll();
    }
  };
  const handlePolyItemUp = (options: any) => {
    if(!canvas || isSelectObject) return;
    isDragging = false;
    selection = true;
  };
  //**! point */
  const [isPointOn, setIsPointOnOff] = useState<boolean>(false);
  const checkIsPoint = () => {
    resetTools();
    setIsPointOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPointOn && canvas) {
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.on("mouse:down", handlePointDown);
      canvas.on("mouse:move", handlePointMove);
      canvas.on("mouse:up", handlePointUp);
    } else if(!isPointOn && canvas) {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    }
  }, [isPointOn]);
  const handlePointDown = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
  };
  const handlePointMove = (options: any) => {
    if(!canvas || !isDown || isSelectObject) return;
    let pointer = canvas.getPointer(options);
  };
  const handlePointUp = (options: any) => {
    if(!canvas || isSelectObject) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "point");
  };
  const drawPoints = (point: any, type: string) => {
    if(type === "point") {
      let optionPoint = {
        id: objId,
        radius: 4 / imgRatio,
        stroke: 'black',
        strokeWidth: 1 / imgRatio,
        color: '#ff0000',
        fill: '#ff0000',
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        //hasControls: false,
        cornerSize: 5 / imgRatio,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        selectable: true,
      };
      let boxingPoint = new fabric.Circle(optionPoint);
      boxingPoint.on('selected', selectObject);
      boxingPoint.on('deselected', deselectObject);
      canvas.add(boxingPoint);
      /*ObjectListItem.push(boxingPoint);
      //this.fCanvas.setActiveObject(polyItem);
      InstanceListItem.push({
        id: objId, //category id
        tool: 'point',
        cId: 0, //AnnotationListItem id
        className: 'human',
        gender: '',
        age: '',
        attrs: [],
      });
      //console.log(this.InstanceListItem);
      AnnotationListItem.push({
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
      });*/
      objId++;

    } else if (type === "autopoint") {
      let optionAutopoint = {
        id: objId,
        radius: 7 / imgRatio,
        stroke: 'black',
        strokeWidth: 1 / imgRatio,
        color: '#999999',
        fill: '#ffcc00',
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        hasControls: false,
        cornerSize: 5 / imgRatio,
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
        setRect();
      }
    }
  }
  //**! brush */
  const [isBrushOn, setIsBrushOnOff] = useState<boolean>(false);
  const checkIsBrush = () => {
    resetTools();
    setIsBrushOnOff((prev) => !prev);
  };
  const onCancelBrush = () => {
    setIsBrushOnOff(false);
  };
  //**! 3Dcube */
  const [is3DcubeOn, setIs3DcubeOnOff] = useState<boolean>(false);
  const checkIs3Dcube = () => {
    resetTools();
    setIs3DcubeOnOff((prev) => !prev);
  };
  const onCancel3Dcube = () => {
    setIs3DcubeOnOff(false);
  };
  //**! segment */
  const [isSegmentOn, setIsSegmentOnOff] = useState<boolean>(false);
  const checkIsSegment = () => {
    resetTools();
    setIsSegmentOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isSegmentOn && canvas) {
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.on("mouse:down", handleSegmentDown);
      canvas.on("mouse:move", handlePolyItemMove);
      canvas.on("mouse:up", handlePolyItemUp);
    } else if(!isSegmentOn && canvas) {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    }
  }, [isSegmentOn]);
  const handleSegmentDown = (options: any) => {
    if(!canvas || isSelectObject) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "segment", "#eecc55");
      } else {
        addPoint(options);
      }
    } else {
      toggleDrawPolygon(options);
    }
  };
  //**! keypoint */
  const [isKeypointOn, setIsKeypointOnOff] = useState<boolean>(false);
  const checkIsKeypoint = () => {
    resetTools();
    setIsKeypointOnOff((prev) => !prev);
  };
  const onCancelKeypoint = () => {
    setIsKeypointOnOff(false);
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
  /*const makeCircle = (left: number, top: number, line1: fabric.Line, line2: fabric.Line, line3: fabric.Line, line4: fabric.Line) => {
      let c = new fabric.Circle({
          id: 0,
          tool: 'keypoint',
          left: left,
          top: top,
          strokeWidth: 2,
          radius: 4,
          fill: '#fff',
          stroke: '#666',
          originX: 'center',
          originY: 'center',
      });
      c.hasControls = c.hasBorders = false;
      c.line1 = line1;
      c.line2 = line2;
      c.line3 = line3;
      c.line4 = line4;
      return c;
  };
  const makeLine = (coords: Array<number>) => {
      return new fabric.Line(coords, {
        tool: 'keypoint',
        fill: 'red',
        stroke: 'red',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
  };*/

  if (pId) {
    return (
      <LabelingPresenter
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
        saveData={saveData}
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
        />
    );
  }
  return null;
};

export default LabelingContainer;