import mongoose from "mongoose";

const blankSchema = new mongoose.Schema({
    id: { type: String, required: true },
    possibleAnswers: { type: [String], default: [] }
});

const questionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, default: "" },
    points: { type: Number, default: 0 },
    description: { type: String, default: "" },
    type: {
        type: String,
        enum: ["MULTIPLE-CHOICE", "TRUE-FALSE", "FILL-IN-THE-BLANK"],
        default: "MULTIPLE-CHOICE",
    },
    choices: { type: [String], default: [] },
    correctChoice: { type: Number, default: 0 },
    correctChoices: { type: [Number], default: [] },
    multipleAnswers: { type: Boolean, default: false },
    correctAnswer: { type: Boolean, default: true },
    answers: { type: [String], default: [] },
    blanks: { type: [blankSchema], default: [] }
});

const quizAttemptSchema = new mongoose.Schema({
    attemptId: { type: String, required: true },
    quizId: { type: String, required: true },
    uid: { type: String, required: true },
    score: { type: Number, default: 0 },
    answers: { type: mongoose.Schema.Types.Mixed },
    submittedAt: { type: Date, default: Date.now },
    timeTakenSeconds: { type: Number, default: 0 }
});

const quizSchema = new mongoose.Schema({
    _id: String,
    course: { type: String, ref: "CourseModel", required: true },
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    type: {
        type: String,
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz"
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
        type: String,
        enum: ["Quizzes", "Exams", "Assignments", "Project"],
        default: "Quizzes"
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    viewResponses: {
        type: String,
        enum: ["Always", "Never"],
        default: "Always"
    },
    showCorrectAnswers: {
        type: String,
        enum: ["Immediately", "Never"],
        default: "Immediately"
    },
    accessCode: { type: String, default: "" },
    oneQuestionAtTime: { type: Boolean, default: true },
    requireRespondusLockDownBrowser: { type: Boolean, default: false },
    requiredToViewQuizResults: { type: Boolean, default: false },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: { type: Date, default: Date.now },
    availableFrom: { type: Date, default: Date.now },
    availableUntil: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    questions: { type: [questionSchema], default: [] },
    attempts: {
        type: Map,
        of: [quizAttemptSchema],
        default: {}
    }
}, { collection: "quizzes" });

export default quizSchema;