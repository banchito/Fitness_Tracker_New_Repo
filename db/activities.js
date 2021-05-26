const client = require("./client");

const createActivity = async({name, description}) => {
    try{
        const {rows: [activity]} = await client.query(`
            INSERT INTO activities (name, description)
            VALUES($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description]);
        // console.log("create activity at activities.js:", rows);
        return activity
    }catch(error){
        console.log(error)
        throw error
    }
}

const getAllActivities = async() => {
    try{
        const {rows} = await client.query(`
            SELECT * FROM activities;
        `);
        // console.log("getAllActivities at activities.js: ", rows)
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {createActivity, getAllActivities}