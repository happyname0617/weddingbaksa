<template>

            <div class="todolist">
                <router-link to="/CheckList" class='btn btn-default'>뒤로</router-link>
                <!-- <h1 class='page-header'>{{selectedCategory.title}}</h1>
                <p>결혼의 꽂! 웨딩촬영! 예전엔 필수코스로 인식되었지만, 비싼 가격에 비해서 한두번 보고 마는 경우가 많아, 셀프촬영으로 대체하거나 생략하는 경우도 많아요. 하지만 평생 한번 있는 기회이니 신중하게 생각해야겠죠?</p>
                <p>서울지역 평균 예산: 100-200만원</p>
                <span><input type="radio" :id='selectedCategory._id+"_none"' :value='none' :name='selectedCategory._id' v-model="selectedCategory.required">미정</span>
                <span><input type="radio" :id='selectedCategory._id+"_yes"' :value='true' :name='selectedCategory._id' v-model="selectedCategory.required">해요</span>
                <span><input type="radio" :id='selectedCategory._id+"_no"' :value='false' :name='selectedCategory._id' v-model="selectedCategory.required">안해요</span> -->

                <input class="new-todo" placeholder="추가할 항목을 넣으세요" v-model="newTodo.title" @keyup.enter="addTodo">
                <!-- <ul class="todo-list">
                    <li v-for="todo in todos"
                        class="todo"
                        :key="todo._id"
                        :class="{completed: todo.completed, editing:todo==editingTodo}"
                        @dblclick="todoEdit(todo)">
                        <div class='row vcenter'>

                            <input class="toggle col-sm-1" type="checkbox" v-model="todo.completed">
                            <label v-show='todo!=editingTodo' class='col-sm-5'>{{ todo.title }}</label>
                            <input type="number" v-model="todo.budget">
                            <input class="col-sm-5 edit" v-show='todo==editingTodo' type='text'  @keyup.esc='todoCancelEdit()' @keyup.enter='updateTodo(todo)' v-model='todo.title'> v-focus='todo==editingTodo'
                            <span v-show='todo.budget>0 && todo!=editingTodo' class='col-sm-6'>예산{{todo.budget}}만원</span>
                            <span v-show='todo.budget==0 && todo!=editingTodo' class='col-sm-6'></span>
                            <span v-show='todo==editingTodo' class='col-sm-4 ' >
                                <span>예산<input type="number" @keyup.esc='todoCancelEdit()' @keyup.enter='updateTodo(todo)'  v-model="todo.budget" placeholder="예산">만원</span>
                                <span v-show='todo.budget_avg>=0'>평균{{todo.budget_avg}} 만원</span>
                            </span>
                            <input type="number" @keyup.esc='todoCancelEdit()' @keyup.enter='updateTodo(todo)' v-model="todo.budget" v-if='todo==editingTodo'>
                            <input type="number" @keyup.esc='todoCancelEdit()' @keyup.enter='updateTodo(todo)' v-model="todo.budget_avg" v-if='todo==editingTodo'>
                            <button v-if='todo==editingTodo' class='col-sm-1 btn btn-default' @click='updateTodo(todo)'>저장</button>
                            <button v-if='todo==editingTodo' class='col-sm-1 btn btn-default' @click='removeTodo(todo)'>삭제</button>
                        </div>
                    </li>
                </ul>         -->
            </div>

</template>
<script>
import auth from '../auth'
// let currentIdx =0;
const API_URL = process.env.API_URL;
console.log('API_URL todolist',API_URL);
export default {
  name: 'todolist',
  data () {
    return {
        //userid:'bskim',
        message:'message place',
        todos:[],
        newTodo:{title:''},
        editingTodo:{},
        error:{}
    }
  },
  methods:{
    todoEdit:function(todo){
        this.editingTodo=todo; 
        console.log('todo.editing ',this.editingTodo )
    },
    todoCancelEdit: function () {
      this.editingTodo = null
      console.log('todo.editing cancel',this.editingTodo )
    },    
       addTodo: function () {
        var value = this.newTodo.title && this.newTodo.title.trim()
        if (!value) {
            return
        }
        var parent = this;
        parent.message = "adding todo list...";
        var userid = auth.user.id;
        var authHeader = auth.getAuthHeader();
        // var newTodo = this.newTodo;
        // newTodo.title = value;

        var newTodo = {
            ownerid: userid,
            title: this.newTodo.title,
            categoryid: parent.selectedCategory._id,
            memo: '', //TODO
            completed: false,//TODO
            descryption: '', //TODO
            budget:0,
            budget_avg:0
        }   
        // console.log('newTodo',newTodo)
        console.log('authHeader',authHeader)
        this.$http.post(API_URL+'/todo/add',newTodo,{headers:authHeader})
            .then(function(response){
            //parent.todos = response.data;
                parent.newTodo = '';
                parent.todos.push(newTodo)
                console.log(response.data)
                },error=>{
                    console.log(error)
                }
            );
              
        
    },
    updateTodo: function (todo) {
        var value = todo.title && todo.title.trim()
        if (!value) {
            return
        }
        var parent = this;
        parent.message = "updating todo";
        var authHeader = auth.getAuthHeader();
        var newTodo = todo;
        newTodo.title = value;
        // {
        //     _id: todo._id,
        //     title: value,
        //     ownerid:todo.ownerid,
        //     categoryid: todo.categoryid,
        //     memo: todo.memo, //TODO
        //     completed: todo.completed,//TODO
        //     descryption: todo.descryption //TODO 
        // }   
        console.log('todo._id',todo._id)
        console.log('authHeader',authHeader)
        this.$http.put(API_URL+'/todo/update',newTodo,{headers:authHeader})
            .then(function(response){
//                parent.editingTodo = null;
                this.editingTodo = null;
                console.log(response.data);
                parent.fetchTodos();
                },error=>{
                    console.log(error)
                }
            );
              
        
    },
    removeTodo: function (todo) {
        console.log(todo)
        var parent = this;
        parent.message = "deleting todo";
        var authHeader = auth.getAuthHeader();
       console.log('authHeader',authHeader)
        this.$http.delete(API_URL+'/todo/delete/'+todo._id,{headers:authHeader})
            .then(function(response){
                parent.editingTodo = null
                console.log(response.data)
                parent.fetchTodos();
                //this.todos.splice(this.todos.indexOf(todo), 1)
                },error=>{
                    console.log(error)
                }
            );
              
        
    },     
    fetchTodos: 
        function(categoryid) {
          var parent = this;
          parent.message = "fetching todo list...";
          var userid = auth.user.id;
          var authHeader = auth.getAuthHeader();
          console.log('userid',userid)
          console.log('authHeader',authHeader)
          this.$http.get(API_URL+'/todo/get/'+userid+'/'+categoryid,{headers:authHeader})
          .then(function(response){
            parent.todos = response.data;
            console.log(response.data)
          },error=>{

          });
        }
    
  },
  created:function(){
    console.log('categoryid clicked',this.$route.params.categoryid)
    this.fetchTodos(this.$route.params.categoryid);
  },
  directives: {
    'focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  computed:{

  }
}


</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


@media only screen and (min-width: 768px) {


}
</style>
