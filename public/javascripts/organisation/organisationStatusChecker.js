async function checkOrganisationStatus() {
    verifyOrganisation()
    .then(data=>{
        //Successful request :)

        //In theory, there should only be one organisation returned
        var org;
        var owner; 
        var id; 
        var verified;
    
        try {
            org = data.name;
            owner = data.owner;
            id = data.id;
            verified = data.accepted;
        } catch (error) {
            showError("STRING");
            return;
        }

        //An organisation is confirmed, lets update the sidebar

        
        var button = document.getElementsByName("applyOrg")[0];
        
        var sideBar = button.parentNode;

        button.parentNode.removeChild(button);


        //Enter the information in the localstorage
        localStorage.setItem("orgInfo", JSON.stringify(data));


        //Create a new organisation button
        var title = "Organisation page"

        if(verified == false) {
            title = "Check verification status";
        }

        createSidebarButton(title, "settings", "orgInfo", "Organisation page")

    })
    .catch(error=>{
        //Oh no
        showError(error);
    })



    const showError = (message)=>{
        //Show an error message of some kind
        console.log(message);
    }
}

function verifyOrganisation() {
    return new Promise((resolve, reject) => {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/organisation/checkStatus");
        xhr.send();
        xhr.onreadystatechange = async function() {
            if(this.status == 200 && this.readyState == 4) {
                var response = JSON.parse(this.responseText);
                
                /*
                {
                    accepted: boolean,
                    owner: string,
                    name: string,
                    id: integer
                }
                */
               
               resolve(response);
               
            } else if(this.status != 200 && this.readyState == 4) {
                //Error
                reject([this.status, this.responseText]);
            }
        }
    })
}



function loadOrgStatus(menu, data) {
    var wr = document.createElement("div");
    wr.className = "wrapper smooth-shadow";
    menu.appendChild(wr);
    
    menu.className = "organisation-status";


    var status = document.createElement("p");
    var statusTxt = "pending review";
    if(data.accepted) {statusTxt = "reviewed"}
    status.innerHTML = "Status - <span class='gray'>" + statusTxt + "</span>";
    wr.appendChild(status);

    var veri = document.createElement("p");
    
    var color = 'red';
    if(data.accepted) {color = 'green'}
    veri.innerHTML = "Verified - <span class=" + color + ">" + data.accepted + "</span>";
    wr.appendChild(veri);


    var info = document.createElement("p");
    info.className = "info";
    info.innerHTML = `
        The review process is done manually, so this can take some time. You cannot cancel your request. If the request is denied, you will have to apply for a new organisation.
    `;

    wr.appendChild(info);
}