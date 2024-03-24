// awsConfig.js
const aws = require('aws-sdk');

// Configure AWS with your access and secret key.
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});

// Create an S3 instance that you can export and use in other parts of your application
const s3 = new aws.S3();

module.exports = s3;
