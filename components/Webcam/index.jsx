/* eslint-disable @next/next/no-img-element */
import React from "react";
import Webcam from "react-webcam";
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

const Camera = ({ constraints, uploadToS3AndExtract }) => {
  const selfieRef = React.useRef();
  const imagesRef = React.useRef();
  const [camState, setCamState] = React.useState({
    selfieImage: "",
    labelImage: "",
  });

  const { selfieImage, labelImage } = camState;

  const snapAndScan = (label) => {
    imagesRef.current = label;
    selfieRef.current.click();
    uploadToS3AndExtract(dataURLtoBlob(label));
  };

  return (
    <>
      <div className="h-[35vh] flex items-center justify-center text-center relative overflow-hidden   w-[90vw] mx-auto rounded-tl-lg rounded-tr-lg mt-5">
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            // facingMode: {
            //   exact: "environment",
            // },
            facingMode: "user",
          }}
          className="absolute left-0 top-0 object-cover h-full w-full"
        >
          {({ getScreenshot }) => (
            <button
              ref={selfieRef}
              className="hidden mt-[10px] rounded-full mx-auto border border-green-400 items-center font-ptmono justify-center text-sm w-[50px] h-[50px] bg-blue-600 text-white p-[10px]"
              onClick={async () => {
                let img = getScreenshot();
                setCamState({
                  ...camState,
                  selfieImage: img,
                  labelImage: imagesRef.current,
                });
              }}
            >
              Scan
            </button>
          )}
        </Webcam>
      </div>
      <div className=" h-[35vh] w-[90vw] flex items-center  overflow-hidden justify-center text-center relative mx-auto rounded-bl-lg rounded-br-lg">
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          className="absolute left-0 top-0 rounded-bl-lg object-cover h-full w-full"
          videoConstraints={{
            facingMode: {
              exact: "environment",
            },
            // facingMode: "user",
          }}
        >
          {({ getScreenshot }) => (
            <button
              className="absolute rounded-full mx-auto border border-green-400 flex items-center font-ptmono justify-center text-sm w-[50px] h-[50px] bg-blue-600 text-white p-[10px] bottom-5"
              onClick={async () => {
                snapAndScan(getScreenshot());
              }}
            >
              Scan
            </button>
          )}
        </Webcam>
      </div>
    </>
  );
};

export default Camera;
