import { Sequelize } from 'sequelize';
import db from "../config/database.js"

const { DataTypes } = Sequelize;

const Table = db.define('billiard_tables', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "user",
      key: "id"
    }
  },
  table_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  ,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  x: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  table_condition: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rotation: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_lamp_on: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  led_pin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  freezeTableName: true
});

export default Table;

(async () => {
  await db.sync();
})();