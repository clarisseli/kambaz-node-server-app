import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
    try {
        const { enrollments } = Database;
        const existingEnrollment = enrollments.find(
            (enrollment) => enrollment.course === courseId && enrollment.user === userId
        );
        if (existingEnrollment) {
            return 400;
        }
        const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
        enrollments.push(newEnrollment);
        return 201;
    } catch (error) {
        console.error(`DAO Error in enrollUserInCourse:`, error);
        throw error;
    }
}

export function unenrollUserInCourse(userId, courseId) {
    try {
        const { enrollments } = Database;
        const initialLength = enrollments.length;
        Database.enrollments = enrollments.filter(
            (enrollment) => !(enrollment.course === courseId && enrollment.user === userId)
        );
        if (Database.enrollments.length === initialLength) {
            return 404;
        }
        return 200;
    } catch (error) {
        console.error(`DAO Error in unenrollUserInCourse:`, error);
        throw error;
    }
}

export function getEnrollments() {
    const { enrollments } = Database;
    return enrollments;
}