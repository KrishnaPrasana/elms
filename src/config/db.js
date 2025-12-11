import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECTION, {
    dialect: "postgres",
    logging: false,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected");
    } catch (error) {
        console.error("Unable to connect to PostgreSQL:", error);
    }
};

export default sequelize;
