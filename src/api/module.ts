import axios, { AxiosRequestHeaders } from "axios";

export type AxiosResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

const callApi = async (
  method: string,
  path: string,
  data?: any,
  jwt?: string,
  params?: any,
  responseType?: AxiosResponseType
) => {
  let headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
  };
  // ? 인증을 jwt로 할지 뭔지는 아직 모르겠으나, 추후에 변경하면 됩니다
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  // const baseUrl = "https://sslo.ai/rest/api/1";
  const baseUrl = "http://sslo.ai:8859/rest/api/1";
  const requestUrl = `${baseUrl}${path}`;

  // ! method ===> GET | DELETE
  if (method === "get" || method === "delete") {
    if (params && responseType) {
      return axios[method](requestUrl, { headers, params, responseType });
    }
    if (params && !responseType) {
      return axios[method](requestUrl, { headers, params });
    }
    if (!params && responseType) {
      return axios[method](requestUrl, { headers, responseType });
    }
    return axios[method](requestUrl, { headers });
  }
  // ! method ===> POST | PUT
  if (method === "post" || method === "put") {
    if (params && data) {
      return axios[method](requestUrl, data, { headers, params });
    }
    if (!params && data) {
      return axios[method](requestUrl, data, { headers });
    }
  }
};

export default callApi;
