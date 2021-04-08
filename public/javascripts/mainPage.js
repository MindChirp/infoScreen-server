var FDButtons = function(){
    this.activateInput = (inp) => {
        //Get the input tag
        var el = inp.querySelector(".fd-text-input__action");
        if(!el) {return new Error("Could not find element")}

        el.addEventListener("blur", (e)=>{
            if(e.target.value.trim().length > 0) {
                //Don't let the label fall back down
                el.nextSibling.style = `transform: translate(-1rem,-1.6rem); font-size: 1rem; line-height: 1.5rem; height: 1.5rem; opacity: 1;`; 
                return;
            }

            el.nextSibling.style = ``;
        })

    },
    this.textInput = (title)=> {
        var lab = document.createElement("label");
        lab.className = "fd-text-input";
    
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "fd-text-input__action smooth-shadow";
    
        var sp = document.createElement("span");
        sp.className = "fd-text-input__title";

        if(title) {
            sp.innerHTML = title + '';
        }
        lab.appendChild(inp);
        lab.appendChild(sp);

        return lab;
    }
}

const FDButts = new FDButtons();


function signOut() {
    location.href = "/signOut";
}

window.onload = ()=>{
    loadUserInfo();
    
    var dat = JSON.parse(localStorage.getItem("userInfo"))[1][0];
    if(!dat.organisation) {
        createSidebarButton("Join organisation", "corporate_fare", "org", "Join organisation");
        createSidebarButton("Create organisation", "check", "applyOrg", "Apply for organisation");
    }
}


async function loadUserInfo() {

        var data = await JSON.parse(localStorage.getItem("userInfo"));
        
        var userInfo = data[1][0];
        
        var name = userInfo.name;
        
        var userCont = document.getElementById("user-container");
        userCont.querySelector("#welcome-text").innerHTML = "Welcome, " + capitalizeTheFirstLetterOfEachWord(name);

}

function capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
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
        bann.querySelector(".bg").classList.add("invisible");

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
        newBann.querySelector(".bg").classList.remove("invisible");


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

    //Fade out the side bar (and fade it back in)
    //Get the side-bar content
    setTimeout(()=>{
        var par = el.closest(".content");
        par.style.opacity = "0";

        setTimeout(()=>{
            par.style.opacity = "1";
        }, 500)
    }, 500)

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

    //Create bottom gradient bar
    var grad = document.createElement("div");
    grad.className = "gradient";
    grad.style = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.3rem;
    `;
    men.appendChild(grad);

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
    h1.className = "smooth-shadow username-and-id";
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

    var h1 = document.createElement("h1");
    h1.innerHTML = "Privacy and Terms of Service";
    h1.className = "title";
    menu.appendChild(h1);

    var p = document.createElement("p");
    p.innerHTML = "In the early stages of this development path, there won't be any focus on password encryption, or on data transaction safety.";

    menu.appendChild(p);

    var p = document.createElement("p");
    p.innerHTML = "There is no privacy policy yet, so I only ask you kindly to not abuse the program in any way, and to play fair. I am also not liable for any damages that may occur from using this product. Any faults or bugs that leads to an unconvenient situation is on your shoulders."
    menu.appendChild(p);

    var p = document.createElement("p");
    p.innerHTML = `Website Terms and Conditions of Use
    1. Terms
    By accessing this Website, accessible from https://shrouded-wave-54128.herokuapp.com/, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
    
    2. Use License
    Permission is granted to temporarily download one copy of the materials on Infoscreen's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
    
    modify or copy the materials;
    use the materials for any commercial purpose or for any public display;
    attempt to reverse engineer any software contained on Infoscreen's Website;
    remove any copyright or other proprietary notations from the materials; or
    transferring the materials to another person or "mirror" the materials on any other server.
    This will let Infoscreen to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the Terms Of Service Generator and the Privacy Policy Generator.
    
    3. Disclaimer
    All the materials on Infoscreen’s Website are provided "as is". Infoscreen makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Infoscreen does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
    
    4. Limitations
    Infoscreen or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Infoscreen’s Website, even if Infoscreen or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
    
    5. Revisions and Errata
    The materials appearing on Infoscreen’s Website may include technical, typographical, or photographic errors. Infoscreen will not promise that any of the materials in this Website are accurate, complete, or current. Infoscreen may change the materials contained on its Website at any time without notice. Infoscreen does not make any commitment to update the materials.
    
    6. Links
    Infoscreen has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Infoscreen of the site. The use of any linked website is at the user’s own risk.
    
    7. Site Terms of Use Modifications
    Infoscreen may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
    
    8. Your Privacy
    Please read our Privacy Policy.
    
    9. Governing Law
    Any claim related to Infoscreen's Website shall be governed by the laws of no without regards to its conflict of law provisions.`;

    menu.appendChild(p);
}

