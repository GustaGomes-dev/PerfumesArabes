let categoriaAtual = "todos";
const numeroWhatsapp = "5511942811605";

const campoBusca = document.getElementById("campoBusca");
const mensagemSemResultado = document.getElementById("mensagemSemResultado");
const carrosselProdutos = document.getElementById("carrosselProdutos");
let intervaloCarrossel = null;

function filtrarPerfumes(categoria, botaoClicado) {
    categoriaAtual = categoria;

    const botoes = document.querySelectorAll(".filtros button");
    botoes.forEach(function(botao) {
        botao.classList.remove("ativo");
    });

    if (botaoClicado) {
        botaoClicado.classList.add("ativo");
    }

    aplicarFiltros();
}

if (campoBusca) {
    campoBusca.addEventListener("input", aplicarFiltros);
}

function aplicarFiltros() {
    const busca = campoBusca ? campoBusca.value.trim().toLowerCase() : "";
    const perfumes = document.querySelectorAll(".card-perfume");
    const titulosCategoria = document.querySelectorAll(".titulo-categoria");
    let totalVisivel = 0;

    perfumes.forEach(function(perfume) {
        const textoDoPerfume = perfume.innerText.toLowerCase();
        const combinaCategoria = categoriaAtual === "todos" || perfume.classList.contains(categoriaAtual);
        const combinaBusca = busca === "" || textoDoPerfume.includes(busca);

        if (combinaCategoria && combinaBusca) {
            perfume.style.display = "flex";
            totalVisivel++;
        } else {
            perfume.style.display = "none";
        }
    });

    titulosCategoria.forEach(function(titulo) {
        const categoria = titulo.classList.contains("categoria-masculino") ? "masculino" :
                          titulo.classList.contains("categoria-feminino") ? "feminino" :
                          "unissex";

        const existeVisivelNaCategoria = Array.from(document.querySelectorAll(`.card-perfume.${categoria}`))
            .some(function(card) {
                return card.style.display !== "none";
            });

        titulo.style.display = existeVisivelNaCategoria ? "block" : "none";
    });

    if (mensagemSemResultado) {
        mensagemSemResultado.style.display = totalVisivel === 0 ? "block" : "none";
    }
}

function avancarCarrossel() {
    if (!carrosselProdutos) return;

    const chegouAoFim = carrosselProdutos.scrollLeft + carrosselProdutos.clientWidth >= carrosselProdutos.scrollWidth - 20;

    if (chegouAoFim) {
        carrosselProdutos.scrollLeft = 0;
    } else {
        carrosselProdutos.scrollLeft += 320;
    }
}

function voltarCarrossel() {
    if (!carrosselProdutos) return;

    if (carrosselProdutos.scrollLeft <= 0) {
        carrosselProdutos.scrollLeft = carrosselProdutos.scrollWidth;
    } else {
        carrosselProdutos.scrollLeft -= 320;
    }
}

function iniciarCarrosselAutomatico() {
    if (!carrosselProdutos) return;

    intervaloCarrossel = setInterval(avancarCarrossel, 3000);

    carrosselProdutos.addEventListener("mouseenter", function() {
        clearInterval(intervaloCarrossel);
    });

    carrosselProdutos.addEventListener("mouseleave", function() {
        intervaloCarrossel = setInterval(avancarCarrossel, 3000);
    });
}

function criarLinkAbsoluto(caminhoImagem) {
    try {
        return new URL(caminhoImagem, window.location.href).href;
    } catch (erro) {
        return caminhoImagem;
    }
}

function abrirWhatsappProduto(nomeProduto, marcaProduto, caminhoImagem) {
    const linkImagem = criarLinkAbsoluto(caminhoImagem);

    const mensagem =
`Olá, tenho interesse no produto: ${nomeProduto}${marcaProduto ? " - " + marcaProduto : ""}.

Imagem do produto: ${linkImagem}

Poderia me passar disponibilidade e valor?`;

    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

function abrirWhatsappGenerico() {
    const mensagem = "Olá, tenho interesse nos perfumes do catálogo Arabian Essence.";
    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

function adicionarBotoesWhatsappNosProdutos() {
    const cards = document.querySelectorAll(".card-perfume");

    cards.forEach(function(card) {
        const areaOriginal = card.querySelector(".original");
        const nome = areaOriginal?.querySelector("h3")?.innerText.trim() || "Perfume";
        const marca = areaOriginal?.querySelector("h4")?.innerText.trim() || "";
        const imagem = areaOriginal?.querySelector("img")?.getAttribute("src") || "";

        if (!areaOriginal || areaOriginal.querySelector(".botao-interesse")) return;

        const botao = document.createElement("button");
        botao.className = "botao-interesse";
        botao.type = "button";
        botao.innerText = "Tenho interesse";
        botao.onclick = function() {
            abrirWhatsappProduto(nome, marca, imagem);
        };

        areaOriginal.appendChild(botao);
    });
}

function adicionarBotoesWhatsappNoCarrossel() {
    const cardsMini = document.querySelectorAll(".card-mini");

    cardsMini.forEach(function(card) {
        const nome = card.querySelector("h3")?.innerText.trim() || "Perfume";
        const imagem = card.querySelector("img")?.getAttribute("src") || "";

        if (card.querySelector(".botao-mini-interesse")) return;

        const botao = document.createElement("button");
        botao.className = "botao-mini-interesse";
        botao.type = "button";
        botao.innerText = "Tenho interesse";
        botao.onclick = function() {
            abrirWhatsappProduto(nome, "", imagem);
        };

        card.appendChild(botao);
    });
}

function configurarWhatsappGeral() {
    const links = document.querySelectorAll('a[href*="wa.me"]');

    links.forEach(function(link) {
        link.addEventListener("click", function(evento) {
            evento.preventDefault();
            abrirWhatsappGenerico();
        });
    });
}

adicionarBotoesWhatsappNosProdutos();
adicionarBotoesWhatsappNoCarrossel();
configurarWhatsappGeral();
iniciarCarrosselAutomatico();
aplicarFiltros();
