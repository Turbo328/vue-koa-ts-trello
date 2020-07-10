import axios from "axios"
import TMessage from "@/components/TMessage/TMessage"

axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH

// 请求拦截器统一处理鉴权
axios.interceptors.request.use((configs) => {
    try {
        let { authorization } = JSON.parse(localStorage.getItem("user"))
        if (authorization) {
            configs.headers.common.authorization = authorization
        }
    } catch (e) {}
    return configs
})

// 响应拦截器统一处理请求提示
axios.interceptors.response.use(
    (response) => {
        return response
    },
    (err) => {
        let { message, errorDetails } = err.response.data
        if (errorDetails) {
            message += " : " + errorDetails
        }
        TMessage.error(message);
        throw err;
    }
)

// 注册
export const register = (data) => {
    return axios({
        method: "post",
        url: "/user/register",
        data,
    })
}

// 登录
export const login = (data) => {
    return axios({
        method: "post",
        url: "/user/login",
        data,
    })
}

// 看板
// 获取所有看板
export const getBoards = () => {
    return axios({
        url: '/board'
    })
}

// 创建一个新看板
export const postBoard = (data) => {
    return axios({
        method: 'post',
        url: '/board',
        data
    })
}

// 获取指定看板
export const getBoard = (id) => {
    return axios({
        url: '/board/' + id
    })
}

// 获取指定看板下的所有列表集合
export const getLists = (boardId) => {
    return axios({
        url: '/list/',
        params: {
            boardId
        }
    })
}

// 添加一个新的列表
export const postList = data => {
    return axios({
        method: 'post',
        url: '/list',
        data
    })
}

// 编辑更新指定列表
export const putList = data => {
    return axios({
        method: 'put',
        url: '/list/' + data.id,
        data
    })
}

// 获取指定列表下的所有卡片
export const getCards = boardListId => {
    return axios({
        url: '/card',
        params: {
            boardListId
        }
    })
}

// 添加一张新的卡片
export const postCard = data => {
    return axios({
        method: 'post',
        url: 'card',
        data
    })
}

// 编辑更新指定卡片
export const putCard = data => {
    return axios({
        method: 'put',
        url: '/card/' + data.id,
        data
    })
}

// 上传附件
export const uploadAttachment = data => {
    // axios 会自动将 FormData 实例对象设置成二进制的 Content-Type
    let fd = new FormData();
    fd.append('boardListCardId', data.boardListCardId);
    fd.append('attachment', data.file);

    return axios({
        method: 'post',
        url: '/card/attachment',
        data: fd
    })
}

// 删除附件
export const removeAttachment = data => {
    return axios({
        method: 'delete',
        url: '/card/attachment/' + data.id
    })
}

// 设置封面
export const setCover = data => {
    return axios({
        method: 'put',
        url: '/card/attachment/cover/' + data.id
    })
}

// 移除封面
export const removeCover = data => {
    return axios({
        method: 'delete',
        url: '/card/attachment/cover/' + data.id
    })
}

// 获取评论列表
export const getComments = params => {
    return axios({
        url: '/comment',
        params
    })
}

// 添加评论
export const postComment = data => {
    return axios({
        method: 'post',
        url: '/comment',
        data
    })
}