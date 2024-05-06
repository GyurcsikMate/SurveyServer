import mongoose, { Schema, Document } from "mongoose";

interface IQuestion extends Document {
  question_type: string;
  question_text: string;
  question_options: string[];
  answers: string[];
  answer: (newAnswer: string[]) => void;
}

const QuestionSchema: Schema = new Schema({
  question_type: { type: String, required: true },
  question_text: { type: String, required: true },
  question_options: { type: [String], required: true },
  answers: { type: [String], required: true },
});
QuestionSchema.methods.answer = function (
  this: IQuestion,
  newAnswer: string[]
): void {
  this.answers = newAnswer;
};

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
