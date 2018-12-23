import heper from "../util/heper";
export default async (ctx,next)=>{
    ctx.heper = heper;
    await next();
}