/* eslint-disable no-console */
const path = require("path");
const s3 = require("s3-client");

const config = require("../config");
const { AWS } = s3;
const PRODUCTION_BRANCH = "production";

function invalidateCloudFront() {
  console.log("Invalidate CloudFront");
  try {
    const cloudfront = new AWS.CloudFront();
    var params = {
      DistributionId: config.get("aws.cloudFrontDistributionId"),
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
      // Prefix: "some/remote/dir/",
      Bucket: config.get("aws.bucket"),
    },
  };

  const uploader = client.uploadDir(params);
  uploader.on("error", (err) => {
    console.error(
      `Unable to sync with ${config.get("aws.bucket")}:`,
      err.stack
    );
    process.exit(1);
  });

  uploader.on("end", () => {
    console.log("Upload completed");
    if (config.get("env") === PRODUCTION_BRANCH) {
      invalidateCloudFront();
    }
  });
}

const awsConfig = new AWS.Config({
  accessKeyId: config.get("aws.accessId"),
  secretAccessKey: config.get("aws.accessSecret"),
  region: "ap-northeast-1",
});

upload(awsConfig);
