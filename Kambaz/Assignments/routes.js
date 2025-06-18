import * as dao from "./dao.js";

export default function AssignmentsRoutes(app) {
    app.get("/api/assignments", async (req, res) => {
        try {
            const assignments = await dao.findAllAssignments();
            res.json(assignments);
        } catch (error) {
            console.error("Error in GET /api/assignments:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/assignments/:cid/:aid", async (req, res) => {
        const { cid, aid } = req.params;
        try {
            const assignment = await dao.findAssignment(cid, aid);
            res.send(assignment);
        } catch (error) {
            console.error("Error getting assignment:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/assignments/:cid", async (req, res) => {
        const { cid } = req.params;
        try {
            const assignments = await dao.findAssignmentsForCourse(cid);
            res.json(assignments);
        } catch (error) {
            console.error("Error getting assignments for course:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/assignments/:cid", async (req, res) => {
        const { cid } = req.params;
        try {
            const assignment = {
                ...req.body,
                course: cid,
                _id: req.body._id || `A${Date.now()}`
            };
            const newAssignment = await dao.createAssignment(assignment);
            res.status(201).json(newAssignment);
        } catch (error) {
            console.error("Error creating assignment:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/assignments/:cid/:aid", async (req, res) => {
        const { cid, aid } = req.params;
        try {
            const status = await dao.deleteAssignment(cid, aid);
            res.json(status);
        } catch (error) {
            console.error("Error deleting assignment:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/assignments/:aid", async (req, res) => {
        const { aid } = req.params;
        try {
            const assignmentUpdates = { ...req.body, _id: aid };
            const updatedAssignment = await dao.updateAssignment(assignmentUpdates);
            if (updatedAssignment) {
                res.json(updatedAssignment);
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            console.error("Error updating assignment:", error);
            res.status(500).json({ error: error.message });
        }
    });
}