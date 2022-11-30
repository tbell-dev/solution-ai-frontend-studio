import { WorkStatusType } from "../screens/studio/preprocessing/PreProcessingContainer";
import callApi, { AxiosResponseType } from "./module";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

export interface ITaskBatchPayload {
  originalDataURL: string;
  originalWidth: number;
  originalHeight: number;
}

export interface IUpdateTaskStatusParams {
  project_id: number;
  task_id: number;
}

//! Task에 할당되는 임의의 유저에 대한 interface
export interface ITaskCommonUser {
  id: string;
  displayName: string;
  email: string;
}

export interface IGetRejectCommentParams {
  project_id: number;
  task_id: number;
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
  imageSize?: number;
  taskWorker?: ITaskCommonUser | null;
  taskValidator?: ITaskCommonUser | null;
  created?: number;
  updated?: number;
}

// eslint-disable-next-line
export default {
  searchTaskByProject: (param: any, jwt?: string) =>
    callApi("get", "/task/search", null, jwt, param),
  getTaskData: (param: any, responseType: AxiosResponseType, jwt?: string) =>
    callApi("get", "/task/data", null, jwt, param, responseType),
  getTask: (param: any, jwt?: string) =>
    callApi("get", "/task", null, jwt, param),
  updateTaskData: (param: IUpdateTaskParams, payload: FormData, jwt?: string) =>
    callApi("post", "/task/data/update", payload, jwt, param, undefined),
  updateTaskStatus: (param: IUpdateTaskStatusParams, payload: any, jwt?: string) =>
    callApi("post", "/task/status/update", payload, jwt, param, undefined),
  updateTask: (param: IUpdateTaskParams, payload: any, jwt?: string) =>
    callApi("post", "/task/update", payload, jwt, param, undefined),
  createTask: (param: any, payload: FormData, jwt?: string) =>
    callApi("post", "/task/create", payload, jwt, param, undefined),
  getTaskRejectComment: (params: IGetRejectCommentParams, jwt?: string) =>
    callApi("get", "/task/comment/reject", undefined, jwt, params, undefined),
};
