import { WorkStatusType } from "../screens/studio/labeling/LabelingContainer";
import callApi, { AxiosResponseType } from "./module";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

//! Task에 할당되는 임의의 유저에 대한 interface
export interface IAutoLabeling {
  id: string;
  displayName: string;
  email: string;
}

// ! Task interface
export interface ILabeling {
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
  created?: number;
  updated?: number;
}

// eslint-disable-next-line
export default {
  searchAnnotationByTask: (param: any) =>
  callApi("get", "/task/annotation/search", null, undefined, param),
  getAnnotation: (param: any) =>
    callApi("get", "/task/annotation", null, undefined, param),
  getOD: (param: any) =>
    callApi("get", "/ai/autolabeling", null, undefined, param),
  getIS: (param: any) =>
    callApi("get", "/ai/autolabeling", null, undefined, param),
  getSES: (param: any) =>
    callApi("get", "/ai/autolabeling", null, undefined, param),
  deleteAnnotation: (param: any) =>
    callApi("post", "/task/annotation/delete", null, undefined, param, undefined),
  updateAnnotation: (param: any, payload: any) =>
    callApi("post", "/task/annotation/update", payload, undefined, param, undefined),
  createAnnotation: (param: any, payload: any) =>
    callApi("post", "/task/annotation/create", payload, undefined, param, undefined),
};
