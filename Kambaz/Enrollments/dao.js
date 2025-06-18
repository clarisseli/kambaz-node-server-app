import model from "./model.js";

export async function getEnrollments() {
    const enrollments = await model.find();
    return enrollments;
}
export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    const validCourses = enrollments
        .filter(enrollment => enrollment.course !== null)
        .map(enrollment => enrollment.course);
    return validCourses;
}
export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
}
export async function enrollUserInCourse(user, course) {
    const existingEnrollment = await model.findOne({ user, course });
    if (existingEnrollment) {
        return existingEnrollment;
    }
    const newEnrollment = { user, course, _id: `${user}-${course}` };
    const result = await model.create(newEnrollment);
    return result;
}
export function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
}
