/* eslint-disable no-console */
const path = require("path");
const s3 = require("s3-client");

const { AWS } = s3;
const PRODUCTION_BRANCH = "main";

const isProduction = process.env.NODE_ENV === PRODUCTION_BRANCH;
const bucket = isProduction
  ? process.env.PRODUCTION_BUCKET
  : process.env.STAGING_BUCKET;

function invalidateCloudFront() {
  console.log("Invalidate CloudFront");
  try {
    const cloudfront = new AWS.CloudFront();
    var params = {
      DistributionId: process.env.CLOUD_FRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: String(new Date().getTime()),
        Paths: {
          Quantity: 1,
          Items: ["/"],
        },
      },
    };
    cloudfront.createInvalidation(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function upload(s3Options) {
  const client = s3.createClient({ s3Options });
  const params = {
    localDir: path.resolve(process.cwd(), "dist"),
    s3Params: {
      Bucket: bucket,
    },
  };

  const uploader = client.uploadDir(params);
  uploader.on("error", (err) => {
    console.error(`Unable to sync with ${bucket}:`, err.stack);
    process.exit(1);
  });

  uploader.on("end", () => {
    console.log("Upload completed");
    if (isProduction) {
      invalidateCloudFront();
    }
  });
}

const awsConfig = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
});

upload(awsConfig);
