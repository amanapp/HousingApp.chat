import ChatModel from '../model/chat.model'
/**
 * @description get connected users
 */
export async function getConnectedUser(): Promise<any> {
  try {
    const result=await ChatModel.find({},{sender_name:1,receiver_name:1,_id:0});
   
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
}
