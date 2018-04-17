/*
    model文件夹中存在的都是需暴露接口的业务层逻辑类，可以理解为"对外开放"
 */


import {GKSUCCESS,modelSetting} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import Base from './../model_private/Base'

@modelSetting({
    __Auth:async ({req})=> {
        console.log("Do Authing of GKModelA ....")
        //TODO:验证req请求中的身份信息，比如解析header中的token信息
        /*
         */
        //最终返回用户信息对象（具体数据结构因项目而异）
        return {uID:1,username:"huangyong",age:23}
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async hello({name}) {
        return {message: `this is a message from Api: got name [${name}]`}
    }

    /**
     * getArticle
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async getArticle({uID, name}) {
        //..模拟一个错误信息
        // throw GKErrors._SERVER_ERROR('错误1')
        //..
        return {
            message: `getArticle.${name}, user.uID = ${uID}, ${ Base.TestInside({name}) }`,
            article: require('fixture/article.json')
        }
    }

    static async editArticle({aID}) {
        //...
        return GKSUCCESS()
    }

    static async deleteArticle({aID}) {
        //...
        return GKSUCCESS()
    }

    static async customResponseResultStruck() {
        //TODO:.....

        //class2api内部会判断，如果API方法返回的是Function，则框架会把函数的运行执行结果返回给客户端，以实现自定义特殊的response结构
        return () => {
            return {data: {name: 'huangyong'}, errorCode: 123}
        }
    }

}

export default GKModelA