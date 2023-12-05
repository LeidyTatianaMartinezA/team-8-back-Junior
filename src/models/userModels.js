import { Schema, model} from "mongoose";

const usersSchema = new Schema({
  name: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  rol: { type: String }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Users', usersSchema);