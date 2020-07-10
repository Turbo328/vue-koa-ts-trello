import { register, login } from "@/api"

export default {
    namespaced: true,
    state: {
        info: null
    },
    mutations: {
        // 因为每次页面刷新，state 中的 info 都会重置为 null
        // 这里初始化时先获取用户信息
        initUserInfo: state => {
            try {
                let data = JSON.parse(localStorage.getItem('user'));
                state.info = data;
            } catch (e) {}
        },
        updateUserInfo: (state, data) => {
            state.info = data;
            // 前端登录成功，将用户信息持久化存储到本地
            localStorage.setItem('user', JSON.stringify(data));
        },
        removeUserInfo: state => {
            state.info = null;
            localStorage.removeItem('user');
        }
    },
    actions: {
        register: ({}, data) => {
            return register(data)
        },
        login: async ({commit}, data) => {
            try {
                let rs = await login(data);

                let { id, name } = rs.data;
                let { authorization } = rs.headers;
                commit('updateUserInfo', {
                    id,
                    name,
                    authorization
                })

                return rs;
            } catch (e) {
                throw e;
            }
        },
        logout: async ({commit}) => {
            commit('removeUserInfo')
        }
    }
}