/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ExtractedData = ({ extractedData, imageUrl }) => {
  const [packageDetails, setPackageDetails] = useState({
    carrier: null,
    weight: null,
  });

  useEffect(() => {
    extractedData.Blocks.forEach((block) => {
      if (block.BlockType === "WORD") {
        if (/FedEx/g.test(block.Text)) {
          setPackageDetails({
            ...packageDetails,
            carrier: "FedEx",
          });
        } else if (/UPS/g.test(block.Text)) {
          setPackageDetails({
            ...packageDetails,
            carrier: "UPS",
          });
        } else if (/FBA/g.test(block.Text)) {
          setPackageDetails({
            ...packageDetails,
            carrier: "Amazon FBA",
          });
        }
      }
    });
  }, [extractedData]);

  useEffect(() => {
    extractedData.Blocks.forEach((block) => {
      if (block.BlockType === "LINE") {
        if (/LB/gi.test(block.Text)) {
          setPackageDetails((packageDetails) => {
            return {
              ...packageDetails,
              weight: block.Text,
            };
          });
        }
      }
    });
  }, [extractedData]);

  return (
    <div className="flex flex-col  items-center mx-auto border w-[95%] max-w-[400px] rounded-lg">
      <div
        className="w-full h-[200px] rounded-lg"
        // style={{
        //   background: `url(${imageUrl})`,
        //   backgroundPosition: "center",
        //   backgroundSize: "cover",
        // }}
      ></div>

      <div className="flex flex-col">
        {extractedData.Blocks.map((block, i) => {
          if (block.BlockType === "QUERY") {
            if ("Relationships" in block) {
              return extractedData.Blocks.map((item, i) => {
                if (item.BlockType === "QUERY_RESULT") {
                  if (block.Relationships[0].Ids[0] === item.Id) {
                    return (
                      <span
                        className="mt-[10px] font-ptmono text-sm border-green-400 "
                        key={i}
                      >
                        <span className=" text-green-500">
                          {block.Query.Alias}
                        </span>
                        :{" "}
                        {block.Relationships[0].Ids[0] === item.Id
                          ? item.Text
                          : ""}
                      </span>
                    );
                  }
                }
              });
            }
          }
        })}
        <span className="font-ptmono text-sm">
          <span className="text-green-400">WEIGHT</span>:{" "}
          {packageDetails.weight}
        </span>
        <span className="font-ptmono text-sm">
          <span className="text-green-400">CARRIER:</span>{" "}
          {packageDetails.carrier}
        </span>
      </div>
    </div>
  );
};

export default ExtractedData;
