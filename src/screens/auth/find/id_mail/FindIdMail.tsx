import React, { useState } from "react";
// import ReactCrop, { Crop } from "react-image-crop";
// // import { Crop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
import styled from "styled-components";
import image from "../../../../assets/images/studio/file-list11.jpg";
// import userApi from "../../../../api/userApi";
// // import removeBg from '../../../../tensorflow';
// // import { getDataUrlByCanvasWithImg } from '../../../../utils';
// // import mergeImages from 'merge-images';
// // import api from '../../../../api';

// // var cv = require('opencv.js');
// // const Container = styled.div`
// //   display: flex;
// //   justify-content: center;
// //   align-items: center;
// // `;
const MainImage = styled.img`
  width: 400px;
  height: 400px;
`;
const Canvas = styled.canvas``;

// const FindIdMail = () => {
//   const go = async () => {
//     const res = await userApi.login({ user_id: "user02", user_password: "qwer02" });
//     if (res && res.status === 200)
//     console.log(res?.headers);
//   };
//   useEffect(() => {
//     go();
//   }, []);

//   // ! crop
//   const [crop, setCrop] = useState<Crop>();
//   const [showCropCanvas, setShowCropCanvas] = useState<boolean>(false);
//   const [croppedImage, setCroppedImage] = useState <string|null>(null);
//   // const handleCrop = (e) => {
//   //   if (crop) {
//   //     const cropCanvas = document.createElement("canvas") as HTMLCanvasElement;
//   //     const cropImage = document.getElementById("cropImage") as HTMLImageElement;
//   //     const scaleX = cropImage?.naturalWidth / cropImage?.width;
//   //     const scaleY = cropImage?.naturalHeight / cropImage?.height;
//   //     cropCanvas.width = crop.width;
//   //     cropCanvas.height = crop.height;
//   //     const ctx = cropCanvas.getContext("2d");
//   //     const pixelRatio = window.devicePixelRatio;
//   //     cropCanvas.width = crop.width * pixelRatio;
//   //     cropCanvas.height = crop.height * pixelRatio;
//   //     ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//   //     ctx?.imageSmoothingQuality = "high";

