const client = require("./client");

const createUser = async({username, password}) => {
    try {
        const { rows: [user] } = await client.query(
            ` INSERT INTO users(username, password)
              VALUES ($1, $2)
              ON CONFLICT (username) DO NOTHING
              RETURNING username, id;
            `, [username, password]
        );
        // console.log("createUsers at users.js:", user);
        
         return user
    }catch(error){
        console.error(error)
        throw error
    }
}

const getUser = async({username, password}) => {
    try{
        const {rows} = await client.query(
            `
              SELECT username FROM users WHERE username=$1 AND password=$2;
            `, [username, password]
        );
         console.log("getUser at user.js:", rows);
    
        return rows
    }catch (error){
        console.error(error)
        throw error
    }
}

const getUserById = async(id) => {
    try{
        const {rows: [user]} = await client.query(`
            SELECT id, username FROM users WHERE id=$1;
        `, [id]);
        console.log("getUserById: ", user);
        return user;
    }catch(error){
        console.error(error)
        throw error
    }
}
module.exports = { createUser, getUser, getUserById }