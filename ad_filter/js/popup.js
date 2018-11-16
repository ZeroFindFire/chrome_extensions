var background = chrome.extension.getBackgroundPage();
var message = document.getElementById("message");
function add_forbid(){
    var url_tab = document.getElementById("input");
    var urls = url_tab.value.split(" ");
    //alert("urls:"+url_tab.innerText);
    urls.forEach(function(url,index){
        background.add(url);
    });
    url_tab.innerHTML = '';
    message.innerHTML = background.language_env.done_add_forbid;
    message.style.display="inline";
    setTimeout(function(){
        message.style.display="none";
    }, 1300);
}
var button = document.getElementById("add");
button.innerHTML = background.language_env.add_forbid
console.log("button:",button);
button.onclick = add_forbid;
var title = document.getElementById('title');
title.innerHTML = background.language_env.popup_title
message.onclick=function(){
    message.style.display="none";
}