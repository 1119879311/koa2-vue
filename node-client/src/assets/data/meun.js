export default
[   
    {"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0},
    {"path":"/admin/blog","name":"blog","title":"cms","id":5,"pid":0,"children":
        [
            {"path":"/admin/blog/article","name":"article","title":"帖子管理","id":6,"pid":5,"children":[]},
            {"path":"/admin/blog/cate","name":"cate","title":"分类管理","id":7,"pid":5,"children":[]},
            {"path":"/admin/blog/tab","name":"tab","title":"标签管理","id":8,"pid":5,"children":[]}
        ]
    },
    {"path":"/admin/rbac","name":"system","title":"rbac","id":1,"pid":0,"children":
        [
            {"path":"/admin/rbac/user","name":"user","title":"管理员","id":2,"pid":1,"children":[]},
            {"path":"/admin/rbac/role","name":"role","title":"角色管理","id":3,"pid":1,"children":[]},
            {"path":"/admin/rbac/auth","name":"auth","title":"权限管理","id":4,"pid":1,"children":[]}
        ],   
    },
    
]