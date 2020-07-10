<template>
    <div id="board">

        <!--头部-->
        <t-header></t-header>

        <!--正文-->
        <main v-if="board">

            <h2>
                {{board.name}}
                <span class="btn btn-icon">
                    邀请
                </span>
            </h2>

            <!--看板容器-->
            <div class="board">

                <!--看板列表容器-->
                <t-list
                    v-for="list of lists"
                    :key="list.id"
                    :data="list"
                    @dragStart="dragStart"
                    @dragMove="dragMove"
                    @dragEnd="dragEnd"
                ></t-list>

                <!--无内容列表容器-->
                <div class="list-wrap no-content" :class="{'list-adding': listAdding}">

                    <div class="list-add" @click="showListAdding">
                        <span class="icon icon-add"></span>
                        <span>添加另一个列表</span>
                    </div>

                    <div class="list">

                        <div class="list-cards">
                            <div class="list-card-add-form">
                                <input
                                    class="form-field-input"
                                    ref="newListName"
                                    placeholder="为这张卡片添加标题……"
                                    @keydown.enter.prevent="addNewList"
                                />
                            </div>
                        </div>

                        <div class="list-footer">
                            <div class="list-add-confirm">
                                <button class="btn btn-success" @click="addNewList">添加列表</button>
                                <span class="icon icon-close" @click="hideListAdding"></span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </main>

        <router-view></router-view>
    </div>
</template>

<script>
import THeader from '@/components/THeader';
import TList from '@/components/TList';

export default {
    name: 'Board',
    components: {
        THeader,
        TList
    },
    data() {
        return {
            listAdding: false
        }
    },
    computed: {
        // 首次渲染时，board 为 null
        board() {
            return this.$store.getters['board/getBoard'](this.$route.params.id);
        },
        lists() {
            return this.$store.getters['list/getLists'](this.$route.params.id);
        }
    },
    created() {
        if (!this.board) {
            this.$store.dispatch('board/getBoard', this.$route.params.id);
        }
        if (!this.lists.length) {
            this.$store.dispatch('list/getLists', this.$route.params.id);
        }
    },
    methods: {
        // 显示添加列表的结构
        showListAdding() {
            this.listAdding = true;
            this.$nextTick(() => {
                this.$refs.newListName.focus();
            })
        },
        // 隐藏添加列表的结构
        hideListAdding() {
            this.listAdding = false;
            this.$refs.newListName.value = '';
        },
        // 提交添加新的列表
        async addNewList() {
            let {value, innerHTML} = this.$refs.newListName;
            if (value.trim() === '') {
                this.$refs.newListName.focus();
                return this.$message.warning('列表名称不能为空哦');
            } else {
                try {
                    await this.$store.dispatch('list/postList', {
                        boardId: this.board.id,
                        name: value
                    })
                    this.$message.success('列表添加成功啦');
                    this.hideListAdding();
                } catch (e) {}
            }
        },
        // 拖拽相关
        dragStart(e) {
            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.list-wrap-content')];
            el._index = lists.findIndex(list => list === el);
        },
        dragMove(e) {
            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.list-wrap')];
            let currentIndex = lists.findIndex(list => list === el);

            lists.forEach((list, index, lists) => {
                // 与el自己以外的其他list作比较
                if ( index !== currentIndex ) {
                    let clientRect = list.getBoundingClientRect();
                    // 鼠标进入了其他list的内部
                    if (
                        e.x >= clientRect.left
                        &&
                        e.x <= clientRect.right
                        &&
                        e.y >= clientRect.top
                        &&
                        e.y <= clientRect.bottom
                    ) {
                        // 向后拖拽
                        if (currentIndex < index) {
                            // 如果鼠标进入 添加列表 内部，则不做位置交换
                            if (index === lists.length - 1) return;
                            // 否则交换位置
                            board.insertBefore(el, list.nextElementsSibling);
                        } else { // 向前拖拽
                            board.insertBefore(el, list);
                        }
                    }
                }
            })
        },
        async dragEnd(e) {
            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.list-wrap-content')];
            let currentIndex = lists.findIndex(list => list === el);

            // 判断一下当前这个元素是否移动了
            if (el._index !== currentIndex) {
                let newOrder;
                // 获取当前所在位置的上一个列表和下一个列表的order值
                let prevOrder = lists[currentIndex - 1] && parseFloat(lists[currentIndex - 1].dataset.order);
                let nextOrder = lists[currentIndex + 1] && parseFloat(lists[currentIndex + 1].dataset.order);

                if (currentIndex === 0) {
                    newOrder = nextOrder / 2;
                } else if (currentIndex === lists.length - 1) {
                    newOrder = prevOrder + 65535;
                } else {
                    newOrder = prevOrder + (nextOrder - prevOrder) / 2;
                }

                await this.$store.dispatch('list/editList', {
                    boardId: this.board.id,
                    id: e.component.data.id,
                    order: newOrder
                })
            }
        }
    }
}
</script>