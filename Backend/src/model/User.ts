import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { ISurvey, SurveySchema } from "./Survey";
import { ISurveyResponse, SurveyResponseSchema } from "./SurveyResponse";

const SALT_FACTOR = 10;

interface IUser extends Document {
  email: string;
  password: string;
  own_surveys: [ISurvey];
  completed_surveys: [ISurveyResponse];
  comparePassword: (
    candidatePassword: string,
    callback: (error: Error | null, isMatch: boolean) => void
  ) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  own_surveys: [SurveySchema],
  completed_surveys: [SurveyResponseSchema],
});

// hook
UserSchema.pre<IUser>("save", function (next) {
  const user = this;

  // hash password
  bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
    if (error) {
      return next(error);
    }
    bcrypt.hash(user.password, salt, (err, encrypted) => {
      if (err) {
        return next(err);
      }
      user.password = encrypted;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (error: Error | null, isMatch: boolean) => void
): void {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
    if (error) {
      callback(error, false);
    }
    callback(null, isMatch);
  });
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

/* THIS - JS - runtime binding
// explanation for this:
const test = {
    prop: 1,
    func: () => {
      return test.prop;
    },
};

const test = {
    prop: 1,
    func: function() {
        return this.prop;
    },
};

// Expected output: 1 */
