import Vue from 'vue';

// 封装公共的全局方法
export default {
    async blurToEditTextarea(options = {}) {
        let defaultOptions = {
            self: null,
            event: null,
            canBeEmpty: false,
            emptyMsg: '',
            successMsg: '',
            actionName: '',
            data: null
        }
        let {
            self,
            event, 
            canBeEmpty,
            emptyMsg,
            successMsg,
            actionName,
            data
        } = {...defaultOptions, ...options};
        // 简单的参数校验
        if (!self || !event || !data || !self instanceof Vue || !event instanceof Event) {
            throw new Error('传入参数有误');
        }
        let { value, innerHTML } = event.target;
        // 判断是否修改过列表名
        if (value !== innerHTML) {
            if (!canBeEmpty && value.trim() === '') {
                event.target.value = innerHTML;
                event.target.focus();
                return self.$message.warning(emptyMsg);
            }
            try {
                await self.$store.dispatch(actionName, data);
                self.$message.success(successMsg);
            } catch (e) {
                event.target.value = innerHTML;
            }
        }
    }
}