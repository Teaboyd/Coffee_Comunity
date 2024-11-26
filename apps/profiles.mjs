import express from "express";
import {protect} from "../middlewares/protect.mjs"
import User from "../modules/users.mjs";
import Profile from "../modules/profiles.mjs";

const profileRouter = express.Router();
                                                                                                                                                      

export default profileRouter;