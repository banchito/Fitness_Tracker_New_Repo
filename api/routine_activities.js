const express = require("express");
const routineActivitiesRouter = express.Router();

const { verifyToken } = require("../utils");
const {updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity } = require("../db");

routineActivitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /routine_activities");
  next();
});

routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  const headersAuth = req.headers.authorization;

  try {
    if (!headersAuth) return res.status(403).send({ message: `Please login` });
    
      const verifiedToken = verifyToken(headersAuth);
      const routineActivityToUpdate = await getRoutineActivityById(routineActivityId);

      (verifiedToken.id === routineActivityToUpdate.creatorId) 
      ? res.send(await updateRoutineActivity({ id: routineActivityId, count, duration }))
      : res.status(403).send({ message: `Please login` });
    
  } catch (error) {
    next(error);
  }
});

routineActivitiesRouter.delete("/:routineActivityId", async (req, res, next) => {
    const { routineActivityId } = req.params;
    const headersAuth = req.headers.authorization;
    try {
      if (headersAuth) {
        const verifiedToken = verifyToken(headersAuth);
        const routineActivityToDelete = await getRoutineActivityById(routineActivityId);

        (verifiedToken.id === routineActivityToDelete.creatorId)
        ? res.send(await destroyRoutineActivity(routineActivityToDelete.id))
        : res.status(403).send({ message: `Routine creator not logged in` });
      }
    } catch (error) {next(error);}
  }
);

module.exports = routineActivitiesRouter;
