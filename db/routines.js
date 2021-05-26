const client = require('./client');

const createRoutine = async({creatorId, isPublic, name, goal}) => {
    
    try{
        const {rows} = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);
        // console.log("createRoutine at routine.js:", rows);
        return rows;
    }catch(error){
        console.error(error)
        throw error
    }
}

const getRoutinesWithoutActivities = async() => {
    try{
        const {rows} = await client.query(`
            SELECT * FROM routines;
        `)
        // console.log("getRoutinesWithoutActivities: ", rows);
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {createRoutine, getRoutinesWithoutActivities}