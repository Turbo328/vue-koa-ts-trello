<template>
    <div id="home">
        <t-header></t-header>
        <main>
            <h2>
                <span class="icon icon-board"></span>
                我的看板
            </h2>
            <ul class="board-items">
                <router-link
                    class="board-item"
                    v-for="board of boards"
                    :key="board.id"
                    tag="li"
                    :to="{name: 'Board', params: {id: board.id}}"
                >
                    <span class="title">{{board.name}}</span>
                </router-link>
                <li class="board-item create-new-board">
                    <textarea
                        class="title form-field-input"
                        placeholder="创建新看板"
                        ref="newBoardName"
                        @blur="postBoard"
                    ></textarea>
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
import THeader from '@/components/THeader';
import {mapState} from 'vuex';

export default {
    name: 'Home',
    components: {
        THeader
    },
    computed: {
        ...mapState('board', {
            boards: state => state.boards,
            inited: state => state.inited
        })
    },
    created() {
        if (!this.inited) {
            this.$store.dispatch('board/getBoards')
        }
    },
    methods: {
        async postBoard() {
            let val = this.$refs.newBoardName.value;
            if (val.trim() !== '') {
                try {
                    this.$store.dispatch('board/postBoard', {
                        name: val
                    });
                    this.$refs.newBoardName.value = '';
                    this.$message.success('看板创建成功');
                } catch (e) {
                    
                }
            }
        }
    }
}
</script>
