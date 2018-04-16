/*
    model_private文件夹中存在的是无需暴露接口的业务层逻辑类，可以理解为"私有"
 */
export default class {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async TestInside({name}) {
        return {message: `hello ${name}`}
    }
}

















