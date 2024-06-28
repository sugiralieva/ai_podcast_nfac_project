const { S3 } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const s3 = new S3({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const uploadFile = async (bucketName, key, file) => {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: bucketName,
            Key: key,
            Body: file,
            ACL: 'public-read',
        }
    });

    try {
        const res = await upload.done();
        console.log(res);
    } catch (err) {
        console.log(`Error uploading file: ${err.Code}`);
    }
};

module.exports = { uploadFile };
