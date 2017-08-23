<template>
  <section>
            <div class="sidebar">
                <!-- <h1 class='page-header'>카테고리</h1> -->
                <!-- <input class="new-category"
                placeholder="추가할 카테고리를 넣으세요"
                v-model="newCategory.title"
                @keyup.enter="addCatogory"> -->
                <div class='basic shadow'>
                            <div>
                                <label>예랑</label>
                                <span>김병수</span>
                            </div>
                            <div>
                                <label>예신</label>
                                <span>김재림</span>
                            </div>
                            
                            <div>
                                <label>결혼 예정일</label>
                                <span>2018년 8월 13일 오후 1시</span>
                            </div>
                            <div>
                                <label>결혼 장소</label>
                                <span>대전 컨벤션센터</span>
                            </div>

                            <div>
                                <label>총 예산</label>
                                <span>{{getAllbudget()}}만원</span>
                            </div>
                            
                            
                </div>
                
                <ul class="nav nav-pills nav-stacked">
                   
                    <!-- <li class="category"  @click="selectAll()" :class="{active:selectedCategory._id=='all'}"> -->
                        
                    <!-- </li> -->
                    <li v-for="category in categories"
                        class="category"
                        :key="category._id"
                        :class="{active:category==selectedCategory}"
                        @click="selected(category)" @dblclick="categoryEdit(category)">
                        <!-- <label v-show='category!=editingCategory' :class="{notrequired: !category.required}">{{ category.title }}</label> -->
                        <h1 class='page-header'>{{category.title}}</h1>
                        <p>결혼의 꽂! 웨딩촬영! 예전엔 필수코스로 인식되었지만, 비싼 가격에 비해서 한두번 보고 마는 경우가 많아, 셀프촬영으로 대체하거나 생략하는 경우도 많아요. 하지만 평생 한번 있는 기회이니 신중하게 생각해야겠죠?</p>
                        <p>서울지역 평균 예산: 100-200만원</p>
                        <span><input type="radio" :id='category._id+"_none"' :value='none' :name='category._id' v-model="category.required">미정</span>
                        <span><input type="radio" :id='category._id+"_yes"' :value='true' :name='category._id' v-model="category.required">해요</span>
                        <span><input type="radio" :id='category._id+"_no"' :value='false' :name='category._id' v-model="category.required">안해요</span>

                        <button @click='categoryEdit(category)' class='btn btn-default'>수정</button>
                        <button> <router-link class='btn btn-default' v-bind:to="'/todolist/'+category._id">></router-link></button>
                        <input type='text'  v-show='category==editingCategory' @keyup.esc='categoryCancelEdit()' @keyup.enter='updateCategory(category)' v-model='category.title'> <!-- v-focus='category==editingCategory' -->
                        <!-- <input v-show='category==editingCategory' type="radio" :id='category._id+"_yes"' :value='true' :name='category._id' v-model="category.required"><label v-show='category==editingCategory'>해요</label>
                        <input v-show='category==editingCategory' type="radio" :id='category._id+"_no"' :value='false' :name='category._id' v-model="category.required"><label v-show='category==editingCategory'>안해요</label> -->
                        <!-- <span v-show='category.required && (category.budget_automatic?getbudget(category):category.budget)>0 && category!=editingCategory'>예산{{category.budget_automatic?getbudget(category):category.budget}}만원</span> -->
                        <span v-show='category.required && category==editingCategory'>
                            <span>예산</span>
                            <span><input type="radio" :id='category._id+"_budgetAutoYes"' :value='true' :name='category._id+"_budget"' v-model="category.budget_automatic">자동계산</span>
                            <span><input type="radio" :id='category._id+"_budgetAutoNo"' :value='false' :name='category._id+"_budget"' v-model="category.budget_automatic">수동입력</span>
                            <span v-show='category.budget_automatic==false'><input type="number" @keyup.esc='categoryCancelEdit()' @keyup.enter='updateCategory(category)'  v-model="category.budget" placeholder="예산">만원
                            평균{{category.budget_avg}} 만원</span>
                        </span>
                        <button v-show='category==editingCategory' @click='updateCategory(category)'>Update</button>
                        <!-- <button v-show='category==editingCategory' @click='deleteCategory(category)'>Delete</button> -->
                        
                    </li>
                </ul>    
            </div>  
      
    <!-- <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Written by <a href="http://evanyou.me">Evan You</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer> -->

  </section>
