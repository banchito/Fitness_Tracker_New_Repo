const express           = require('express');
const activitiesRouter  = express.Router();
const jwt               = require("jsonwebtoken");
const {getAllActivities, createActivity} = require('../db');

activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /activities");
    next();
  });

activitiesRouter.get("/", async(req, res, next) => {
    try{
        const activities = await getAllActivities()
        res.send(activities)
    }catch(error){
        next(error);
    }
})

activitiesRouter.post("/", async(req, res, next)=>{
    console.log("reqbody",req.body);
    const {name, description} = req.body;
    try{
        if(req.headers.authorization){
            const [,token] = req.headers.authorization.split("Bearer ");
            const validatedToken = jwt.verify(token, process.env.JWT_SECRET);

            if(!validatedToken || validatedToken === false || validatedToken === null) return res.send({ message: `Please login` });
            if(validatedToken){
                const newActivity = await createActivity({name, description})
                console.log("newActivity: ", newActivity);
                res.send(newActivity)
            }
            
        }else{
            res.status(403).send({ message: `Please login` });
        }
    }catch(error){
        next(error);
    }
})

module.exports = activitiesRouter