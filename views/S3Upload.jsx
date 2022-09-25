/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useS3Upload } from "next-s3-upload";
import Webcam from "react-webcam";
import ExtractedData from "../components/ExtractedData";
import Header from "../components/Header";
// import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import axios from "axios";

const videoConstraints = {
  //   width: 90,
  //   height: 720,
  // facingMode: { exact: "environment" },
};

let dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export default function ExtractText() {
  let [imageUrl, setImageUrl] = useState();

  const [extractState, setExtractState] = useState({
    extractedData: null,
    extracted: false,
    analysing: null,
  });
  const [extractedImages, setExtractedImages] = useState([]);
  let { files, uploadToS3 } = useS3Upload();

  const { extracted, extractedData, analysing } = extractState;

  let uploadToS3AndExtract = async (img) => {
    let { bucket, key, url } = await uploadToS3(img);
    setImageUrl(url);
    setExtractState({
      ...extractState,
      analysing: true,
    });

    axios
      .post("/api/extract-text-from-image", {
        key,
        bucket,
      })
      .then(function (response) {
        setExtractState({
          ...extractState,
          extractedData: response.data,
        });
        setExtractedImages([...extractedImages, response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  console.log(extractedImages);

  return (
    <div>
      <Header text="Please scan each and every package that is being delivered at this building." />
      {files.length > 0 && files[files.length - 1].progress < 100 ? (
        <Loading text="Uploading  snap to s3 bucket..." />
      ) : files.length > 0 &&
        files[files.length - 1].progress === 100 &&
        analysing === true ? (
        <Loading text="Extracting text from image..." />
      ) : (
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-[90%]  mx-auto rounded-lg mt-5"
          videoConstraints={videoConstraints}
        >
          {({ getScreenshot }) => (
            <button
              className="mt-[10px] rounded-full mx-auto border border-green-400 flex items-center font-ptmono justify-center text-sm w-[50px] h-[50px] bg-blue-600 text-white p-[10px]"
              onClick={async () => {
                let img = getScreenshot();
                uploadToS3AndExtract(dataURLtoBlob(img));
              }}
            >
              Scan
            </button>
          )}
        </Webcam>
      )}

      {extractedImages.length > 0 &&
        extractedImages?.map((imageData, i) => {
          return (
            <ExtractedData
              key={i}
              extractedData={imageData}
              imageUrl={imageUrl}
            />
          );
        })}
    </div>
  );
}
