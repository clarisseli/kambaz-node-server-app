import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import upload from "./uploadMiddleware.js";

export default function CourseRoutes(app) {
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    });

    app.get("/api/courses/:cid", async (req, res) => {
        const { cid } = req.params;
        const status = await dao.getCourse(cid);
        res.send(status);
    });

    app.delete("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    });

    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });

    app.post("/api/courses", async (req, res) => {
        const course = await dao.createCourse(req.body);
        const currentUser = req.session["currentUser"];
        if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        }
        res.json(course);
    });

    // Image upload endpoint
    app.post("/api/courses/:courseId/image", upload.single('courseImage'), async (req, res) => {
        try {
            const { courseId } = req.params;

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Update course with new image path
            const imagePath = `/images/coursePics/${req.file.filename}`;
            await dao.updateCourse(courseId, { image: imagePath });

            res.json({
                success: true,
                imagePath: imagePath,
                message: "Image uploaded successfully"
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.send(modules);
    });

    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module);
        res.send(newModule);
    });

    app.get("/api/courses/:cid/users", async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    });
}