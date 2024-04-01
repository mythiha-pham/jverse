'use client';

import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import styles from '../styles';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function upload(e) {
    e.preventDefault();
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      const res = await axios.postForm('/api/upload', { file });
      setIsUploading(false);
      const { newName } = res.data;
      router.push(`/${newName}`);
    }
  }
  return (
    <>
      {isUploading && (
        <div className="bg-black/90 text-white fixed inset-0 flex items-center">
          <div className={`${styles.flexCenter} w-full flex-col text-center`}>
            <img src="./spinner.svg" alt="spinner" />
            <h1 className={`${styles.heroHeading} mb-4`}>Upload in progress</h1>
            <h2 className={`${styles.heroSubheading}`}>Please wait until the file has finished uploading</h2>
          </div>
        </div>
      )}
      <div className="border-4 border-dashed border-[#76FFFF] border-opacity-50 hover:border-opacity-100 rounded-md p-[120px] w-[500px] mx-auto flex flex-col items-center">
        <p className={`${styles.heroSubheading} font-semibold text-[16px] mb-4`}>Choose your file to upload</p>
        <label className={`${styles.button} flex gap-2 cursor-pointer`}>
          <img src="/upload.png" alt="upload" width={25} height={25} />
          Browse
          <input onChange={upload} type="file" className="hidden" />
        </label>
        <div className="mt-4">
          <p className={`${styles.heroSubheading} font-light text-[12px]`}>
            <span className="text-[#ff6961]">*</span> Supported formats: AMR, FLAC, M4A, MP3, MP4, Ogg, WebM, WAV
          </p>
        </div>
      </div>
    </>
  );
}
