/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useS3Upload } from "next-s3-upload";
import Webcam from "react-webcam";
import ExtractedData from "../components/ExtractedData";
import Header from "../components/Header";

const videoConstraints = {
  //   width: 90,
  //   height: 720,
  facingMode: { exact: "environment" },
};

export default function ExtractText() {
  let [imageUrl, setImageUrl] = useState();
  const [extractedData, setExtractedData] = useState(null);
  const [extracted, setExtracted] = useState(false);
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let uploadToS3AndExtract = async (img) => {
    let { bucket, key, url } = await uploadToS3(img);
    setImageUrl(url);
    fetch("/api/extract-text-from-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        bucket,
      }),
    }).then((data) => {
      data.json().then((res) => setExtractedData(res));
    });
  };

  useEffect(() => {
    if (extractedData) {
      if (extractedData.Blocks.length > 0) {
        setExtracted(true);
      }
    }
  }, [extractedData]);

  return (
    <div>
      <Header text="Please scan each and every package that is being delivered at this building." />
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
              uploadToS3AndExtract(img);
            }}
          >
            Scan
          </button>
        )}
      </Webcam>

      {extracted && (
        <ExtractedData extractedData={extractedData} imageUrl={imageUrl} />
      )}
    </div>
  );
}
