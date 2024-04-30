import { S3Client } from '@aws-sdk/client-s3';
import { TranscribeClient } from '@aws-sdk/client-transcribe';

// create S3 client
export const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// create an Amazon Transcribe service client
export const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* clean up the transcription items by concatenating the content of adjacent items into a single item
 * e.g., [{ start_time: '0.0', end_time: '1.0', alternatives: [{ content: 'Hello' }] }, { start_time: '1.0', end_time: '2.0', alternatives: [{ content: 'world' }] }], [{ start_time: '', end_time: '', alternatives: [{ content: '!' }] } => [{ start_time: '0.0', end_time: '2.0', content: 'Hello world!' }]
 * @param {Array} items - an array of transcription items
 * @returns {Array} - an array of cleaned-up transcription items
 */
export function cleanUpTranscription(items) {
  // store cleaned-up contents
  const contents = [];
  // store current content being processed
  let currentContent = '';
  // store the default start time for the current content
  let start_time_default = '';

  items.forEach((item, key) => {
    // remove the item if it has no start_time
    if (!item.start_time) {
      delete items[key];
      return;
    }
    // get the content of the current item
    const { content } = item.alternatives[0];
    // if the current content is empty, set the default start time to the start_time of the current item
    if (!currentContent) {
      start_time_default = item.start_time;
    }

    // concatenate the content of the current item with the current content
    currentContent += (currentContent ? ' ' : '') + content;

    // if the next item has no start_time or it is the last item in the array, add the current content to the contents array
    if (key === items.length - 1 || !items[key + 1].start_time) {
      contents.push({
        start_time: start_time_default,
        end_time: item.end_time,
        content: currentContent += items[key + 1].alternatives[0].content,
      });
      // reset the current content and default start time for the next content
      currentContent = '';
      start_time_default = '';
    }
  });

  return contents;
}

/* convert a time string in seconds to a formatted string representing the time in HH:MM:SS,MS format
 * each component (hours, minutes, seconds, and milliseconds) is formatted to have at least 2 digits (for hours, minutes, and seconds) and 3 digits (for milliseconds)
 * @param {String} timeString - a time string in seconds
 * @returns {String} - a formatted time string in HH:MM:SS,MS format
 */
function secondsToHHMMSSMSFormat(timeString) {
  const totalSeconds = parseFloat(timeString);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (num, size) => {
    let s = num.toString();
    while (s.length < size) s = `0${s}`;
    return s;
  };

  return (
    `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 3)}`
  );
}

/* convert an array of transcription items to an SRT formatted string
 * an SRT file is a text file that contains the subtitles of a video
 * each subtitle is a block of text that is separated from the next subtitle by a blank line
 * each subtitle block contains:
 *  - a sequence number
 *  - a time interval during which the subtitle should be displayed
 *  - the text of the subtitle
 * the time interval is formatted as follows: HH:MM:SS,MS --> HH:MM:SS,MS
 * where HH is the number of hours, MM is the number of minutes, SS is the number of seconds, and MS is the number of milliseconds
 * the sequence number is an integer that starts at 1 and increments by 1 for each subtitle
 * the time interval and text of each subtitle are separated by a blank line
 * the text of each subtitle is separated from the next subtitle by a blank line
 * @param {Array} items - an array of transcription items
 * @returns {String} - an SRT formatted string
 */
export function transcriptionItemsToSrt(items) {
  // Map each item to its corresponding SRT format
  const srtItems = items.filter(item => !!item).map((item, index) => {
    // Generate the SRT format for the current item
    const seq = index + 1;
    const { start_time, end_time, content } = item;
    const timestamps = `${secondsToHHMMSSMSFormat(start_time)} --> ${secondsToHHMMSSMSFormat(end_time)}`;
    return `${seq}\n${timestamps}\n${content}\n\n`;
  });

  // Concatenate all SRT items into a single string
  return srtItems.join('');
}

/* convert a stream to a string
 * @param {ReadableStream} stream - the stream to convert
 * @returns {Promise} - the string
 */
export async function streamToString(stream) {
  // create an array to store the chunks of data received from the stream
  const chunks = [];

  // return a promise to handle the asynchronous nature of working with streams
  return new Promise((resolve, reject) => {
    // listen for the 'data' event emitted by the stream
    stream.on('data', (chunk) => {
      // When data is received, convert it to a Buffer and push it into the chunks array
      chunks.push(Buffer.from(chunk));
    });

    // listen for the 'end' event emitted by the stream, indicating that all data has been received
    stream.on('end', () => {
      // concatenate all the buffered chunks into a single Buffer and convert it to a UTF-8 encoded string
      const concatenatedBuffer = Buffer.concat(chunks);
      const result = concatenatedBuffer.toString('utf8');

      // resolve the promise with the resulting string
      resolve(result);
    });

    // Listen for any errors that occur during the streaming process
    stream.on('error', (err) => {
      // If an error occurs, reject the promise with the error object
      reject(err);
    });
  });
}
