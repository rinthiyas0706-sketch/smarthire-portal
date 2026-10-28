
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';

const uploadDirectory = path.resolve('uploads', 'resumes');

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${req.user.userId}-${Date.now()}.pdf`;

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const isPdfName = path.extname(file.originalname).toLowerCase() === '.pdf';

    if (isPdfMime && isPdfName) {
        return cb(null, true);
    }

    cb(new Error('Only PDF resume files are allowed'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
});

export default upload;
