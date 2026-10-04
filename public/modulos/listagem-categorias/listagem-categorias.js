const listaCategorias = document.getElementById("lista-categorias");
const campoPesquisa = document.getElementById("campo-pesquisa");
const botaoAtualizar = document.getElementById("btn-atualizar");
campoPesquisa.addEventListener("input", function() {
 const textoPesquisa = campoPesquisa.value.toLowerCase();
const linhas = listaCategorias.querySelectorAll("tr");
linhas.forEach(function(linha) {
const textoLinha = linha.cells[0].textContent.toLowerCase() + " " + linha.cells[1].textContent.toLowerCase();
const encontrou = textoLinha.includes(textoPesquisa);
linha.style.display = encontrou ? "" : "none";
});
});    
botaoAtualizar.addEventListener("click", function() {
    carregarCategorias();
  campoPesquisa.value = "";  
});

async function carregarCategorias() {
    const resposta = await fetch("http://localhost:3000/categorias");

    const categorias = await resposta.json();
listaCategorias.innerHTML = "";
    
    categorias.forEach(function(categoria) {
    listaCategorias.innerHTML += `
        <tr>
            <td>${categoria.nome}</td>
            <td>${categoria.descricao}</td>
            <td>
    <span style="background-color: ${categoria.cor}; padding: 2px 10px; margin-right: 5px;"></span>
    ${categoria.cor}
</td>
        </tr>
    `;
});
}
carregarCategorias();