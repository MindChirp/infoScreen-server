var doneAdding = true;
async function addSlide(button) {
    if(!doneAdding) return;
    doneAdding = false;
    var slide = document.createElement("div");
    slide.className = "slide";
    var txt = document.createElement("p");
    txt.innerHTML = "Slide thing";
    slide.appendChild(txt);

    
    //Animate the button?
    button.style.animation = "none";
    await sleep(10)
    button.style.animation = "";
    button.style.animation = "slide-button 200ms ease-out";
    
    
    await sleep(200);
    //Get the parent
    var par = document.getElementById("bottom").querySelector(".slides");
    par.insertBefore(slide, button)
    doneAdding = true;
}


function sleep(interval) {
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        }, interval);
    })
}