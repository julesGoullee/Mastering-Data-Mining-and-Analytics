document.addEventListener("DOMContentLoaded", function(event) {
    var _socket = io();
    var tabHtml = document.getElementById("tab");
    _socket.on('newRepresentation', function( tweets ){
        var data = "";
        for (var i = 0; i < tweets.length; i++){
            data += "<tr>" + tweets[i] + "</tr>";
        }
        tabHtml.innerHTML = data;
    });
});