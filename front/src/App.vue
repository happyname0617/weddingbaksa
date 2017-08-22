<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">웨딩박사</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <!-- <li><router-link to='/'>Home</router-link></li> -->
            <li><router-link to='/checklist' v-if="user.authenticated">체크리스트</router-link></li>
            <!-- <li><router-link to='/itemlist' v-if="user.authenticated">혼수목록</router-link></li> -->
            <li><router-link to='/register' v-if="!user.authenticated">회원가입</router-link></li>
            <li><router-link to='/login' v-if="!user.authenticated">로그인</router-link></li>
            <li v-if="user.authenticated" @click="logout()" ><router-link to='/login'> 로그아웃</router-link></li>

          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import auth from './auth'

export default {
  name: 'app',
  data(){
    return {
      user: auth.user
    }
  },
  methods:{
    logout() {
      console.log('logoutclick')
        auth.logout()
      }
  }
}
</script>

<style>
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
/* @import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css); */
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: "Roboto","Noto Sans KR",'Nanum Gothic',Dotum,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 0px;
}
</style>
