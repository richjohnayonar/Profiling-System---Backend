const mongoose = require("mongoose");

const DepartmentSchema = mongoose.Schema({
  administration: {
    type: String,
  },
});

const Department = mongoose.model("Department", DepartmentSchema);

const CourseSChema = mongoose.Schema({
  courseName: {
    type: String,
  },
  courseAv: {
    type: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department, // Reference to the Administration schema
  },
});

const Course = mongoose.model("Course", CourseSChema);

const StudentSchema = mongoose.Schema({
  studentName: {
    type: String,
  },
  studentId: {
    type: String,
  },
  studentAddr: {
    type: String,
  },
  studentAge: {
    type: Number,
  },
  yearLevel: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Course, // Reference to the Course schema
  },
});

const Student = mongoose.model("Student", StudentSchema);

const InstructorSchema = mongoose.Schema({
  instructorName: {
    type: String,
  },
  instructorId: {
    type: String,
  },
  instructorAddr: {
    type: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department, // Reference to the Administration schema
  },
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

const SubjectSchema = mongoose.Schema({
  subjectId: {
    type: String,
  },
  subjectDescription: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Course,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Instructor,
  },
});

// Combine multiple fields into a single field for text search
SubjectSchema.index(
  {
    subjectId: "text",
    subjectDescription: "text",
    "$**": "text", // Search across all fields within the document
  },
  {
    name: "Subject_Text_Index", // Optional: name for the index
    default_language: "english", // Optional: specify language for text indexing
  }
);

const Subject = mongoose.model("Subject", SubjectSchema);

const ScheduleSchema = mongoose.Schema({
  time: {
    type: String,
  },
  day: {
    type: String,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Subject,
  },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

const StudenScheduleSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Schedule,
  },
});

const StudenSchedule = mongoose.model("StudenSchedule", StudenScheduleSchema);

const PaymentSchema = mongoose.Schema({
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student,
  },
  status: {
    type: String,
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = {
  Department,
  Course,
  Student,
  Instructor,
  Subject,
  Schedule,
  Payment,
  StudenSchedule,
};
