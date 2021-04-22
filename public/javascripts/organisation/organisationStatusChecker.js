async function checkOrganisationStatus(fetch) {
    if(fetch) {

        verifyOrganisation()
        .then(data=>{
            //Successful request :)

            //In theory, there should only be one organisation returned
            var org;
            var owner; 
            var id; 
            var verified;
            var userVerified;
            try {
                org = data.name;
                owner = data.owner;
                id = data.id;
                verified = data.accepted;
                verified = data.useraccepted;
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

            if(verified == false || userVerified == false) {
                title = "Check verification status";
            } else {
                //Call the general 'organisation found do something' function
                showAllOptionsOrgFound();
            }

            createSidebarButton(title, "settings", "orgInfo", "Organisation page")

        })
        .catch(error=>{
            //Oh no
            showError(error);
        })
    } else {
        //Get information from localstorage (to reduce server traffic)

        var orgInfo = JSON.parse(localStorage.getItem("orgInfo"));

        var org = orgInfo.name;
        var owner = orgInfo.owner;
        var id = orgInfo.id;
        var verified = orgInfo.accepted;
        var userVerified = orgInfo.useraccepted;

        var button = document.getElementsByName("applyOrg")[0] || document.getElementsByName("orgInfo")[0];
            
        var sideBar = button.parentNode;

        button.parentNode.removeChild(button);

        //Create a new organisation button
        var title = "Organisation page"

        if(verified == false || userVerified == false) {
            title = "Check verification status";
        } else {
            //Call the general 'organisation found do something' function
            showAllOptionsOrgFound();
        }

        createSidebarButton(title, "settings", "orgInfo", "Organisation page")

    }



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
                    id: integer,
                    useraccepted: boolean
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


    if(data.accepted) {
        //Create the user verification box
        var box = document.createElement("div");
        box.className = "wrapper smooth-shadow";
        box.style.padding = "2rem";
        var title = document.createElement("p");
        title.innerHTML = "Enter master password to activate organisation";

        box.appendChild(title);
        menu.appendChild(box);
        box.style.marginTop = "1rem";


        var bkg = document.createElement("div");
        bkg.className = "background-animation";
        box.appendChild(bkg);


        var form = document.createElement("form");
        form.className = "activate-org";
        box.appendChild(form);

        var pass = FDButts.textInput();
        pass.getElementsByTagName("input")[0].type = "password";
        pass.style = `
            margin: 0.5rem 0 0 0.5rem;
        `
        form.appendChild(pass);
    
    
        var butt = document.createElement("button");
        butt.innerHTML = "Activate";
        butt.className = "button stdStyle smooth-shadow";
        
        form.appendChild(butt);
    
        butt.addEventListener("click", (e)=>{
            e.preventDefault();

            var butt = e.target;

            butt.innerHTML = "Activating";
            butt.disabled = true;

            var passVal = butt.previousSibling.getElementsByTagName("input")[0].value;
            
            //Send a request to the server
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/organisation/userVerify");

            var formData = new FormData();

            formData.append("password", passVal);

            xhr.send(formData);

            xhr.onreadystatechange = function() {
                if(this.status == 200 && this.readyState == 4) {
                    //OK
                    butt.innerHTML = "Activated"; 

                    var orgStat = JSON.parse(localStorage.getItem("orgInfo"));
                    orgStat.useraccepted = true;
                    orgStat.accepted = true;

                    console.log(butt.closest(".wrapper").querySelector(".background-animation"))
                    butt.closest(".wrapper").querySelector(".background-animation").style.animation = "animate-after-activation 250ms ease-in-out both 1s;"

                    localStorage.setItem("orgInfo", JSON.stringify(orgStat));

                    checkOrganisationStatus(false);

                    
                } else if(this.status != 200 && this.readyState == 4) {
                    //Error
                    butt.innerHTML = "Activate";
                    showElementMessage(butt, JSON.parse(this.responseText).message);
                    butt.disabled = false;
                }
            }
        })
    }


}


function showAllOptionsOrgFound() {
    var cont = document.getElementById("action-buttons");

    var x;
    for(x of cont.childNodes) {
        x.disabled = false;
    }


    //Fix the statistics page
    var parent = document.getElementById("user-stats");

    var toRemove = parent.querySelector(".no-stats");
    toRemove.parentNode.removeChild(toRemove);


    var stats = document.createElement("div");
    stats.id = "statistics-container";
    stats.className = "smooth-shadow";
    parent.appendChild(stats);


    var msg = document.createElement("p");
    msg.innerHTML = "No statistics found";
    msg.className = "no-stats"; //THERE IS A DIFFERENCE BETWEEN THIS ONE AND THE .no-stats ABOVE!
    stats.appendChild(msg);
    
}