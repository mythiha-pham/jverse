import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from '@aws-sdk/client-transcribe';
import { streamToString } from '../../../libs/TranscriptionHelper';

/* These following codes are adapted from the AWS SDK for JavaScript documentation.
 * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/transcribe-examples-section.html
 *create an Amazon Transcribe service client object
 * @returns {TranscribeClient} - the service client object
 */
function createClient() {
  return new TranscribeClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

/* create a new transcription command
 * @param {String} filename - the name of the file to transcribe
 * @returns {StartTranscriptionJobCommand} - the transcription command
 */
function startTranscriptionCommand(filename) {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: filename,
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: `s3://${process.env.BUCKET_NAME}/${filename}`,
    },
    OutputKey: `${filename}.transcription`,
    OutputBucketName: process.env.BUCKET_NAME,
  });
}

/* create a new transcription job for the specified file
 * @param {String} filename - the name of the file to transcribe
 * @returns {Promise} - the transcription job
 */

async function createTranscriptionJob(filename) {
  const transcribeClient = createClient();
  const transcriptionCommand = startTranscriptionCommand(filename);
  return transcribeClient.send(transcriptionCommand);
}

/* get the status of a transcription job
 * @param {String} filename - the name of the file to transcribe
 * @returns {Promise} - the transcription job status
 */
async function getJobStatus(filename) {
  const transcribeClient = createClient();
  let jobStatusResult = null;
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: filename,
    });
    jobStatusResult = await transcribeClient.send(transcriptionJobStatusCommand);
  } catch (e) {
    console.error(e);
  }
  return jobStatusResult;
}

/* grab ready transcription file
 * @param {String} filename - the name of the file to transcribe
 * @returns {Promise} - the transcription file
 */
async function getTranscriptionFile(filename) {
  const transcriptionFile = `${filename}.transcription`;
  const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: transcriptionFile,
  });
  let transcriptionFileResponse = null;
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand);
  } catch (e) {
    console.error(e);
  }
  if (transcriptionFileResponse) {
    return JSON.parse(await streamToString(transcriptionFileResponse.Body));
  }
  return null;
}

/* GET request to /api/transcribe
 * @param {Request} req - the incoming request
 * @returns {Response} - the response
 */
export async function GET(req) {
  // Parse the request URL to extract query parameters
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get('filename');

  // Check if transcription is already completed
  const transcription = await getTranscriptionFile(filename);
  if (transcription) {
    // Return JSON response with completed status and transcription
    return Response.json({
      status: 'COMPLETED',
      transcription,
    });
  }
  // Check if already transcribing
  const existingJob = await getJobStatus(filename);

  if (existingJob) {
    // Return JSON response with status of existing transcription job
    return Response.json({
      status: existingJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }
  // Create new transcription job if there is no job running
  if (!existingJob) {
    const newJob = await createTranscriptionJob(filename);
    // Return JSON response with status of new transcription job
    return Response.json({
      status: newJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }
  // Return null response if no action taken
  return Response.json(null);
}