function feedback(menu) {
    var h1 = document.createElement("h1");
    h1.innerHTML = "Send Feedback";
    h1.className = "title";
    menu.appendChild(h1);

    var left = document.createElement("div");
    left.style = `
        float: left;
        display: inline-block;
        width: fit-content;
        height: fit-content;
        margin-bottom: 1rem;
        margin-top: 1rem;
    `;
    left.className = "left";

    var title = FDButts.textInput('Title');
    var wr = document.createElement("div");
    wr.style = `
        display: block;
    `
    wr.appendChild(title);
    left.appendChild(wr);

    FDButts.activateInput(title);

    var email = FDButts.textInput('Email');
    var wr = document.createElement("div");
    wr.style = `
        margin-top: 2rem;
        display: block;
    `
    wr.appendChild(email);
    left.appendChild(wr);

    menu.appendChild(left);
    FDButts.activateInput(email);


    var right = document.createElement("div");
    right.style = `
        margin-top: 1rem;
        display: inline-block;
        width: 70%;
    `;
    right.className = "right";

    var box = document.createElement("textarea");
    box.placeholder = "Type something..";

    box.style = `
        height: 20rem;
        width: 100%;
        overflow: hidden;
    `;
    
    var subm = document.createElement("button");
    subm.innerHTML = "submit";
    subm.displaying = false;
    subm.className = "smooth-shadow submit-feedback-button";
    subm.disabled = true;


    var wr = document.createElement("div");
    wr.appendChild(box);
    wr.className = "wrapper smooth-shadow";
    right.appendChild(wr);
    wr.style.marginLeft = "1rem";
    wr.style.position = "relative";
    wr.style.overflow = "hidden";

    wr.appendChild(subm)

    box.addEventListener("focus", (e)=>{
        //Show the submit button
        //check if it is displaying
        var button = box.nextElementSibling;
        if(button.displaying == false) {
            button.displaying = true;
            button.style.transform = "translate(0, -1rem)";
            button.disabled = false;
        }
        
    });

    const serverAddress = 'https://shrouded-wave-54128.herokuapp.com';


    subm.addEventListener("click", (e)=>{
        //Send the server request
        var xhr = new XMLHttpRequest();
        console.log(serverAddress);
        xhr.open("POST", serverAddress + "/postFeedBack");
        
        var par = e.target.closest("#fullpage-menu").querySelector(".left");
        var subject = par.getElementsByTagName("input")[0].value;
        var email = par.getElementsByTagName("input")[1].value;
        var letter = e.target.closest(".right").getElementsByTagName("textarea")[0].value;

        if(subject.trim().length == 0 || email.trim().length == 0 || letter.trim().length == 0) {return}

        var formData = new FormData();
        formData.append("subject", subject.value);
        formData.append("email", email.value);
        formData.append("body", letter.value);
        
        xhr.send(formData);
        xhr.onreadystatechange = async function() {
            if(this.readyState == 4 && this.status == 200) {
                var res = JSON.parse(this.responseText);
                if(res[0] == "OK") {
    
                    e.target.style.width = "5rem";
                    e.target.style.overflow = "hidden";
                    e.target.style.opacity = "0.4";
                    e.target.innerHTML = "Sent";
                    e.target.disabled = true;
        
        
                } else if(res[0] == "ERROR") {
                    console.log(res[1]);
                } else {
                    console.log(res);
                }
        
            } else if(this.readyState == 4 && this.status != 200){
                //Request failed
                alert("Failed.");
            }
        }
    })

    menu.appendChild(right);

}




function applyOrg(menu) {
    var h1 = document.createElement("h1");
    h1.innerHTML = "Apply to Create an Organisation";
    h1.className = "title";
    menu.appendChild(h1);
}

function createSidebarButton(title, icon, name, hover) {
    var el = document.createElement("button");
    el.setAttribute("onclick", "openFullPage(this)");

    if(name) {
        el.name = name;
    }

    if(hover) {
        var h = document.createElement("div");
        h.className = "info-box smooth-shadow";
        h.innerHTML = hover;
        el.appendChild(h);
    }

    var ico = document.createElement("span");
    ico.className = "material-icons";
    ico.innerHTML = icon;
    el.appendChild(ico);
    
    var lab = document.createElement("span");
    lab.innerHTML = title;
    el.appendChild(lab);

    document.getElementById("side-bar").querySelector(".content").appendChild(el);

}