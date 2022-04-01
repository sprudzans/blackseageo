import sharp from 'sharp'
sharp.cache(false);

async function resize(path) {
    let buffer = await sharp(path)
        .resize(480, 360, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
        })
        .jpeg({ quality: 90 })
        .toBuffer();
    return sharp(buffer).toFile(path);
}

// const resize = function (file) {
//     sharp(file.path)
//         .resize(480, 360)
//         .jpeg({ quality: 90 })
//         .toFile(file.destination + '' + file.originalname)
// }

export default resize