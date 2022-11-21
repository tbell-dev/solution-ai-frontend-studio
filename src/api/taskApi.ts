import { WorkStatusType } from "../screens/studio/preprocessing/PreProcessingContainer";
import callApi, { AxiosResponseType } from "./module";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

//! Task에 할당되는 임의의 유저에 대한 interface
export interface ITaskCommonUser {
  id: string;
  displayName: string;
  email: string;
}

// ! Task interface
export interface ITask {
  taskId: number;
  imageName: string;
  image: string;
  imageThumbnail: string;
  taskStatus: number;
  taskStep?: number;
  taskStatusName: WorkStatusType | undefined;
  imageFormat: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  taskWorker?: ITaskCommonUser | null;
  taskValidator?: ITaskCommonUser | null;
  created?: number;
  updated?: number;
}

// eslint-disable-next-line
export default {
  searchTaskByProject: (param: any) =>
    callApi("get", "/task/search", null, undefined, param),
  getTaskData: (param: any, responseType: AxiosResponseType) =>
    callApi("get", "/task/data", null, undefined, param, responseType),
  updateTaskData: (param: IUpdateTaskParams, payload: FormData) =>
    callApi("post", "/task/data/update", payload, undefined, param, undefined),
  updateTask: (param: IUpdateTaskParams, payload: any) =>
    callApi("post", "/task/update", payload, undefined, param, undefined),
  createTask: (param: any, payload: FormData) =>
    callApi("post", "/task/create", payload, undefined, param, undefined),
};
