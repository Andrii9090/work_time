import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.sequelize.transaction(
      async (transaction) => {
        queryInterface.createTable('work_times', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          date: { type: DataTypes.STRING },
          userId: { type: DataTypes.INTEGER },
          start: { type: DataTypes.INTEGER },
          finish: { type: DataTypes.INTEGER },
          dinner: { type: DataTypes.FLOAT, defaultValue: 0 },
          festive: { type: DataTypes.BOOLEAN, defaultValue: false },
          comment: { type: DataTypes.STRING }
        })
      })
  },

  async down(queryInterface: QueryInterface) {

  }
};
