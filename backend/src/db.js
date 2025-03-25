import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize('blog', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: console.log
});

const initialize = async () => {

    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PORT:', process.env.DB_PORT);

    try {
        let retries = 5;
        while (retries) {
            try {
                console.log('Trying to connect to the database...');
                await sequelize.authenticate();
                console.log('Connection established!');
                break;
            } catch (error) {
                retries -= 1;
                console.log(`Retrying to connect. Attempts left: ${retries}`);
                await new Promise(res => setTimeout(res, 5000));  // задержка в 5 секунд
            }
        }
        await sequelize.sync();
    } catch (error) {
        console.error(`Error initializing database: ${error}`);
    }
}

const close = async () => {
    return sequelize.close();
}

export { sequelize, initialize, close };