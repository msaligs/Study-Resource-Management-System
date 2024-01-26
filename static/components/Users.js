export default {
  template: `
        <div>
            <p class="text-danger">{{error}}</p>
            <div v-for="(user, index) in allUsers" class="col-lg-4 col-md-6 mb-4">
                <div class="card" >
                    <div class="card-body">
                        <h5 class="card-title">{{user.username}}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{user.roles}}</h6>
                        <p class="card-text">{{user.email}}</p>
                        <button class="btn btn-primary" v-if="!user.active" @click="activate_inst(user.id,index)">activate</button>
                    </div>
                </div>

            </div>
        </div>`,
  data() {
    return {
      allUsers: [],
      token: localStorage.getItem("auth-token"),
      error: null,
    };
  },
  methods: {
    async activate_inst(inst_id,userIndex){
        const res = await fetch(`/activate/inst/${inst_id}`, {
            headers:{
                'Authentication-Token': this.token
            }
        })
        if (!res.ok){
            throw new Error(`Something went wrong. Status: ${res.status}`);
        }
        const data = await res.json()
        this.$set(this.allUsers, userIndex, { ...this.allUsers[userIndex], active: true });
        this.componentKey += 1;


    }
  },
  
  async mounted() {
    try {
      const res = await fetch("/users", {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      if (!res.ok) {
        if (res.status == '403'){
            throw new Error(`You are not authorise for this resource. Status: ${res.status}`);
        }
        else{
            throw new Error(`Failed to fetch users. Status: ${res.status}`);
        }
      }

      const data = await res.json();
      this.allUsers = data;
    } catch (error) {
      this.error = error.message;
    }
  },
};