const valor = document.getElementById("search").value;

function autoComplete(pacote) {
  const destino = ["caio", "enzo", "pacote"];
  return destino.filter((valor) => {
    const valorMinusculo = valor.toLowerCase();
    const pacoteMinusculo = pacote.toLowerCase();

    return valorMinusculo.includes(pacoteMinusculo);
  });
}
const sug = document.querySelector(".sug");
const kit = document.querySelector(".kit");

sug.addEventListener("input", ({ target }) => {
  const dadosDosug = target.value;
  if (dadosDosug.length) {
    const autoCompleteValores = autoComplete(dadosDosug);
    kit.innerHTML = `
          ${autoCompleteValores
            .map((value) => {
              return `<li><div class="searchResult row searchResultEnd">

  <div class="col-1">
  <img src="/uploads/img/pfp/travisScott.jpg" class="imgSearchInput">
  </div>
  
  <div class="col">
  <h1 class="subTitle titleSearchInput">${value}</h1>
  </div>

  <div class="col">
  <img src="/img/icons/star.png" class="searchInputIcons float-start">
      <p class="cardTxt">
          00
      </p>
  </div>

  <div class="col-4">
 <img src="/img/icons/buyers.png" class="searchInputIcons float-start">
      <p class="cardTxt">
          00
      </p>
  </div>

</div></li>`;
            })
            .join("")}
         `;
    // listener para remover as sugestao ao clicar
  } else {
    kit.innerHTML = ""; // limpa as sugestao se o input tiver vazio
  }
});
