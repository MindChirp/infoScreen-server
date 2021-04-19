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

var FDButtons = function(){
    this.activateInput = (inp) => {
        //Get the input tag
        var el = inp.querySelector(".fd-text-input__action");
        if(!el) {return new Error("Could not find element")}

        el.addEventListener("blur", (e)=>{
            if(e.target.value.trim().length > 0) {
                //Don't let the label fall back down
                el.nextSibling.nextSibling.style = `transform: translate(-0.8rem,-1.6rem); font-size: 1rem; line-height: 1.5rem; height: 1.5rem; opacity: 1;`; 
                return;
            }

            el.nextSibling.nextSibling.style = ``;
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

        var indicator = document.createElement("div");
        indicator.className = "fd-text-input__indicator";

        lab.appendChild(inp);
        lab.appendChild(indicator);
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
    //require the TOS module
    try {
        console.log(Terms);
        p.innerHTML = Terms;
    } catch (error) {
        console.log(error);
        p.innerHTML = "Could not load the full legal document.";
        p.className = "paragraph-warning";
    }
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
    title.setAttribute("name", "title");
    wr.appendChild(title);
    left.appendChild(wr);

    FDButts.activateInput(title);

    var email = FDButts.textInput('Email');
    email.setAttribute("name", "email");

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

    subm.addEventListener("click", (e)=>{
        //Send the server request
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/postFeedBack");
        
        var par = e.target.closest("#fullpage-menu").querySelector(".left");
        var subject = par.getElementsByTagName("input")[0].value;
        var email = par.getElementsByTagName("input")[1].value;
        var isEmailValid = validateEmail(email);
        if(!isEmailValid) {
            //The email is not formatted correctly. The database won't accept it either way, so lets just block it at this stage.
            var emailEl = document.getElementsByName("email")[0];
            showElementMessage(emailEl, "Email is not formatted correctly");

            return;
        }

        if(subject.trim().length < 5) {
            var titleEl = document.getElementsByName("title")[0];
            showElementMessage(titleEl, "Please enter a valid title");
            return;
        }
        var letter = e.target.closest(".right").getElementsByTagName("textarea")[0].value;
        console.log(subject, email, letter)
        if(subject.trim().length == 0 || email.trim().length == 0 || letter.trim().length == 0) {return}

        var formData = new FormData();
        formData.append("subject", subject);
        formData.append("email", email);
        formData.append("body", letter);

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


function showElementMessage(el, message) {
    //Check if element is in the DOM
    if(!el instanceof HTMLElement) {return new Error("The element is not part of the DOM")}

    //To show the message at the center, the element should be either position: absolute; or position: relative;
    
    var msg = document.createElement("div");
    msg.className = "element-message smooth-shadow";

    el.appendChild(msg);

    //Text
    var p = document.createElement("p");
    p.innerHTML = message + ''; //Force it to be a string

    msg.appendChild(p);

    //Kill the element after some time

    setTimeout(()=>{
        msg.parentNode.removeChild(msg);
    }, 5000);

    return msg;
}

        
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function applyOrg(menu) {
    var mainWrapper = document.createElement("div");
    mainWrapper.className = "main-wrapper";
    menu.appendChild(mainWrapper);

    var h1 = document.createElement("h1");
    h1.innerHTML = "Apply to Create an Organisation";
    h1.className = "title";
    mainWrapper.appendChild(h1);
    menu.classList.add("apply-for-org");

    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    mainWrapper.appendChild(wrapper);

    var form = document.createElement("form");
    form.className = "form";
    form.setAttribute("autocomplete", "off");

    wrapper.appendChild(form);

    var title = FDButts.textInput('Organisation name');
    form.appendChild(title);
    FDButts.activateInput(title);
    title.classList.add("name");

    var desc = FDButts.textInput('Description');
    form.appendChild(desc);
    desc.setAttribute("autocomplete", "off")
    desc.childNodes[0].style.width = "20rem";
    desc.childNodes[0].setAttribute("autocomplete", "off");
    FDButts.activateInput(desc);
    desc.classList.add("description");

    var pass = FDButts.textInput('Master password');
    pass.setAttribute("autocomplete", "new-field-password")
    form.appendChild(pass);
    pass.childNodes[0].style.width = "20rem";
    pass.childNodes[0].type = "password";
    pass.childNodes[0].setAttribute("autocomplete", "off");
    FDButts.activateInput(pass);
    pass.classList.add("password");

    //Create information dropdown for the master password input
    var info = document.createElement("div");
    var p = document.createElement("p");
    p.innerHTML = "The master password should only be known to the administrator";
    info.appendChild(p);
    pass.appendChild(info);
    info.className = "information";


    var p = document.createElement("p");
    p.innerHTML = "Organisation image";
    p.className = "sub-title";
    wrapper.appendChild(p);

    var imageSection = document.createElement("div");
    imageSection.className = "image-section";
    wrapper.appendChild(imageSection);

    var imgCont = document.createElement("div");
    imgCont.className = "image-selector-container";
    imageSection.appendChild(imgCont);

    var img = document.createElement("div");
    img.className = "image-selector smooth-shadow";
    imgCont.appendChild(img);

    var selImg = document.createElement("input");
    selImg.type = "file";
    selImg.accept = "image/*"
    selImg.id = "upload-photo";
    selImg.style.display = "none";

    var label = document.createElement("label");
    label.setAttribute("for", "upload-photo")
    label.className = "upload-label smooth-shadow";
    img.appendChild(label);
    label.innerHTML = "Select an Image"

    var image = document.createElement("img");
    image.className = "org-image";
    image.src = "/images/resources/icon.png";
    img.appendChild(image);

    img.appendChild(selImg);


    selImg.addEventListener("change", async function(){
        if(this.files && this.files[0]) {
            var appendSrc = async function(src){
                return new Promise((resolve, reject)=>{

                    var image = img.querySelector(".org-image");

                    image.src = URL.createObjectURL(src);
                    image.onload = ()=>{resolve()}
                    image.onerror = ()=>{reject()}
                })
            }


            //Check if there is an error message
            if(img.querySelector(".error")) {
                console.log(img.querySelector(".error"));
                var el = img.querySelector(".error");
                el.parentNode.removeChild(el);

                var image = document.createElement("img");
                image.className = "org-image";
                img.appendChild(image);
            }

            try {
                await appendSrc(this.files[0]);
            } catch (error) {
                if(img.getElementsByTagName("img")[0]) {
                    var el = img.getElementsByTagName("img")[0];
                    el.parentNode.removeChild(el);
                }
                var p = document.createElement("p");
                p.className = "error";
                p.innerHTML = "Could not load the image"
                img.appendChild(p);
            }

            var image = img.querySelector(".org-image");

            var imgStyle = window.getComputedStyle(image);
            var h = image.naturalHeight;
            var w = image.naturalWidth;
            var margins = 0.1;



            if(h/w > 1 + margins || h/w < 1 - margins) {
                //Show the ratio warning
                if(imageSection.querySelector(".ratio-warning")) {imageSection.querySelector(".ratio-warning").parentNode.removeChild(imageSection.querySelector(".ratio-warning"))}
                var el = document.createElement("div");
                el.className = "ratio-warning smooth-shadow";

                var msg = document.createElement("p");
                msg.innerHTML = "Your current resolution (" + w + "x" + h +") might scale differently across the platform. It is recommended to use a squared image.";
                el.appendChild(msg);

                imageSection.appendChild(el);
            } else {
                if(imageSection.querySelector(".ratio-warning")) {imageSection.querySelector(".ratio-warning").parentNode.removeChild(imageSection.querySelector(".ratio-warning"))}
            }
        }
    });



    var imgInfo = document.createElement("div");
    imgInfo.className = "image-information";

    var wr = document.createElement("div");
    wr.className = "wrapper";

    var p = document.createElement("p");
    p.innerHTML = "The organisation image will be used to give users an idea of what organisation this is. It should typically be a logo, or a concept that represents what the organisation does.";

    wr.appendChild(p);
    imgInfo.appendChild(wr);


    imageSection.appendChild(imgInfo);

    var informationSection = document.createElement("div");


    var apply = document.createElement("button");
    apply.className = "apply-button smooth-shadow";

    apply.innerHTML = "Apply for organisation";

    mainWrapper.appendChild(apply);

    apply.addEventListener("click", (e)=>{
        //Gather the information, send it to the server
        var name = menu.querySelector(".name").getElementsByTagName("input")[0];
        var desc = menu.querySelector(".description").getElementsByTagName("input")[0];

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/applyOrg");
        console.log(name.value)
        var formData = new FormData();
        formData.append("name", name.value);
        formData.append("desc", desc.value);

        xhr.send(formData);
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {

                //Send profile image
                var imageDat
                uploadOrgPfp()
                console.log(this.responseText);
            } else if(this.readyState == 4 && this.status != 200) {
                console.log("ERROR");
                console.log(this.responseText);
            }
        }

    });
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