const addRouter =
     {path:"/admin",component:()=>import("@/pages/admin/layout"),children:
        [
            {path:"/admin",name:"adminIndex",title:"首页",component:()=>import("@/pages/admin")},

            {path:"/admin/rbac/user",name:"user",title:"管理员",component:()=>import("@/pages/admin/rbac/user")},
            {path:"/admin/rbac/role",name:"role",title:"角色管理",component:()=>import("@/pages/admin/rbac/role")},
            {path:"/admin/rbac/auth",name:"auth",title:"权限管理",component:()=>import("@/pages/admin/rbac/auth")},
            {path:"/admin/blog/article",name:"article",title:"帖子管理",component:()=>import("@/pages/admin/blog/article")},
            {path:"/admin/blog/articleAdd",name:"articleAdd",title:"添加帖子",component:()=>import("@/pages/admin/blog/articleAdd")},
            {path:"/admin/blog/article/:id",name:"articleUpdate",title:"查看帖子",component:()=>import("@/pages/admin/blog/articleUpdate")},
            {path:"/admin/blog/cate",name:"cate",title:"分类管理",component:()=>import("@/pages/admin/blog/cate")},
            {path:"/admin/blog/tab",name:"tab",title:"标签管理",component:()=>import("@/pages/admin/blog/tab")},

            {path:"/admin/error/404",name:"adminNofind",title:"404",component:()=>import("@/pages/common/404")},
            {path:"/admin/noauth",name:"noAuth",title:"没权限",component:()=>import("@/pages/common/noauthority")}

        ]
        
    };

export default addRouter;