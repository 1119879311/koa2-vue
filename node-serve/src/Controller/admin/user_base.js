const {userAuth} = imports("Lib/permission")

module.exports = class {
    @userAuth()
    async __before(){
        
   }
}