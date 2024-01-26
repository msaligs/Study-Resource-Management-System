export default {
    template: `
      </div>
        <div class="container login-container" style="max-width:500px">
            <div class="card card-login mx-auto">
                <div class="card-body bg-light m-3">
                    <h3 class="text-center">Login</h3>
                    <form>
                        <p class="text-danger">{{error}}</p>
                        <div class="form-group" style="margin-bottom:20px">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" v-model="cred.email" placeholder="Enter your Email">
                        </div>
                        <div class="form-group" style="margin-bottom:20px">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" v-model="cred.password" placeholder="Enter your password">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" @click="login">Login</button>
                        <router-link to="/register" class="btn btn-link btn-block">Register</router-link>
                    </form>
                </div>
            </div>

        </div>
      </div>
    `,
    data() {
      return {
        cred: {
          email: null,
          password: null,
        },
        error: this.$route.query.error || null,
      };
    },
  
    methods: {
      async login() {
        if (!this.cred.email) {
          this.error = "Email Address Not Provided.";
          return;
        }
        if (!this.cred.password) {
          this.error = "Password not Provided.";
          return;
        }
  
        const res = await fetch('/user-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        });



        const data = await res.json();
        console.log(data);
        if (res.ok) {
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('roles', data.roles);  

          
          if (data.roles.includes('admin')) {
            this.$router.push({ name: 'adminHome', path: '/adminHome' });
          } else if (data.roles.includes('inst')) {
            this.$router.push({ name: 'InstHome', path: '/InstHome' });
          } else if (data.roles.includes('stud')) {
            this.$router.push({ name: 'StudHome', path: '/StudHome' });
          } else {
            this.$router.push({ name: 'home', path: '/' });
          }
        } else {
          this.error = data.message;
        }
      },
    },
  };
  