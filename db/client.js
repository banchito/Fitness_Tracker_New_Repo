// build and export your unconnected client here
const {Client} = require('pg');
// const CONNECTION_STRING = process.env.DATABASE_URL || "postgres://localhost:5432/Fitness-dev";
// const client = new Client(CONNECTION_STRING)

const client = new Client(process.env.DATABASE_URL || 'postgres://localhost:5432/juicebox-dev');
module.exports = client;