import mongoose, { Schema, Document } from "mongoose";
import { IQuestion, QuestionSchema } from "./Question";

// Define the interface representing the document itself for SurveyResponse
export interface ISurveyResponse extends Document {
  survey_responder_id: string;
  survey_id: string;
  questions: IQuestion[];
}

// Define the schema for SurveyResponse
export const SurveyResponseSchema: Schema = new Schema({
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
