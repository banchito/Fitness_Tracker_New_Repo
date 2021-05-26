const client = require("./client")

const addActivityToRoutine = async({routineId, activityId, count, duration}) => {
    try{
        const { rows } = await client.query(`
            INSERT INTO routine_activities
            ("routineId", "activityId", duration, count)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `,[routineId,activityId, count, duration]);
        return rows;
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {addActivityToRoutine}