function loadOrgPage(menu, data) {
    menu.className = "org-page";

    var wr = document.createElement("div");
    wr.className = "wrapper";

    menu.appendChild(wr);

    var invite = document.createElement("div");
    invite.className = "invite-user";
    wr.appendChild(invite);

    var txt = document.createElement("p");
    txt.className = "title";
    txt.innerHTML = "Invite user";
    invite.appendChild(txt);

    var wrapper = document.createElement("div");
    invite.appendChild(wrapper);
    wrapper.className = "wrapper";

    var inp = FDButts.textInput("Username and code");
    FDButts.activateInput(inp);
    wrapper.appendChild(inp);
    inp.style.position = "relative";

    var subm = document.createElement("button");
    subm.innerHTML = "Invite";
    subm.className = "button stdStyle smooth-shadow";
    subm.style = `
        margin-left: 1rem;
    `
    wrapper.appendChild(subm);

    subm.addEventListener("click", (e)=>{
        e.preventDefault();

        var butt = e.target;

        var inp = butt.previousSibling.getElementsByTagName("input")[0];

        if(inp.value.trim().length < 8) {
            //Cannot be a real user
            showElementMessage(butt.parentNode, "Enter a valid user id");
            return;
        }

        butt.disabled = true,
        butt.innerHTML = "Inviting";

    })

}