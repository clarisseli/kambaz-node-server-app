import model from "./model.js";

export async function getQuizSummariesForCourse(courseId) {
    const quizzes = await model.find({ course: courseId });
    return quizzes.map(quiz => {
        const questionsArray = quiz.questions || [];
        return {
            ...quiz.toObject(),
            questionsCount: questionsArray.length,
            viewResponses: quiz.viewResponses || "Always",
            showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
            requireRespondusLockDownBrowser: quiz.requireRespondusLockDownBrowser || false,
            requiredToViewQuizResults: quiz.requiredToViewQuizResults || false
        };
    });
}

export async function getQuizById(quizId) {
    const quiz = await model.findById(quizId);
    if (quiz) {
        quiz.viewResponses = quiz.viewResponses || "Always";
        quiz.showCorrectAnswers = quiz.showCorrectAnswers || "Immediately";
        quiz.requireRespondusLockDownBrowser = quiz.requireRespondusLockDownBrowser || false;
        quiz.requiredToViewQuizResults = quiz.requiredToViewQuizResults || false;

        if (quiz.questions) {
            quiz.questions = quiz.questions.map(q => {
                const question = q.toObject ? q.toObject() : q;
                if (question.type === "MULTIPLE-CHOICE") {
                    question.choices = question.choices || [];
                    question.multipleAnswers = !!question.multipleAnswers;
                    if (question.multipleAnswers) {
                        question.correctChoices = Array.isArray(question.correctChoices) ? question.correctChoices : [];
                    } else {
                        question.correctChoice = question.correctChoice ?? 0;
                    }
                } else if (question.type === "FILL-IN-THE-BLANK") {
                    if (!question.blanks || question.blanks.length === 0) {
                        if (question.answers && question.answers.length > 0) {
                            question.blanks = [{
                                id: `blank-${Date.now()}`,
                                possibleAnswers: question.answers
                            }];
                        } else {
                            question.blanks = [{
                                id: `blank-${Date.now()}`,
                                possibleAnswers: [""]
                            }];
                        }
                    }
                    question.answers = question.answers || [];
                }
                return question;
            });
        }
    }
    return quiz;
}

export function setPublishStatusForQuiz(quizId, isPublished) {
    return model.updateOne({ _id: quizId }, { $set: { isPublished } });
}

export function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
}

export async function updateQuiz(updatedQuiz) {
    const quizToUpdate = {
        ...updatedQuiz,
        questions: updatedQuiz.questions || [],
        viewResponses: updatedQuiz.viewResponses || "Always",
        showCorrectAnswers: updatedQuiz.showCorrectAnswers || "Immediately",
        requireRespondusLockDownBrowser: updatedQuiz.requireRespondusLockDownBrowser || false,
        requiredToViewQuizResults: updatedQuiz.requiredToViewQuizResults || false
    };

    quizToUpdate.questions = quizToUpdate.questions.map(q => {
        const question = { ...q };
        if (question.type === "MULTIPLE-CHOICE") {
            question.choices = question.choices || [];
            question.multipleAnswers = !!question.multipleAnswers;
            if (question.multipleAnswers) {
                question.correctChoices = Array.isArray(question.correctChoices) ? question.correctChoices.map(c => Number(c)) : [];
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
            } else if (question.answers && question.answers.length > 0) {
                question.blanks = [{
                    id: `blank-${Date.now()}`,
                    possibleAnswers: question.answers
                }];
            }
        }
        return question;
    });

    delete quizToUpdate.id;
    return model.updateOne({ _id: updatedQuiz._id }, { $set: quizToUpdate });
}

export function getQuestionsForQuiz(quizId) {
    return model.findById(quizId).then(quiz => quiz ? quiz.questions : []);
}

export async function updateQuestion(quizId, questionId, updatedQuestion) {
    const quiz = await model.findById(quizId);
    if (!quiz) return null;
    quiz.questions = quiz.questions.map(q => q.id === questionId ? updatedQuestion : q);
    return quiz.save();
}

export async function updateQuestionsOfQuiz(quizId, updatedQuestionList) {
    return model.updateOne({ _id: quizId }, { $set: { questions: updatedQuestionList } });
}

export async function createQuizAttempt(quizAttempt) {
    try {
        const quiz = await model.findById(quizAttempt.quizId);
        if (!quiz) {
            return null;
        }

        if (!quiz.attempts) {
            quiz.attempts = new Map();
        }

        const userId = quizAttempt.userId || quizAttempt.uid;
        const userAttempts = quiz.attempts.get(userId) || [];
        const newAttempt = {
            attemptId: quizAttempt.attemptId || `${Date.now()}`,
            quizId: quizAttempt.quizId,
            uid: userId,
            score: quizAttempt.score,
            answers: quizAttempt.answers,
            submittedAt: new Date(),
            timeTakenSeconds: quizAttempt.timeTakenSeconds || 0
        };

        userAttempts.push(newAttempt);
        quiz.attempts.set(userId, userAttempts);
        quiz.markModified('attempts');
        const savedQuiz = await quiz.save();
        return newAttempt;
    } catch (error) {
        throw error;
    }
}

export async function getQuizAttemptById(attemptId) {
    const quizzes = await model.find();
    for (const quiz of quizzes) {
        if (quiz.attempts) {
            for (const [userId, attempts] of quiz.attempts) {
                const attempt = attempts.find(a => a.attemptId === attemptId);
                if (attempt) return attempt;
            }
        }
    }
    return null;
}

export async function deleteQuizAttemptById(attemptId) {
    const quizzes = await model.find();
    for (const quiz of quizzes) {
        if (quiz.attempts) {
            for (const [userId, attempts] of quiz.attempts) {
                const filteredAttempts = attempts.filter(a => a.attemptId !== attemptId);
                if (filteredAttempts.length !== attempts.length) {
                    quiz.attempts.set(userId, filteredAttempts);
                    quiz.markModified('attempts');
                    return quiz.save();
                }
            }
        }
    }
    return null;
}

export async function getQuizAttemptsForUser(quizId, userId) {
    try {
        const quiz = await model.findById(quizId);
        if (!quiz || !quiz.attempts) return [];

        let attempts = quiz.attempts.get(userId);
        if (!attempts && userId.length === 24) {
            for (const [key, value] of quiz.attempts) {
                if (key === userId || key.toString() === userId) {
                    attempts = value;
                    break;
                }
            }
        }
        return attempts || [];
    } catch (error) {
        return [];
    }
}

export async function getQuizAttemptsCountForUser(quizId, userId) {
    const attempts = await getQuizAttemptsForUser(quizId, userId);
    return attempts.length;
}

export function createNewQuiz(quiz) {
    const quizWithDefaults = {
        ...quiz,
        questions: quiz.questions || [],
        viewResponses: quiz.viewResponses || "Always",
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        requireRespondusLockDownBrowser: quiz.requireRespondusLockDownBrowser || false,
        requiredToViewQuizResults: quiz.requiredToViewQuizResults || false
    };

    quizWithDefaults.questions = quizWithDefaults.questions.map(q => {
        const question = { ...q };
        if (question.type === "MULTIPLE-CHOICE" && question.multipleAnswers) {
            question.correctChoices = question.correctChoices || [];
        } else if (question.type === "FILL-IN-THE-BLANK" && question.blanks) {
            question.blanks = question.blanks.map(blank => ({
                id: blank.id || `blank-${Date.now()}-${Math.random()}`,
                possibleAnswers: blank.possibleAnswers || []
            }));
        }
        return question;
    });

    return model.create(quizWithDefaults);
}