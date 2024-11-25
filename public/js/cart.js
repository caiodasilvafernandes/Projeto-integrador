const xhttp = new XMLHttpRequest();
var btnDelete = document.getElementById("btnDelete");
var btnContinuar = document.getElementById("btnContinuar");
const checkboxes = document.querySelectorAll('input[name="prod"]');
const precoTotal = document.getElementById("precoTotal");
var comprarPack = [];

function deleteCar(idCliente, idPack) {
    idCliente = parseInt(idCliente);
    idPack = parseInt(idPack);

    xhttp.open("DELETE", `/deleteCar/${idCliente}/${idPack}`);
    xhttp.send();
}

btnDelete.addEventListener("click", (event) => {
    let nome = btnDelete.name.split(",");
    let idCliente = nome[0];
    let idPack = nome[1];
    deleteCar(idCliente, idPack);

    let div = document.getElementById(idPack);
    closest(".row productRow").remove();
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        let split = precoTotal.textContent.split("$");
        let valor = parseInt(split[1]);

        if (this.checked) {
            valor += parseInt(this.value);

            precoTotal.textContent ="R$" + valor;
        } else {
            valor -= parseInt(this.value);

            precoTotal.textContent ="R$" + valor;
        }
    });
});

btnContinuar.addEventListener("click", () => {
    let checkbox = document.querySelectorAll("input[type='checkbox']:checked");
    let comprarPack = [];
    let quantComp = checkbox.length;
    let precoTotal = precoTotal.textContent;
    
    for (check of checkbox) {
        comprarPack.push(check.id);
    }

});