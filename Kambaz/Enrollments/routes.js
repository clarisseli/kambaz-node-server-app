import * as enrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    app.get("/api/enrollments", (req, res) => {
        try {
            const enrollments = enrollmentsDao.getEnrollments();
            res.send(enrollments);
        } catch (error) {
            console.error('Error getting enrollments:', error);
            res.sendStatus(500);
        }
    });

    app.post("/api/enrollments/:uid/:cid", (req, res) => {
        const { uid, cid } = req.params;
        try {
            const status = enrollmentsDao.enrollUserInCourse(uid, cid);
            res.sendStatus(status);
        } catch (error) {
            console.error('ROUTE Error enrolling user:', error);
            res.sendStatus(500);
        }
    });

    app.delete("/api/enrollments/:uid/:cid", (req, res) => {
        const { uid, cid } = req.params;
        try {
            const status = enrollmentsDao.unenrollUserInCourse(uid, cid);
            res.sendStatus(status);
        } catch (error) {
            console.error('ROUTE Error unenrolling user:', error);
            res.sendStatus(500);
        }
    });
}