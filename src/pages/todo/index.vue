<template>
  <view class="todo_container">
    <view class="header">
      <!-- <image class="plus" src="../../image/plus.png"/> -->
      <input
        ref="input"
        class="new-todo"
        v-model="input"
        placeholder="添加任务"
        @confirm="handleAddTodo"
        confirm-type="done"
      />
      <image
        class="plus"
        v-if="input"
        @click="handleAddTodo"
        src="../../static/image/yes.png"
      />
    </view>
    <block v-if="todos.length">
      <view class="footer">
        <!-- <text class="btn" bindtap="handleToggleAll">✔ 全选</text> -->
        <image
          class="btn"
          @click="handleToggleAll"
          src="../../static/image/allselect.png"
        />
        <text class="foottext" v-if="leftCount"
          >剩 {{ leftCount }} {{ leftCount === 1 ? "个" : "个" }}任务待完成</text
        >
        <image
          class="btn"
          v-if="todos.length > leftCount"
          @click="handleClearCompleted"
          src="../../static/image/delete.png"
        />
      </view>
      <view class="todos">
        <!-- List items should get the class `completed` when marked as completed -->
        <view
          class="item"
          :class="{completed: item.completed}"
          v-for="(item, index) in todos"
          :key="index"
          @click="handleToggleTodo(index)"
        >
          <!-- completed: success, todo: circle -->
          <icon
            class="checkbox"
            :type="item.completed ? 'success' : 'circle'"
          />
          <text class="name">{{ item.name }}</text>
          <icon
            class="remove"
            type="clear"
            size="16"
            @click.stop="handleRemoveTodo"
            :data-index="index"
          />
        </view>
      </view>
    </block>
    <block v-else>
      <view class="nodata">
        <image class="nodata_img" src="../../static/image/nodata.png"></image>
        <text class="nodata_text">今天的任务都完成了！</text>
      </view>
    </block>
  </view>
</template>
<script>
import {get, set} from '@/utils/local'
export default {
  data() {
    return {
      input: '',
      todos: get('todo_list') || [],
      
      logs: get('todo_logs') || [],
    }
  },
  computed: {
    leftCount() {
      return this.todos.filter(todo => !todo.completed).length
    },
    allCompleted() {
      return this.todos.every(todo => todo.completed)
    }
  },
  methods: {
    save() {
      // 同时存入local
      set('todo_list', this.todos)
      set('todo_logs', this.logs)
    },
    // 添加todo
    handleAddTodo() {
      if (!this.input || !this.input.trim()) return 
      let todos = this.todos 
      let logs = this.logs
      todos.push({name: this.input, completed: false})
      logs.push({timestamp: Date.now(), action: 'add', name: this.input})
      this.save()
      // 同时清空input
      this.input = ''
    },
    // 切换全部任务状态
    handleToggleAll() {
      let todos = this.todos 
      let logs = this.logs 
      todos.forEach(todo => {
        todo.completed = true
      })

      logs.push({
        timestamp: Date.now(),
        action: this.allCompleted ? 'finish' : 'restart',
        name: 'all todos'
      })

      this.save()
      
    },
    // 切换其中一个任务的状态
    handleToggleTodo(index) {
      let todos = this.todos 
      let logs = this.logs
      todos[index].completed = !todos[index].completed
      logs.push({
        timestamp: Date.now(),
        action: todos[index].completed ? 'finish' : 'restart',
        name: todos[index].name
      })

      this.save()

    },
    handleRemoveTodo(e) {
      // 获取要删除todo的索引 
      const index = e.target.dataset.index 
      const removeTodo = this.todos.splice(index, 1)[0]

      let logs = this.logs 
      logs.push({
        timestamp: Date.now(),
        action: 'remove',
        name: removeTodo.name
      })

      this.save()

    },
    // 清除已经完成的任务
    handleClearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
      uni.showToast({
        title: '已清除',
        icon: 'success'
      })

      let logs = this.logs 
      logs.push({
        timestamp: Date.now(),
        action: 'clear',
        name: 'completed todo'
      })

      this.save()
    }
  }
};
</script>
<style  scoped>
.header {
  display: flex;
  align-items: center;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  box-shadow: 5px 5px 5px #e0e0e0;
  margin-bottom: 30rpx;
  padding: 20rpx;
  width: 94%;
  height: 90rpx;
  background-color: #ffffff;
  text-align: center;
  margin-left: 3%;
}
.back_container {
  height: 100%;
  background-color: #ededed;
}
.todo_container {
  height: 80%;
  background-color: #ededed;
}

.header .plus {
  width: 50rpx;
  height: 50rpx;
  margin-right: 10rpx;
}

.header .new-todo {
  flex: 1;
  font-size: 28rpx;
  margin-left: 5%;
  margin-right: 5%;
}

.todos {
  /* border: 3rpx solid #e0e0e0; */
  border-radius: 10rpx;
  /* box-shadow: 0 0 5rpx #e0e0e0; */
  margin-top: 10rpx;
  width: 94%;
  margin-left: 3%;
  /* background-color: #f5f5f5; */
}

.todos .item {
  display: flex;
  height: 120rpx;
  align-items: center;
  padding: 25rpx;
  border-bottom: 1rpx solid #e0e0e0;

  background-color: #6f879f;
  border-radius: 10rpx;
  margin-bottom: 10rpx;
  background-image: url("https://s3.ax1x.com/2021/03/17/6cxSER.jpg");
  background-size: 110%;
  background-repeat: no-repeat;
}

.todos .item:last-child {
  border-bottom: 0;
}

.todos .item .checkbox {
  margin-right: 20rpx;
}

.todos .item .name {
  flex: 1;
  font-size: 30rpx;
  /* color: #444; */
  color: #ffffff;
}
.todos .item.completed {
  background-color: #d5d5d5;
  background-image: none;
}
.todos .item.completed .name {
  text-decoration: line-through;
  color: #888;
}
/* 
.todos .item .remove {
  cursor: pointer;
}
*/
.footer {
  display: flex;
  justify-content: space-between;
  margin: 10rpx 0 30rpx 0;
  padding: 0 5rpx;
  font-size: 30rpx;
  color: #576b95;
}

.footer .btn {
  text-align: center;
  color: #c4c4c4;
  font-size: 32rpx;
  border-radius: 10rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
  width: 90rpx;
  height: 50rpx;
}
.footer .foottext {
  color: #8a8a8a;
  font-size: 30rpx;
  margin: 0 3%;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty .title {
  font-size: 60rpx;
  margin: 200rpx 50rpx 50rpx;
  color: #444;
}

.empty .content {
  color: #c4c4c4;
  text-align: center;
}
</style>