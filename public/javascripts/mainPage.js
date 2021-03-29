function signOut() {
    location.href = "/signOut";
}

window.onload = ()=>{
    loadUserInfo();
}


function loadUserInfo() {
    var data = JSON.parse(localStorage.getItem("userInfo"));

    var userInfo = data[1][0];
    
    var name = userInfo.name;

    var userCont = document.getElementById("user-container");
    userCont.querySelector("#welcome-text").innerHTML = "Welcome, " + name;
}

function toggleSidebar() {
    var sideBar = document.getElementById("side-bar");
    var shade = document.getElementById("dark-shade-modal");
    var infoB = document.getElementById("info-container-modal");

    if(!sideBar.displaying) {
        sideBar.displaying = true;
        sideBar.style.transform = "translate(0)";
        shade.style.display = "initial";
        infoB.style.display = "initial";
    } else {
        sideBar.displaying = false;
        sideBar.style.transform = "translate(-100%)";
        shade.style.display = "none";
        infoB.style.display = "none";

    }
}

function openProjectMenu() {
    var el = document.getElementById("projects");
    el.style.display = "block";
    el.style.animation = "fade-in 200ms ease-in-out";
    
    toggleBg();

    //Paint content if there is none
    if(!el.querySelector(".content")) {
        var cont = document.createElement("div");
        cont.style = `
            height: 100%;
            width: 100%;
            padding: 1rem;
            box-sizing: border-box;
        `;
        cont.className = "content";

        var t = document.createElement("h1");
        t.innerHTML = "Open project from server";
        t.style = `
            height: fit-content;
            margin: 0;
            font-weight: lighter;
        `
        cont.appendChild(t);
        el.appendChild(cont);

        var close = document.createElement("button");
        cont.appendChild(close);
        close.className = "close-button smooth-shadow"

        var i = document.createElement("i");
        i.innerHTML = "close";
        i.className = "material-icons";
        close.appendChild(i);


        close.addEventListener("click", (e)=>{
            var menu = e.target.closest(".action-menu");
            menu.style.display = "none";
            toggleBg();
        })
    } else {
        console.log("CONTENT FOUND")
    }
}




function toggleBg() {

    var disp = document.getElementById("banner").displaying;
    if(!disp) {

        //Get the action buttons
        var butts = document.getElementById("action-buttons");
        butts.style.opacity = "0";

        
        var usr = document.getElementById("user-container");
        usr.style.opacity = "0";
        document.getElementById("banner").displaying = true;

        setTimeout(()=>{
            butts.style.display = "none";
            usr.style.display = "none";
        }, 300);

        //Move the banner
        var bann = document.getElementById("banner");
        bann.style.animation = "move-background 400ms ease-in-out";
        bann.style.animationFillMode = "both";
    } else {
        //Get the action buttons
        var butts = document.getElementById("action-buttons");
        butts.style.opacity = "1";
                
        var usr = document.getElementById("user-container");
        usr.style.opacity = "1";
        document.getElementById("banner").displaying = false;


        setTimeout(()=>{
            butts.style.display = "block";
            usr.style.display = "block";
        }, 300);

        //Move the banner
        var bann = document.getElementById("banner");
        var newBann = bann.cloneNode(true);

        newBann.style.animationFillMode = "both";
        newBann.style.animation = "move-background 400ms ease-in-out";
        newBann.style.animationDirection = "reverse";

        bann.before(newBann);

        bann.parentNode.removeChild(bann);
        setTimeout(()=>{
            newBann.style.animation = "";
            newBann.style.animationDirection = "";
        }, 400)
    }
}