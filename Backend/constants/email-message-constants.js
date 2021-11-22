module.exports.MAIL_MESSAGE_PREFIX = (fromName) =>
  `Diese Mail wurde Dir über den XCCup von ${fromName} gesendet. 
  
Du kannst direkt auf diese E-Mail antworten.

------
  
`;

module.exports.REGISTRATION_TITLE = "Deine Anmeldung bei XCCup.net";

module.exports.REGISTRATION_TEXT = (firstName, activateLink) =>
  `Liebe/r ${firstName}! Willkommen beim XCCup.

Um dein Konto final zu aktivieren klicke bitte auf den folgenden Link:
${activateLink}

Wir wünschen Dir allzeit gute Flüge und viel Spaß.

Dein XCCup Team
    
`;