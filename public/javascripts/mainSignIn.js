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
    xhr.open("POST", "https://shrouded-wave-54128.herokuapp.com/auth");
    xhr.send(formData);
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            window.location.href = "/main";
        } else if(this.readyState == 4 && this.status != 200) {
            console.log(this.responseText);
            window.location.href = "/main";

        }
    }
}