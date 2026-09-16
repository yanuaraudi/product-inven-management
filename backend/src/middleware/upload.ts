import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const extension = file.originalname.split(".").pop();
        const filename = `${crypto.randomUUID()}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error : any = new Error("Only JPG, PNG, and WebP images are allowed");
            error.status = 400;
            cb(error);
        }
    },
});

export default upload;