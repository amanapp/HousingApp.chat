import { Response, Request } from "express";
import { HttpStatusCode } from "../constant/status.constant";
import { getConnectedUser } from "../services/get_connected_user.services";

/**
 * @description whisted the property
 * @param req 
 * @param res 
 */
export const GetConnectedUser = async (req: Request, res: Response) => {
  try {
    const user = await getConnectedUser();
    res
      .status(HttpStatusCode.CREATED)
      .json({ message: user });
  } catch (e) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: e.message });
  }
};