//   //     ctx?.drawImage(
//   //       cropImage,
//   //       crop.x * scaleX,
//   //       crop.y * scaleY,
//   //       crop.width * scaleX,
//   //       crop.height * scaleY,
//   //       0,
//   //       0,
//   //       crop.width,
//   //       crop.height
//   //     );
//   //     const base64Image = cropCanvas.toDataURL("image/png");
//   //     setCroppedImage(base64Image);
//   //   }
//   // };
//   return <ReactCrop
//   crop={crop}
//   onChange={(c) => setCrop(c)}
//   // onDragEnd={handleCrop}
// >
// </ReactCrop>
//   // const [src, setSrc] = useState();
//   // const handleAlphaBlending = () => {
//   //   // ! 이 부분이 Grayscale 적용시 필요한 부분
//   //   // let defaultImage = document.getElementById('defaultImage') as HTMLImageElement;
//   //   // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
//   //   // const context = canvas.getContext('2d');
//   //   // context!.filter = "grayscale(50%)";
//   //   // context?.drawImage(defaultImage!, 0, 0, canvas.width, canvas.height);
//   //   // console.log(canvas!.toDataURL());
//   //   // context!.filter = "none";
//   //   // ! END
//   //   // ! 밝기
//   //   // let defaultImage = document.getElementById(
//   //   //   'defaultImage'
//   //   // ) as HTMLImageElement;
//   //   // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
//   //   // let base = cv.imread(defaultImage);
//   //   // let cloned = base.clone();
//   //   // // let alpha = 0.4;
//   //   // // let beta = 0.3;
//   //   // // let gamma = 1;
//   //   // let dst = new cv.Mat();
//   //   // // // ! alpha is brighten
//   //   // // ! 앞에서부터 alpha, beta, gamma
//   //   // // ! 0.0 -> 0.99
//   //   // cv.addWeighted(base, 0, cloned, 1, 1, dst);
//   //   // cv.imshow(canvas, dst);
//   //   // cloned.delete();
//   //   // let img = document.getElementById('defaultImage');
//   //   // let canvas = document.getElementById('canvas');
//   //   // let base = cv.imread(img);
//   //   // let dst = new cv.Mat();
//   //   // console.log(base.cols, base.rows);
//   //   // let dsize = new cv.Size(300, 200);
//   //   // cv.resize(base, dst, dsize, 0, 0, cv.INTER_LINEAR);
//   //   // cv.imshow(canvas, dst);
//   //   /** canvas -> dataURL -> img src  */
//   //   // let img = document.getElementById("defaultImage") as HTMLImageElement;
//   //   // let canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   //   // const context = canvas.getContext('2d');
//   //   // if (img.width != canvas.width) canvas.width = img.width;
//   //   // if (img.height != canvas.height) canvas.height = img.height;
//   //   // context?.clearRect(0, 0, canvas.width, canvas.height);
//   //   // context?.drawImage(img!, 0, 0, canvas.width, canvas.height);
//   //   // let f = dataUrlToBlob(getDataUrlByCanvasWithImg(img, canvas))
//   //   //const canvas = document.createElement("canvas");
//   //   // const ctx = canvas.getContext("2d");
//   //   // if (img.width != canvas.width) canvas.width = img.width;
//   //   // if (img.height != canvas.height) canvas.height = img.height;
//   //   // if (ctx) {
//   //   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   //   //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//   //   // } else {
//   //   //   throw new Error("canvas context invalid, check please");
//   //   // }
//   //   // setSrc(URL.createObjectURL(f));
//   //   // let base = cv.imread(img);
//   //   // let dst = new cv.Mat();
//   //   // const reader = new FileReader();
//   //   // reader.readAsDataURL(f);
//   //   // reader.onload = () => {
//   //   //   setSourceImage(reader.result);
//   //   // };
//   // };
//   // // ! blobImage
//   // // const blobImage = (dataURL: string) => {
//   // //   // const blobBin = atob(dataURL.split(',')[1]);
//   // //   // const array = [];
//   // //   // for (let i = 0; i < blobBin.length; i++) {
//   // //   //   array.push(blobBin.charCodeAt(i));
//   // //   // }
//   // //   // const file = new Blob([new Uint8Array(array)], {type: "image/png"});
//   // //   // return file;
//   // //   const blobBin = Buffer.from(dataURL.split(',')[1], 'base64')
//   // //   const array = [];
//   // //   for (let i = 0; i < blobBin.length; i++) {
//   // //     array.push(blobBin[i])
//   // //   }
//   // //   const file = new Blob([new Uint8Array(array)], {type: 'image/png'});
//   // //   return file;
//   // // }
//   // // const blobImage = (dataURL: string) => {
//   // //   const blobBin = Buffer.from(dataURL.split(",")[1], "base64");
//   // //   const array = [];
//   // //   for (let i = 0; i < blobBin.length; i++) {
//   // //     array.push(blobBin[i]);
//   // //   }
//   // //   const file = new Blob([new Uint8Array(array)], { type: "image/png" });
//   // //   return file;
//   // // };
//   // // ! crop
//   // // const [crop, setCrop] = useState<Crop>();
//   // // const [showCropCanvas, setShowCropCanvas] = useState < boolean > false;
//   // // const [croppedImage, setCroppedImage] = (useState < string) | (null > null);
//   // // const handleCrop = (e) => {
//   // //   if (crop) {
//   // //     const cropCanvas = document.createElement("canvas");
//   // //     const cropImage = document.getElementById("cropImage");
//   // //     const scaleX = cropImage.naturalWidth / cropImage.width;
//   // //     const scaleY = cropImage.naturalHeight / cropImage.height;
//   // //     cropCanvas.width = crop.width;
//   // //     cropCanvas.height = crop.height;
//   // //     const ctx = cropCanvas.getContext("2d");
//   // //     const pixelRatio = window.devicePixelRatio;
//   // //     cropCanvas.width = crop.width * pixelRatio;
//   // //     cropCanvas.height = crop.height * pixelRatio;
//   // //     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//   // //     ctx.imageSmoothingQuality = "high";