</template>
<script>
const API_URL = process.env.API_URL;
console.log('API_URL checklist',API_URL);
import auth from '../auth'
// let currentIdx =0;
export default {
  name: 'checklist',
  data () {
    return {
        //userid:'bskim',
        message:'message place',
        categories:[
            ],
        newCategory:{title:''},
        editingCategory:{},
        selectedCategory:{_id:'all',title:'전체'},
        toggleOn:false,
        error:{}
    }
  },
  methods:{

    getAllbudget:function(){
        // var parent = this;
        // return this.categories.reduce(function(acc,item){
        //     return acc+(item.budget_automatic?parent.getbudget(item):item.budget);
        // },0);
    },
    // getbudget:function(category){
    //     var newlist =[];
    //     var parent=this;
    //     newlist = parent.todos.filter(function(element){
    //         return (element.categoryid==category._id);
    //     });
    //     return newlist.reduce(function(acc,item){return acc+=item.budget},0)
    // },    
    categoryEdit:function(category){
        this.editingCategory=category; 
        console.log('category.editing ',this.editingCategory )
    },
    categoryCancelEdit: function () {
      this.editingCategory = null
    },
    selected:function(category){
        this.selectedCategory = category;
        this.toggleOn=true;
    },
    goback:function()
    {
        this.toggleOn=false;
    },
    fetchCategory: function() {
          var parent = this;
          parent.message = "fetching category list...";
          var userid = auth.user.id;
          var authHeader = auth.getAuthHeader();
          console.log('userid',userid)
          console.log('authHeader',authHeader)
        this.$http.get(API_URL+'/category/list/'+userid,{headers:authHeader})
          .then(function(response){
            parent.categories = response.data;
            console.log(response.data)
          },error=>{

          });
        
    
    },
    addCatogory: function () {
        var value = this.newCategory.title && this.newCategory.title.trim()
        if (!value) {
            return
        }
        var parent = this;
        parent.message = "add new category...";
        var userid = auth.user.id;
        var authHeader = auth.getAuthHeader();
        // var newCategory = this.newCategory;

        var newCategory = {
            ownerid: userid,
            title: value,
            memo: '', 
            required: true,
            descryption: '',
            budget:0,
            budget_avg:0,
            budget_automatic:true

        }   
        console.log('userid',userid)
        console.log('authHeader',authHeader)
        this.$http.post(API_URL+'/category/add',newCategory,{headers:authHeader})
            .then(function(response){
            //parent.todos = response.data;
                parent.newCategory = ''
                console.log(response.data);
                // router.push({name:'CheckList'})
                this.fetchCategory();
                },error=>{
                    console.log(error)
                }
            );
              
        
    },
    updateCategory: function (category) {
        console.log(category)
        var value = category.title && category.title.trim()
        if (!value) {
            return
        }
        var parent = this;
        parent.message = "updating category";
        var userid = auth.user.id;
        var authHeader = auth.getAuthHeader();
        var newCategory = category;
        newCategory.title = value;

        // var newCategory = {
        //     _id:category._id,
        //     ownerid: userid,
        //     title: category.title,
        //     memo: category.memo, //TODO
        //     required: category.required,//TODO
        //     descryption: category.descryption //TODO
        // }   
 
        console.log('userid',userid)
        console.log('authHeader',authHeader)
        this.$http.put(API_URL+'/category/update',newCategory,{headers:authHeader})
            .then(function(response){
                this.editingCategory = null
                console.log(response.data);
                // router.push({name:'CheckList'})
                this.fetchCategory();
                },error=>{
                    console.log(error)
                }
            );
              
        
    },       
    deleteCategory: function (category) {
        console.log(category)
        var parent = this;
        parent.message = "deleting category";

        var authHeader = auth.getAuthHeader();
        console.log('authHeader',authHeader)
        this.$http.delete(API_URL+'/category/delete/'+category._id,{headers:authHeader})
            .then(function(response){
                this.editingCategory = null
                console.log(response.data)
                //router.push({name:'CheckList'})
                this.fetchCategory();
                },error=>{
                    console.log(error)
                }
            );
              
        
    }
  },       

  created:function(){
     this.fetchCategory();
  },
  directives: {
    'focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  computed:{
    activeCategoryIds:function(){
        var newlist =[];
        this.categories.forEach(function(element){
            if(element.required) newlist.push(element._id);
        });
        return newlist;
    }
  }
}


</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notrequired {
    text-decoration:line-through
}

/* html,
body {
	margin: 0;
	padding: 0;
} */

