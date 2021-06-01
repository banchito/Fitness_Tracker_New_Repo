const client = require("./client");
const { hash, compare } = require("./hash");



const createUser = async ({ username, password }) => {
  const hashedPassword = hash(password);
  console.log("username and passw: ", username, password);
  // console.log("hashedPassword: ", hashedPassword);
  try {
    const {
      rows: [user],
    } = await client.query(
      ` INSERT INTO users(username, password)
              VALUES ($1, $2)
              ON CONFLICT (username) DO NOTHING
              RETURNING username, id;
            `,
      [username, hashedPassword]
    );
     console.log("createUsers at users.js:", user);

    return user;
  } catch (error) {
    console.log("Failed to create user.", username);
    console.error(error);
    return false;
  }
};

const getUser = async ({ username, password }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      ` SELECT id, username, password FROM users WHERE username=$1 LIMIT 1;`,
      [username]
    );
    // console.log("getUser at user.js:", user.password);

    if (!user) return false;

    const passwordMatch = compare(password, user.password);
    // console.log("password match :", passwordMatch);
    if (passwordMatch) return {id: user.id, username: user.username};

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserByUsername = async(username) => {
    try{
        const {rows: [user]} = await client.query(`
            SELECT username, id FROM users WHERE username=$1`,[username]);
            return user
    }catch(error){
      console.log("Failed to create user.", username);
      console.error(error);
      return false;
    
    }
}

const getUserById = async (id) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT id, username FROM users WHERE id=$1;
        `,
      [id]
    );
    // console.log("getUserById: ", user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = { createUser, getUser, getUserById, getUserByUsername };
