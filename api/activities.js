const express           = require('express');
const activitiesRouter  = express.Router();
const jwt               = require("jsonwebtoken");
const {getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity} = require('../db');

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
    // console.log("reqbody",req.body);
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

activitiesRouter.patch("/:activityId", async (req, res, next) => {
    const { activityId }            = req.params;
    const { name, description }     = req.body;

    try{
        if(req.headers.authorization){
            const [, token]         = req.headers.authorization.split("Bearer ");
            const validatedToken    = jwt.verify(token, process.env.JWT_SECRET);

            if (validatedToken){
                const activity = await updateActivity({id: activityId, name, description})
                res.send(activity)
            } else {
                res.status(403).send({ message: `Please login` });
            }

        }else {
            res.status(403).send({ message: `Please login` });
        }
    }catch(error){
        next(error)
    }
});

activitiesRouter.get("/:activityId/routines", async(req, res, next)=>{
    const { activityId } = req.params;
    try{
        const activities = await getPublicRoutinesByActivity({id: activityId});
        res.send(activities);
    }catch(error){
        next(error)
    }
});


module.exports = activitiesRouter