const app = Vue.createApp({
    data() {
        return {
            data: {}
        }
    },
    created(){
        this.data.app_title = this.getJsonData() || "App";
    },
    methods: {
        getJsonData(){
            fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.data = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
})

app.mount('#app')