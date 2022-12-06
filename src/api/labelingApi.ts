import { WorkStatusType } from "../screens/studio/labeling/LabelingContainer";
import callApi, { AxiosResponseType } from "./module";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

//! autolabeling
export interface IAutoLabeling {
  
}

// ! labeling
export interface ILabeling {
  
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
  deleteAnnotation: (param: any, jwt?: string) =>
    callApi("post", "/task/annotation/delete", null, jwt, param, undefined),
  updateAnnotation: (param: any, payload: any, jwt?: string) =>
    callApi("post", "/task/annotation/update", payload, jwt, param, undefined),
  createAnnotation: (param: any, payload: any, jwt?: string) =>
    callApi("post", "/task/annotation/create", payload, jwt, param, undefined),
};
