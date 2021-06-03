const express = require("express");
const routineActivitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db");

routineActivitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /routine_activities");
  next();
});

routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;

  try {
    if (req.headers.authorization) {
      const [, token]               = req.headers.authorization.split("Bearer ");
      const validatedToken          = jwt.verify(token, process.env.JWT_SECRET);
      const routineActivityToUpdate = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivityToUpdate.routineId);

      if (validatedToken.id === routine.creatorId) {
        const routineActivityUpdated = await updateRoutineActivity({
          id: routineActivityId,
          count,
          duration,
        });
        res.send(routineActivityUpdated);
      } else {
        res.status(403).send({ message: `Routine creator not logged in` });
      }
    }
  } catch (error) {
    next(error);
  }
});

routineActivitiesRouter.delete("/:routineActivityId", async(req, res, next)=>{
    const {routineActivityId} = req.params
    try{
        if(req.headers.authorization){
            const [, token]                 = req.headers.authorization.split("Bearer ");
            const validatedToken            = jwt.verify(token, process.env.JWT_SECRET)
            const routineActivityToDelete   = await getRoutineActivityById(routineActivityId)
            const routine                   = await getRoutineById(routineActivityToDelete.routineId);

           if(validatedToken.id === routine.creatorId){
                const result = await destroyRoutineActivity(routineActivityToDelete.id);
                res.send(result)
           }else{
            res.status(403).send({ message: `Routine creator not logged in` });
           }
            
        }
    }catch(error){

    }
})

module.exports = routineActivitiesRouter;
