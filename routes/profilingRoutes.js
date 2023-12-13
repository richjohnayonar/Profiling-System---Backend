const profiling = require("../controller/profilingController");
const express = require("express");

const router = express.Router();

// POST ROUTES
router.post("/department", profiling.createDepartment);
router.post("/course", profiling.createCourse);
router.post("/student", profiling.createStudent);
router.post("/instructor", profiling.createInstructor);
router.post("/subject", profiling.createSubject);
router.post("/schedule", profiling.createSchedule);
router.post("/student-schedule", profiling.creaetStudentSchedule);
//GET ROUTES
router.get("/student", profiling.getStudent);
router.get("/subject", profiling.getSubject);
router.get("/schedule", profiling.getSchedule);
module.exports = router;
