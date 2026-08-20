const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['objective', 'descriptive'],
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Please add question text'],
    },
    codeSnippet: {
      type: String,
    },
    options: {
      type: [String],
      validate: {
        validator: function(v) {
          if (this.type === 'objective') {
            return v && v.length === 4;
          }
          return true; // Not required for descriptive
        },
        message: 'Objective questions must have exactly 4 options.',
      },
    },
    correctAnswer: {
      type: String,
      required: function() {
        return this.type === 'objective';
      },
    },
    marks: {
      type: Number,
      default: 1,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
