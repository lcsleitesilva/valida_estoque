const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");
const btnAtualizar = document.getElementById("btnAtualizar");
const campoPesquisa = document.getElementById("campoPesquisa");

let produtosCarregados = [];
let categoriasCarregadas = [];
let fornecedoresCarregados = [];
let lotesCarregados = [];
let movimentacoesCarregadas = [];

function carregarProdutos() {

    Promise.all([
        fetch("/produtos").then(resposta => resposta.json()),
        fetch("/categorias").then(resposta => resposta.json()),
        fetch("/fornecedores").then(resposta => resposta.json()),
        fetch("/lotes").then(resposta => resposta.json()),
        fetch("/movimentacoes").then(resposta => resposta.json())
    ])
    .then(dados => {

        produtosCarregados = dados[0];
        categoriasCarregadas = dados[1];
        fornecedoresCarregados = dados[2];
        lotesCarregados = dados[3];
        movimentacoesCarregadas = dados[4];

        mostrarProdutos(produtosCarregados);
    })
    .catch(erro => {

        console.log("Erro ao carregar produtos:", erro);

        mensagem.innerHTML = "Erro ao carregar os produtos.";
        mensagem.style.display = "block";
    });
}

function mostrarProdutos(produtos) {

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {
        mensagem.innerHTML = "Nenhum produto encontrado";
        mensagem.style.display = "block";
        return;
    }

    mensagem.style.display = "none";

    produtos.forEach(produto => {

        const categoria = categoriasCarregadas.find(
            item => item.id == produto.categoriaId
        );

        const fornecedor = fornecedoresCarregados.find(
            item => item.id == produto.fornecedorId
        );

        const lotesProduto = lotesCarregados.filter(
            lote => lote.produtoId == produto.id
        );

        let estoqueAtual = 0;

        lotesProduto.forEach(lote => {
            estoqueAtual = estoqueAtual + lote.quantidade;
        });

        const saidasProduto = movimentacoesCarregadas.filter(
            movimentacao =>
                movimentacao.produtoId == produto.id &&
                movimentacao.tipo == "saida"
        );

        saidasProduto.forEach(movimentacao => {
            estoqueAtual = estoqueAtual - movimentacao.quantidade;
        });

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.codigoBarras}</td>
            <td>${categoria ? categoria.nome : "-"}</td>
            <td>${estoqueAtual}</td>
            <td>R$ ${produto.precoVenda.toFixed(2)}</td>
            <td>${fornecedor ? fornecedor.razaoSocial : "-"}</td>
        `;

        listaProdutos.appendChild(linha);
    });
}

campoPesquisa.addEventListener("input", function () {

    const textoPesquisa = campoPesquisa.value.toLowerCase();

    const produtosFiltrados = produtosCarregados.filter(produto => {

        return produto.nome.toLowerCase().includes(textoPesquisa) ||
               produto.codigoBarras.includes(textoPesquisa);
    });

    mostrarProdutos(produtosFiltrados);
});

btnAtualizar.addEventListener("click", carregarProdutos);

carregarProdutos();