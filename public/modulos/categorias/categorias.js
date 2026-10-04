// Listagem de categorias - ValidaEstoque
// Consome a API REST simulada pelo JSON-Server (rota /categorias)

const listaCategorias = document.getElementById("lista-categorias");
const tabelaCategorias = document.getElementById("tabela-categorias");
const mensagem = document.getElementById("mensagem");
const campoPesquisa = document.getElementById("campo-pesquisa");
const btnAtualizar = document.getElementById("btn-atualizar");
const btnCadastrar = document.getElementById("btn-cadastrar");

// Guarda as categorias carregadas da API para a pesquisa não precisar de novas requisições
let categoriasCarregadas = [];

// Exibe uma mensagem acima da tabela (erro = true deixa a mensagem em vermelho)
function mostrarMensagem(texto, erro) {
    mensagem.textContent = texto;
    mensagem.classList.toggle("erro", Boolean(erro));
    mensagem.style.display = "block";
}

function esconderMensagem() {
    mensagem.style.display = "none";
}

// Busca as categorias no JSON-Server
function carregarCategorias() {
    fetch("/categorias")
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then(categorias => {
            categoriasCarregadas = categorias;
            aplicarPesquisa();
        })
        .catch(erro => {
            console.error("Erro ao carregar categorias:", erro);
            listaCategorias.innerHTML = "";
            tabelaCategorias.style.display = "none";
            mostrarMensagem("Erro ao carregar as categorias. Verifique se o json-server está rodando.", true);
        });
}

// Aceita apenas cores no formato #RGB / #RRGGBB (evita injetar CSS inválido)
function corValida(cor) {
    return typeof cor === "string" && /^#[0-9a-fA-F]{3,8}$/.test(cor);
}

// Monta a tabela com a lista de categorias recebida
function mostrarCategorias(categorias) {
    listaCategorias.innerHTML = "";

    if (categorias.length === 0) {
        tabelaCategorias.style.display = "none";
        mostrarMensagem("Nenhuma categoria encontrada", false);
        return;
    }

    esconderMensagem();
    tabelaCategorias.style.display = "table";

    categorias.forEach(categoria => {
        const linha = document.createElement("tr");

        // Coluna Categoria (textContent evita problemas se o nome tiver caracteres HTML)
        const tdNome = document.createElement("td");
        tdNome.textContent = categoria.nome;

        // Coluna Descrição
        const tdDescricao = document.createElement("td");
        tdDescricao.textContent = categoria.descricao || "-";

        // Coluna Cor: bolinha colorida + código hexadecimal
        const tdCor = document.createElement("td");
        const divCor = document.createElement("div");
        divCor.className = "cor-celula";

        const bolinha = document.createElement("span");
        bolinha.className = "cor-bolinha";
        if (corValida(categoria.cor)) {
            bolinha.style.backgroundColor = categoria.cor;
        }

        const codigo = document.createElement("span");
        codigo.className = "cor-codigo";
        codigo.textContent = categoria.cor || "-";

        divCor.appendChild(bolinha);
        divCor.appendChild(codigo);
        tdCor.appendChild(divCor);

        // Coluna Ações: Editar e Excluir
        const tdAcoes = document.createElement("td");
        const divAcoes = document.createElement("div");
        divAcoes.className = "acoes-celula";

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn-acao btn-editar";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => editarCategoria(categoria.id));

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn-acao btn-excluir";
        btnExcluir.textContent = "X";
        btnExcluir.title = "Excluir categoria";
        btnExcluir.addEventListener("click", () => excluirCategoria(categoria));

        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnExcluir);
        tdAcoes.appendChild(divAcoes);

        linha.appendChild(tdNome);
        linha.appendChild(tdDescricao);
        linha.appendChild(tdCor);
        linha.appendChild(tdAcoes);

        listaCategorias.appendChild(linha);
    });
}

// Filtra as categorias já carregadas pelo texto digitado (nome ou descrição)
function aplicarPesquisa() {
    const texto = campoPesquisa.value.trim().toLowerCase();

    const filtradas = categoriasCarregadas.filter(categoria => {
        return categoria.nome.toLowerCase().includes(texto) ||
               (categoria.descricao || "").toLowerCase().includes(texto);
    });

    mostrarCategorias(filtradas);
}

// Abre o formulário em modo edição (form.html?id=N)
function editarCategoria(id) {
    window.location.href = "form.html?id=" + id;
}

// Exclui uma categoria, mas só se nenhum produto estiver usando ela
function excluirCategoria(categoria) {
    // Consulta os produtos vinculados a essa categoria
    fetch("/produtos?categoriaId=" + categoria.id)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro ao consultar produtos");
            }
            return resposta.json();
        })
        .then(produtos => {
            if (produtos.length > 0) {
                alert("Não é possível excluir a categoria \"" + categoria.nome + "\": existem " +
                      produtos.length + " produto(s) vinculado(s) a ela.");
                return;
            }

            if (!confirm("Deseja realmente excluir a categoria \"" + categoria.nome + "\"?")) {
                return;
            }

            return fetch("/categorias/" + categoria.id, { method: "DELETE" })
                .then(resposta => {
                    if (!resposta.ok) {
                        throw new Error("Erro ao excluir");
                    }
                    alert("Categoria excluída com sucesso!");
                    carregarCategorias();
                });
        })
        .catch(erro => {
            console.error("Erro ao excluir categoria:", erro);
            alert("Erro ao excluir! Verifique se o json-server está rodando.");
        });
}

// Eventos da tela
campoPesquisa.addEventListener("input", aplicarPesquisa);
btnAtualizar.addEventListener("click", carregarCategorias);
btnCadastrar.addEventListener("click", () => {
    window.location.href = "form.html";
});

// Carrega a lista ao abrir a tela
carregarCategorias();
