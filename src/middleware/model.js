import model from "../model/model";
export default async (ctx,next)=>{
    ctx.model = model;
    await next();
}