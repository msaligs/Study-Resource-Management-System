export default {
    template: `
        <div>
            <div class="container resource-container" style="max-width:500px">
                <div class="card card-resource mx-auto">
                    <div class="card-body bg-light m-3">
                        <h3 class="text-center">Add Study Resource</h3>
                        <form>
                            <p class="text-danger">{{ error }}</p>
                            <div class="form-group" style="margin-bottom:20px">
                                <label for="topic">Topic</label>
                                <input type="text" class="form-control" id="topic" v-model="resource.topic" placeholder="Enter the topic">
                            </div>
                            <div class="form-group" style="margin-bottom:20px">
                                <label for="description">Description</label>
                                <textarea class="form-control" id="description" v-model="resource.description" placeholder="Enter the description"></textarea>
                            </div>
                            <div class="form-group" style="margin-bottom:20px">
                                <label for="resourceLink">Resource Link</label>
                                <input type="text" class="form-control" id="resourceLink" v-model="resource.resource_link" placeholder="Enter the resource link">
                            </div>
                            <button class="btn btn-primary btn-block" @click="addResource">Add Resource</button>
                            <!-- Link to go back or navigate to another page -->
                            <router-link to="/" class="btn btn-link btn-block">Back to Home</router-link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            resource: {
                topic: null,
                description: null,
                resource_link: null
            },
            error: this.$route.query.error || null,
            token: localStorage.getItem('auth-token')
        };
    },
    methods: {
        async addResource() {
            try {
                const res = await fetch('/api/study_material', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,
                    },
                    body: JSON.stringify(this.resource)
                });
                
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(`Failed to create the resource. Status: ${res.status}`);
                }

                // Clear any previous error messages
                this.error = null;

                // Consider displaying success message on the page instead of an alert
                alert(data.message);

                // Redirect to the resources page with a success message
                this.$router.push({ name: 'resources', path: '/resources', query: { success: 'New Resource Created' } });
            } catch (error) {
                // Display the error on the page
                this.error = error.message;
                console.error(error); // Log the error for debugging
            }
        }
    }
};
