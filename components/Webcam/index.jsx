import React from "react";
import Webcam from "react-webcam";

const Camera = ({ constraints }) => {
  return (
    <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      className="w-[90%]  mx-auto rounded-lg mt-5"
      videoConstraints={constraints}
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
  );
};

export default Camera;
