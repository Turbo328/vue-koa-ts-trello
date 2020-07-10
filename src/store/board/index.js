import * as api from '@/api';

export default {
    namespaced: true,
    state: {
        // 是否已经初始化
        inited: false,
        // 设置为 null，而非 []
        // 方便判断当前是首次获取还是获取到一个空数组（用户没有看板时会返回空数组）
        boards: null
    },
    getters: {
        getBoard: ({boards}) => id => Array.isArray(boards) ? boards.find(board => board.id == id) : null
    },
    mutations: {
        updateBoards: (state, data) => {
            state.boards = data;
            state.inited = true;
        },
        addBoard: (state, data) => {
            if (state.boards === null) {
                state.boards = [];
            }
            state.boards = [...state.boards, data];
        }
    },
    actions: {
        getBoards: async ({commit}) => {
            try {
                let rs = await api.getBoards();
                commit('updateBoards', rs.data);
                return rs;
            } catch (e) {
                throw e;
            }
        },
        getBoard: async ({commit}, id) => {
            try {
                let rs = await api.getBoard(id);
                commit('addBoard', rs.data);
                return rs;
            } catch (e) {
                throw e;
            }
        },
        postBoard: async ({commit}, data) => {
            try {
                let rs = await api.postBoard(data);
                commit('addBoard', rs.data);
                return rs;
            } catch (e) {
                throw e;
            }
        }
    }
}