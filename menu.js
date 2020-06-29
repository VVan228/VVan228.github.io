window.onload = function (){
    $(".play").on("click",function(){
        sessionStorage.setItem("toStartFromSave","false")
        let n = $("#name")[0].value;
        if(n===""){
            alert("empty name!");
            return;
        }
        localStorage.setItem("name",n);
        window.location.replace("game.html");
    });
    $(".playSaved").on("click",function(){
        sessionStorage.setItem("toStartFromSave","true");
        if(sessionStorage.getItem("save")!=null){
            window.location.replace("game.html");
        }else{
            alert("there are no saves!");
        }
    });
    if(sessionStorage.getItem("record")!=null){
        let obj = JSON.parse(sessionStorage.getItem("record"));
        $("#recordText")[0].innerText = "last record "+obj.points+" by "+obj.name;
    }
};