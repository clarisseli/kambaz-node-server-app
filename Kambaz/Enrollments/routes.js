import * as enrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    app.get("/api/enrollments", async (req, res) => {
        const enrollments = await enrollmentsDao.getEnrollments();
        res.json(enrollments);
    });

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };

    app.post("/api/enrollments/:uid/:cid", enrollUserInCourse);
    app.delete("/api/enrollments/:uid/:cid", unenrollUserFromCourse);
}