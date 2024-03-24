const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function s3Upload(file) {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ACL: 'public-read',
  };

  return await s3Client.send(new PutObjectCommand(uploadParams));
}

module.exports = { s3Upload };
