import { DataTypes } from 'sequelize'
import db from '../db'

const WorkTimeModel = db.sequelize.define('workTime', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    date: { type: DataTypes.STRING },
    start: { type: DataTypes.INTEGER },
    finish: { type: DataTypes.INTEGER },
    dinner: { type: DataTypes.FLOAT, defaultValue: 1 },
    comment: { type: DataTypes.STRING },
})

const workTimeSync = async () => {
    await WorkTimeModel.sync({ alter: true })
}

workTimeSync()

export { WorkTimeModel, workTimeSync }
