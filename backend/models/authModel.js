import { Sequelize } from 'sequelize';
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Auth = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employee_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    freezeTableName: true
});

export default Auth;

(async () => {
    await db.sync({ alter: true });
    console.log("Database synchronized with model changes");
})();
