<template>
	<div class='col-sm-4 col-sm-offset-4'>
		<h2>로그인</h2>
		<p>Log in to your account to get some great weddign service.</p>		
		<div class="alert alert-danger" v-if="error">
	        <p>{{ error }}</p>
	    </div>
		<div class="form-group">
			<input
			  type="text"
			  class="form-control"
			  placeholder="아이디를 입력하세요"
			  v-model="credentials.username">
		</div>
		<div class="form-group">
			<input
			  type="password"
			  class="form-control"
			  placeholder="비밀번호를 입력하세요"
			  v-model="credentials.password">
		</div>
		<!-- @click is the same as v-on:click -->
		<button class="btn btn-primary" @click="submit()">로그인</button>
	</div>
</template>

<script>
import auth from '../auth'
export default {
	data(){
		return {
			credentials: {
				username: '',
				password: ''
			},
			error: ''
		}
	},
	methods: {
		submit(){
			var credentials = {
				username: this.credentials.username,
				password: this.credentials.password
			}
			auth.login(this, credentials, 'Home')
		}
	}
}
</script>