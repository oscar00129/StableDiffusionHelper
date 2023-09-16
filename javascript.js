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
                // Order data.lora_info
                data.lora_info.sort((a, b) => {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();

                    if (nameA < nameB){
                        return -1;
                    }else if (nameA > nameB){
                        return 1;
                    }else{
                        return 0;
                    }
                });

                this.data = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        copyToClipboard(text){
            navigator.clipboard.writeText(text);
        }
    }
})

app.mount('#app')