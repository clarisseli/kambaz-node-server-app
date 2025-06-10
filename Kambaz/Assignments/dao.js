import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllAssignments() {
    return Database.assignments;
}

export function findAssignment(cid, aid) {
    const { assignments } = Database;
    const assignment = assignments.find((a) => a.course === cid && a._id === aid);
    return assignment;
}

export function findAssignmentsForCourse(courseId) {
    const { assignments } = Database;
    const assignmentsForCourse = assignments.filter((a) => a.course === courseId);
    return assignmentsForCourse;
}

export function createAssignment(assignment) {
    const newAssignment = {
        ...assignment,
        _id: assignment._id || uuidv4()
    };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
}

export function deleteAssignment(cid, aid) {
    const assignments = Database.assignments;
    Database.assignments = assignments.filter((a) => !(a.course === cid && a._id === aid));
    return { message: "Assignment deleted successfully" };
}

export function updateAssignment(assignmentUpdates) {
    const assignments = Database.assignments;
    const assignment = assignments.find((a) => a._id === assignmentUpdates._id);
    if (!assignment) {
        return null;
    }
    Object.assign(assignment, assignmentUpdates);
    return assignment;
}