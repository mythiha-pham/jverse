/* concatenate the content of an item with missing start_time property to the content of the previous item.
 * remove the current item from the array if it has no start_time.
 * map the modified items into a new array containing only the start_time, end_time, and content properties.
 * @param {Array} items - an array of transcription items
 * @returns {Array} - an array of transcription items with no missing start_time properties
 */
export function cleanUpTranscription(items) {
  items.forEach((item, key) => {
    if (!item.start_time) {
      const prev_item = items[key - 1];
      prev_item.alternatives[0].content += item.alternatives[0].content;
      delete items[key];
    }
  });

  return items.map(item => {
    const { start_time, end_time } = item;
    const { content } = item.alternatives[0];
    return { start_time, end_time, content };
  });
}

/* convert a time string in seconds to a formatted string representing the time in HH:MM:SS,MS format
 * each component (hours, minutes, seconds, and milliseconds) is formatted to have at least 2 digits (for hours, minutes, and seconds) and 3 digits (for milliseconds)
 * @param {String} timeString - a time string in seconds
 * @returns {String} - a formatted time string in HH:MM:SS,MS format
 */
function secondsToHHMMSSMSFormat(timeString, minDuration = 0.05) {
  const totalSeconds = parseFloat(timeString) + minDuration;
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
