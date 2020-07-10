<template>
	<!--看板列表容器-->
	<div class="list-wrap list-wrap-content" :class="{'list-adding': listAdding}" :data-order="data.order">
		<div class="list-placeholder" ref="listPlaceholder"></div>

		<div class="list" ref="list">
			<div class="list-header" ref="listHeader">
				<textarea
                    class="form-field-input"
                    @mousedown.prevent
                    ref="newBoardListName"
                    @blur="editListName"
                    @keydown.enter.prevent="enterToBlurList"
                >{{data.name}}</textarea>
				<div class="extras-menu" @mousedown.prevent>
					<span class="icon icon-more"></span>
				</div>
			</div>

			<div class="list-cards">
				
                <t-card
                    v-for="card of cards"
                    :key="card.id"
                    :data="card"
                ></t-card>

				<div class="list-card-add-form">
					<textarea
						class="form-field-input"
						placeholder="为这张卡片添加标题……"
                        ref="newCardName"
                        @keydown.enter.prevent="addNewCard"
					></textarea>
				</div>
			</div>

			<div class="list-footer">
				<div class="list-card-add" @click="showListCardAddForm">
					<span class="icon icon-add"></span>
					<span>添加另一张卡片</span>
				</div>
				<div class="list-add-confirm">
					<button class="btn btn-success" @click="addNewCard">添加卡片</button>
					<span class="icon icon-close" @click="hideListCardAddForm"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TCard from '@/components/TCard';
export default {
    name: 'TList',
    props: {
        data: {
            type: Object
        },
    },
    components: {
        TCard
    },
    data() {
        return {
            drag: {
                isDown: false,
                isDrag: false,
                downClientX: 0,
                dwonClientY: 0,
                downElementX: 0,
                downElementY: 0,
            },
            listAdding: false
        }
    },
    computed: {
        cards() {
            return this.$store.getters['card/getCards'](this.data.id);
        }
    },
    async created() {
        if (!this.cards.length) {
            await this.$store.dispatch('card/getCards', this.data.id);
        }
    },
    mounted() {
        this.$refs.listHeader.addEventListener('mousedown', this.dragDown);
        document.addEventListener('mousemove', this.dragMove);
        document.addEventListener('mouseup', this.dragUp);
    },
    methods: {
        dragDown(e) {
            this.drag.isDown = true;
            this.drag.downClientX = e.clientX;
            this.drag.downClientY = e.clientY;
            let pos = this.$refs.list.getBoundingClientRect();
            this.drag.downElementX = pos.x;
            this.drag.downElementY = pos.y;
        },
        dragMove(e) {
            if (this.drag.isDown) {
                let listElement = this.$refs.list;
                let x = e.clientX - this.drag.downClientX;
                let y = e.clientY - this.drag.downClientY;

                // 触发拖拽的条件
                if (x > 10 || y > 10) {
                    // 判断是否是第一次触发拖拽
                    if (!this.drag.isDrag) {
                        this.drag.isDrag = true;

                        this.$refs.listPlaceholder.style.height = listElement.offsetHeight + 'px';

                        listElement.style.position = 'absolute';
                        listElement.zIndex = 99999;
                        listElement.style.transform = 'rotate(5deg)';
                        document.body.appendChild(listElement);

                        this.$emit('dragStart', {
                            component: this
                        });
                    }
                    
                    listElement.style.left = this.drag.downElementX + x + 'px';
                    listElement.style.top = this.drag.downElementY + y + 'px';

                    this.$emit('dragMove', {
                        component: this,
                        x: e.clientX,
                        y: e.clientY
                    });
                }
            }
        },
        dragUp(e) {
            if (this.drag.isDown) {
                if (this.drag.isDrag) {
                    let listElement = this.$refs.list;

                    this.$refs.listPlaceholder.style.height = '0px';

                    listElement.style.position = 'relative';
                    listElement.style.zIndex = 0;
                    listElement.style.left = 0;
                    listElement.style.top = 0;
                    listElement.style.transform = 'rotate(0deg)';
                    this.$el.appendChild(listElement);

                    this.$emit('dragEnd', {
                        component: this
                    });
                } else {
                    if (e.path.includes(this.$refs.newBoardListName)) {
                        this.$refs.newBoardListName.select();
                    }
                }

                this.drag.isDown = false;
                this.drag.isDrag = false;
            }
        },
        editListName(e) {
            this.$utils.blurToEditTextarea({
                self: this,
                event: e,
                emptyMsg: '列表名称不能为空哦',
                successMsg: '列表名称修改成功啦',
                actionName: 'list/editList',
                data: {
                    id: this.data.id,
                    boardId: this.data.boardId,
                    name: e.target.value
                }
            });
            this.hideListCardAddForm();
        },
        enterToBlurList() {
            this.$refs.newBoardListName.blur();
        },

        // 显示添加列表
        showListCardAddForm() {
            this.listAdding = true;
            this.$nextTick(() => {
                this.$refs.newCardName.focus();
            })
        },
        // 隐藏添加列表
        hideListCardAddForm() {
            this.listAdding = false;
            this.$refs.newCardName.value = '';
        },
        async addNewCard() {
            let { value } = this.$refs.newCardName;
            if (value.trim() !== '') {
                try {
                    await this.$store.dispatch('card/postCard', {
                        boardListId: this.data.id,
                        name: value
                    });
                    this.$message.success('添加卡片成功啦');
                    this.hideListCardAddForm();
                } catch (e) {}
            } else {
                this.$message.warning('卡片名称不能为空哦');
                this.$refs.newCardName.focus();
            }
        }
    }
}
</script>