function signIn(e, el) {
    e.preventDefault();

    //Get the datas
    var parent = el.closest(".submission-form");

    el.innerHTML = "Loading";
    el.disabled = true;

    var email = parent.getElementsByTagName("input")[0].value;
    var pass = parent.getElementsByTagName("input")[1].value;

    var formData = new FormData();
    formData.append("user", email);
    formData.append("password", pass);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/auth");
    xhr.send(formData);
    xhr.onerror = function(err) {
        console.log(err);
    }
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            document.getElementById("main-content-wrapper").style.animation = "slide-out-right 400ms ease-in-out"
            document.getElementById("main-content-wrapper").style.animationFillMode = "both"
            document.getElementById("background-gradient").style.animation = "fade-out 300ms ease-in-out 300ms both";
            localStorage.setItem("userInfo", JSON.stringify(res));
            setTimeout(()=>{
                window.location.href = "/main";
            }, 500)
        } else if(this.readyState == 4 && this.status != 200) {
            console.log(this.responseText)
            var res = JSON.parse(this.responseText);
            alert(res.message);

            var el = document.querySelector("#sign-in-cont > div.top > form > button.sign-in.smooth-shadow")
            el.disabled = false;
            el.innerHTML = "Sign in";
            //window.location.href = "/main";

        }
    }
}



function forgotPass(e) {
    e.preventDefault();

    alert("Too bad.");
}

function registerNew() {

    //Hide the register a new account button
    var el = document.querySelector("#sign-in-cont > div.bottom")
    el.style = `
        transition: all 300ms ease-in-out;
        transform: translate(0,-130%);
        position: relative;
        opacity: 0;
        pointer-events: none;
    `;

    var form = document.getElementsByClassName("submission-form")[0]
    var par = form.parentNode;
    form.parentNode.removeChild(form)
    
    var reg = document.createElement("form");

    var e = document.createElement("p");
    e.innerHTML = "Email";
    reg.appendChild(e);
    var email = document.createElement("input");
    email.type = "text";
    email.autocomplete = "email";
    reg.appendChild(email);

    
    var n = document.createElement("p");
    n.innerHTML = "Full Name";
    n.style.marginTop = "0";
    reg.appendChild(n);
    var name = document.createElement("input");
    name.type = "text";
    reg.appendChild(name);

    var p = document.createElement("p");
    p.innerHTML = "Password";
    reg.appendChild(p);
    var pass = document.createElement("input");
    pass.type = "password";
    pass.autocomplete = "none";
    reg.appendChild(pass);

    var p = document.createElement("p");
    p.innerHTML = "Confirm Password";
    reg.appendChild(p);
    var pass1 = document.createElement("input");
    pass1.type = "password";
    pass1.autocomplete = "none";
    reg.appendChild(pass1);


    par.appendChild(reg);
    reg.style.animation = "fade-in 300ms ease-in-out";
    reg.style.animationFillMode = "both";

    var subm = document.createElement("button");
    subm.id="register";
    subm.className = "sign-in smooth-shadow";
    subm.innerHTML = "Register account";
    subm.addEventListener("click", (e)=>{
        var res = createAccount(e, email.value.toLowerCase(), name.value.toLowerCase(), pass.value, pass1.value);
        if(res) {
            var form = document.querySelector("#sign-in-cont > div.top > form");
            showElementMessage(form, res);
        }
    })
    reg.appendChild(subm);

    var back = document.createElement("button");
    back.className="forgot-password";
    back.innerHTML = "Back";
    reg.appendChild(back);
    back.addEventListener("click", (e)=>{
        e.preventDefault();
        location.reload();
    })

}

function createAccount(event, email, name, pass, pass1) {
    event.preventDefault();
    //Get the credentials
    if(email.trim().length == 0) return "Type an email"
    if(name.trim().length < 5) return "Type your full name"
    if(pass!=pass1) return "Passwords do not match";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register");

    var formData = new FormData();
    formData.append("user", name);
    formData.append("email", email);
    formData.append("password", pass);

    xhr.send(formData);


    var butt = document.getElementById("register");
    butt.innerHTML = "Creating user";
    butt.disabled = true;

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            //Request ok!
            //var res = JSON.parse(this.responseText);
            location.reload();

        } else if(this.readyState == 4 && this.status != 200) {
            //Error!
            console.log(this.responseText);
            var form = document.querySelector("#sign-in-cont > div.top > form");
            showElementMessage(form, JSON.parse(this.responseText).message);

            var button = document.querySelector("#register");
            button.innerHTML = "Register";
            button.disabled = false;

        }
    }
}




//Loading wheel
function loaderWheel() {
    var el = document.createElement("div");
        el.setAttribute("class", "lds-roller");

    for(let i = 0; i < 7; i++) {
        var child = document.createElement("div");
            el.appendChild(child);
    }

    return el;
}



function showElementMessage(el, message) {
    //Check if element is in the DOM
    if(!el instanceof HTMLElement) {console.log(new Error("The element is not part of the DOM"))}

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