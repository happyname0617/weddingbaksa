//import {router} from '../router/index'
import router from '../router'

// endpoints
const API_URL = process.env.API_URL;
console.log('API_URL',API_URL);
const LOGIN_URL = API_URL + '/user/login'
const SIGNUP_URL = API_URL + '/user/register'

export default {
	// user object is how we check auth status
	user: {
        authenticated: false,
        id:''
	},

	login(context, creds, redirect){
        console.log('login function');
        var app = this;
        console.log('LOGIN_URL',LOGIN_URL);
        context.$http.post(LOGIN_URL, creds)
        .then(response => {
            console.log(response.data)
            if(response.data.success)
                {
                    console.log(response.data)
                    localStorage.setItem('id_token', response.data.token)
                    localStorage.setItem('userinfo', JSON.stringify(response.data.user))    
                    app.user.authenticated = true;
                    app.user.id = response.data.user.id;
                    // redirect
                    if(redirect){
                        router.push({name:redirect})
                    }
                }
                else{
                        router.push({name:'Login'})
                }
		},error => {
			context.error = error
		})
	},

	signup(context, creds, redirect){
        var app = this;
		context.$http.post(SIGNUP_URL, creds) 
		.then(function(response){
            if(response.data.success){
                localStorage.setItem('id_token', response.data.token);
                localStorage.setItem('userinfo', JSON.stringify(response.data.user))
                app.user.authenticated = true;
                app.user.id = response.data.user.id;
                // redirect
                if(redirect){
                    router.push({name:redirect})
                }
            }
            else{
                    router.push({name:'Register'})
            }
          },error => {
			context.error = error
		})
	},

	logout(){
        console.log('logout')
        localStorage.removeItem('id_token')
        localStorage.removeItem('userinfo')
        this.user.authenticated = false;
        this.user.id = '';
	},

	checkAuth(){
        console.log('checkAuth')
        var jwt = localStorage.getItem('id_token');
        var userinfo = JSON.parse(localStorage.getItem('userinfo'));
		if(jwt){
            this.user.authenticated = true
            this.user.id = userinfo.id;
		} else {
            this.user.authenticated = false;
            this.user.id = {};
        }
        console.log('this.user.authenticated',this.user.authenticated)
	},

	getAuthHeader(){
		return {
            'Authorization': localStorage.getItem('id_token')
		}
    },

}