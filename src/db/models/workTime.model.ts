import { DataTypes } from "sequelize";
import db from ".";


const WorkTimeModel = db.sequelize?.define('work_time',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        date: { type: DataTypes.STRING },
        userId: { type: DataTypes.INTEGER },
        start: { type: DataTypes.INTEGER },
        finish: { type: DataTypes.INTEGER },
        dinner: { type: DataTypes.FLOAT, defaultValue: 0 },
        festive: { type: DataTypes.BOOLEAN, defaultValue: false },
        comment: { type: DataTypes.STRING }
    },
    {
        timestamps: false
    }
)

export default WorkTimeModel  