import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Detect file type from URL or filename
export function getFileType(url) {
  if (!url) return 'unknown';
  
  const urlLower = url.toLowerCase();
  
  // PDF
  if (urlLower.includes('.pdf') || urlLower.includes('pdf')) {
    return 'pdf';
  }
  
  // PowerPoint
  if (urlLower.includes('.ppt') || urlLower.includes('.pptx') || 
      urlLower.includes('powerpoint') || urlLower.includes('presentation')) {
    return 'ppt';
  }
  
  // Word Documents
  if (urlLower.includes('.doc') || urlLower.includes('.docx') || 
      urlLower.includes('document') || urlLower.includes('word')) {
    return 'doc';
  }
  
  // Excel
  if (urlLower.includes('.xls') || urlLower.includes('.xlsx') || 
      urlLower.includes('excel') || urlLower.includes('spreadsheet')) {
    return 'xls';
  }
  
  // Google Drive specific
  if (urlLower.includes('drive.google.com')) {
    if (urlLower.includes('/presentation/')) return 'ppt';
    if (urlLower.includes('/document/')) return 'doc';
    if (urlLower.includes('/spreadsheets/')) return 'xls';
    if (urlLower.includes('/file/')) return 'pdf'; // Default for generic drive files
  }
  
  return 'pdf'; // Default fallback
}

// Get viewer URL based on file type
export function getViewerUrl(fileUrl, fileType) {
  if (!fileUrl) return null;
  
  const detectedType = fileType || getFileType(fileUrl);
  
  // For Google Drive links, convert to preview/embed URL
  if (fileUrl.includes('drive.google.com')) {
    // Extract file ID
    const fileIdMatch = fileUrl.match(/[-\w]{25,}/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }
  
  // For other URLs, use appropriate viewer
  switch (detectedType) {
    case 'pdf':
      return fileUrl; // PDF can be directly embedded
    
    case 'ppt':
    case 'doc':
    case 'xls':
      // Use Microsoft Office Online Viewer for non-PDF documents
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    
    default:
      return fileUrl;
  }
}
