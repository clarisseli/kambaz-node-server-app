import model from "./model.js"

export function findAllAssignments() {
    return model.find();
}

export function findAssignment(cid, aid) {
    return model.find({ course: cid, _id: aid })
}

export function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId })
}

export function createAssignment(assignment) {
    return model.create(assignment);
}

export function deleteAssignment(cid, aid) {
    return model.deleteOne({ course: cid, _id: aid })
}

export function updateAssignment(assignmentUpdates) {
    return model.updateOne({ _id: assignmentUpdates._id }, { $set: assignmentUpdates });
}