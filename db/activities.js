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

const updateActivity = async({ id, name, description }) => {
    try{
        const {rows: [activity]} = await client.query(`
            UPDATE activities
            SET name = ($2), description = ($3)
            WHERE id=$1
            RETURNING *; 
        `,[id, name, description]);
        return activity
    }catch(error){
        console.error(error)
        throw error
    }
}

const getActivityById = async(id)=> {
    try{
        const {rows} = await client.query(`
        SELECT * FROM activities WHERE id=$1;
        `, [id]);
        return rows;
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {createActivity, getAllActivities, updateActivity, getActivityById}