const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, //Constrain on DB
        validate: {
          //Validation will be performed before any sql interaction happens
          notEmpty: true, //No empty string allowed
        },
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      birthday: {
        type: DataTypes.DATEONLY,
      },
      urlProfilPicture: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Keine",
      },
      gender: {
        type: DataTypes.STRING,
      },
      tshirtSize: {
        type: DataTypes.STRING,
      },
      gliders: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      emailInformIfComment: {
        type: DataTypes.BOOLEAN,
      },
      emailNewsletter: {
        type: DataTypes.BOOLEAN,
      },
      emailTeamSearch: {
        type: DataTypes.BOOLEAN,
      },
      state: {
        type: DataTypes.STRING,
        // The state the user lives in (e.g. RLP, NRW, LUX). Needed for possible state championships.
      },
      address: {
        type: DataTypes.STRING,
        // Needed to send prices (e.g. T-Shirt) to an user.
      },
      email: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      rankingNumber: {
        type: DataTypes.INTEGER,
        unique: true,
        // The number should represent the position the user reached in last years overall ranking
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );

  //Define instance level methods for user
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.prototype.getAge = function () {
    const birthYear = new Date(Date.parse(this.birthday)).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const getNames = async () => {
    return User.findAll({
      attributes: ["name"],
    });
  };
  User.getNames = getNames;

  User.associate = (models) => {
    User.hasMany(models.Flight, {
      as: "flights",
      foreignKey: {
        name: "userId",
      },
    });
    User.hasMany(models.FlightComment, {
      as: "comments",
      foreignKey: {
        name: "userId",
        //Through this constrain it's realized that every comment, will be delete if the user will be deleted
        allowNull: false,
      },
      onDelete: "CASCADE",
      hooks: true,
    });
    User.hasOne(models.ProfilPicture, {
      foreignKey: {
        name: "userId",
        //Through this constrain it's realized that every comment, will be delete if the user will be deleted
        allowNull: false,
      },
      onDelete: "CASCADE",
      hooks: true,
    });
    User.hasMany(models.FlightImage, {
      foreignKey: {
        name: "userId",
        //Through this constrain it's realized that every comment, will be delete if the user will be deleted
        allowNull: false,
      },
      onDelete: "CASCADE",
      hooks: true,
    });
    User.belongsTo(models.Club, {
      foreignKey: {
        name: "clubId",
      },
    });
    User.belongsTo(models.Team, {
      foreignKey: {
        name: "teamId",
      },
    });
  };

  return User;
};
