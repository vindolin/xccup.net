module.exports = (sequelize, DataTypes) => {
  const UserMedia = sequelize.define("UserMedia", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2000),
    },
    timestamp: {
      type: DataTypes.DATE,
    },
    mimetype: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.BIGINT,
    },
    isYoutubeLink: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    likers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
  });

  UserMedia.associate = (models) => {
    UserMedia.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
    });
  };

  return UserMedia;
};
