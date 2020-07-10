<template>
	<div class="popup-container">
		<div @click="open">
			<slot></slot>
		</div>
		<!--弹窗，可用于对话框、弹出式菜单等-->
		<!--弹出式菜单-->
		<div class="popup" v-show="isShow" ref="popup">
			<div class="popup-header">
				<span class="popup-title">{{title}}</span>
				<a class="popup-header-close" @click="close" ref="close">
					<i class="icon icon-close"></i>
				</a>
			</div>

            <div class="popup-content">
                <slot name="content"></slot>
            </div>
		</div>
	</div>
</template>

<script>

export default {
    name: "TPopup",
    props: {
        title: {
            type: String,
            default: '菜单',

        }
    },
	data() {
		return {
			isShow: false,
		};
	},
	methods: {
		open() {
			this.isShow = true;

			// 处理弹窗超出页面边界问题
			let $popup = this.$refs.popup;

            // 点击页面出 popup 以外的区域时关闭弹窗
            // 这里会有冒泡的问题，再次点击 popup ，click 事件会冒泡到 window，触发 close 方法
            // 因此 popup 将不会弹出
            // 不适合用阻止冒泡行为的做法
            // 在 close 方法中做一下判断即可
			window.addEventListener("click", this.close);

			this.$nextTick(() => {
				$popup.style.left = "0px";
				let $popupRect = $popup.getBoundingClientRect();
				// console.log($popupRect);
				let left = 0;
				if ($popupRect.right > window.innerWidth) {
					// 超出
					left = -$popupRect.width + this.$el.offsetWidth;
				}
                $popup.style.left = left + "px";
            });
            
            this.$emit('open');
		},
		close(e) {
            // console.log(e.path);
            // 冒泡的问题在这里处理
			// 判断冒泡路径数组中是否
			// 1. 不存在 event 事件（即直接调用 close 方法，而非通过事件监听触发的）
            // 1. 包含关闭按钮（即点击关闭按钮触发该事件）
            // 2. 不包含弹窗根组件（即点击事件是在弹窗根组件或者其子节点触发的）
            // 满足其一则隐藏弹窗
            if (!e || e.path.includes(this.$refs.close) || !e.path.includes(this.$el)) {
                this.isShow = false;
                this.$emit('close');
                window.removeEventListener('click', this.close);
            }
		},
	},
};
</script>
