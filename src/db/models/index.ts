import { Model, ModelCtor, Sequelize } from "sequelize";
import WorkTimeModel from "./workTime.model";

interface IDb {
  sequelize: Sequelize
}


const db: IDb = {
  sequelize: new Sequelize(
    {
      dialect: 'sqlite',
      storage: 'db.sqlite'
    }
  )
}


export default db