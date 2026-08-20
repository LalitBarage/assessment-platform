const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed, // stores { questionId: 'answer_text' }
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Result', resultSchema);
