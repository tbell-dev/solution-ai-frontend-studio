import { Buffer } from "buffer";

/** dataURL을 받아서 Blob으로 변환한 파일을 리턴한다. */
const dataUrlToBlob = (dataURL: string) => {
  const blobBin = Buffer.from(dataURL.split(",")[1], "base64");
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin[i]);
  }
  const file = new Blob([new Uint8Array(array)], { type: "image/png" });
  return file;
};

/** Image와 Canvas를 받아서 Canvas에 해당 이미지를 이미지 크기에 맞춰서 그린 후 data url을 리턴한다. */
const getDataUrlByCanvasWithImg = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  const context = canvas.getContext("2d");
  if (img.width !== canvas.width) canvas.width = img.width;
  if (img.height !== canvas.height) canvas.height = img.height;
  if (!context) {
    throw new Error("canvas context invalid, check out please");
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img!, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};

export interface IParamTransform {
  scaleX: number;
  scaleY: number;
  transX: number;
  transY: number;
}

/** Image에 filter를 적용한 후 canvas의 data URL을 리턴한다. */
const getDataUrlWithFilter = (
  image: HTMLImageElement,
  filter?: string,
  transform?: IParamTransform
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  let dataURL = null;
  if (!context) {
    throw new Error("The context of the canvas is not allowcated");
  }
  if (image.width !== canvas.width) canvas.width = image.width;
  if (image.height !== canvas.height) canvas.height = image.height;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (filter) {
    context.filter = filter;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL();
    context.filter = "none";
  }
  if (transform) {
    context.transform(
      transform.scaleX,
      0,
      0,
      transform.scaleY,
      transform.transX,
      transform.transY
    );
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL();
  }
  return dataURL;
};

/** milliseconds -> YYYY.MM.DD 형식의 데이터로 전환 */
const getFormattedDate = (milliseconds: number): string => {
  const isoString = new Date(milliseconds).toISOString();
  return isoString.split("T")[0].replaceAll("-", ".");
};

/** 오늘날짜를 milliseconds로 반환 */
const getTodayMillisecondsDate = (): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};

/** 이번달 1일 milliseconds로 반환 */
const getFirstDayOfCurrentMonthMillisecondsDate = (): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
};

/** 몇 개월 전 후 오늘을 milliseconds로 반환
 * @param aMonth 전후 개월 수 (한달전이면 -1, 두달후면 2)
 */
const getTodayOfAMonthMillisecondsDate = (aMonth: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + aMonth,
    now.getDate()
  ).getTime();
};

/** 이번달 며칠 전 후 오늘을 milliseconds로 반환
 * @param aDay 전후 일 수 (하루전이면 -1, 일주일전이면 -6, 하루후면 1)
 */
const getADayOfCurrentMonthMillisecondsDate = (aDay: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + aDay
  ).getTime();
};

/** startAt, maxResults 값을 받은 page를 기반으로 리턴한다.
 * @param page 현재 페이지
 */
const setOffset = (
  page: number,
  count: number = 10
): { startAt: number; maxResults: number } => {
  const startAt = (page - 1) * count;
  const maxResults = count;
  return { startAt, maxResults };
};

export {
  dataUrlToBlob,
  getDataUrlByCanvasWithImg,
  getDataUrlWithFilter,
  getFormattedDate,
  getTodayMillisecondsDate,
  getFirstDayOfCurrentMonthMillisecondsDate,
  getTodayOfAMonthMillisecondsDate,
  getADayOfCurrentMonthMillisecondsDate,
  setOffset,
};
