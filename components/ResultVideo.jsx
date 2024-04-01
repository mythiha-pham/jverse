'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { useEffect, useState, useRef } from 'react';
import { transcriptionItemsToSrt } from '../libs/TranscriptionHelper';
import styles from '../styles';
import arvo from '../fonts/Arvo-Regular.ttf';
import cabin from '../fonts/Cabin-Regular.ttf';
import dosis from '../fonts/Dosis-Regular.ttf';
import dynaPuff from '../fonts/DynaPuff-Regular.ttf';
import miltonian from '../fonts/Miltonian-Regular.ttf';
import montserrat from '../fonts/Montserrat-Regular.ttf';
import poppins from '../fonts/Poppins-Regular.ttf';
import roboto from '../fonts/Roboto-Regular.ttf';

/* The ResultVideo component is responsible for displaying the video player and the caption styles manager */
export default function ResultVideo({ filename, transcriptionItems }) {
  const videoURL = `https://capto-verse.s3.amazonaws.com/${filename}`;

  // progress state
  const [progress, setProgress] = useState(1);

  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  // colors, fonts and positon states
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [boxColor, setBoxColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('30');
  const [font, setFont] = useState('roboto');
  const [verticalMargin, setVerticalMargin] = useState('70');

  // bold and italic states
  const [italicUnchecked, setItalicChecked] = useState(false);
  const [italic, setItalic] = useState('0');
  const [boldUnchecked, setBoldChecked] = useState(false);
  const [bold, setBold] = useState('0');

  // load FFmpeg
  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  // load video
  useEffect(() => {
    videoRef.current.src = videoURL;
    load();
  }, []);

  // convert RGB to FFmpeg color format
  function toFFmegColor(rgb) {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return `&H${bgr}&`;
  }

  // transcode video with captions and styles applied to it
  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const srt = transcriptionItemsToSrt(transcriptionItems);
    await ffmpeg.writeFile(filename, await fetchFile(videoURL));
    await ffmpeg.writeFile('subs.srt', srt);
    videoRef.current.src = videoURL;
    // wait for video to load
    await new Promise((resolve) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    // update progress bar
    const { duration } = videoRef.current;
    ffmpeg.on('log', ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult && regexResult?.[1]) {
        const howMuchIsDone = regexResult?.[1];
        const [hours, minutes, seconds] = howMuchIsDone.split(':');
        const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
        const videoProgress = doneTotalSeconds / duration;
        setProgress(videoProgress);
      }
    });

    // load font
    switch (font) {
      case 'arvo':
        await ffmpeg.writeFile('/tmp/arvo.ttf', await fetchFile(arvo));
        break;
      case 'cabin':
        await ffmpeg.writeFile('/tmp/cabin.ttf', await fetchFile(cabin));
        break;
      case 'dosis':
        await ffmpeg.writeFile('/tmp/dosis.ttf', await fetchFile(dosis));
        break;
      case 'dynaPuff':
        await ffmpeg.writeFile('/tmp/dynaPuff.ttf', await fetchFile(dynaPuff));
        break;
      case 'miltonian':
        await ffmpeg.writeFile('/tmp/miltonian.ttf', await fetchFile(miltonian));
        break;
      case 'montserrat':
        await ffmpeg.writeFile('/tmp/montserrat.ttf', await fetchFile(montserrat));
        break;
      case 'poppins':
        await ffmpeg.writeFile('/tmp/poppins.ttf', await fetchFile(poppins));
        break;
      default:
        await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto));
        break;
    }

    // apply captions and styles
    await ffmpeg.exec([
      '-i', filename,
      '-preset', 'ultrafast',
      '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=${font},FontSize=${fontSize},Italic=${italic},Bold=${bold},MarginV=${verticalMargin},PrimaryColour=${toFFmegColor(primaryColor)},OutlineColour=${toFFmegColor(outlineColor)},BorderStyle=4,BackColour=${toFFmegColor(boxColor)}'`,
      'result.mp4',
    ]);

    const data = await ffmpeg.readFile('result.mp4');
    videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    setProgress(1);
  };

  return (
    <>
      {/* Styles manager */}
      <div className="bg-gradient-to-r from-gray-900 to-cyan-700 rounded-md">
        <details className="open:bg-gradient-to-r from-gray-900 to-cyan-700 open:ring-white/10 open:shadow-lg rounded-md p-2">
          <summary className="text-md leading-6 text-white font-semibold select-none">
            Styles Manager
          </summary>
          <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-900 grid grid-cols-2">
            {/* Font */}
            <div className="gap-2 flex flex-row items-center">
              <label className={`${styles.label} w-[100px]`}>Font</label>
              <select value={font} onChange={(e) => setFont(e.target.value)}>
                <option value="arvo">Arvo</option>
                <option value="cabin">Cabin</option>
                <option value="dosis">Dosis</option>
                <option value="dynaPuff">DynaPuff</option>
                <option value="miltonian">Miltonian</option>
                <option value="montserrat">Montserrat</option>
                <option value="poppins">Poppins</option>
                <option value="roboto">Roboto</option>
              </select>
            </div>
            {/* Font size, bold and italic */}
            <div className="gap-2 flex flex-row items-center">
              <label className={`${styles.label} w-[100px]`}>Font size</label>
              <input className="w-[50px] h-[20px] text-center rounded-md" type="text" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
              <input
                type="checkbox"
                checked={italicUnchecked}
                onChange={() => {
                  setItalicChecked(!italicUnchecked);
                  if (!italicUnchecked) {
                    setItalic('1');
                  } else {
                    setItalic('0');
                  }
                }}
              />
              <label className={`${styles.label}`}>Italic</label>
              <input
                type="checkbox"
                checked={boldUnchecked}
                onChange={() => {
                  setBoldChecked(!boldUnchecked);
                  if (!boldUnchecked) {
                    setBold('1');
                  } else {
                    setBold('0');
                  }
                }}
              />
              <label className={`${styles.label}`}>Bold</label>
            </div>
            {/* Colors */}
            <div className="gap-2 flex flex-row items-center">
              <label className={`${styles.label} w-[100px]`}>Primary color</label>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-transparent" />
            </div>

            <div className="gap-2 flex flex-row items-center">
              <label className={`${styles.label} w-[100px]`}>Outline color</label>
              <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} className="bg-transparent" />
            </div>

            <div className="gap-2 flex flex-row items-center">
              <label className={`${styles.label} w-[100px]`}>Box color</label>
              <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="bg-transparent" />
            </div>
            {/* Margin */}
            <div className="gap-2 flex flex-row items-center ">
              <label className={`${styles.label} w-[100px]`}>Vert. margin</label>
              <input className="w-[50px] text-center rounded-md h-[20px]" type="text" value={verticalMargin} onChange={(e) => setVerticalMargin(e.target.value)} />
            </div>
          </div>
        </details>
      </div>

      <div className="rounded-xl overflow-hidden relative mt-4">
        {/* Progress bar */}
        {progress && progress < 1 && (
        <div className="absolute inset-0 bg-black/80 flex items-center">
          <div className="w-full text-center">
            <div className="bg-gray-200 mx-8 rounded-md overflow-hidden relative">
              <div className="bg-gradient-to-r from-cyan-800 to-green-200 h-2" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
        )}
        {/* Video */}
        <div className="flex justify-center items-center">
          <video className="w-[50%] h-[50%]" ref={videoRef} controls>
            <track kind="captions" />
          </video>
        </div>
      </div>
      {/* Apply captions button */}
      <div className="mt-4 flex justify-center items-center">
        <button type="button" onClick={transcode} className={`${styles.button}`}>
          Apply captions
        </button>
      </div>
    </>
  );
}

