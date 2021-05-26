const client = require("./client");

const createUser = async({username, password}) => {
    try {
        const { rows: [user] } = await client.query(
            ` INSERT INTO users(username, password)
              VALUES ($1, $2)
              ON CONFLICT (username) DO NOTHING
              RETURNING username;
            `, [username, password]
        );
        // console.log("createUsers at users.js:", user);
        
         return user
    }catch(error){
        console.error(error)
        throw error
    }
}

const getUser = ({username, password}) => {
    try{
        const {rows} = client.query(
            `
              SELECT * FROM users WHERE username=$1 AND password=$2;
            `, [username, password]
        );
        //console.log("getUser at user.js:", user);
        //delete user.password
        return rows
    }catch (error){
        console.error(error)
        throw error
    }
}

module.exports = { createUser, getUser }