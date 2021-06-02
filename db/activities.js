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

const updateActivity = async(fields = {  }) => {
    
    const idReference = fields.id
    delete fields.id
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ")

    try{
        const activitiToUpdate = await getActivityById(idReference)
        // console.log("activitiToUpdate: ", activitiToUpdate);
        const {rows: [activity]} = await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${activitiToUpdate.id}
            RETURNING name, description; 
        `, Object.values(fields));

        return activity
    }catch(error){
        console.error(error)
        throw error
    }
}

const getActivityById = async(id)=> {
    try{
        const {rows: [activities]} = await client.query(`
        SELECT * FROM activities WHERE id=$1;
        `, [id]);
        return activities;
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {createActivity, getAllActivities, updateActivity, getActivityById}