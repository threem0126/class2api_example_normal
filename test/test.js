import should from 'should';
import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from 'class2api/testhelper'
import {GKErrors} from 'class2api/gkerrors'

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let isDev = (process.env.NODE_ENV ==="development" || !process.env.NODE_ENV)

//跨用例的"全局"变量，保存测试期间的全局共享数据
//在用例执行过程中，也可以在上文用例中暂存数据在_run对象里，然后在下文用例中获取
let _run = {
    accounts: {
        user1: {
            token: 'token-111'
        },
        admin: {
            jwtoken: 'jwtoken-333'
        }
    }
}

const remote_api = isDev ? `http://127.0.0.1:3002`:`其他环境的接口发布地址`;

//配置远程请求endpoint
setApiRoot(remote_api)

describe('接口网关', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        //将所有标记了ApiDesc实参的接口所执行的结果，汇总保存到Api文档
        save2Doc({save2File:'api.MD'})
    });
    //endregion

    it('/a2/hello（以get方式请求）', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1, 'get')(
            '/a2/hello',
            {name: "haungyong"}
        )
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('haungyong').should.be.above(-1)
    })

    it('/a2/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/a2/getArticle', {name:"haungyong"})
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('getArticle').should.be.above(-1)
    })

    it('/a2/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/a2/getArticle', {name:Math.random()})
        //console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('getArticle').should.be.above(-1)
    })

    it('/a2/editArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.admin)(
            '/a2/editArticle',
            {aID: Math.random()},
            ApiDesc(`编辑文章`))
        let {err,result:{success}} = response
        success.should.eql(true)
    })

    it('/a2/deleteArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.admin)(
            '/a2/deleteArticle',
            {aID: Math.random()},
            ApiDesc(`删除文章`))
        let {err,result:{success}} = response
        success.should.eql(true)
    })

})


