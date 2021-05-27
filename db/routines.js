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

const getAllRoutines = async() => {
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id, r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName", ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE r.id IS NOT NULL;
        `);

        rows.forEach((row)=>{
            row.activities = [{id:row.activityId, description: row.description, count: row.count, duration:row.duration }]
            delete row.activityId
            delete row.description
            delete row.duration
            delete row.count

        })

        return rows
    }catch(error){
        console.error(error)

    }  
} 

const getAllPublicRoutines = async() => {
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id, r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName", ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE r."isPublic" IS TRUE;
        `);

        rows.forEach((row)=>{
            row.activities = [{id:row.activityId, description: row.description, count: row.count, duration:row.duration }]
            delete row.activityId
            delete row.description
            delete row.duration
            delete row.count

        })

        return rows
    }catch(error){
        console.error(error)
        
    }
} 

const getAllRoutinesByUser = async(user) => {
    console.log("user: ",user);
    console.log("username:",user.username);
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id, r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName", ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE u.username = $1;
        `,[username]);

        rows.forEach((row)=>{
            row.activities = [{id:row.activityId, description: row.description, count: row.count, duration:row.duration }]
            delete row.activityId
            delete row.description
            delete row.duration
            delete row.count

        });
        console.log("getAllRoutinesByUser: ",rows)

        return rows;
    }catch(error){
        console.error(error)
        throw error
    }
}


module.exports = {createRoutine, getRoutinesWithoutActivities, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser}