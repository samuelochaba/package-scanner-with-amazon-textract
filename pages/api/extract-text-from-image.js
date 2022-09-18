import AWS from "aws-sdk";

export default async function extractText(req, res) {
  const { method, body } = req;
  if (method === "POST") {
    const textractData = await documentExtract(body.key);

    res.send(textractData);
  }
}

function documentExtract(key) {
  return new Promise((resolve) => {
    var textract = new AWS.Textract({
      region: process.env.S3_UPLOAD_REGION,
      endpoint: `https://textract.${process.env.S3_UPLOAD_REGION}.amazonaws.com/`,
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    });
    var params = {
      Document: {
        S3Object: {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Name: key,
        },
      },
      FeatureTypes: ["QUERIES"],
      QueriesConfig: {
        Queries: [
          {
            Text: "from",
            Alias: "FROM",
          },
          {
            Text: "to",
            Alias: "TO",
          },
          {
            Text: "ship date",
            Alias: "SHIP_DATE",
          },
          {
            Text: "dept",
            Alias: "DEPT",
          },
          {
            Text: "tracking #",
            Alias: "TRACKING #",
          },
          {
            Text: "billing",
            Alias: "BILLING",
          },
        ],
      },
    };

    textract.analyzeDocument(params, (err, data) => {
      if (err) {
        return resolve(err);
      } else {
        resolve(data);
      }
    });
  });
}
