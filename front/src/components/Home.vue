<template>
  <div class="home">
      <h1 class='page-header'>Home</h1>
      <!-- {{isloggedin}}
        <a href="http://localhost:3000/auth/facebook">
              Login with Facebook
              </a> -->

  </div>
</template>

<script>
import auth from '../auth'
export default {
  name: 'home',
  data () {
    return {isloggedin:auth.user.authenticated
    }
  },
  methods:{
      getUserinfo:function(){
          var parent = this;
          // this.$http.get('http://localhost:3000/get/userinfo')
          // .then(function(response){
          //     console.log(response.data)
          //       parent.isloggedin = response.data;
          // });
      }
  },
  created:function(){
     this.getUserinfo();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
