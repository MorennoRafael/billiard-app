import { Sequelize } from 'sequelize';
import db from "../config/database.js";
import Table from './TableModel.js';

const { DataTypes } = Sequelize;

const Transactions = db.define('transactions', {
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
  id_billiard: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "billiard_tables",
      key: "id"
    }
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  time_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: false
});

Transactions.belongsTo(Table, { foreignKey: "id_billiard", as: "Table" });

export default Transactions;

(async () => {
  await db.sync();
})();