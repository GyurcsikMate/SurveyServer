import mongoose, { Schema, Document } from "mongoose";

// Define the interface representing the document itself for Question
interface IQuestion extends Document {
  question_type: string;
  question_text: string;
  question_options: string[];
  answers: string[];
}

// Define the schema for Question
const QuestionSchema: Schema = new Schema({
  question_type: { type: String, required: true },
  question_text: { type: String, required: true },
  question_options: { type: [String], required: true },
  answers: { type: [String], required: true },
});

// Define the interface representing the document itself for SurveyResponse
interface ISurveyResponse extends Document {
  survey_responder_id: string;
  survey_id: string;
  questions: IQuestion[];
}

// Define the schema for SurveyResponse
const SurveyResponseSchema: Schema = new Schema({
  survey_responder_id: { type: String, required: true },
  survey_id: { type: String, required: true },
  questions: [QuestionSchema], // Embedded schema
});

// Define and export the model for SurveyResponse
const SurveyResponse = mongoose.model<ISurveyResponse>(
  "SurveyResponse",
  SurveyResponseSchema
);

export default SurveyResponse;
