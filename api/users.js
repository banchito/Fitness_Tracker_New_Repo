const express         = require("express");
const usersRouter     = express.Router();
const jwt             = require('jsonwebtoken')
const {verifyToken}   = require("../utils");
const { createUser, getUserByUsername, getUser, getUserById, getPublicRoutinesByUser } = require("../db");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.post("/register", async (req, res, next) => {
  console.log("/register body :", req.body);
  const { username, password } = req.body;
    
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.status(400).send({
        name: "UserExistsError",
        message: "A user by that username already exists.",
      });
    };

    if(password.length < 8 || !password ){
      return res
        .status(406)
        .send({ message: `Password must be at least 8 characters long` });
    };

    const user = await createUser({ username, password });
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {expiresIn: "1w"});

    res.send(
        {
        user:{id: user.id, username: user.username},
        message: "Thank you for signing up",
        token,
    });
    next()
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    if(!username || !password || password.length < 8){
      res.status(400).send({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
        next()
    }

    try{
        const user = await getUser({username, password})

        if(!user) {throw new Error(`username/password invalid`)}

        if(user){
            const token = jwt.sign({id:user.id, username}, process.env.JWT_SECRET, {expiresIn: "1w"})
            res.send({ user:{id: user.id, username: user.username}, message: `You are logged in ${user.username}!`, token: token})
        }
        
        if(user === false)  { 
          res.status(400).send({ 
                name: 'IncorrectCredentialsError', 
                message: 'Username or password is incorrect'
              });
            }

    }catch(error){
        next(error);
    }
})

usersRouter.get("/me", async(req, res, next) =>{
  const headersAuth = req.headers.authorization;

  try{
    if (!headersAuth) return res.status(403).send({ message: `Please login` });

      const verifiedToken = verifyToken(headersAuth);
      const user = await getUserById(verifiedToken.id);

      user ? res.send(user) : res.status(403).send({ message: `Please register or login` });
   
    }catch(error){
      next(error)
    }
})

usersRouter.get("/:username/routines", async(req, res ,next)=>{
  const {username} = req.params;
  try{

     const user = await getUserByUserName(username);

    if(!user) return res.send({ message: `Couldn't find: ${username}` })

    const routines = await getPublicRoutinesByUser({id: user.id, username: user.username })
    res.send(routines)

  }catch(error){
    next(error)
  }
})

module.exports = usersRouter;