//   // //     ctx?.drawImage(
//   // //       cropImage,
//   // //       crop.x * scaleX,
//   // //       crop.y * scaleY,
//   // //       crop.width * scaleX,
//   // //       crop.height * scaleY,
//   // //       0,
//   // //       0,
//   // //       crop.width,
//   // //       crop.height
//   // //     );
//   // //     const base64Image = cropCanvas.toDataURL("image/png");
//   // //     setCroppedImage(base64Image);
//   // //   }
//   // // };
//   // // const handleCrop = (e: PointerEvent) => {
//   // //   if (crop) {
//   // //     const cropCanvas = document.createElement("canvas") as HTMLCanvasElement;
//   // //     const cropImage = document.getElementById("cropImage") as HTMLImageElement;
//   // //     const scaleX = cropImage.naturalWidth / cropImage.width;
//   // //     const scaleY = cropImage.naturalHeight / cropImage.height;
//   // //     cropCanvas.width  = crop.width;
//   // //     cropCanvas.height = crop.height;
//   // //     const ctx = cropCanvas.getContext('2d');
//   // //     const pixelRatio = window.devicePixelRatio;
//   // //     cropCanvas.width = crop.width * pixelRatio;
//   // //     cropCanvas.height = crop.height * pixelRatio;
//   // //     ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//   // //     ctx!.imageSmoothingQuality = 'high';

//   // //     ctx?.drawImage(cropImage, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
//   // //     const base64Image = cropCanvas.toDataURL('image/png');
//   // //     setCroppedImage(base64Image);
//   // //   }
//   // // }

//   // const [removedBgImage, setRemovedBgImage] = useState<any>(null);
//   // const [sourceImage, setSourceImage] = useState<any>(null);
//   // const [loading, setLoading] = useState<boolean>(false);

//   // const handleRemoveBackground = async () => {
//   //   setLoading(true);
//   //   if (sourceImage) {
//   //     await removeBg(sourceImage, (result) => setRemovedBgImage(result));
//   //   }
//   //   setLoading(false);
//   // };

//   // // const removeBg = async (imgSrc: string) => {

//   // //   setLoading(true);
//   // //   if (news) {
//   // //     const img = new Image();
//   // //     img.src = news;
//   // //     img.onload = async () => {
//   // //       const canvas = document.createElement("canvas");
//   // //       const ctx = canvas.getContext("2d");
//   // //       canvas.width = img.width;
//   // //       canvas.height = img.height;
//   // //       ctx!.drawImage(img, 0, 0);
//   // //       const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
//   // //       const data = imageData.data;

//   // //       const net = await bodyPix.load({
//   // //         architecture: "MobileNetV1",
//   // //         outputStride: 16,
//   // //         multiplier: 0.75,
//   // //         quantBytes: 2,
//   // //       });
//   // //       const { data: map } = await net.segmentPerson(canvas, {
//   // //         internalResolution: 'full',
//   // //       });
//   // //       for (let i = 0; i < map.length; i++) {
//   // //         const [r, g, b, a] = [
//   // //           data[i * 4],
//   // //           data[i * 4 + 1],
//   // //           data[i * 4 + 2],
//   // //           data[i * 4 + 3],
//   // //         ];
//   // //         if (map[i] === 0) {
//   // //           data[i * 4] = 0;
//   // //           data[i * 4 + 1] = 0;
//   // //           data[i * 4 + 2] = 0;
//   // //           data[i * 4 + 3] = 0;
//   // //         }
//   // //       }
//   // //       ctx!.putImageData(imageData, 0, 0);
//   // //       const newImage = new Image();
//   // //       newImage.src = canvas.toDataURL();
//   // //       setRemovedBgImage(newImage)

//   // //     }
//   // //     // console.log(imgSrc);
//   // //     // await removeBGTF(
//   // //     //   {
//   // //     //     imgSrc,
//   // //     //     internalResolution: "low",
//   // //     //   },
//   // //     //   function(result) {
//   // //     //     console.log(result);
//   // //     //     setRemovedBgImage(result);
//   // //     //   }
//   // //     // );
//   // //   }
//   // //   setLoading(false);
//   // // };
//   // // console.log('Using TensorFlow backend: ', tf);
//   // useEffect(() => {
//   //   tf.getBackend();
//   // }, []);
//   // const [mergeImageSrc, setMergeImageSrc] = useState<string | null>(null);
//   // const gaussianBlur = async () => {
//   //   let img = document.getElementById("defaultImage") as HTMLImageElement;
//   //   let clonedCanvas = document.createElement("canvas");
//   //   const imgSrc = getDataUrlByCanvasWithImg(img, clonedCanvas);