/* button {
	margin: 0;
	padding: 0;
    border: none;
	background: none;
	font-size: 100%;
	vertical-align: baseline;
	font-family: inherit;
	font-weight: inherit;
	color: inherit;
	-webkit-appearance: none;
	appearance: none;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
} */

/* body {
	font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
	line-height: 1.4em;
	background: #f5f5f5;
	color: #4d4d4d;
	min-width: 230px;
	max-width: 550px;
	margin: 0 auto;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-weight: 300;
} */

:focus {
	outline: 0;
}

.hidden {
	display: none;
}

.checklist {
    /* display:block; */
	background: #fff;
    width:100vw;
	max-width: 800px;
    height:100vh;
    padding-bottom:10px;
    z-index:2000;

    /* top: 0px; */
	/* margin: 130px 0 40px 0; */
    /* margin-top: 0px;
    margin-bottom:40px;
    margin-left:auto;
    margin-right:auto; */

	position: fixed;
	box-shadow: 0 15px 15px 0 rgba(0, 0, 0, 0.2),
	            0 25px 50px 0 rgba(0, 0, 0, 0.1);
    -webkit-transition:-webkit-transform .3s ease-in-out; 
    -webkit-transform: translateX(100%);

}

.checklist.active {
    -webkit-transform: translateX(0%);
    overflow: scroll;
}

.checklist input::-webkit-input-placeholder {
	/* font-style: italic; */
	/* font-weight: 300; */
    color: white;
    text-shadow: 1px 1px 4px #000000;
    }

.checklist input::-moz-placeholder {
	/* font-style: italic; */
	/* color: #e6e6e6; */
    color: white;
    text-shadow: 1px 1px 4px #000000;
}

.checklist input::input-placeholder {
	/* font-style: italic; */
	font-weight: 300;
    text-shadow: 1px 1px;
	/* color: #e6e6e6; */
    color: white;
    text-shadow: 1px 1px 4px #000000;


}

.checklist h1 {
	position: relative;
	/* top: -155px; */
	width: 100%;
	font-size: 50px;
	font-weight: 100;
	text-align: center;
	color: rgba(175, 47, 47, 0.75);
	-webkit-text-rendering: optimizeLegibility;
	-moz-text-rendering: optimizeLegibility;
	text-rendering: optimizeLegibility;
}

