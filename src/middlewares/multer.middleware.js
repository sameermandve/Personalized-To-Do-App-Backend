import multer from "multer";

const uploadDirectory = "../../public/temp";

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const uniqueFilename = file.fieldname + "-" + uniqueSuffix;
        cb(null, uniqueFilename);
    },

});

export const upload = multer({
    storage,
});