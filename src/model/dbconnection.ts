import mongoose from "mongoose";

import '../config/env'
import { logger } from "../middleware/winsdon.middleware";
const url = process.env.DB_CONNECTION_URL;

export const connection = async () => {
  try {
    await mongoose.connect(url);
    logger.log({level:"info",message:`Succesfully connected to the db`});
  } catch (e) {
    logger.log({level:"error",message:"ERRRRRR"});
  }
};

