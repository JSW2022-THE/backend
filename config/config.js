require('dotenv').config();
const env = process.env;

const development = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    port: env.MYSQL_PORT,
    pool: {
        max: 7,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const production = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    port: env.MYSQL_PORT,
    pool: {
        max: 7,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const test = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE_TEST,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    port: env.MYSQL_PORT,
    pool: {
        max: 7,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = { development, production, test };