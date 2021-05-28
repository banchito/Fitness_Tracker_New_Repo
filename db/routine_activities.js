const client = require("./client")

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
    console.log("getRoutineActivitiesByRoutine: ", id);
    try{
        const { rows } = await client.query(`
            SELECT * FROM routine_activities WHERE "routineId" = $1;
        `,[id])
        console.log("getRoutineActivitiesByRoutine:", rows);
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}

const updateRoutineActivity = async(fields = {}) => {
    
    const idReference = fields.id
    delete fields.id
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ")
    console.log(fields)
    if (setString.length === 0) {
        return;
      }

      try{
        const {rows:[routineActivity]} = await client.query(`SELECT * FROM routine_activities WHERE id = ${idReference};`)
        console.log("routineActToUpdate:",routineActivity.id);

        const {rows: [routineActiv]} = await client.query(`  
        UPDATE routine_activities
        SET ${setString}
        WHERE id = ${routineActivity.id}
        RETURNING *;
        ` , Object.values(fields));
        console.log("before return:", routineActiv);
        return routineActiv;
      }catch(error){
        console.log(error)
        throw error
      }
}


module.exports = {addActivityToRoutine, getRoutineActivitiesByRoutine, updateRoutineActivity}