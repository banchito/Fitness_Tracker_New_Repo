// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express       = require('express');
const apiRouter     = express.Router();
const usersRouter   = require('./users')
require('dotenv').config();

apiRouter.get("/health", (req,res,next) => {
    res.send({message:"All is good on /api/health!"});
    next();
})

apiRouter.use('/users', usersRouter);

module.exports = apiRouter
