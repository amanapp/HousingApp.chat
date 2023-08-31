import express from 'express'
import { GetConnectedUser } from '../controller/get_connected_user.controller';


const routes =express.Router();

routes.get('/connected',GetConnectedUser)

export default routes;