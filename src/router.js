import { resolve } from "path"
import fs from "fs"
let rootPath = process.cwd();
let entryPath = process.env.NODE_ENV==="development"?"src":"dist";
console.log(entryPath)
let ctrPath = resolve(entryPath,'controller');

export default (app)=>{
    function loadCtr(rootPaths){
        try {
            var allfile = fs.readdirSync(rootPaths);   
            allfile.forEach((file)=>{
                var filePath = resolve(rootPaths,file)
                if(fs.lstatSync(filePath).isDirectory()){
                    loadCtr(filePath)
                }else{
                  let r =  require(filePath).default;
                  if(r&&r.router&&r.router.routes){
                      try {
                        app
                        .use(r.router.routes())
                      } catch (error) {
                          console.log(filePath)
                      }
                  }else{
                      // console.log("miss routes:--filename:"+filePath)
                  }
                }
            }) 
        } catch (error) {
            console.log(error)
            console.log("no such file or dir :---- "+rootPaths)
        } 
    }
    loadCtr(ctrPath);
}