const client = require("./client");
const { hash, compare } = require("./hash");



const createUser = async ({ username, password }) => {
  const hashedPassword = hash(password);
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

    return user;
  } catch (error) {
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

    if (!user) return false;

    const passwordMatch = compare(password, user.password);
    if (passwordMatch) {
      delete user.password;
      return user;
    } else {
      return false;
    }

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
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = { createUser, getUser, getUserById, getUserByUsername };
