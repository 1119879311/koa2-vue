import {Controller, GET} from "../util/router_decorator"
import URModel from '../model/tk_user_role';

@Controller("/api/index")
export default class {

    @GET("/")
    async index(ctx, next) {
        let resRole = await URModel.getRole();
        ctx.body = await resRole;
    }
}