/* a component to edit a list of transcription items
  * @param {Array} awsTranscriptionItems - an array of transcription items
  * @param {Function} setAwsTranscriptionItems - a function to update the transcription items
  * @returns {JSX.Element} - a list of transcription items
  */
export default function TranscriptionEditor({
  awsTranscriptionItems,
  setAwsTranscriptionItems,
}) {
  function updateTranscriptionItem(index, property, e) {
    // create a new array with the updated transcription item
    const newAwsItems = [...awsTranscriptionItems];
    // update the transcription item with the new value
    newAwsItems[index][property] = e.target.value;
    setAwsTranscriptionItems(newAwsItems);
  }

  return (
    <>
      <div className="grid grid-cols-3 sticky top-0 bg-gradient-to-r from-gray-900 to-cyan-700 p-2 rounded-md text-white">
        <div className="text-md leading-6 text-white font-semibold text-center">From</div>
        <div className="text-md leading-6 text-white font-semibold text-center">End</div>
        <div className="text-md leading-6 text-white font-semibold text-center">Content</div>
      </div>
      {awsTranscriptionItems.length > 0 && (
        <div className="sm:h-[600px] overflow-y-scroll sm:overflow-auto">
          {awsTranscriptionItems.map((item, key) => (
            <div key={key}>
              <TranscriptionItem
                handleStartTimeChange={(e) => updateTranscriptionItem(key, 'start_time', e)}
                handleEndTimeChange={(e) => updateTranscriptionItem(key, 'end_time', e)}
                handleContentChange={(e) => updateTranscriptionItem(key, 'content', e)}
                item={item}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* a component to edit a transcription item
 * @param {Object} item - a transcription item
 * @param {Function} handleStartTimeChange - a function to handle the change of the start_time property of the transcription item
 * @param {Function} handleEndTimeChange - a function to handle the change of the end_time property of the transcription item
 * @param {Function} handleContentChange - a function to handle the change of the content property of the transcription item
 */
export function TranscriptionItem({
  item,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange,
}) {
  if (!item) {
    return '';
  }
  return (
    <div className="my-1 grid grid-cols-3 gap-1 items-center">
      <input type="text"
        className="bg-white/20 p-1 rounded-md text-white text-center"
        value={item.start_time}
        onChange={handleStartTimeChange}
      />
      <input type="text"
        className="bg-white/20 p-1 rounded-md text-white text-center"
        value={item.end_time}
        onChange={handleEndTimeChange}
      />
      <input type="text"
        className="bg-white/20 p-1 rounded-md text-white text-center"
        value={item.content}
        onChange={handleContentChange}
      />
    </div>
  );
}
