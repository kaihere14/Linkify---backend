import { Router } from "express";
const router =  Router()
import { urlRegister } from "../controller/url.controller.js";

router.post("/shorten",urlRegister)


export default router