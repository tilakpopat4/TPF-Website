'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  imageUrl: string;
  title: string;
  className?: string;
}

export default function DownloadButton({ imageUrl, title, className }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;

    try {
      setDownloading(true);
      
      // Fetch image data as a blob
      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {},
      });
      const blob = await response.blob();
      
      // Create a local blob object URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create temporary link and click it to trigger direct download
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      
      // Normalize filename
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
      tempLink.download = `${cleanTitle}_TPF_Poster.jpg`;
      
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      // Revoke the blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Direct download failed, falling back to opening in a new tab:', error);
      // Fallback to opening in new tab in case of CORS or network failures
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className={className} 
      disabled={downloading}
      style={{ cursor: 'pointer' }}
    >
      {downloading ? 'Downloading...' : 'Download Poster'}
    </button>
  );
}
