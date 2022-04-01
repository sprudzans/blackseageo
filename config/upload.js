import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './assets/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '--' + Math.floor(Math.random() * 1000000) + ".png");
        },
    }),

    fileFilter: (req, file, cb) => {
        if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
            cb(null, true);
        } else{
            cb(null, false);
        }
    }
});

export default upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
