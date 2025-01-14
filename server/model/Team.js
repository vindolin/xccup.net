module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false, // It's allowed that the same name can appear in two different years
    },
    participantInSeasons: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    // Create a complete new team entry if the compostion of members changes
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
  });

  // ??? Don't make this association because a user can change his association in a later season ???
  // Team.associate = (models) => {
  //   Team.hasMany(models.User, {
  //     as: "members",
  //     foreignKey: {
  //       name: "teamId",
  //     },
  //   });
  // };

  return Team;
};
