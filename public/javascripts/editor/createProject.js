
function createProjectMenu() {
    var menu = displayActionBlock("createproject");
    if(!menu.new) return;

    var t = document.createElement("h1");
    t.innerHTML = "Create project";
    t.style = `
        margin: 0;
        font-weight: lighter;
    `;

    var side = document.createElement("div");
    side.className = "side-bar";
    
    var tCont = document.createElement("div");
    tCont.className = "title-container";
    tCont.appendChild(t);

    side.appendChild(tCont);

    menu.appendChild(side);

    //Create content wrapper
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    menu.appendChild(wrapper);

    //Add input boxes
    var name = FDButts.textInput("Project name");
    FDButts.activateInput(name);
    wrapper.appendChild(name);

    var desc = FDButts.textInput("Project description");
    FDButts.activateInput(desc);
    wrapper.appendChild(desc);

    var tmpCont = document.createElement("div");
    tmpCont.className = "wrapper template-container";
    wrapper.appendChild(tmpCont);

    var title = document.createElement("p");
    title.className = "title";
    title.innerHTML = "templates";
    tmpCont.appendChild(title);

    var box = document.createElement("div");
    box.className = "container";
    tmpCont.appendChild(box);

    var noTmp = document.createElement("p");
    noTmp.innerHTML = "No templates available";
    box.appendChild(noTmp);



    var create = document.createElement("button");
    create.className = "submit button stdStyle smooth-shadow";
    create.innerHTML = "Create";
    wrapper.appendChild(create);


    
    
    create.addEventListener("click", (e)=>{
        
        //Get the title and description
        var title = name.getElementsByTagName("input")[0].value;
        var description = desc.getElementsByTagName("input")[0].value;

        var cancelContinue = false;

        if(title.trim().length == 0) {
            cancelContinue = true;
            showElementMessage(name, "Name the project");
        }

        if(description.trim().length == 0) {
            cancelContinue = true;
            showElementMessage(desc, "Create a description");
        }

        if(cancelContinue) {
            return;
        }

        showElementMessage(create, "This function is disabled");
        return;

        createProject(title, description)
        .then((response)=>{
            if(response.ok) {
                //Success
            } else {
                console.log(response);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    })
}



function createProject(title, desc) {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);

    fetch('/org/upload/project', {
        method: "POST",
        body: formData
    })
    .then(response => resolveContent(response))
    .catch(error => PromiseRejectionEvent(error))
}