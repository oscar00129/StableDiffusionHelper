const app = Vue.createApp({
    data() {
        return {
            data: {},
            isHidden: true,
            form: {
                txtName: "",
                txtFile: "",
                txtImage: "",
                txtPost: "",
                txtLoraTag: "",
                txtPrompts: ""
            },
            loras: [],
            jsonFile: ""
        }
    },
    created(){
        this.getJsonData();
        this.getLocalStorageLoras();
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
                Object.assign(this.form, this.data.form_data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        getLocalStorageLoras(){
            var loras = localStorage.getItem("loras");
            if(loras){
                this.loras = JSON.parse(loras);
                
                // Order data.lora_info
                this.loras.sort((a, b) => {
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
            }else{
                let emptyLoraArr = []
                let jsonEmpltyLoraArr = JSON.stringify(emptyLoraArr);
                localStorage.setItem("loras", jsonEmpltyLoraArr);
                this.getLocalStorageLoras();
            }
        },
        copyToClipboard(text){
            navigator.clipboard.writeText(text);
        },
        complete(){
            var evaluatedVariables = [this.form.txtName, this.form.txtFile, this.form.txtLoraTag]
            var areEmpty = false

            for(var i=0; i<evaluatedVariables.length; i++){
                if(evaluatedVariables[i].trim() === ""){
                    areEmpty = true;
                    alert("Its necessary to fill name, filename and lora tag fields.");
                    break;
                }
            }

            if (areEmpty) return;

            var lora_file_repeated_index = this.loras.findIndex((lora) => {
                return lora.file === this.form.txtFile;
            });

            if(lora_file_repeated_index !== -1){
                // Modify lora
                var currentLora  = {
                    name: this.form.txtName,
                    file: this.form.txtFile,
                    image: this.form.txtImage,
                    url: this.form.txtPost,
                    lora_tag: this.form.txtLoraTag,
                    prompts: this.form.txtPrompts
                }
                this.loras[lora_file_repeated_index] = currentLora;
            }else{
                // Add lora
                var newLora = {
                    name: this.form.txtName,
                    file: this.form.txtFile,
                    image: this.form.txtImage,
                    url: this.form.txtPost,
                    lora_tag: this.form.txtLoraTag,
                    prompts: this.form.txtPrompts
                }
                this.loras.push(newLora);
            }

            // Order Lora
            var ordenedLoraArr = this.loras;
            ordenedLoraArr.sort((a, b) => {
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
            this.loras = ordenedLoraArr;

            this.saveJson();
            this.isHidden = true;
            this.clearForm();
        },
        saveJson(){
            let jsonLoraArr = JSON.stringify(this.loras);
            localStorage.setItem("loras", jsonLoraArr);
        },
        clearForm(){
            this.form.txtName = "";
            this.form.txtFile = "";
            this.form.txtImage = "";
            this.form.txtPost = "";
            this.form.txtLoraTag = "";
            this.form.txtPrompts = "";
        },
        openEdit(lora){
            this.clearForm();
            this.form.txtName = lora.name;
            this.form.txtFile = lora.file;
            this.form.txtImage = lora.image;
            this.form.txtPost = lora.url;
            this.form.txtLoraTag = lora.lora_tag;
            this.form.txtPrompts = lora.prompts;
            this.isHidden = false;
        },
        btnExportClick(){
            let lorasString = JSON.stringify(this.loras);

            var a = document.createElement("a");
            a.href = "data:application/json;charset=utf-8," + encodeURIComponent(lorasString);
            
            var currentDateObj = new Date();
            let currentDate = currentDateObj.toISOString().slice(0, 10);
            let currentTime = currentDateObj.toTimeString().slice(0, 8);
            
            a.download = "Loras_" + currentDate + "_" + currentTime;
            a.click();
        },
        btnImportClick(){
            let inputFileElement = this.$refs.inputFile;
            inputFileElement.click();
        },
        fileLoaded(){
            let inputFileElement = this.$refs.inputFile;

            if(inputFileElement.files[0] && inputFileElement.files[0].type === 'application/json'){
                const reader = new FileReader();
                reader.onload = (event) => {
                    const jsonData = JSON.parse(event.target.result);

                    if(this.loras.length > 0){
                        var response = confirm("Override current loras?");
                        
                        if(response == true){
                            this.loras = jsonData;
                            this.saveJson();
                        }
                    }else{
                        this.loras = jsonData;
                        this.saveJson();
                    }
                }
                reader.readAsText(inputFileElement.files[0]);
            }else{
                alert("Input not valid!");
            }
        }
    }
})

app.mount('#app')