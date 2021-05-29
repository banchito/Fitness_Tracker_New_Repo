const client = require("./client")

const getRoutineActivityById = async(id) => {
    try{
        const {rows: [routineActivity]} = await client.query(`
            SELECT * FROM routine_activities WHERE id=$1`,[id]);
            return routineActivity
    }catch(error){
      console.log("Failed to create user.", username);
      console.error(error);
      return false;
    
    }

}

const addActivityToRoutine = async({routineId, activityId, duration, count}) => {
    try{
        const { rows: [routineActivity] } = await client.query(`
            INSERT INTO routine_activities
            ("routineId", "activityId", duration, count)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `,[routineId, activityId, duration, count]);
        return routineActivity;
    }catch(error){
        console.error(error)
        throw error
    }
}

const getRoutineActivitiesByRoutine = async({id}) => {
    // console.log("getRoutineActivitiesByRoutine: ", id);
    try{
        const { rows } = await client.query(`
            SELECT * FROM routine_activities WHERE "routineId" = $1;
        `,[id])
        // console.log("getRoutineActivitiesByRoutine:", rows);
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}

const updateRoutineActivity = async(fields = {}) => {
    
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ")
    // console.log(fields)
    if (setString.length === 0) {
        return;
      }

      try{
        const {rows: [routine]} = await client.query(`SELECT id FROM routine_activities WHERE id = ${fields.id};`)
        // console.log("routineActToUpdate:",routine.id);

         const {rows: [routineUpdated]} = await client.query(`  
         UPDATE routine_activities
         SET ${setString}
         WHERE id = ${routine.id}
         RETURNING id, count, duration;
         ` , Object.values(fields));
        //  console.log("before return:", routineUpdated);
         return routineUpdated;
      }catch(error){
        console.log(error)
        throw error
      }
}

const  destroyRoutineActivity = async(id) => {
    //console.log("destroyRoutineActivity: ", id);
    try{
        const {rows: [routineActivity]} = await client.query(`
        DELETE FROM routine_activities
        WHERE id = $1
        RETURNING *;
        `, [id]);
        // console.log("destroyRA: ", routineActivity);
        return routineActivity
    }catch(error){
        console.error(error)
        throw error
    }
}


module.exports = {addActivityToRoutine, getRoutineActivitiesByRoutine, updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById}