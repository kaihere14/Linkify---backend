import { Router } from "express";
const router =  Router()
import {redirect} from "../controller/url.controller.js";


router.get("/:code",redirect)

export default router