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



    
}