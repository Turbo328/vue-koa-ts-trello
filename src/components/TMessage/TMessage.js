import Vue from 'vue';
import TMessage from './TMessage.vue';

// Vue.extend 方法传入一个组件，返回该组件的构造函数
const TMessageClass = Vue.extend(TMessage);

/**
 * 工厂函数
 *  创建一个TMessage组件对象
 *  管理TMessage组件对象队列
 */
let instances = [];
function Message(data) {
    data = data || {};
    if (typeof data === 'string') {
        data = {
            message: data
        }
    };

    data.onClose = function() {
        Message.close(instance);
    }

    let instance = new TMessageClass({
        data
    });

    // 手动挂载，生成 $el,加入 DOM 树中
    instance.$mount();
    document.body.appendChild(instance.$el);

    // 设置当前组件对象偏移量，默认为20，只读
    let offset = data.offset || 20;
    // 将 offset 存入一个可写变量
    let offsetTop = offset;

    /**
     * 先循环再推入队列
     * 因为 instances[0] 的 top 只需要加上自身的 offset
     * 因此循环只需要从 instances[1] 开始
     */

    // 循环组件队列，依次设置每个组件的偏移量
    instances.forEach(item => {
        offsetTop += item.$el.offsetHeight + offset;
    });

    // 为当前组件对象设置 top 值
    instance.$el.style.top = offsetTop + 'px';

    instances.push(instance);
}

['info', 'success', 'error', 'warning'].forEach(type => {
    Message[type] = function(data) {
        if (typeof data === 'string') {
            data = {
                message: data
            }
        }
        return Message({
            ...data,
            type
        })
    }
})

/**
 * 获取当前 instance 的高度
 * 当前 instance 后面的所有实例的 top 减去这个高度以及偏移量
 */
Message.close = function(instance) {
    let removeHeight = instance.$el.offsetHeight + instance.offset;
    let index = instances.findIndex(item => item === instance);
    instances = instances.filter(item => item !== instance);

    for(let i = index; i < instances.length; i++) {
        let top = parseFloat(instances[i].$el.style.top);
        instances[i].$el.style.top = top - removeHeight + 'px';
    }
}

export default Message;