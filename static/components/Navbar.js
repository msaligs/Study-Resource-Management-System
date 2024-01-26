export default {
    template: `
    <div class="container-fluid ">
        <div class="row">
            <div class="container-fluid d-flex justify-content-between align-items-center">
                <!-- Website Title -->
                <a class="navbar-brand align-middle" href="#">
                    <img src="https://placehold.co/50" alt="Logo" width="50" height="50" class="d-inline-block align-top">
                    <span class="fs-1 fw-semibold ">Study Resource Management</span>
                </a>

                <!-- Icons and Buttons -->
                <div class="d-flex align-items-center">
                    <!-- Cart Icon -->
                    <a href="#" class="me-3">
                        <i class="bi bi-cart"></i>
                    </a>

                    <!-- Profile Icon -->
                    <a href="#" class="me-3">
                        <i class="bi bi-person"></i>
                    </a>

                    <!-- Login/Logout Button -->
                    <button class="btn btn-primary" id="loginLogoutBtn">Login</button>
                </div>
            </div>
        </div>


        <div class="row">
            <nav class="navbar navbar-expand-md bg-body-tertiary ">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">SRM</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
                            </li>

                            <li class="nav-item" v-if="role=='admin'">
                                <router-link class="nav-link active" aria-current="page" to="/users">Users</router-link>
                            </li>

                            <li class="nav-item dropdown" v-if="is_login">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Resources
                                </a>
                                <ul class="dropdown-menu">
                                    <li v-if="role=='stud'">
                                        <router-link class="nav-link active" aria-current="page" to="/resources">
                                            My Resources
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link class="nav-link active" aria-current="page" to="/resources">
                                            All Resources
                                        </router-link>
                                    </li>
                                    <li v-if="role=='stud'">
                                        <router-link class="nav-link active" aria-current="page" to="/CreateResource">
                                            Add New Resource
                                        </router-link>
                                    </li>
                                </ul>
                            </li>

                            <li class="nav-item" v-if="!is_login">
                                <router-link class="nav-link" to="/login">Login</router-link>
                            </li>
                            <li class="nav-item" v-if="is_login">
                                <button class="nav-link" @click="logout">Logout</button>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>


    </div>

  `,
    data() {
        return {
            is_login: localStorage.getItem('auth-token') || null,
            role: localStorage.getItem('roles')
        }
    },

    methods: {
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('roles')
            this.$router.push({ name: 'home' })
        }
    },

}