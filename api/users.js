const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername, getUser, getUserById, getPublicRoutinesByUser } = require("../db");
// const {hash} = require('../db/hash')

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
      next({
        name: "UserExistsError",
        message: "A user by that username already exists.",
      });
    };

    if(password.length < 8 ){
        next({
            name: "PasswordLengthError",
            message: "Password must be at least 8 characters.",
          });
    };

    const user = await createUser({ username, password });
    // console.log("new user: ", user);
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
    // console.log("/login: ", req.body);

    if(!username || !password){
      res.status(400).send({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
        next()
    }

    try{
        const user = await getUser({username, password})

        console.log("/login getUser: ", user);
        //console.log("/login getUser: ", user.password );

        if(user){
            const token = jwt.sign({id:user.id, username}, process.env.JWT_SECRET, {expiresIn: "1w"})
            res.send({ user:{id: user.id, username: user.username}, message: `You are logged in ${user.username}!`, token: token})
        }
        
        if(user === false)  { 
          // console.log("user is false");
          res.status(400).send({ 
                name: 'IncorrectCredentialsError', 
                message: 'Username or password is incorrect'
              });
            }

    }catch(error){
        // console.log("api /login:", error);
        next(error);
    }
})

usersRouter.get("/me", async(req, res, next) =>{
  try{
    if(req.headers.authorization){
      const [, token] = req.headers.authorization.split("Bearer ");
      const validatedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await getUserById(validatedToken.id);

      if(user) return res.send(user);
      if(!user) return res.status(403).send({ message: `Please login` });
    } else {
      res.status(403).send({ message: `Please login` });
    }
     
    }catch(error){
      next(error)
    }
})

usersRouter.get("/:username/routines", async(req,res,next)=>{
  const {username} = req.params;
  try{
    const user = await getUserByUsername(username)
    console.log("/users/:username/routines: ", user);
    if(!user) return res.send({ message: `Couldn't find: ${username}` })

    const routines = await getPublicRoutinesByUser({id: user.id, username: user.username })

    res.send(routines)
  }catch(error){
    next(error)
  }
})

module.exports = usersRouter;
