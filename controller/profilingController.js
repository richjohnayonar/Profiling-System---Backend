const profiling = require("../model/profilingModel");
const mongoose = require("mongoose");

//Create

//create department
const createDepartment = async (req, res) => {
  try {
    const addministration = await profiling.Department.create(req.body);
    if (!addministration) {
      res.status(401).json({ message: "Failed to create addministration" });
    }
    res.status(200).json(addministration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create course
const createCourse = async (req, res) => {
  try {
    const course = await profiling.Course.create(req.body);
    if (!course) {
      res.status(401).json({ message: "Failed to create course" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create student
const createStudent = async (req, res) => {
  try {
    const student = await profiling.Student.create(req.body);
    if (!student) {
      res.status(401).json({ message: "Failed to create student" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create instructor
const createInstructor = async (req, res) => {
  try {
    const instructor = await profiling.Instructor.create(req.body);
    if (!instructor) {
      res.status(401).json({ message: "Failed to create student" });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create subject
const createSubject = async (req, res) => {
  try {
    const subject = await profiling.Subject.create(req.body);
    if (!subject) {
      res.status(401).json({ message: "Failed to create student" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create schedule
const createSchedule = async (req, res) => {
  try {
    const schedule = await profiling.Schedule.create(req.body);
    if (!schedule) {
      res.status(401).json({ message: "Failed to create student" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create student schedule
const creaetStudentSchedule = async (req, res) => {
  try {
    const studentSchedule = await profiling.StudenSchedule.create(req.body);
    if (!studentSchedule) {
      res.status(401).json({ message: "Failed to create student" });
    }
    res.status(200).json(studentSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create payment
const createPayment = async (req, res) => {
  try {
    const payment = await profiling.Payment.create(req.body);
    if (!payment) {
      return res
        .status(400)
        .json({ message: "No Data Found in this database" });
    }
    return res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fetch

//get student
const getStudent = async (req, res) => {
  try {
    const student = await profiling.Student.find().populate("course");
    if (!student) {
      res.status(401).json({ message: "No Student Found!" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get Course
const getCourse = async (req, res) => {
  try {
    const course = await profiling.Course.find().populate("department");
    if (!course) {
      return res
        .status(400)
        .json({ message: "No course Available in database" });
    }
    return res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get studentbyId
const getStudentById = async (req, res) => {
  const userId = req.params.userId; // Access userId directly
  try {
    const student = await profiling.Student.findById(userId);
    if (!student) {
      return res.status(401).json({ message: "No Student Found!" });
    }
    return res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get subject
const getSubject = async (req, res) => {
  try {
    const subject = await profiling.Subject.find().populate([
      "course",
      "instructor",
    ]);
    if (!subject) {
      res.status(401).json({ message: "No Student Found!" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get subject with pagination
const getSubjectWithPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.query;

  try {
    let subjectsQuery = profiling.Subject.find().populate([
      "course",
      "instructor",
    ]);

    if (searchQuery) {
      subjectsQuery = subjectsQuery.find({
        $or: [
          { subjectId: { $regex: new RegExp(searchQuery, "i") } },
          {
            instructor: {
              $in: await profiling.Instructor.find({
                instructorName: { $regex: new RegExp(searchQuery, "i") },
              }).distinct("_id"),
            },
          },
        ],
      });
    }

    const TotalSubject = await profiling.Subject.countDocuments();

    const models = await subjectsQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const filteredModels = models.filter(
      (model) => model.instructor && model.instructor.instructorName
    );

    res.status(200).json({
      models: filteredModels,
      currentPage: page,
      totalPages: Math.ceil(TotalSubject / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get specific subject
const getSubjectById = async (req, res) => {
  const id = req.params.id;
  try {
    const subject = await profiling.Subject.findById(id).populate([
      "course",
      "instructor",
    ]);
    if (!subject) {
      res.status(401).json({ message: "No Student Found!" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get subject assigned
const getSubjectByInstructor = async (req, res) => {
  const userId = req.params.userId;

  try {
    const Subject = await profiling.Subject.aggregate([
      {
        $lookup: {
          from: "courses", // Replace with your actual subject collection name
          localField: "course",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $lookup: {
          from: "instructors", // Replace with your actual instructor collection name
          localField: "instructor",
          foreignField: "_id",
          as: "instructorInfo",
        },
      },
      {
        $unwind: "$instructorInfo",
      },
      {
        $match: {
          "instructorInfo._id": new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId type if using Mongoose
        },
      },
    ]);

    if (!Subject || Subject.length === 0) {
      return res
        .status(401)
        .json({ message: "No Subject Found for this Instructor!" });
    }

    res.status(200).json(Subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get schedule
const getSchedule = async (req, res) => {
  try {
    const schedule = await profiling.Schedule.find().populate({
      path: "subject",
      populate: ["instructor", "course"],
    });
    if (!schedule) {
      res.status(401).json({ message: "No Student Found!" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get schedule by instructor id
const getScheduleByInstructor = async (req, res) => {
  const userId = req.params.userId;

  try {
    const schedule = await profiling.Schedule.aggregate([
      {
        $lookup: {
          from: "subjects", // Replace with your actual subject collection name
          localField: "subject",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      {
        $unwind: "$subjectInfo",
      },
      {
        $lookup: {
          from: "instructors", // Replace with your actual instructor collection name
          localField: "subjectInfo.instructor",
          foreignField: "_id",
          as: "instructorInfo",
        },
      },
      {
        $unwind: "$instructorInfo",
      },
      {
        $match: {
          "instructorInfo._id": new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId type if using Mongoose
        },
      },
    ]);

    if (!schedule || schedule.length === 0) {
      return res
        .status(401)
        .json({ message: "No Schedule Found for this Instructor!" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get instructors
const getInstructor = async (req, res) => {
  try {
    const instructor = await profiling.Instructor.find().populate("department");
    if (!instructor) {
      res.status(400).json({ message: "No instructor in the database" });
    }
    return res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get student schedule
const getStudentSchedule = async (req, res) => {
  try {
    const studentSched = await profiling.StudenSchedule.find()
      .populate("student")
      .populate({ path: "schedule", populate: "subject" });
    if (!studentSched) {
      return res.status(400).json({ message: "No Student in this subject" });
    }
    return res.status(200).json(studentSched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentScheduById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const schedule = await profiling.StudenSchedule.aggregate([
      {
        $lookup: {
          from: "students", // Replace with your actual subject collection name
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $lookup: {
          from: "schedules", // Replace with your actual instructor collection name
          localField: "schedule",
          foreignField: "_id",
          as: "scheduleInfo",
        },
      },
      {
        $unwind: "$scheduleInfo",
      },
      {
        $lookup: {
          from: "subjects", // Replace with your actual instructor collection name
          localField: "scheduleInfo.subject",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      {
        $unwind: "$subjectInfo",
      },
      {
        $lookup: {
          from: "instructors", // Replace with your actual instructor collection name
          localField: "subjectInfo.instructor",
          foreignField: "_id",
          as: "instructorInfo",
        },
      },
      {
        $unwind: "$instructorInfo",
      },
      {
        $match: {
          "studentInfo._id": new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId type if using Mongoose
        },
      },
    ]);

    if (!schedule || schedule.length === 0) {
      return res
        .status(401)
        .json({ message: "No Schedule Found for this student!" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get student schedule By Subject ID
const getStudSchedBySubId = async (req, res) => {
  const id = req.params.id;

  try {
    const studSubSched = await profiling.StudenSchedule.aggregate([
      {
        $lookup: {
          from: "students", // Replace with your actual subject collection name
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $lookup: {
          from: "schedules", // Replace with your actual instructor collection name
          localField: "schedule",
          foreignField: "_id",
          as: "scheduleInfo",
        },
      },
      {
        $unwind: "$scheduleInfo",
      },
      {
        $lookup: {
          from: "subjects", // Replace with your actual instructor collection name
          localField: "scheduleInfo.subject",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      {
        $unwind: "$subjectInfo",
      },
      {
        $lookup: {
          from: "courses", // Replace with your actual instructor collection name
          localField: "subjectInfo.course",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $lookup: {
          from: "instructors", // Replace with your actual instructor collection name
          localField: "subjectInfo.instructor",
          foreignField: "_id",
          as: "instructorInfo",
        },
      },
      {
        $unwind: "$instructorInfo",
      },
      {
        $match: {
          "subjectInfo._id": new mongoose.Types.ObjectId(id), // Convert userId to ObjectId type if using Mongoose
        },
      },
    ]);

    if (!studSubSched || studSubSched.length === 0) {
      return res
        .status(401)
        .json({ message: "No Schedule Found for this Instructor!" });
    }

    res.status(200).json(studSubSched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get payment
const getPayment = async (req, res) => {
  try {
    const payment = await profiling.Payment.find().populate("student");
    if (!payment) {
      return res.status(400).json({ message: "No Data Found." });
    }
    return res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get payment by id
const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await profiling.Payment.findById(id);
    if (!payment) {
      return res
        .status(400)
        .json({ message: `No Data Found with ${id} in the database.` });
    }
    return res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get payment by student id
const getStudentPaymentStatus = async (req, res) => {
  const userId = req.params.userId;

  try {
    const schedule = await profiling.Payment.aggregate([
      {
        $lookup: {
          from: "students", // Replace with your actual subject collection name
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $match: {
          "studentInfo._id": new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId type if using Mongoose
        },
      },
    ]);
    if (!schedule || schedule.length === 0) {
      return res
        .status(401)
        .json({ message: "No Payment Found for this student!" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update

//update payment
const updatePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await profiling.Payment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!payment) {
      return res.status(400).json({ message: "No payment data found." });
    }
    return res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete

//delete payment record
const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await profiling.Payment.findByIdAndDelete(id);
    if (!payment) {
      return res
        .status(400)
        .json({ message: `No ID:${id} found in database.` });
    }
    return res.status(200).json({ message: `ID:${id} successfully deleted!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  //create
  createDepartment,
  createCourse,
  createStudent,
  createInstructor,
  createSubject,
  createSchedule,
  creaetStudentSchedule,
  createPayment,

  //fetch
  getSubject,
  getStudent,
  getSchedule,
  getStudentById,
  getScheduleByInstructor,
  getInstructor,
  getSubjectByInstructor,
  getSubjectById,
  getStudentSchedule,
  getStudSchedBySubId,
  getCourse,
  getPayment,
  getPaymentById,
  getSubjectWithPage,
  getStudentScheduById,
  getStudentPaymentStatus,

  //update
  updatePayment,

  //delete
  deletePayment,
};
