const express = require("express");
const service = require("../service/ProfilePictureService");
const userService = require("../service/UserService");
const { query } = require("express-validator");
const { NOT_FOUND, OK } = require("../constants/http-status-constants");
const router = express.Router();
const { authToken } = require("./Auth");
const { checkParamIsUuid, validationHasErrors } = require("./Validation");
const multer = require("multer");
const path = require("path");

const IMAGE_STORE = process.env.SERVER_DATA_PATH + "/images/users";

const imageUpload = multer({
  dest: IMAGE_STORE,
});

// @desc Gets the profile picture of an user
// @route GET /users/picture/:id

router.get(
  "/:userId",
  checkParamIsUuid("userId"),
  query("thumb").optional().isBoolean(),
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const userId = req.params.userId;
    const thumb = req.query.thumb;

    try {
      const picture = await service.getByUserId(userId);

      if (picture) {
        const fullfilepath = thumb
          ? path.join(path.resolve(), picture.pathThumb)
          : path.join(path.resolve(), picture.path);

        return res.type(picture.mimetype).sendFile(fullfilepath);
      }

      const user = await userService.getById(userId);
      if (!user) return res.sendStatus(NOT_FOUND);

      const diceBearUrl = grabImageFromDicebear(user);

      return res.redirect(diceBearUrl);
    } catch (error) {
      next(error);
    }
  }
);

// @desc Deletes the profile picture of an user
// @route DELETE /users/picture/
// @access Only owner

router.delete("/", authToken, async (req, res, next) => {
  const id = req.user.id;

  try {
    const picture = await service.getByUserId(id);

    if (!picture) return res.sendStatus(NOT_FOUND);

    await service.delete(picture);
    res.sendStatus(OK);
  } catch (error) {
    next(error);
  }
});

// @desc Saves a profile picture to an existing user
// @route POST /users/picture
// @access Only owner

router.post(
  "/",
  authToken,
  imageUpload.single("image"),
  async (req, res, next) => {
    try {
      const originalname = req.file.originalname;
      const mimetype = req.file.mimetype;
      const size = req.file.size;
      const path = req.file.path;

      const userId = req.user.id;

      const user = await userService.getById(userId);
      if (!user) return res.sendStatus(NOT_FOUND);

      if (user.picture) {
        service.delete(user.picture);
      }

      const picture = await service.create({
        originalname,
        mimetype,
        size,
        path,
        userId,
      });

      res.json(picture);
    } catch (error) {
      next(error);
    }
  }
);

function grabImageFromDicebear(user) {
  const { seed, initals } = generateDicebearSeed(user);
  // TODO: Why not always our own service? And if there is an option it needs to be included in E2E tests
  const diceBearUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.DICEBEAR_URL}api/initials/${seed}${initals}.svg`
      : `https://avatars.dicebear.com/api/initials/${seed}${initals}.svg`;

  return diceBearUrl;
}

function generateDicebearSeed(user) {
  const seedChars = "<>!&()-:'|";

  const initals =
    user.firstName.substring(0, 1) + user.lastName.substring(0, 1);

  const seed =
    seedChars[user.id.charCodeAt(0) % seedChars.length] +
    seedChars[user.id.charCodeAt(1) % seedChars.length] +
    seedChars[user.id.charCodeAt(2) % seedChars.length];
  return { seed, initals };
}

module.exports = router;
