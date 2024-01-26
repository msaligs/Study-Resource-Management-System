export default {
    template: `
        <div>
            <div class="container mt-5">
            <h2 class="mb-4">Study Resources</h2>

            <div class="mb-3">
                <label for="isApprovedFilter">Filter by Approval:</label>
                <select v-model="filter.is_approved" @change="filterResources">
                    <option :value="null">All</option>
                    <option :value="true">Approved</option>
                    <option :value="false">Not Approved</option>
                </select>
            </div>

            
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Topic</th>
                        <th>Description</th>
                        <th>Creator Username</th>
                        <th>Resource Link</th>
                        <th>Is Approved</th>
                    </tr>
                </thead>
                <tbody>
                    
                <tr v-for="resource in resources" :key="resource.id">
                    <td>{{ resource.id }}</td>
                    <td>{{ resource.topic }}</td>
                    <td>{{ resource.description }}</td>
                    <td>{{ resource.creater_name }}</td>
                    <td>{{ resource.resource_link }}</td>
                    <td>{{ resource.is_approved ? 'Yes' : 'No' }}</td>
                </tr>
                    
                </tbody>
            </table>
            </div>
        </div>
    
    `,
    data(){
        return {
            error : this.$route.query.error || null,
            token: localStorage.getItem('auth-token'),
            resources : [],
            filter:{
                is_approved:null,
                topic:'new topic12',
                resource_link:'aaa',
            }

        }
    },
    methods:{
        async filterResources(){
                // Build the query string with non-null values
                const queryParams = Object.entries(this.filter)
                    .filter(([key, value]) => value !== null)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
            console.log(queryParams);
            try{
                const res = await fetch(`/api/study_material?${queryParams}`, {
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-Token':this.token
                    }
                })
    
                if(!res.ok){
                    if (res.status == '403'){
                        throw new Error(`You are not authorise to this resource, status: ${res.status}`)
                    }else{
                        throw new Error(`Something is not good, status: ${res.status}`)
                    }
                }
                const data = await res.json()
                this.resources = data;
                console.log(data)
            }
            catch(error){
                this.error = error.message
            }
        }
    },
    
    async mounted(){
        try{
            // const res = await fetch('/api/study_material', {
            const res = await fetch('/api/study_material?is_approved=false', {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-Token':this.token
                }
            })

            if(!res.ok){
                if (res.status == '403'){
                    throw new Error(`You are not authorise to this resource, status: ${res.status}`)
                }else{
                    throw new Error(`Something is not good, status: ${res.status}`)
                }
            }
            const data = await res.json()
            this.resources = data;
            console.log(data)
        }
        catch(error){
            this.error = error.message
        }
    }


}