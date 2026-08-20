const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// --- SUBJECTS ---
const createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const subject = await Subject.create({
      name,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- TOPICS ---
const createTopic = async (req, res) => {
  try {
    const { name, subject } = req.body;
    const topic = await Topic.create({
      name,
      subject,
      createdBy: req.user.id,
    });
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- QUESTIONS ---
const createQuestion = async (req, res) => {
  try {
    const { type, text, codeSnippet, options, correctAnswer, marks, subject, topic } = req.body;
    const question = await Question.create({
      type,
      text,
      codeSnippet,
      options,
      correctAnswer,
      marks: marks || 1,
      subject,
      topic,
      createdBy: req.user.id,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuestionsByTopic = async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topicId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- QUIZZES ---
const createQuiz = async (req, res) => {
  try {
    const { title, subject, topic, questions, duration, scheduledDate } = req.body;
    const quiz = await Quiz.create({
      title,
      subject,
      topic,
      questions,
      duration,
      scheduledDate,
      createdBy: req.user.id,
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuizzesBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subject: req.params.subjectId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTodayQuizzes = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const quizzes = await Quiz.find({
      scheduledDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- RESULTS ---
const submitQuiz = async (req, res) => {
  try {
    const { score, totalMarks, answers } = req.body;
    
    const result = await Result.create({
      student: req.user.id,
      quiz: req.params.quizId,
      score,
      totalMarks,
      answers
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate({
        path: 'quiz',
        select: 'title subject topic',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'topic', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  createTopic,
  getTopicsBySubject,
  createQuestion,
  getQuestionsByTopic,
  createQuiz,
  getQuizzesBySubject,
  getTodayQuizzes,
  getQuizById,
  submitQuiz,
  getMyResults,
};
