import Url from "../models/urlSchema";
import { Request,Response } from "express";
import { url } from "inspector";
import { nanoid } from "nanoid";
// nanoid v5 is ESM-only; use dynamic import in CommonJS output

interface urlData{
    link : string

}

export const urlRegister = async(req:Request,res:Response)=>{
    const {link} = req.body as urlData
    console.log(link)
    try {
        if(!link){
            return res.status(404).json({status:404,message:"PLease enter a valid url"})
        }
        
        const url_code:string = nanoid(6)
        console.log(url_code)
        const url = await Url.create({
            original_link : link,
            short_code : url_code,
        })
        console.log(url)

        return res.status(201).json({status:201,data:{ shortned_url : `http://localhost:5500/${url?.short_code}`,click_count:url.click_count},message:"Url shortned successfully"})
        
    } catch (error) {
        return res.status(500).json({status:500,message:"Internal Server error"})
    }
}

export const redirect = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;
  
    if (!code) {
      res.status(400).json({ status: 400, message: "Missing short code" });
      return;
    }

    try {
      const url = await Url.findOne({ short_code: code });

      if (!url) {
        res.status(404).json({ status: 404, message: "No URL found for this code" });
        return;
      }
  
      url.click_count += 1;
      await url.save();
      let link: string = url.original_link.trim();
        if (!/^https?:\/\//i.test(link)) {
        link = "https://" + link;
        }
      res.redirect(link);
    } catch (error) {
      console.error("Redirect error:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  };
