import { Schema,Document,Model } from "mongoose";
import mongoose from "mongoose";



interface UrlData extends Document{
    original_link : string,
    click_count : number,
    short_code : string,
}

const urlSchema = new Schema<UrlData>({
    original_link: { type: String, required: true, trim: true },
    click_count: { type: Number, default: 0 },
    short_code: { type: String, required: true, unique: true },
  },{
    timestamps:true
  });

const Url: Model<UrlData> = mongoose.model<UrlData>("Url", urlSchema);
export default Url;