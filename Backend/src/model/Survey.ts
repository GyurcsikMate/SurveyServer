import mongoose, { Schema, Document } from "mongoose";
import { IQuestion, QuestionSchema } from "./Question";

// Define the interface representing the document itself for Survey
export interface ISurvey extends Document {
  name: string;
  owner_id: string;
  questions: IQuestion[];
  responses: string[];
  appendResponse: (response: string) => void;
  addQuestion: (question: IQuestion) => void;
  removeQuestion: (index: number) => void;
  switchQuestionsPosition: (index1: number, index2: number) => void;
  editQuestion: (index: number, updatedQuestion: IQuestion) => void; // Method signature
}

// Define the schema for Survey
export const SurveySchema: Schema = new Schema({
  name: { type: String, required: true },
  owner_id: { type: String, required: true },
  questions: [QuestionSchema], // Embedded schema
  responses: { type: [String], required: true },
});

// Define instance method to append response
SurveySchema.methods.appendResponse = function (
  this: ISurvey,
  response: string
): void {
  this.responses.push(response);
};

// Define instance method to add a new question
SurveySchema.methods.addQuestion = function (
  this: ISurvey,
  question: IQuestion
): void {
  this.questions.push(question);
};

// Define instance method to remove a question
SurveySchema.methods.removeQuestion = function (
  this: ISurvey,
  index: number
): void {
  if (index >= 0 && index < this.questions.length) {
    this.questions.splice(index, 1);
  }
};

// Define instance method to switch the positions of two questions
SurveySchema.methods.switchQuestionsPosition = function (
  this: ISurvey,
  index1: number,
  index2: number
): void {
  if (
    index1 >= 0 &&
    index1 < this.questions.length &&
    index2 >= 0 &&
    index2 < this.questions.length
  ) {
    const temp = this.questions[index1];
    this.questions[index1] = this.questions[index2];
    this.questions[index2] = temp;
  }
};

// Define instance method to edit a question
SurveySchema.methods.editQuestion = function (
  this: ISurvey,
  index: number,
  updatedQuestion: IQuestion
): void {
  if (index >= 0 && index < this.questions.length) {
    this.questions[index] = updatedQuestion;
  }
};

// Define and export the model for Survey
const Survey = mongoose.model<ISurvey>("Survey", SurveySchema);

export default Survey;
