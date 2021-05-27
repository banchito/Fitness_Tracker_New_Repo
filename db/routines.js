const client = require('./client');

const createRoutine = async({creatorId, isPublic, name, goal}) => {
    
    try{
        const {rows: [activity]} = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);
        //  console.log("createRoutine at routine.js:", activity);

        return activity;
    }catch(error){
        console.error(error)
        throw error
    }
}

const getRoutineById = async(id) => {
    // console.log("getRByid: ", id);
    try{
        const {rows: [routine]} = await client.query(`
        SELECT * FROM routines WHERE id=$1
        `, [id]);
        return routine;
    }catch(error){
        console.error(error)
        throw error
    }
}

const updateRoutine = async(routine) => {
    console.log("routine update routine: ",routine);
    const {id, isPublic, name, goal} = routine
    try{
        let routineToUpdate = await getRoutineById(id)
        console.log("to update: ", routineToUpdate.id);

        const {rows:[routine]} = await client.query(`
        UPDATE routines 
        SET "isPublic" = $1, name = $2, goal=$3
        WHERE id = $4;
        ` , [isPublic, name, goal, routineToUpdate.id ]);

        return routine;
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
    
    const {id, username} = user
    
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id AS "routineID", r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName",u.id, ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE u.username = $1 AND u.id = $2 ;
        `,[username,id]);

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

const getPublicRoutinesByUser = async(user) => {
    
    const {id, username} = user
    
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id AS "routineID", r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName",u.id, ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE u.username = $1 AND u.id = $2 AND r."isPublic" IS TRUE;
        `,[username,id]);

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

const getPublicRoutinesByActivity = async(activity) => {
    // console.log("getPublicRoutinesByActivity: ", activity);
    const [{id} ]= activity
    // console.log("getPublicRoutinesByActivity id: ", id );
    try{
        const {rows} = await client.query(`
        SELECT r."creatorId", r.goal, r.id AS "routineID", r."isPublic", r.name, a.description, a.id as "activityId", u.username AS "creatorName",u.id, ra.duration, ra.count
        FROM routine_activities ra
        JOIN activities a ON ra."activityId" = a.id
        JOIN routines r ON ra."routineId" = r.id
        JOIN users u ON r."creatorId" = u.id
        WHERE a.id = $1;
        `,[id])
        // console.log("getPublicRoutinesByActivity rows: ",rows);
        rows.forEach((row)=>{
            row.activities = [{id:row.activityId, description: row.description, count: row.count, duration:row.duration}]
        })
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}


module.exports = {
    createRoutine, 
    getRoutineById,
    updateRoutine,
    getRoutinesWithoutActivities, 
    getAllRoutines, 
    getAllPublicRoutines, 
    getAllRoutinesByUser, 
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity
}