//   //   let canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   //   let base = cv.imread(img);
//   //   let dst = new cv.Mat();
//   //   let dsize = new cv.Size(45, 45);
//   //   // Rect (x, y, width, height)
//   //   //let rect = new cv.Rect(1, 2, 3, 4);

//   //   cv.GaussianBlur(
//   //     base.roi(new cv.Rect(250, 90, 90, 90)),
//   //     dst,
//   //     dsize,
//   //     0,
//   //     0,
//   //     cv.BORDER_DEFAULT
//   //   );
//   //   // cv.addWeighted(base, 0, dst, 1, 1, realdst);
//   //   cv.imshow(canvas, dst);

//   //   const newImage = new Image();
//   //   newImage.src = canvas.toDataURL();

//   //   console.log(img.src);

//   //   await mergeImages([
//   //     { src: imgSrc, x: 0, y: 0 },
//   //     { src: newImage.src, x: 250, y: 90 },
//   //   ]).then((b64) => {
//   //     console.log(b64);
//   //     setMergeImageSrc(b64);
//   //   });

//   //   // ! Download image
//   //   // const a = document.createElement('a');
//   //   // a.setAttribute("download", "blur.png");
//   //   // a.setAttribute("href", canvas.toDataURL());
//   //   // a.click();
//   // };
//   // const [cropBlurPart, setCropBlurPart] = useState<Crop>();
//   // const handleCrop = async () => {
//   //   if (cropBlurPart) {
//   //     let img = document.getElementById("defaultImage") as HTMLImageElement;
//   //     let clonedCanvas = document.createElement("canvas");
//   //     const imgSrc = getDataUrlByCanvasWithImg(img, clonedCanvas);

//   //     let canvas = document.createElement("canvas") as HTMLCanvasElement;
//   //     let base = cv.imread(img);
//   //     let dst = new cv.Mat();
//   //     let dsize = new cv.Size(5, 5);
//   //     // Rect (x, y, width, height)
//   //     //let rect = new cv.Rect(1, 2, 3, 4);

//   //     cv.GaussianBlur(
//   //       base.roi(
//   //         new cv.Rect(
//   //           cropBlurPart.x,
//   //           cropBlurPart.y,
//   //           cropBlurPart.width,
//   //           cropBlurPart.height
//   //         )
//   //       ),
//   //       dst,
//   //       dsize,
//   //       255,
//   //       255,
//   //       cv.BORDER_DEFAULT
//   //     );
//   //     // cv.addWeighted(base, 0, dst, 1, 1, realdst);
//   //     cv.imshow(canvas, dst);

//   //     const newImage = new Image();
//   //     newImage.src = canvas.toDataURL();

//   //     console.log(img.src);

//   //     await mergeImages([
//   //       { src: imgSrc, x: 0, y: 0 },
//   //       { src: newImage.src, x: cropBlurPart.x, y: cropBlurPart.y },
//   //     ]).then((b64) => {
//   //       console.log(b64);
//   //       setMergeImageSrc(b64);
//   //     });
//   //   }
//   // };

//   // const noiseRemove = () => {
//   //   let img = document.getElementById("defaultImage") as HTMLImageElement;
//   //   let canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   //   let base = cv.imread(img);
//   //   let dst = new cv.Mat();
//   //   // cv.bilateralFilter(base, dst, -1, 10, 5);
//   //   cv.medianBlur(base, dst, 1);
//   //   cv.imshow(canvas, dst);
//   // };

// const test = () => {
//   let defaultImage = document.getElementById('defaultImage') as HTMLImageElement;
//   let canvas = document.createElement('canvas') as HTMLCanvasElement;
//   const context = canvas.getContext('2d');
//   context!.filter = "grayscale(100%)";
//   context?.drawImage(defaultImage!, 0, 0, canvas.width, canvas.height);
//   console.log(canvas!.toDataURL());
//   context!.filter = "none";
// }

