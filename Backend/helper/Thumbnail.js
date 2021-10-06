const sharp = require("sharp");

const THUMBNAIL_POSTFIX = "-thumb";
/**
 * This function creates a thumbnail for a given image.
 * The thumbnail will be stored next to the given image.
 * The filename of the thumbnail is based on the given image but extended by "-thumb".
 * @param {*} path The path of the image to which a thumbnail should be created.
 */
function create(path) {
  sharp(path)
    .resize(null, 200)
    // eslint-disable-next-line no-unused-vars
    .toFile(path + THUMBNAIL_POSTFIX, (err, resizedImageInfo) => {
      if (err) {
        console.log(err);
      }
    });
}

exports.createThumbnail = create;
exports.THUMBNAIL_POSTFIX = THUMBNAIL_POSTFIX;
