const xhttp = new XMLHttpRequest();

function controleFav(method, id) {
    var fav = document.getElementById("fav").valor;
    id = parseInt(id);
    xhttp.open(method, `/ControleFavorita/${id}/${fav}`);
    xhttp.send();
}