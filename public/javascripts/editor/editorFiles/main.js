var doneAdding = true;
async function addSlide(button) {
    if(!doneAdding) return;
    doneAdding = false;
    var slide = document.createElement("div");
    slide.className = "slide";
    var txt = document.createElement("p");
    txt.innerHTML = "Slide thing";
    slide.appendChild(txt);

    var close = document.createElement("button");
    var ico = document.createElement("i");
    ico.innerHTML = "close";
    ico.className = "material-icons";
    close.appendChild(ico);
    slide.appendChild(close);
    
    close.addEventListener("click", async (e)=>{
        var el = e.target.closest(".slide");
        el.style.opacity = "0";
        setTimeout(()=>{
            el.style.marginLeft = "calc(calc(-7rem * (16/9)) * 1.3)";
        }, 200);

        await sleep(400);
        el.parentNode.removeChild(el);

    })

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




    slide.addEventListener("click", (e)=>{
        selectSlide(e.target.closest(".slide"));
    })
}




function selectSlide(slide) {
    var selected = document.getElementById("bottom").querySelector(".slide.active");
    if(selected) {
        selected.classList.remove("active");   
        slide.classList.add("active");
    } else {
        slide.classList.add("active");
    }
}







function sleep(interval) {
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        }, interval);
    })
}



window.onload = function() {
    setInterval(()=>{

        var div = document.getElementById("bottom").querySelector(".slides");
        var hasHorizontalScrollbar = div.scrollWidth > div.clientWidth;
        
        if(hasHorizontalScrollbar) {
            div.style.marginTop = "8px";
        } else {
            div.style.marginTop = "0";
        }
    }, 100);
}