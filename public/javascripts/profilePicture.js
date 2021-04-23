async function selectPfp(button) {

    if(document.getElementById("select-profile-picture")) {
        var el = document.getElementById("select-profile-picture");
        el.parentNode.removeChild(el);
        return;
    }
    await sleep(10);
    var cont = document.createElement("div");
    cont.id="select-profile-picture";
    cont.className = "smooth-shadow";
    button.appendChild(cont);

    var title = document.createElement("p");
    title.innerHTML = "Select profile picture";
    title.className = "title";
    cont.appendChild(title);


    var imgCont = document.createElement("div");
    imgCont.className = "image-container";


    var img = document.createElement("img");
    imgCont.appendChild(img);
    cont.appendChild(imgCont);

    var noImg = document.createElement("p");
    noImg.innerHTML = "No image selected";
    noImg.className = "no-image";
    imgCont.appendChild(noImg);

    var selectImage = document.createElement("label");
    selectImage.setAttribute("for", "upload-profile-picture-button");
    selectImage.innerHTML = "select";
    selectImage.className = "button stdStyle select-image smooth-shadow";

    imgCont.appendChild(selectImage);

    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.id = "upload-profile-picture-button";
    imgCont.appendChild(inp);

    inp.addEventListener("change", async function(e) {
        if(this.files && this.files[0]) {
            var appendSrc = async function(src){
                return new Promise((resolve, reject)=>{
                    img.src = URL.createObjectURL(src);
                    img.onload = ()=>{resolve()}
                    img.onerror = ()=>{reject()}
                })
            }

            if(imgCont.querySelector(".no-image")) {
                var el = imgCont.querySelector(".no-image");
                el.parentNode.removeChild(el);
            }

            appendSrc(this.files[0])
            .then(()=>{
                //Image added!
                showControls();
            })

            var showControls = function () {
                if(cont.querySelector(".controls")) {return};
                
                var wr = document.createElement("div");
                wr.className = "controls";

                var apply = document.createElement("button");
                apply.innerHTML = "Apply";
                apply.className = "apply-button smooth-shadow button stdStyle";
                wr.appendChild(apply);
                cont.appendChild(wr);


                apply.addEventListener("click", function(e) {
                    var img = cont.getElementsByTagName("input")[0].files[0];
                    if(img.size > 1024*1000) {showElementMessage(cont, "Image size too big (max 1MB)"); return;} //Warn about max size
                    console.log(img);
                    e.target.innerHTML = "Saving";
                    e.target.disabled = true;
                    uploadUsrPfp(img)
                    .then(async (response)=>{
                        //Image has been uploaded!
                        e.target.innerHTML = "Apply";
                        e.target.disabled = false;
                        //Apply it to the webpage as well!


                        var imgEl = document.getElementById("user-container").querySelector(".pfp");
                        var base64String = await getBase64(img);
                        imgEl.src = base64String;

                        var localData = JSON.parse(localStorage.getItem("userInfo"));
                        localData.imagedata = base64String;

                        localStorage.setItem("userInfo", JSON.stringify(localData));

                    })
                    .catch((error)=>{
                        console.log(error);a
                        showElementMessage(cont, "Could not upload");
                    })
                })

            }

        }
    })
}