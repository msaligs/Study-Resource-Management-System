export default {
  template: `
    <div class="container login-container" style="max-width:500px">
      <div class="card card-login mx-auto">
        <div class="card-body bg-light m-3">
          <h3 class="text-center">Register</h3>
          <form>
            <p class="text-danger">{{ error }}</p>
            <div class="form-group" style="margin-bottom:20px">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username" v-model="cred.username" placeholder="Enter your Username">
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" v-model="cred.email" placeholder="Enter your Email">
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" v-model="cred.password" placeholder="Enter your password">
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label for="role">Role</label>
              <select class="form-control" id="role" v-model="cred.role" @change="updateActive">
                <option value="stud">Student</option>
                <option value="inst">Instructor</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block" @click="register">Register</button>
            <!-- Link to login page -->
            <router-link to="/login" class="btn btn-link btn-block">Login</router-link>
          </form>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      cred: {
        username: null,
        email: null,
        password: null,
        role: "stud", // Default role is set to student
      },
      error: this.$route.query.error || null,
    };
  },
  methods: {

    async register() {
      if (!this.cred.username || !this.cred.email || !this.cred.password) {
        this.error = "Please fill in all the required fields.";
        return;
      }

      const res = await fetch('/user-register',{
        method: "POST",
        headers: {
          'Content-Type': 'application/JSON'
        },
        body:JSON.stringify(this.cred)
      })
      const data = await res.json()
      if (res.ok){
        this.$router.push({name:'login', path:'/login', query:{error:data.message}})
      }
      else{
        this.error = data.message
      }

    },
  },
};
