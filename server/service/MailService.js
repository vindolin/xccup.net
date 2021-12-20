const sendMail = require("../config/email");
const logger = require("../config/logger");
const {
  MAIL_MESSAGE_PREFIX,
  REGISTRATION_TEXT,
  REGISTRATION_TITLE,
  NEW_PASSWORD_TITLE,
  NEW_PASSWORD_TEXT,
  REQUEST_NEW_PASSWORD_TITLE,
  REQUEST_NEW_PASSWORD_TEXT,
  CONFIRM_NEW_ADDRESS_TITLE,
  CONFIRM_NEW_ADDRESS_TEXT,
  AIRSPACE_VIOLATION_TITLE,
  AIRSPACE_VIOLATION_TEXT,
  NEW_FLIGHT_COMMENT_TITLE,
  NEW_FLIGHT_COMMENT_TEXT,
} = require("../constants/email-message-constants");
const User = require("../config/postgres")["User"];
const Flight = require("../config/postgres")["Flight"];

const clientUrl = process.env.CLIENT_URL;
const userActivateLink = process.env.CLIENT_USER_ACTIVATE;
const userPasswordLostLink = process.env.CLIENT_USER_PASSWORD_LOST;
const confirmMailChangeLink = process.env.CLIENT_USER_MAIL_CHANGE;
const flightLink = process.env.CLIENT_FLIGHT;

const service = {
  sendMailSingle: async (fromUserId, toUserId, content) => {
    const [fromUser, toUser] = await Promise.all([
      User.findByPk(fromUserId),
      User.findByPk(toUserId),
    ]);

    logger.debug(`MS: ${fromUserId} requested to send an email`);

    const isXccupOffical = fromUserId.role != "Keine";

    const toMail = fromUser.email;
    const fromMail = toUser.email;
    const fromName = `${toUser.firstName} ${toUser.lastName}`;

    if (!isXccupOffical) {
      content.text = MAIL_MESSAGE_PREFIX(fromName) + content.text;
    }

    return sendMail(toMail, content, fromMail);
  },

  sendActivationMail: async (user) => {
    logger.info(`MS: Send activation mail to ${user.email}`);

    const activationLink = `${clientUrl}${userActivateLink}?userId=${user.id}&token=${user.token}`;

    const content = {
      title: REGISTRATION_TITLE,
      text: REGISTRATION_TEXT(user.firstName, activationLink),
    };

    return sendMail(user.email, content);
  },

  sendNewPasswordMail: async (user, password) => {
    logger.info(`MS: Send new password to ${user.email}`);

    const content = {
      title: NEW_PASSWORD_TITLE,
      text: NEW_PASSWORD_TEXT(user.firstName, password),
    };

    return sendMail(user.email, content);
  },

  sendRequestNewPasswordMail: async (user) => {
    logger.info(`MS: Send new password request to ${user.email}`);

    const resetLink = `${clientUrl}${userPasswordLostLink}?confirm=true&userId=${user.id}&token=${user.token}`;

    const content = {
      title: REQUEST_NEW_PASSWORD_TITLE,
      text: REQUEST_NEW_PASSWORD_TEXT(user.firstName, resetLink),
    };

    return sendMail(user.email, content);
  },

  sendConfirmNewMailAddressMail: async (user, newEmail) => {
    logger.info(
      `MS: Send confirm new mail for user ${user.firstName} ${user.lastName} to ${newEmail}`
    );

    const confirmMailLink = `${clientUrl}${confirmMailChangeLink}?userId=${user.id}&token=${user.token}&email=${newEmail}`;

    const content = {
      title: CONFIRM_NEW_ADDRESS_TITLE,
      text: CONFIRM_NEW_ADDRESS_TEXT(user.firstName, confirmMailLink),
    };

    return sendMail(newEmail, content);
  },

  sendAirspaceViolationMail: async (flight) => {
    const user = await User.findByPk(flight.userId);

    logger.info(
      `MS: Send airspace violation mail to user ${user.firstName} ${user.lastName}`
    );

    const flightLinkUrl = `${clientUrl}${flightLink}/${flight.externalId}`;

    const content = {
      title: AIRSPACE_VIOLATION_TITLE,
      text: AIRSPACE_VIOLATION_TEXT(user.firstName, flightLinkUrl),
    };

    return sendMail(user.email, content);
  },

  sendNewFlightCommentMail: async (comment) => {
    const [fromUser, flight] = await Promise.all([
      User.findByPk(comment.userId),
      Flight.findByPk(comment.flightId),
    ]);

    // Don't sent any email if commenter is the same person has the owner of the flight
    if (comment.userId == flight.userId) return;

    const toUser = await User.findByPk(flight.userId);

    logger.info(`MS: Send new flight comment mail to user ${toUser.id}`);

    const flightLinkUrl = `${clientUrl}${flightLink}/${flight.externalId}`;

    const content = {
      title: NEW_FLIGHT_COMMENT_TITLE,
      text: NEW_FLIGHT_COMMENT_TEXT(
        toUser.firstName,
        `${fromUser.firstName} ${fromUser.lastName} `,
        comment.message,
        flightLinkUrl
      ),
    };

    return sendMail(toUser.email, content);
  },

  sendMailAll: async (user, content) => {
    logger.info(`MS: ${user.id} requested to send an email to all users`);

    const query = {
      attributes: ["email"],
      where: {
        emailNewsletter: true,
      },
    };

    const mailAddresses = await User.findAll(query);

    return sendMail(mailAddresses, content);
  },
};

module.exports = service;
