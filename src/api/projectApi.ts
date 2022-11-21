import callApi from "./module";

export interface IGetAllProjectsParams {
  startAt?: number;
  maxResults?: number;
  project_name?: string;
  created_start?: number;
  created_end?: number;
}

/** 1: 수집, 2: 정제/전처리, 3: 가공 */
export interface IPType {
  project_type_id: number;
  project_type_name: string;
  created: number;
}

export interface IProject {
  pNo: number;
  pName: string;
  pType: IPType;
  pWorkerCount: any;
  pCreated: number;
}

export interface IGetProjectParam {
  project_id: number;
}

export interface IProjectInfo {
  projectId: number;
  projectName: string;
}

export interface IAnnotationAttribute {
  annotation_category_attr_name: string;
  annotation_category_attr_desc?: string;
  annotation_category_attr_type: number;
  annotation_category_attr_val?: string[];
  annotation_category_attr_limit_min?: number;
  annotation_category_attr_limit_max?: number;
}

export interface IProjectAnnotation {
  annotation_category_name: string;
  annotation_category_parent_id?: number;
  annotation_category_color: string;
  annotation_category_attributes?: IAnnotationAttribute[];
}

export interface ICreatePcrawlPayload {
  project_name: string;
  project_desc: string;
  project_manager: {
    user_id: string;
  };
  project_type: {
    project_type_id: number;
  };
  project_detail?: {
    data_type?: number;
    dataset_ids?: number[];
    crawling_channel_type?: string;
    crawling_keywords?: string[];
    crawling_period_type?: number;
    crawling_period_start?: number;
    crawling_period_end?: number;
    crawling_limit?: number;
    project_categories?: IProjectAnnotation[];
  };
}

// eslint-disable-next-line
export default {
  getAllProjects: (params: IGetAllProjectsParams) =>
    callApi("get", "/project/search", null, undefined, params),
  getProject: (param: IGetProjectParam) =>
    callApi("get", "/project", null, undefined, param),
  createProject: (payload: ICreatePcrawlPayload) =>
    callApi("post", "/project/create", payload, undefined, null),
};
