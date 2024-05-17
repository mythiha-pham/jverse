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
      // Check if the file size exceeds file size limit
      const maxSizeBytes = 4500000; // 4.5MB in bytes
      if (file.size > maxSizeBytes) {
        alert('File size exceeds the limit of 4.5MB');
        return;
      }
      // Check if the file type is supported
      if (file.type !== 'video/mp4' && file.type !== 'video/ogg' && file.type !== 'video/webm') {
        alert('File format not supported');
        console.log(file.type);
        return;
      }
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
      <div className="border-4 border-dashed border-[#76FFFF] border-opacity-50 hover:border-opacity-100 rounded-md p-[120px] w-[800px] mx-auto flex flex-col items-center">
        <p className={`${styles.heroSubheading} font-semibold text-[16px] mb-4`}>Choose your file to upload</p>
        <label className={`${styles.button} flex gap-2 cursor-pointer`}>
          <img src="/upload.png" alt="upload" width={25} height={25} />
          Browse
          <input onChange={upload} type="file" className="hidden" />
        </label>
        <div className="mt-4">
          <p className={`${styles.heroSubheading} font-light text-[12px]`}>
            <span className="text-[#FF6961]">*</span> Supported formats: MP4, Ogg, WebM
          </p>
          <p className={`${styles.heroSubheading} font-light text-[12px] mt-3`}>
            Size limit: 4.5MB
          </p>
          <p className={`${styles.heroSubheading} font-light text-[12px] text-[#FF6961] mt-3`}>
            (This website is only for testing purposes. Do not upload sensitive information.)
          </p>
        </div>
      </div>
    </>
  );
}
