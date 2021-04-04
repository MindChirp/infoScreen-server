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
    var menu = displayActionBlock("projects");
    if(!menu.new) return;

    var t = document.createElement("h1");
    t.innerHTML = "Open project";
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
}


function openLiveMenu() {
    var menu = displayActionBlock("live");
    if(!menu.new) return;

    var t = document.createElement("h1");
    t.innerHTML = "Open live slideshow";
    t.style = `
        height: fit-content;
        margin: 0;
        font-weight: lighter;
    `
    var side = document.createElement("div");
    side.className = "side-bar";
    
    var tCont = document.createElement("div");
    tCont.className = "title-container";
    tCont.appendChild(t);

    side.appendChild(tCont);
    
    menu.appendChild(side);
}

function previewShows() {
    var menu = displayActionBlock("preview");

    console.log(menu.new)

    if(!menu.new) return;
    var t = document.createElement("h1");
    t.innerHTML = "Preview a slideshow";

    t.style = `
        height: fit-content;
        margin: 0;
        font-weight: lighter;
    `
    var side = document.createElement("div");
    side.className = "side-bar";
    
    var tCont = document.createElement("div");
    tCont.className = "title-container";
    tCont.appendChild(t);

    side.appendChild(tCont);
    
    menu.appendChild(side); 
}

function userOptions() {
    var menu = displayActionBlock("options");

    console.log(menu.new)

    if(!menu.new) return;
    var t = document.createElement("h1");
    t.innerHTML = "User options";

    t.style = `
        height: fit-content;
        margin: 0;
        font-weight: lighter;
    `
    var side = document.createElement("div");
    side.className = "side-bar";
    
    var tCont = document.createElement("div");
    tCont.className = "title-container";
    tCont.appendChild(t);

    side.appendChild(tCont);
    
    menu.appendChild(side);
}



function displayActionBlock(id) {
    var el = document.getElementById(id);
    if(!el) return new Error("Could not find the element"); //Error handling

    el.style.display = "block";
    el.style.animation = "pop-actions-in 350ms cubic-bezier(0.42, 0, 0.07, 1.43)";
    
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
        });

        cont.new = true;
        return cont;
    } else {
        el.querySelector(".content").new = false;
        return el.querySelector(".content");
    }
}





function toggleBg() {

    var disp = document.getElementById("banner").displaying;
    if(!disp) {

        //Get the els to hide
        var els = document.getElementsByName("hideable");
        var x;

        for(x of els) {
            x.style.opacity = "0";
            setTimeout(()=>{
                x.style.display = "none";
            }, 300)
        }

        document.getElementById("banner").displaying = true;

        //Move the banner
        var bann = document.getElementById("banner");
        bann.style.animation = "move-background 400ms cubic-bezier(0.42, 0, 0.15, 1.5)";
        bann.style.animationFillMode = "both";
    } else {
        //Get the action buttons
        var els = document.getElementsByName("hideable");
        console.log(els)
        var y;

        for(y of els) {
            y.style.display = "block";
        }
        setTimeout(()=>{
            var x;
            for(x of els) {
                x.style.opacity = "1";
            }
        }, 300);
        document.getElementById("banner").displaying = false;


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

function openFullPage(el) {
    //Create the fullpage menu
    var men = document.createElement("div");
    men.id = "fullpage-menu";

    setTimeout(()=>{
        document.body.appendChild(men);
    }, 250)
    
    //Move the clicked button
    el.style.animation = "slide-clicked-button 300ms ease-in-out";
    el.blur();

    //Create close button
    var close = document.createElement("button");
    men.appendChild(close);
    close.className = "close-button smooth-shadow"
    close.innerHTML = "Close";

    close.addEventListener("click", (e)=>{
        var parent = e.target.closest("#fullpage-menu");
        parent.parentNode.removeChild(parent);
        el.style.animation = "none";
    });

    //Unselect all buttons
    document.body.blur();

    //Run the function

    window[el.getAttribute("name")](men);

}

function org(menu) {
    var dat = JSON.parse(localStorage.getItem("userInfo"))
    var email = dat[1][0].email;
    var id = dat[1][0].id;

    var h1 = document.createElement("h1");
    h1.style = `
        background-color: var(--dark-secondary-button-color);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        width: fit-content;
        margin: auto;
    `;
    h1.className = "smooth-shadow";
    h1.innerHTML = email + "<span style='opacity: 0.5; color: var(--paragraph-color); font-family: bahnschrift; font-size: 1.5rem;'>#" + id + "</span>"; //This is going to be the default prefix for now


    var cont = document.createElement("div");
    cont.style = `
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
    `;  
    cont.appendChild(h1);

    var sub = document.createElement("p");
    sub.innerHTML = "You do not belong to any organisation. You can however join one by using your email and code above. <br>When you are assigned to an organisation, options will be shown here.";
    sub.style = `
        font-weight: lighter;
        text-align: center;
        width: 100%;
    `
    cont.appendChild(sub);

    menu.appendChild(cont);
}


function priv(menu) {
    var p = document.createElement("p");
    p.innerHTML = "In the early stages of this development path, there won't be any focus on password encryption, or on data transaction safety.";

    menu.appendChild(p);

    var p = document.createElement("p");
    p.innerHTML = "There is no privacy policy yet, so I only ask you kindly to not abuse the program in any way, and to play fair. I am also not liable for any damages that may occur from using this product. Any faults or bugs that leads to an unconvenient situation is on your shoulders."
    menu.appendChild(p);
}

function feedback(menu) {

}

function applyOrg(menu) {
    var h1 = document.createElement("h1");
    h1.innerHTML = "Apply for organisation status";
    h1.style = `
        margin-top: 0;
        font-size: 3rem;
        background-color: var(--dark-secondary-button-color);
        width: fit-content;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
    `
    menu.appendChild(h1);
}