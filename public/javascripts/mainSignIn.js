function signIn(e, el) {
    e.preventDefault();

    //Get the datas
    var parent = el.closest(".submission-form");

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
            //window.location.href = "/main";

        }
    }
}



function forgotPass(e) {
    e.preventDefault();

    alert("Too bad.");
}

function registerNew() {
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
    subm.innerHTML = "Regiser account";
    subm.addEventListener("click", (e)=>{
        createAccount(e, email.value.toLowerCase(), name.value.toLowerCase(), pass.value, pass1.value);
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

    if(pass!=pass1) return new Error("Passwords do not match");

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
            alert(this.responseText);
        }
    }
}