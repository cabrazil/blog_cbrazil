import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files, File, Part } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part: Part) => {
        return Boolean(part.mimetype && part.mimetype.includes('image'));
      },
    });

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const fileArray = files.file;
    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = fileArray[0];
    
    // Generate public URL for the file
    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;

    // For TinyMCE, we need to return the location property
    if (req.headers['x-tinymce-upload']) {
      return res.status(200).json({
        location: fileUrl,
      });
    }

    return res.status(200).json({
      url: fileUrl,
      message: 'Upload successful',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error uploading file',
    });
  }
} 