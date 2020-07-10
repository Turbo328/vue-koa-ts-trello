<template>
	<div class="pagination">
		<span v-if="firstShowPage > 1" @click="gotoPage(1)">首页</span>
		<span v-if="page > 1" @click="gotoPage(page - 1)">上一页</span>
		<span
            v-if="pages > showPagesCount && firstShowPage > showPagesCount"
            @click="gotoPage(page - showPagesCount)"
        >...</span>
		<span
            v-for="showPage of showPages"
            :key="showPage"
            :class="{'current-page': showPage == page}"
            @click="gotoPage(showPage)"
        >{{showPage}}</span>
		<span
            v-if="pages > showPagesCount && lastShowPage < pages - showPagesCount"
            @click="gotoPage(page + showPagesCount)"
        >...</span>
		<span v-if="page < pages" @click="gotoPage(page + 1)">下一页</span>
		<span v-if="lastShowPage < pages" @click="gotoPage(pages)">尾页</span>
	</div>
    <!-- class="current-page" -->
</template>

<script>
export default {
    name: 'TPagination',
    props: {
        pages: {
            type: Number,
            default: 1
        },
        page: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            // 期望显示的可选页数
            showPagesCount: 5
        }
    },
    computed: {
        showPages() {
            // 显示的可选起始页
            let s = this.page;
            // 显示的可选结束页
            let e = this.page;
            let arr = [this.page];
            let p = this.showPagesCount - 1;

            while(p > 0) {
                // 左边
                if (p > 0 && s > 1) {
                    arr.unshift(--s);
                    p--;
                }
                // 右边
                if (p > 0 && e < this.pages) {
                    arr.push(++e);
                    p--
                }
                if (s <= 1 && e >= this.pages) {
                    break;
                }
            }
            return arr;
        },
        firstShowPage() {
            return this.showPages[0];
        },
        lastShowPage() {
            return this.showPages[this.showPages.length-1];
        }
    },
    methods: {
        gotoPage(page) {
            page = Math.max(1, page);
            page = Math.min(page, this.pages);
            if (page !== this.page) {
                this.$emit('changePage', page);
            }
        }
    }
}
</script>
