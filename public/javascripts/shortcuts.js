
function handleShortcut(e) {
    if(e.code == "Escape") {
        closeExistingModals()
        .then((result)=>{
            if(!result.modalsClosed) {
                console.log(result)
                closeExistingActionMenus();
            }
        })
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
    return new Promise((resolve)=>{

        
        var closingState = {
            closedModal: false,
            closedSidebar: false
        }
        
        if(document.getElementById("fullpage-menu")) {
            closeFullPage();
            closingState.closedModal = true;
        }
        
        
        var sideBar = document.getElementById("side-bar");
        if(sideBar.displaying && !closingState.closedModal) {
            closingState.closedSidebar = true;
            toggleSidebar();
        }
        
        //Close pfp selector
        if(document.getElementById("select-profile-picture")) {
            var el = document.getElementById("select-profile-picture");
            el.parentNode.removeChild(el);
        }
    
        if(closingState.closedModal || closingState.closedSidebar) {
            resolve({modalsClosed: true});
        } else {
            resolve({modalsClosed: false});
        }
    })
}