.new-todo
{
	position: relative;
	margin: 0;
	width: 100%;
	font-size: 24px;
	font-family: inherit;
	font-weight: inherit;
	line-height: 1.4em;
	border: 0;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.edit {
	position: relative;
	margin: 0;
	/* width: 100%; */
	font-size: inherit;
	font-family: inherit;
	font-weight: inherit;
	/* line-height: 1.2em; */
	border: 0;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.new-todo {
	padding: 16px 16px 16px 60px;
	/* border: none; */
    border:1px solid rgba(219, 213, 212, 0.903); 
	/* background: rgba(219, 213, 212, 0.903); */
	/* background: #DBD5D4; */
	box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}

/* .main {
	position: relative;
	z-index: 2;
	border-top: 1px solid #e6e6e6;
    display: none;
} */




.todo-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.todo-list li {
    padding: 5px 0px;
	position: relative;
	font-size: 17px;
    font-family: 'Nanum Gothic',Dotum,sans-serif;

	/* border-bottom: 1px solid #ededed; */
}

.todo-list li:last-child {
	border-bottom: none;
}

.todo-list li.editing {

	border-bottom: none;
	/* padding: 0; */
}

.todo-list li.editing .edit {
    font-size: inherit;
    font-family: inherit;
	display: inline;
	padding: 12px 16px;
	margin: 0 0 0 0px;
}
input[type=number] {
    width:60px;
}
.todo-list li.editing .view {
	display: none;
}

.todo-list li .toggle {
	text-align: center;
	/* width: 40px; */
	/* auto, since non-WebKit browsers doesn't support input styling */
	/* height: auto; */
	position: relative;
	top: 0;
	bottom: 0;
	margin: 2px 0;
	border: none; /* Mobile Safari */
	-webkit-appearance: none;
	appearance: none;
    
}

input[type=file]:focus, input[type=checkbox]:focus, input[type=radio]:focus {
    outline: none;
    outline-offset:0;
}
.todo-list li .toggle:after {
	content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#8B8988" stroke-width="3"/></svg>');
}

.todo-list li .toggle:checked:after {
	content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
}

.todo-list li label {
	word-break: break-all;
    padding: 12px 16px;
    font-weight: 100;
	/* padding: 15px 60px 15px 15px; */
	/* margin-left: 45px; */
    margin-bottom: 0px;
	/* display: inline; */
    /* line-height: 1.2em; */

	transition: color 0.4s;
}
.todo-list li span {
    font-weight: 100;
	transition: color 0.4s;
}

.todo-list li.completed label {
	color: #d9d9d9;
	text-decoration: line-through;
}
.todo-list li.completed span {
	color: #d9d9d9;
	text-decoration: line-through;
}

.todo-list li .destroy {
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 0;
	width: 40px;
	/* height: 40px; */
	margin: auto 0;
	font-size: 30px;
	color: #cc9a9a;
	margin-bottom: 11px;
	transition: color 0.2s ease-out;
}

.basic {
    /* background: url('https://s.cdpn.io/7635/averyson-logo.gif');
    background-size: length;
    background-repeat: no-repeat; */
    /* height:200px;  */
    /* box-shadow: 0 15px 15px 0 rgba(0, 0, 0, 0.2),
	            0 25px 50px 0 rgba(0, 0, 0, 0.1); */
    padding-left:20px;
    padding-top:30px;
    padding-bottom:20px;
}

.todo-list li .destroy:hover {
	color: #af5b5e;
}

.todo-list li .destroy:after {
	content: 'Ã—';
}

.todo-list li:hover .destroy {
	display: block;
}

.todo-list li .edit {
	display: none;
}

.todo-list li.editing:last-child {
	margin-bottom: -1px;
}

.footer {
	color: #777;
	padding: 10px 15px;
	height: 20px;
	text-align: center;
	border-top: 1px solid #e6e6e6;
}

.footer:before {
	content: '';
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 50px;
	overflow: hidden;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
	            0 8px 0 -3px #f6f6f6,
	            0 9px 1px -3px rgba(0, 0, 0, 0.2),
	            0 16px 0 -6px #f6f6f6,
	            0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
	float: left;
	text-align: left;
}

.todo-count strong {
	font-weight: 300;
}

.filters {
	margin: 0;
	padding: 0;
	list-style: none;
	position: absolute;
	right: 0;
	left: 0;
}

.filters li {
	display: inline;
}

.filters li a {
	color: inherit;
	margin: 3px;
	padding: 3px 7px;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: 3px;
}

.filters li a:hover {
	border-color: rgba(175, 47, 47, 0.1);
}

.filters li a.selected {
	border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed,
html .clear-completed:active {
	float: right;
	position: relative;
	line-height: 20px;
	text-decoration: none;
	cursor: pointer;
}

.clear-completed:hover {
	text-decoration: underline;
}

.info {
	margin: 65px auto 0;
	color: #bfbfbf;
	font-size: 10px;
	text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
	text-align: center;
}

.info p {
	line-height: 1;
}

.info a {
	color: inherit;
	text-decoration: none;
	font-weight: 400;
}

.info a:hover {
	text-decoration: underline;
}
.row{
    margin-left: 0px;
    margin-right: 0px;
}
.vcenter {
    display: flex;
    align-items: center;
    /* justify-content: flex-start */
}
/*
	Hack to remove background from Mobile Safari.
	Can't use it globally since it destroys checkboxes in Firefox
*/



/* debugging purpose */
/* [class*='row'] {
    border: 2px solid gray;

}

[class*='col-'] {
    border: 2px solid tomato;

} */
.sidebar {
    display:block;
    width:100vw;
    /* height:calc(100vh - 50px); */
    /* margin-top:50px; */
    /* top: 0px; */
    /* overflow: scroll; */
    /* padding-left: 5px; */
    max-width: 500px;
    /* background-color: beige; */
    position: relative;


}

.sidebar li{
    padding-left:10px;
    padding-top: 5px;
    padding-bottom: 5px;
    
    /* border: 1px solid gray; */
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2),
                0 5px 10px 0 rgba(0, 0, 0, 0.1);
    /* transform: scale(1); */
}
.sidebar li:hover{
    /* transform: scale(1.1); */
}
.sidebar .nav li.active{
/* color: #fff; */
/* background-color: rgba(219, 213, 212, 0.7); */
/* padding-top: 50px; */
/* -webkit-transition: height background-color 500ms ease-in;
-ms-transition: height background-color 500ms ease-in; */
/* transform: translate(-2px,-1px);
transition: transform 200ms, background-color 200ms, padding 200ms; */
}

@media only screen and (min-width: 768px) {


}
</style>
