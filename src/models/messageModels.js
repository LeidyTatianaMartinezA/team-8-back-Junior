import { Schema, model} from "mongoose";

const messageSchema = new Schema({
  name: { type: String },
  message: { type: String }
});

export default model('Message', messageSchema);