import * as dao from "./dao.js";

export default function QuizzesRoutes(app) {
    app.get("/api/quizzes/summary/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const { search } = req.query;
        try {
            let quizzes = await dao.getQuizSummariesForCourse(courseId);
            if (search) {
                quizzes = quizzes.filter(quiz =>
                    quiz.title.toLowerCase().includes(search.toLowerCase())
                );
            }
            const summaries = quizzes.map(quiz => ({
                id: quiz._id,
                title: quiz.title,
                availableFrom: quiz.availableFrom,
                availableUntil: quiz.availableUntil,
                dueDate: quiz.dueDate,
                points: quiz.points,
                questionsCount: quiz.questions ? quiz.questions.length : 0,
                published: quiz.isPublished,
                _id: quiz._id
            }));
            res.json(summaries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        try {
            const quiz = await dao.getQuizById(quizId);
            res.json({ quiz: quiz });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        try {
            const questions = await dao.getQuestionsForQuiz(quizId);
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/quizzes/attempts/:attemptId", async (req, res) => {
        const { attemptId } = req.params;
        try {
            const quizAttempt = await dao.getQuizAttemptById(attemptId);
            res.json(quizAttempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/quizzes/attempts/:quizId/user/:userId", async (req, res) => {
        const { quizId, userId } = req.params;
        try {
            const quizAttempts = await dao.getQuizAttemptsForUser(quizId, userId);
            res.json(quizAttempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/quizzes/new", async (req, res) => {
        try {
            const newQuiz = req.body;
            if (newQuiz.questions) {
                newQuiz.questions = newQuiz.questions.map(q => {
                    const question = { ...q };
                    if (question.type === "MULTIPLE-CHOICE") {
                        if (question.multipleAnswers) {
                            question.correctChoices = question.correctChoices || [];
                            delete question.correctChoice;
                        } else {
                            question.correctChoice = question.correctChoice ?? 0;
                            delete question.correctChoices;
                        }
                    } else if (question.type === "FILL-IN-THE-BLANK") {
                        if (question.blanks && question.blanks.length > 0) {
                            question.blanks = question.blanks.map(blank => ({
                                id: blank.id || `blank-${Date.now()}-${Math.random()}`,
                                possibleAnswers: blank.possibleAnswers || []
                            }));
                        }
                    }
                    return question;
                });
            }
            const createdQuiz = await dao.createNewQuiz({ ...newQuiz, questions: newQuiz.questions || [] });
            res.json(createdQuiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/quizzes/attempts/new", async (req, res) => {
        const { quizId, userId, answers, score, timeTakenSeconds } = req.body;
        try {
            const quizAttempt = {
                attemptId: `${Date.now()}`,
                quizId,
                userId,
                score,
                answers,
                submittedAt: new Date(),
                timeTakenSeconds: timeTakenSeconds || 0
            };
            const result = await dao.createQuizAttempt(quizAttempt);
            if (!result) {
                throw new Error("Failed to create quiz attempt");
            }
            res.json({ attemptId: result.attemptId, success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/quizzes/:quizId", async (req, res) => {
        try {
            const { quizId } = req.params;
            const updatedQuiz = req.body;
            await dao.updateQuiz(updatedQuiz);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/quizzes/:quizId/attempts/count/:userId", async (req, res) => {
        const { quizId, userId } = req.params;
        try {
            const attemptCount = await dao.getQuizAttemptsCountForUser(quizId, userId);
            res.json({ count: attemptCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const updatedQuestion = req.body;
        try {
            await dao.updateQuestion(quizId, questionId, updatedQuestion);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const updatedQuestionList = req.body;
        try {
            await dao.updateQuestionsOfQuiz(quizId, updatedQuestionList);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/quizzes/:quizId/publish", async (req, res) => {
        const { quizId } = req.params;
        const { published } = req.body;
        try {
            await dao.setPublishStatusForQuiz(quizId, published);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        try {
            await dao.deleteQuiz(quizId);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/quizzes/attempts/:attemptId", async (req, res) => {
        const { attemptId } = req.params;
        try {
            await dao.deleteQuizAttemptById(attemptId);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}