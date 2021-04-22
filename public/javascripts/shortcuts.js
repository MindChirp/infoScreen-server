
function handleShortcut(e) {
    if(e.code == "Escape") {
        closeExistingActionMenus();
        closeExistingModals();
    }
}



function initShortcuts() {
    window.addEventListener("keydown", handleShortcut);
}


function closeExistingActionMenus() {
    var actionMenus = document.getElementsByClassName("action-menu");
    var x;

    var exists = false;
    for(x of actionMenus) {

        if(x.style.display ==  "block") {
            x.style.display = "none";
            exists = true;
        }
    }
    if(exists == true) {
        toggleBg();
        toggleHomeButtons(false);
    }
    
}



function closeExistingModals() {

    var closingState = {
        closedModal: false,
        closedSidebar: false
    }

    if(document.getElementById("fullpage-menu")) {
        var el = document.getElementById("fullpage-menu");
        el.parentNode.removeChild(el);
        closingState.closedModal = true;
    }


    var sideBar = document.getElementById("side-bar");
    if(sideBar.displaying && !closingState.closedModal) {
        toggleSidebar();
    }

}