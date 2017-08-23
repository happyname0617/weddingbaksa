webpackJsonp([0],[function(e,t,a){"use strict";var o=a(14),n=a.n(o),i=a(2),s="http://www.weddingbaksa.com";console.log("API_URL",s);var r=s+"/user/login";t.a={user:{authenticated:!1,id:""},login:function(e,t,a){console.log("login function");var o=this;console.log("LOGIN_URL",r),e.$http.post(r,t).then(function(e){console.log(e.data),e.data.success?(console.log(e.data),localStorage.setItem("id_token",e.data.token),localStorage.setItem("userinfo",n()(e.data.user)),o.user.authenticated=!0,o.user.id=e.data.user.id,a&&i.a.push({name:a})):i.a.push({name:"Login"})},function(t){e.error=t})},signup:function(e,t,a){var o=this;e.$http.post("http://www.weddingbaksa.com/user/register",t).then(function(e){e.data.success?(localStorage.setItem("id_token",e.data.token),localStorage.setItem("userinfo",n()(e.data.user)),o.user.authenticated=!0,o.user.id=e.data.user.id,a&&i.a.push({name:a})):i.a.push({name:"Register"})},function(t){e.error=t})},logout:function(){console.log("logout"),localStorage.removeItem("id_token"),localStorage.removeItem("userinfo"),this.user.authenticated=!1,this.user.id=""},checkAuth:function(){console.log("checkAuth");var e=localStorage.getItem("id_token"),t=JSON.parse(localStorage.getItem("userinfo"));e?(this.user.authenticated=!0,this.user.id=t.id):(this.user.authenticated=!1,this.user.id={}),console.log("this.user.authenticated",this.user.authenticated)},getAuthHeader:function(){return{Authorization:localStorage.getItem("id_token")}}}},,function(e,t,a){"use strict";var o=a(3),n=a(35),i=a(23),s=a.n(i),r=a(22),c=a.n(r),l=a(24),d=a.n(l),u=a(26),g=a.n(u),v=a(25),m=a.n(v),p=a(27),f=a.n(p);o.a.use(n.a),t.a=new n.a({routes:[{path:"/",name:"Home",component:s.a},{path:"/checklist",name:"CheckList",component:c.a},{path:"/todolist/:categoryid",name:"TodoList",component:f.a},{path:"/itemlist",name:"ItemList",component:d.a},{path:"/register",name:"Register",component:g.a},{path:"/login",name:"Login",component:m.a}]})},,function(e,t,a){function o(e){a(20)}var n=a(1)(a(6),a(32),o,null,null);e.exports=n.exports},,function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0);t.default={name:"app",data:function(){return{user:o.a.user}},methods:{logout:function(){console.log("logoutclick"),o.a.logout()}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0),n="http://www.weddingbaksa.com";console.log("API_URL checklist",n),t.default={name:"checklist",data:function(){return{message:"message place",categories:[],newCategory:{title:""},editingCategory:{},selectedCategory:{_id:"all",title:"전체"},toggleOn:!1,error:{}}},methods:{getAllbudget:function(){},categoryEdit:function(e){this.editingCategory=e,console.log("category.editing ",this.editingCategory)},categoryCancelEdit:function(){this.editingCategory=null},selected:function(e){this.selectedCategory=e,this.toggleOn=!0},goback:function(){this.toggleOn=!1},fetchCategory:function(){var e=this;e.message="fetching category list...";var t=o.a.user.id,a=o.a.getAuthHeader();console.log("userid",t),console.log("authHeader",a),this.$http.get(n+"/category/list/"+t,{headers:a}).then(function(t){e.categories=t.data,console.log(t.data)},function(e){})},addCatogory:function(){var e=this.newCategory.title&&this.newCategory.title.trim();if(e){var t=this;t.message="add new category...";var a=o.a.user.id,i=o.a.getAuthHeader(),s={ownerid:a,title:e,memo:"",required:!0,descryption:"",budget:0,budget_avg:0,budget_automatic:!0};console.log("userid",a),console.log("authHeader",i),this.$http.post(n+"/category/add",s,{headers:i}).then(function(e){t.newCategory="",console.log(e.data),this.fetchCategory()},function(e){console.log(e)})}},updateCategory:function(e){console.log(e);var t=e.title&&e.title.trim();if(t){this.message="updating category";var a=o.a.user.id,i=o.a.getAuthHeader(),s=e;s.title=t,console.log("userid",a),console.log("authHeader",i),this.$http.put(n+"/category/update",s,{headers:i}).then(function(e){this.editingCategory=null,console.log(e.data),this.fetchCategory()},function(e){console.log(e)})}},deleteCategory:function(e){console.log(e),this.message="deleting category";var t=o.a.getAuthHeader();console.log("authHeader",t),this.$http.delete(n+"/category/delete/"+e._id,{headers:t}).then(function(e){this.editingCategory=null,console.log(e.data),this.fetchCategory()},function(e){console.log(e)})}},created:function(){this.fetchCategory()},directives:{focus:function(e,t){t.value&&e.focus()}},computed:{activeCategoryIds:function(){var e=[];return this.categories.forEach(function(t){t.required&&e.push(t._id)}),e}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0);t.default={name:"home",data:function(){return{isloggedin:o.a.user.authenticated}},methods:{getUserinfo:function(){}},created:function(){this.getUserinfo()}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"itemlist",data:function(){return{}},methods:{},created:function(){}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0);t.default={data:function(){return{credentials:{username:"",password:""},error:""}},methods:{submit:function(){var e={username:this.credentials.username,password:this.credentials.password};o.a.login(this,e,"Home")}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0);t.default={data:function(){return{credentials:{username:"",password:"",email:"",name:""},error:""}},methods:{submit:function(){var e={username:this.credentials.username,password:this.credentials.password,email:this.credentials.email,name:this.credentials.name};o.a.signup(this,e,"Home")}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(0),n="http://www.weddingbaksa.com";console.log("API_URL todolist",n),t.default={name:"todolist",data:function(){return{message:"message place",todos:[],newTodo:{title:""},editingTodo:{},error:{}}},methods:{todoEdit:function(e){this.editingTodo=e,console.log("todo.editing ",this.editingTodo)},todoCancelEdit:function(){this.editingTodo=null,console.log("todo.editing cancel",this.editingTodo)},addTodo:function(){if(this.newTodo.title&&this.newTodo.title.trim()){var e=this;e.message="adding todo list...";var t=o.a.user.id,a=o.a.getAuthHeader(),i={ownerid:t,title:this.newTodo.title,categoryid:e.selectedCategory._id,memo:"",completed:!1,descryption:"",budget:0,budget_avg:0};console.log("authHeader",a),this.$http.post(n+"/todo/add",i,{headers:a}).then(function(t){e.newTodo="",e.todos.push(i),console.log(t.data)},function(e){console.log(e)})}},updateTodo:function(e){var t=e.title&&e.title.trim();if(t){var a=this;a.message="updating todo";var i=o.a.getAuthHeader(),s=e;s.title=t,console.log("todo._id",e._id),console.log("authHeader",i),this.$http.put(n+"/todo/update",s,{headers:i}).then(function(e){this.editingTodo=null,console.log(e.data),a.fetchTodos()},function(e){console.log(e)})}},removeTodo:function(e){console.log(e);var t=this;t.message="deleting todo";var a=o.a.getAuthHeader();console.log("authHeader",a),this.$http.delete(n+"/todo/delete/"+e._id,{headers:a}).then(function(e){t.editingTodo=null,console.log(e.data),t.fetchTodos()},function(e){console.log(e)})},fetchTodos:function(e){var t=this;t.message="fetching todo list...";var a=o.a.user.id,i=o.a.getAuthHeader();console.log("userid",a),console.log("authHeader",i),this.$http.get(n+"/todo/get/"+a+"/"+e,{headers:i}).then(function(e){t.todos=e.data,console.log(e.data)},function(e){})}},created:function(){console.log("categoryid clicked",this.$route.params.categoryid),this.fetchTodos(this.$route.params.categoryid)},directives:{focus:function(e,t){t.value&&e.focus()}},computed:{}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a(3),n=a(4),i=a.n(n),s=a(2),r=a(5),c=a(0);o.a.config.productionTip=!1,o.a.use(r.a),c.a.checkAuth(),new o.a({el:"#app",router:s.a,template:"<App/>",components:{App:i.a}})},,,,function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t,a){function o(e){a(18)}var n=a(1)(a(7),a(30),o,"data-v-61ffac6c",null);e.exports=n.exports},function(e,t,a){function o(e){a(21)}var n=a(1)(a(8),a(34),o,"data-v-f5772fae",null);e.exports=n.exports},function(e,t,a){function o(e){a(19)}var n=a(1)(a(9),a(31),o,"data-v-6945df9b",null);e.exports=n.exports},function(e,t,a){var o=a(1)(a(10),a(29),null,null,null);e.exports=o.exports},function(e,t,a){var o=a(1)(a(11),a(33),null,null,null);e.exports=o.exports},function(e,t,a){function o(e){a(17)}var n=a(1)(a(12),a(28),o,"data-v-09afe9ce",null);e.exports=n.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"todolist"},[a("router-link",{staticClass:"btn btn-default",attrs:{to:"/CheckList"}},[e._v("뒤로")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.newTodo.title,expression:"newTodo.title"}],staticClass:"new-todo",attrs:{placeholder:"추가할 항목을 넣으세요"},domProps:{value:e.newTodo.title},on:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13))return null;e.addTodo(t)},input:function(t){t.target.composing||(e.newTodo.title=t.target.value)}}})],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"col-sm-4 col-sm-offset-4"},[a("h2",[e._v("로그인")]),e._v(" "),a("p",[e._v("Log in to your account to get some great weddign service.")]),e._v(" "),e.error?a("div",{staticClass:"alert alert-danger"},[a("p",[e._v(e._s(e.error))])]):e._e(),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.username,expression:"credentials.username"}],staticClass:"form-control",attrs:{type:"text",placeholder:"아이디를 입력하세요"},domProps:{value:e.credentials.username},on:{input:function(t){t.target.composing||(e.credentials.username=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.password,expression:"credentials.password"}],staticClass:"form-control",attrs:{type:"password",placeholder:"비밀번호를 입력하세요"},domProps:{value:e.credentials.password},on:{input:function(t){t.target.composing||(e.credentials.password=t.target.value)}}})]),e._v(" "),a("button",{staticClass:"btn btn-primary",on:{click:function(t){e.submit()}}},[e._v("로그인")])])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("div",{staticClass:"sidebar"},[a("div",{staticClass:"basic shadow"},[e._m(0),e._v(" "),e._m(1),e._v(" "),e._m(2),e._v(" "),e._m(3),e._v(" "),a("div",[a("label",[e._v("총 예산")]),e._v(" "),a("span",[e._v(e._s(e.getAllbudget())+"만원")])])]),e._v(" "),a("ul",{staticClass:"nav nav-pills nav-stacked"},e._l(e.categories,function(t){return a("li",{key:t._id,staticClass:"category",class:{active:t==e.selectedCategory},on:{click:function(a){e.selected(t)},dblclick:function(a){e.categoryEdit(t)}}},[a("h1",{staticClass:"page-header"},[e._v(e._s(t.title))]),e._v(" "),a("p",[e._v("결혼의 꽂! 웨딩촬영! 예전엔 필수코스로 인식되었지만, 비싼 가격에 비해서 한두번 보고 마는 경우가 많아, 셀프촬영으로 대체하거나 생략하는 경우도 많아요. 하지만 평생 한번 있는 기회이니 신중하게 생각해야겠죠?")]),e._v(" "),a("p",[e._v("서울지역 평균 예산: 100-200만원")]),e._v(" "),a("span",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.required,expression:"category.required"}],attrs:{type:"radio",id:t._id+"_none",name:t._id},domProps:{value:e.none,checked:e._q(t.required,e.none)},on:{__c:function(a){t.required=e.none}}}),e._v("미정")]),e._v(" "),a("span",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.required,expression:"category.required"}],attrs:{type:"radio",id:t._id+"_yes",name:t._id},domProps:{value:!0,checked:e._q(t.required,!0)},on:{__c:function(e){t.required=!0}}}),e._v("해요")]),e._v(" "),a("span",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.required,expression:"category.required"}],attrs:{type:"radio",id:t._id+"_no",name:t._id},domProps:{value:!1,checked:e._q(t.required,!1)},on:{__c:function(e){t.required=!1}}}),e._v("안해요")]),e._v(" "),a("button",{staticClass:"btn btn-default",on:{click:function(a){e.categoryEdit(t)}}},[e._v("수정")]),e._v(" "),a("button",[a("router-link",{staticClass:"btn btn-default",attrs:{to:"/todolist/"+t._id}},[e._v(">")])],1),e._v(" "),a("input",{directives:[{name:"show",rawName:"v-show",value:t==e.editingCategory,expression:"category==editingCategory"},{name:"model",rawName:"v-model",value:t.title,expression:"category.title"}],attrs:{type:"text"},domProps:{value:t.title},on:{keyup:[function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27))return null;e.categoryCancelEdit()},function(a){if(!("button"in a)&&e._k(a.keyCode,"enter",13))return null;e.updateCategory(t)}],input:function(e){e.target.composing||(t.title=e.target.value)}}}),e._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:t.required&&t==e.editingCategory,expression:"category.required && category==editingCategory"}]},[a("span",[e._v("예산")]),e._v(" "),a("span",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.budget_automatic,expression:"category.budget_automatic"}],attrs:{type:"radio",id:t._id+"_budgetAutoYes",name:t._id+"_budget"},domProps:{value:!0,checked:e._q(t.budget_automatic,!0)},on:{__c:function(e){t.budget_automatic=!0}}}),e._v("자동계산")]),e._v(" "),a("span",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.budget_automatic,expression:"category.budget_automatic"}],attrs:{type:"radio",id:t._id+"_budgetAutoNo",name:t._id+"_budget"},domProps:{value:!1,checked:e._q(t.budget_automatic,!1)},on:{__c:function(e){t.budget_automatic=!1}}}),e._v("수동입력")]),e._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:0==t.budget_automatic,expression:"category.budget_automatic==false"}]},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.budget,expression:"category.budget"}],attrs:{type:"number",placeholder:"예산"},domProps:{value:t.budget},on:{keyup:[function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27))return null;e.categoryCancelEdit()},function(a){if(!("button"in a)&&e._k(a.keyCode,"enter",13))return null;e.updateCategory(t)}],input:function(e){e.target.composing||(t.budget=e.target.value)}}}),e._v("만원\n                          평균"+e._s(t.budget_avg)+" 만원")])]),e._v(" "),a("button",{directives:[{name:"show",rawName:"v-show",value:t==e.editingCategory,expression:"category==editingCategory"}],on:{click:function(a){e.updateCategory(t)}}},[e._v("Update")])])}))])])},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",[e._v("예랑")]),e._v(" "),a("span",[e._v("김병수")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",[e._v("예신")]),e._v(" "),a("span",[e._v("김재림")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",[e._v("결혼 예정일")]),e._v(" "),a("span",[e._v("2018년 8월 13일 오후 1시")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",[e._v("결혼 장소")]),e._v(" "),a("span",[e._v("대전 컨벤션센터")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"itemlist"},[a("h1",{staticClass:"page-header"},[e._v("혼수목록")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("nav",{staticClass:"navbar navbar-default"},[a("div",{staticClass:"container"},[e._m(0),e._v(" "),a("div",{staticClass:"collapse navbar-collapse",attrs:{id:"navbar"}},[a("ul",{staticClass:"nav navbar-nav"},[a("li",[e.user.authenticated?a("router-link",{attrs:{to:"/checklist"}},[e._v("체크리스트")]):e._e()],1),e._v(" "),a("li",[e.user.authenticated?e._e():a("router-link",{attrs:{to:"/register"}},[e._v("회원가입")])],1),e._v(" "),a("li",[e.user.authenticated?e._e():a("router-link",{attrs:{to:"/login"}},[e._v("로그인")])],1),e._v(" "),e.user.authenticated?a("li",{on:{click:function(t){e.logout()}}},[a("router-link",{attrs:{to:"/login"}},[e._v(" 로그아웃")])],1):e._e()])])])]),e._v(" "),a("router-view")],1)},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"navbar-header"},[a("button",{staticClass:"navbar-toggle collapsed",attrs:{type:"button","data-toggle":"collapse","data-target":"#navbar","aria-expanded":"false","aria-controls":"navbar"}},[a("span",{staticClass:"sr-only"},[e._v("Toggle navigation")]),e._v(" "),a("span",{staticClass:"icon-bar"}),e._v(" "),a("span",{staticClass:"icon-bar"}),e._v(" "),a("span",{staticClass:"icon-bar"})]),e._v(" "),a("a",{staticClass:"navbar-brand",attrs:{href:"#"}},[e._v("웨딩박사")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"col-sm-4 col-sm-offset-4"},[a("h2",[e._v("회원가입")]),e._v(" "),a("p",[e._v("Create an account to get some great wedding service.")]),e._v(" "),e.error?a("div",{staticClass:"alert alert-danger"},[a("p",[e._v(e._s(e.error))])]):e._e(),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.name,expression:"credentials.name"}],staticClass:"form-control",attrs:{type:"text",placeholder:"성함을 입력하세요"},domProps:{value:e.credentials.name},on:{input:function(t){t.target.composing||(e.credentials.name=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.email,expression:"credentials.email"}],staticClass:"form-control",attrs:{type:"email",placeholder:"이메일주소를 입력하세요"},domProps:{value:e.credentials.email},on:{input:function(t){t.target.composing||(e.credentials.email=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.username,expression:"credentials.username"}],staticClass:"form-control",attrs:{type:"text",placeholder:"아이디를 입력하세요"},domProps:{value:e.credentials.username},on:{input:function(t){t.target.composing||(e.credentials.username=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.credentials.password,expression:"credentials.password"}],staticClass:"form-control",attrs:{type:"password",placeholder:"비밀번호를 입력하세요"},domProps:{value:e.credentials.password},on:{input:function(t){t.target.composing||(e.credentials.password=t.target.value)}}})]),e._v(" "),a("button",{staticClass:"btn btn-success",on:{click:function(t){e.submit()}}},[e._v("가입하기")])])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"home"},[a("h1",{staticClass:"page-header"},[e._v("Home")]),e._v(" "),a("h1",{staticClass:"page-header"},[e._v("landing page info will be added here")])])}]}},,,,function(e,t){}],[13]);
//# sourceMappingURL=app.bfb185a323a7acfdc837.js.map