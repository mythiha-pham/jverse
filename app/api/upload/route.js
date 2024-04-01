import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import uniqid from 'uniqid';

/* POST /api/upload
 * @param {FormData} req - the form data containing the file to upload
 * @returns {Response} - the response object
 */
export async function POST(req) {
  // retrieve form data
  const formData = await req.formData();
  // extract file from form data
  const file = formData.get('file');
  // extract file metadata
  const { name, type } = file;
  // read file content
  const data = await file.arrayBuffer();

  // create S3 client
  const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // generate unique name for uploaded file
  const id = uniqid();
  const extension = name.split('.').slice(-1)[0];
  const newName = `${id}.${extension}`;

  // upload file to S3 bucket
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Body: data,
    ACL: 'public-read',
    ContentType: type,
    Key: newName,
  });
  await s3client.send(uploadCommand);

  return Response.json({ name, extension, newName, id });
}
