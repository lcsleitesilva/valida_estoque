// Função que constrói e injeta o menu lateral
function renderizarMenuLateral() {
    const container = document.getElementById("menu-lateral-container");
    
    if (!container) return;

    const path = window.location.pathname;
    const publicIndex = path.indexOf('/public');
    const basePath = publicIndex !== -1 ? path.substring(0, publicIndex + 7) : '';

    function verificaAtivo(rotaBase) {
        if (path.indexOf(rotaBase) !== -1) {
            return "text-danger fw-bold";
        }
        return "";
    }

    container.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2 class="sidebar-title">Menu</h2>
            </div>
            
            <nav class="sidebar-nav flex-column">
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/produtos')}" 
                   href="${basePath}/modulos/produtos/index.html">
                    Produtos <i class="fa-solid fa-chevron-right"></i>
                </a>
                
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/lotes')}" 
                   href="#">
                    Lotes <i class="fa-solid fa-chevron-right"></i>
                </a>
                
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/categorias')}" 
                   href="${basePath}/modulos/categorias/index.html">
                    Categorias <i class="fa-solid fa-chevron-right"></i>
                </a>
                
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/fornecedores')}" 
                   href="#">
                    Fornecedores <i class="fa-solid fa-chevron-right"></i>
                </a>
                
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/promocoes')}" 
                   href="#">
                    Promoções <i class="fa-solid fa-chevron-right"></i>
                </a>
                
                <a class="nav-link d-flex justify-content-between align-items-center ${verificaAtivo('/modulos/relatorios')}" 
                   href="#">
                    Relatórios <i class="fa-solid fa-chevron-right"></i>
                </a>

                <!-- Botão de Sair -->
                <a class="nav-link d-flex justify-content-between align-items-center mt-5 text-secondary" 
                   href="#" id="btn-logout-menu">
                    Sair <i class="fa-solid fa-right-from-bracket"></i>
                </a>
            </nav>

            <div class="sidebar-footer-box"></div>
        </aside>
    `;

    document.getElementById("btn-logout-menu").addEventListener("click", function (event) {
        event.preventDefault();
        
        if (typeof logoutUser === 'function') {
            logoutUser();
        } else {
            sessionStorage.removeItem('usuarioCorrente');
            window.location.href = basePath + '/modulos/login/login.html';
        }
    });
}

renderizarMenuLateral();