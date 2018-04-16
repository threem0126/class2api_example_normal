import {createServer} from 'class2api'
import GKModelA from './model/GKModelA'
import _config from "./config.js" ;

let node_env = process.env.NODE_ENV || "development"
let port = process.env.PORT || _config.PORT || 3002
let isDev = (node_env === "development")

//在API方法执行前
const beforeCall = async ({req, params, modelSetting})=> {
    let {__Auth} = modelSetting
    if (isDev) {
        console.log(`[${ req.originalUrl }] beforeCall: `)
        console.log('==> invoke params:....' + JSON.stringify(params))
        console.log('==> req.cookies:....' + JSON.stringify(req.cookies))
    }
    //根据类的__Auth配置来进行身份验证,具体的验证逻辑由类的修饰器配置决定，这里不进行类静态方法的权限认证
    if (__Auth) {
        let userInfo = await __Auth({req})
        params.uID = userInfo.uID
    }
    return params
}

//在API方法执行后
const afterCall = async ({req,result})=> {
    /*
    TODO:在API方法执行完成后，进行的拦截处理，可以做日志记录、对结果result的二次加工处理等
     */
    console.log(`[${ req.originalUrl }] afterCall: ${ JSON.stringify(result) }`)
    return result
}


//创建微服务对象
createServer({
    config: {
        apiroot: '/',
        cros: true,
    },
    // 将GKModelA类映射路径取别名a2
    modelClasses:[{model:GKModelA, as:'a2'}],
    beforeCall,
    afterCall,
    custom:(expressInstence)=> {
        //TODO：对express对象的扩展设置...
        return expressInstence
    }
}).then((server)=>{
    //开始监听指定的端口
    server.listen(port, "0.0.0.0", function onStart(err) {
        if (err)  console.log(err);
        console.info("==> 🌎 Listening on http://0.0.0.0:%s/. wait request ...", port);
        if(isDev) console.info("==> For Test: $ mocha test/test.run.js");
    });

}).catch((error)=>{
    setTimeout(()=>{throw  error})
})
