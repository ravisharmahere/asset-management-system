// file-upload.ts
import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_CONFIG } from '../config';
import { ValidationError } from './error';

// Ensure upload directories exist
const assetsDir = path.join(UPLOAD_CONFIG.imageDirectory, 'assets');
const documentsDir = path.join(UPLOAD_CONFIG.documentDirectory, 'documents');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    // Determine directory based on file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, assetsDir);
    } else {
      cb(null, documentsDir);
    }
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    // Create unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type not allowed. Allowed types: ${UPLOAD_CONFIG.allowedMimeTypes.join(', ')}`));
  }
};

// Create upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.maxFileSize, // Maximum file size (e.g., 10MB)
  },
});

// Function to get public URL for file
export const getFileUrl = (filename: string, isImage: boolean = true): string => {
  const subDir = isImage ? 'assets' : 'documents';
  return `/uploads/${subDir}/${filename}`;
};

// Function to generate thumbnail for images
export const generateThumbnail = async (
  filePath: string,
  width: number = 200,
  height: number = 200
): Promise<string> => {
  try {
    // This is a simplified placeholder
    // In a real application, you'd use a library like sharp to resize the image

    // For now, just return the original file path
    const fileName = path.basename(filePath);
    const thumbName = `thumb_${fileName}`;
    const thumbPath = path.join(path.dirname(filePath), thumbName);

    // Copy file as a placeholder for thumbnail
    // In reality, you'd resize the image here
    fs.copyFileSync(filePath, thumbPath);

    return getFileUrl(thumbName, true);
  } catch (error) {
    throw new Error(`Error generating thumbnail: ${error}`);
  }
};

// Function to delete file
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error(`Error deleting file: ${error}`);
  }
};

// Function to get absolute file path from URL
export const getAbsoluteFilePath = (fileUrl: string): string => {
  const relativePath = fileUrl.replace('/uploads/', '');
  return path.join(UPLOAD_CONFIG.directory, relativePath);
};