//   // const [binary, setBinary] = useState<any>();
//   // const getTaskData = async () => {
//   //   const res = await api.getTaskData({project_id: 4, task_id: 1}, "blob");
//   //   const blob = res?.data;
//   //   const reader = new FileReader();
//   //   reader.readAsDataURL(blob);
//   //   reader.onloadend = () => {
//   //     setBinary(reader.result);
//   //   }
//   //   // const res = await fetch("http://210.113.122.196:8826/rest/api/1/task/data?project_id=4&task_id=1");
//   //   // const blob = await res.blob();
//   //   // const reader = new FileReader();
//   //   // reader.readAsDataURL(blob);
//   //   // reader.onloadend = () => {
//   //   //   setBinary(reader.result);
//   //   // }

//   // }

//   // useEffect(() => {
//   //   getTaskData();
//   // })

//   // <Container>
//   //   {/* <input
//   //     type={"file"}
//   //     onChange={(e) => {
//   //       const file = e.target.files![0];
//   //       console.log("this is file ---> " + file);
//   //       const reader = new FileReader();
//   //       reader.readAsDataURL(file);
//   //       reader.onload = () => {
//   //         console.log("this is result ---> " + reader.result);
//   //       };
//   //     }}
//   //   /> */}

//   //   {/* <input type={"range"} onMouseUp={handleAlphaBlending} /> */}
//   //   {/* <ReactCrop
//   //     crop={cropBlurPart}
//   //     onChange={(c) => setCropBlurPart(c)}
//   //     onDragEnd={handleCrop}
//   //   >
//   //     <Img
//   //       id={"defaultImage"}
//   //       style={{ filter: "blur(4px)" }}
//   //       src={require("../../../../assets/images/studio/file-list11.jpg")}
//   //       onClick={gaussianBlur}
//   //     />
//   //   </ReactCrop> */}
//   //   {/* <Img
//   //     id={"defaultImage"}
//   //     src={require("../../../../assets/images/studio/file-list11.jpg")}
//   //     onClick={gaussianBlur}
//   //   /> */}
//   //   {binary && <Img src={binary} />}
//   //   <Img
//   //     id={"defaultImage"}
//   //     // style={{ filter: "blur(4px)" }}
//   //     src={require("../../../../assets/images/studio/file-list11.jpg")}
//   //     onClick={test}
//   //   />
//   //   <Canvas id={"canvas"} />
//   //   {mergeImageSrc && <Img id={"mergeImage"} src={mergeImageSrc} />}
//   //   {src && <Img src={src} />}
//   //   {removedBgImage && <Img src={removedBgImage.src} />}
//   //   {loading && <h1>Loading!!</h1>}
//   //   <button onClick={async () => await handleRemoveBackground()}>
//   //     removebg
//   //   </button>
//   //   {/* {!croppedImage && <ReactCrop crop={crop} onChange={c => setCrop(c)} onDragEnd={handleCrop}>
//   //     <Img id={"cropImage"} src={require("../../../../assets/images/studio/file-list11.jpg")} />
//   //   </ReactCrop>}
//   //   {croppedImage && <Img src={croppedImage} />} */}
//   // </Container>
// };

const FindIdMail = () => {
  const [cURL, setCURL] = useState<string | null>(null);
  const translate = () => {
    let mainImage = document.getElementById("mainImage") as HTMLImageElement;
    let canvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (mainImage.width !== canvas.width) canvas.width = mainImage.width;
    if (mainImage.height !== canvas.height) canvas.height = mainImage.height;
    context!.clearRect(0, 0, canvas.width, canvas.height);
    //context!.translate(100, 100);
    context!.scale(1.05, 1);
    context!.drawImage(mainImage!, 0, 0, canvas.width, canvas.height);
    setCURL(canvas.toDataURL());
  };
  return (
    <>
      <MainImage
        src={cURL ? cURL : image}
        style={{ backgroundColor: "black" }}
        id={"mainImage"}
        onClick={translate}
      />
      <Canvas id={"canvas"} />
    </>
  );
};

export default FindIdMail;
