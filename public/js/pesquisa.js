const valor = document.getElementById("pesquisa").value;

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

sug.addEventListener("input", async ({ target }) => {
  const pesq = target.value;

  if (pesq.length > 0) {
    try {
      const resposta = await fetch(`/autocomplete?pesq=${encodeURIComponent(pesq)}`);

      const resultados = await resposta.json();

      if (resultados.length > 0) {
        kit.innerHTML = resultados
          .map(
            (pack) => `
              <li>
              <a href="/kitPage/${pack.idPacote}/${pack.slug}">
                <div class="searchResult row">
                  <div class="col-1">
                    <img src="/uploads/img/kitCover/${pack.dirImg}" class="imgSearchInput" alt="${pack.nome}">
                  </div>
                  <div class="col-6">
                    <h1 class="subTitle titleSearchInput">${pack.nome}</h1>
                  </div>
                  <div class="col">
                    <img src="/img/icons/star.png" class="searchInputIcons float-start">
                    <p class="cardTxt">${pack.media}</p>
                  </div>
                  <div class="col">
                    <img src="/img/icons/buyers.png" class="searchInputIcons float-start">
                    <p class="cardTxt">${pack.totalCompras}</p>
                  </div>
                </div>
                </a>
              </li>
            `
          )
          .join("");
      } else {
        kit.innerHTML = `<p>Nenhum resultado encontrado</p>`;
      }
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
      kit.innerHTML = `<p>Erro ao buscar resultados.</p>`;
    }
  } else {
    kit.innerHTML = "";
  }
});
