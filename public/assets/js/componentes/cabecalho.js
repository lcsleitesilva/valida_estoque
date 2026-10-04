// Função que constrói e injeta o cabeçalho
function renderizarCabecalho() {
    const container = document.getElementById("cabecalho-container");
    
    // Se a página não tiver a div do cabeçalho, a função para por aqui
    if (!container) return; 

    // Lógica para descobrir a pasta raiz do projeto
    const path = window.location.pathname;
    const publicIndex = path.indexOf('/public');
    const basePath = publicIndex !== -1 ? path.substring(0, publicIndex + 7) : '';

    // Injeta o HTML no container
    container.innerHTML = `
        <header class="header-principal">
            <div class="container-fluid h-100 d-flex align-items-center px-4">
                <div class="logo-box" id="logo-cabecalho" style="cursor: pointer;">Logo</div>
                <h1 class="nome-sistema" id="titulo-cabecalho" style="cursor: pointer;">ValidaEstoque</h1>
            </div>
        </header>
    `;

    // Função de clique para ir para a Home
    function irParaHome() {
        window.location.href = basePath + '/index.html';
    }

    // Adiciona os eventos de clique
    document.getElementById("logo-cabecalho").addEventListener("click", irParaHome);
    document.getElementById("titulo-cabecalho").addEventListener("click", irParaHome);
}

// Executa a função assim que o script é carregado
renderizarCabecalho();