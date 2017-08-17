<template>
	<div class='col-sm-4 col-sm-offset-4'>
		<h2>회원가입</h2>
		<p>Create an account to get some great wedding service.</p>		
		<div class="alert alert-danger" v-if="error">
	        <p>{{ error }}</p>
	    </div>
		<div class="form-group">
			<input
			  type="text"
			  class="form-control"
			  placeholder="성함을 입력하세요"
			  v-model="credentials.name">
		</div>
		<div class="form-group">
			<input
			  type="email"
			  class="form-control"
			  placeholder="이메일주소를 입력하세요"
			  v-model="credentials.email">
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
		<button class="btn btn-success" @click="submit()">가입하기</button>
	</div>
</template>

<script>
import auth from '../auth'
export default {
	data(){
		return {
			credentials: {
				username: '',
				password: '',
				email: '',
				name:''
			},
			error: ''
		}
	},
	methods: {
		submit(){
			var credentials = {
				username: this.credentials.username,
                password: this.credentials.password,
                email:this.credentials.email,
                name:this.credentials.name
			}
			auth.signup(this, credentials, 'Home')
		}
	}
}
</script>