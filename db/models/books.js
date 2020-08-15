const Sequelize = require("sequelize");

// Defining Book model

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title field is required. Please provide a value for it.",
          },
          notEmpty: {
            msg: "Title field cannot be empty. Please provide a value for it.",
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Author field is required. Please provide a value for it.",
          },
          notEmpty: {
            msg: "Author field cannot be empty. Please provide a value for it.",
          },
        },
      },
      genre: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
      },
    },
    { sequelize }
  );

  return Book;
};
