import mongoose, { Document, Schema } from "mongoose";
interface Chat extends Document {
  sender_name: string;
  receiver_name:string;
  room_id:string;
  message:object;
}

const chatSchema: Schema<Chat> = new Schema<Chat>({
  sender_name: { type: String, required: true },
  receiver_name: { type: String, required: true },
  room_id: { type: String, required: true },
  message:{type:Array,required:false},
},{timestamps:true});

const ChatModel = mongoose.model<Chat>("Chat", chatSchema);

export default ChatModel;
