import { Router } from "express";
const router =  Router()
import { urlRegister } from "../controller/url.controller";

router.post("/shorten",urlRegister)


export default router