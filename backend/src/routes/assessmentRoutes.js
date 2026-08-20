const express = require('express');
const router = express.Router();
const {
  createSubject, getSubjects,
  createTopic, getTopicsBySubject,
  createQuestion, getQuestionsByTopic,
  createQuiz, getQuizzesBySubject,
  getTodayQuizzes, getQuizById,
  submitQuiz, getMyResults
} = require('../controllers/assessmentController');
const { protect, adminOrTrainer } = require('../middleware/authMiddleware');

// Subjects
router.post('/subjects', protect, adminOrTrainer, createSubject);
router.get('/subjects', protect, getSubjects);

// Topics
router.post('/topics', protect, adminOrTrainer, createTopic);
router.get('/subjects/:subjectId/topics', protect, getTopicsBySubject);

// Questions
router.post('/questions', protect, adminOrTrainer, createQuestion);
router.get('/topics/:topicId/questions', protect, getQuestionsByTopic);

// Quizzes
router.post('/quizzes', protect, adminOrTrainer, createQuiz);
router.get('/quizzes/today', protect, getTodayQuizzes);
router.get('/quizzes/:quizId', protect, getQuizById);
router.post('/quizzes/:quizId/submit', protect, submitQuiz);
router.get('/subjects/:subjectId/quizzes', protect, getQuizzesBySubject);

// Results
router.get('/results/me', protect, getMyResults);

module.exports = router;
