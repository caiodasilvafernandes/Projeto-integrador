const xhttp = new XMLHttpRequest();

function controleFav(url, method) {
    var fav = document.getElementById("fav").valor;
    xhttp.open(method, `${url}/${fav}`);
    xhttp.send();
}