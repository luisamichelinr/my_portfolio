const elHello = document.getElementById("hello-world");
const cursorHello = document.getElementById("cursor-hello");
const txtHello = "Hello world!";
let iHello = 0;

// Elementos do segundo texto
const elTexto = document.getElementById("texto");
const cursorTexto = document.getElementById("cursor-texto");
const name = document.getElementById("name");
const buttonPurple = document.getElementById("buttonPurple");
const frases = [
  "Desenvolvedora, pesquisadora e apaixonada por educação.",
  "Criando soluções com tecnologia.",
  "Bem-vindo ao meu portfólio!"
];
let indiceFrase = 0;
let indiceLetra = 0;
let apagando = false;

// 1. Primeira etapa: Digita apenas o Hello World
function digitarHello() {
  if (iHello < txtHello.length) {
    elHello.textContent += txtHello.charAt(iHello);
    iHello++;
    setTimeout(digitarHello, 100); // Velocidade do Hello World
  } else {
    setTimeout(() => {
      cursorHello.classList.add("d-none");    // Esconde o primeiro cursor
      elHello.style.fontSize = "1.5rem"; // Aumenta o tamanho do Hello World
      name.classList.remove("d-none");          // Mostra o nome
    }, 1000); // Aguarda 1 segundo antes de começar o próximo
    setTimeout(() => {
        buttonPurple.classList.remove("d-none");    // Mostra o botão
        cursorTexto.classList.remove("d-none"); // Mostra o segundo cursor
        efeitoDigitarFrases();                  // Inicia o próximo texto
    }, 2500);
  }
}

// 2. Segunda etapa: Loop infinito das outras frases
function efeitoDigitarFrases() {
  const fraseAtual = frases[indiceFrase];
  
  if (!apagando) {
    elTexto.textContent = fraseAtual.substring(0, indiceLetra + 1);
    indiceLetra++;
    
    if (indiceLetra === fraseAtual.length) {
      apagando = true;
      setTimeout(efeitoDigitarFrases, 2500); // Pausa de 2.5s na frase cheia
      return;
    }
  } else {
    elTexto.textContent = fraseAtual.substring(0, indiceLetra - 1);
    indiceLetra--;
    
    if (indiceLetra === 0) {
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
    }
  }
  
  const velocidade = apagando ? 30 : 60; // Mais rápido ao apagar
  setTimeout(efeitoDigitarFrases, velocidade);
}

// Inicializa o processo ao carregar a página
document.addEventListener("DOMContentLoaded", digitarHello);

// =========================
// Funções utilitárias
// =========================

function mostrar(id) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.style.display = "flex";
    }
}

function esconder(id) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.style.display = "none";
    }
}

function alternar(id) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    if (elemento.style.display === "none") {
        mostrar(id);
    } else {
        esconder(id);
    }
}

const avatar = document.getElementById("avatar");

let olhandoDireita = false;
let olhandoEsquerda = false;

const limite = 300;

function centroAvatar(){

    const rect = avatar.getBoundingClientRect();

    return rect.left + rect.width/2;

}

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const centro = centroAvatar();

    // 1. CÁLCULO DO MOVIMENTO DOS OLHOS (Calibrado e Amortecido)
    const deltaX = mouseX - centro;
    const deltaY = mouseY - (window.innerHeight / 2);

    // Reduzimos o limite máximo para 8px para a pupila não "vazar" da órbita
    const limiteOlho = 8; 
    const limiteSobrancelha = 20; 

    // Multiplicar por 0.03 deixa o rastreio milimétrico e muito mais suave
    const moveX = Math.max(-limiteOlho, Math.min(limiteOlho, deltaX * 0.03));
    const moveY = Math.max(-limiteOlho, Math.min(limiteOlho, deltaY * 0.03));

    const browX = Math.max(-limiteSobrancelha, Math.min(limiteSobrancelha, deltaX * 0.07));
    const browY = Math.max(-limiteSobrancelha, Math.min(limiteSobrancelha, deltaY * 0.07));


    const pLeftNormal = document.getElementById("left-eye-normal");
    const pRightNormal = document.getElementById("right-eye-normal");
    const bLeftNormal = document.getElementById("left-eyebrow-normal");
    const bRightNormal = document.getElementById("right-eyebrow-normal");

    // 2. O SEU LIMITE DE PROXIMIDADE (Calibre os pixels se quiser a área do meio maior ou menor)
    // Exemplo: se o mouse estiver a mais de 300px do centro do boneco, ele entra nos extremos.
    const limiteDistancia = 300; 

    // =========================================================================
    // LADO DIREITO DA TELA (mouse maior que o centro)
    // =========================================================================
    if (mouseX >= centro) {
        avatar.style.transform = "rotateY(0deg)"; // Fica de frente para a direita

        // ESTADO 1: EXTREMO-DIREITA (Cara diferente / Olhos FIXOS)
        if (mouseX > centro + limiteDistancia) {
            mostrar("left-eye-curious");
            mostrar("right-eye-curious");
            mostrar("left-eyebrow-curious");
            mostrar("right-eyebrow-curious");
            esconder("left-eye-normal");
            esconder("right-eye-normal");
            esconder("left-eyebrow-normal");
            esconder("right-eyebrow-normal");

            // Trava as pupilas normais no centro fixo
            if (pLeftNormal) pLeftNormal.style.transform = "translate(0px, 0px)";
            if (pRightNormal) pRightNormal.style.transform = "translate(0px, 0px)";
            if (bLeftNormal) bLeftNormal.style.transform = "translate(0px, 0px)";
            if (bRightNormal) bRightNormal.style.transform = "translate(0px, 0px)";
        } 
        // ESTADO 2: CENTRO-DIREITA (Cara normal / Olhos MEXENDO)
        else {
            esconder("left-eye-curious");
            esconder("right-eye-curious");
            esconder("left-eyebrow-curious");
            esconder("right-eyebrow-curious");
            mostrar("left-eye-normal");
            mostrar("right-eye-normal");
            mostrar("left-eyebrow-normal");
            mostrar("right-eyebrow-normal");

            // Olhos seguem o mouse livremente
            if (pLeftNormal) pLeftNormal.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (pRightNormal) pRightNormal.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (bLeftNormal) bLeftNormal.style.transform = `translate(${browX}px, ${browY}px)`;
            if (bRightNormal) bRightNormal.style.transform = `translate(${browX}px, ${browY}px)`;
        }
    } 
    
    // =========================================================================
    // LADO ESQUERDO DA TELA (mouse menor que o centro)
    // =========================================================================
    else {
        avatar.style.transform = "rotateY(180deg)"; // Vira espelhado para a esquerda

        // ESTADO 3: EXTREMO-ESQUERDA (Cara diferente / Olhos FIXOS)
        if (mouseX < centro - limiteDistancia) {
            mostrar("left-eye-curious");
            mostrar("right-eye-curious");
            mostrar("left-eyebrow-curious");
            mostrar("right-eyebrow-curious");
            esconder("left-eye-normal");
            esconder("right-eye-normal");
            esconder("left-eyebrow-normal");
            esconder("right-eyebrow-normal");

            // Trava as pupilas normais no centro fixo
            if (pLeftNormal) pLeftNormal.style.transform = "translate(0px, 0px)";
            if (pRightNormal) pRightNormal.style.transform = "translate(0px, 0px)";
            if (bLeftNormal) bLeftNormal.style.transform = "translate(0px, 0px)";
            if (bRightNormal) bRightNormal.style.transform = "translate(0px, 0px)";
        } 
        // ESTADO 4: CENTRO-ESQUERDA (Cara normal / Olhos MEXENDO)
        else {
            esconder("left-eye-curious");
            esconder("right-eye-curious");
            esconder("left-eyebrow-curious");
            esconder("right-eyebrow-curious");
            mostrar("left-eye-normal");
            mostrar("right-eye-normal");
            mostrar("left-eyebrow-normal");
            mostrar("right-eyebrow-normal");

            // Como o boneco está em rotateY(180deg), multiplicamos o X por -1 para corrigir o espelhamento
            if (pLeftNormal) pLeftNormal.style.transform = `translate(${moveX * -1}px, ${moveY}px)`;
            if (pRightNormal) pRightNormal.style.transform = `translate(${moveX * -1}px, ${moveY}px)`;
            if (bLeftNormal) bLeftNormal.style.transform = `translate(${browX * -1}px, ${browY}px)`;
            if (bRightNormal) bRightNormal.style.transform = `translate(${browX * -1}px, ${browY}px)`;
        }
    }
});

// EXECUTA O PISCAR AUTOMÁTICO A CADA 30 SEGUNDOS (30000 milissegundos)
setInterval(() => {
    // 1. Verifica quais olhos normais ou curiosos estavam visíveis no momento
    const olhoNormalEsquerdo = document.getElementById("left-eye-normal");
    const oEsquerdoEstavaVisivel = olhoNormalEsquerdo && olhoNormalEsquerdo.style.display !== "none";

    const olhoCuriosoEsquerdo = document.getElementById("left-eye-curious");
    const oCuriosoEstavaVisivel = olhoCuriosoEsquerdo && olhoCuriosoEsquerdo.style.display !== "none";

    // 2. FECHA OS OLHOS: Mostra os IDs de piscada e esconde temporariamente os outros
    mostrar("left-eye-winking");
    mostrar("right-eye-winking");
    
    esconder("left-eye-normal");
    esconder("right-eye-normal");
    esconder("left-eye-curious");
    esconder("right-eye-curious");

    // 3. ABRE OS OLHOS: Após 150 milissegundos (tempo de uma piscada natural), restaura o estado anterior
    setTimeout(() => {
        esconder("left-eye-winking");
        esconder("right-eye-winking");

        // Se o personagem estava no centro (olho normal), devolve o olho normal
        if (oEsquerdoEstavaVisivel) {
            mostrar("left-eye-normal");
            mostrar("right-eye-normal");
        } 
        // Se estava nos extremos (olho curioso), devolve o olho curioso
        else if (oCuriosoEstavaVisivel) {
            mostrar("left-eye-curious");
            mostrar("right-eye-curious");
        }
    }, 150); // Duração do olho fechado em milissegundos

}, 30000); // 30 segundos de intervalo

const wrapperLanternas = document.querySelector(".secao-scroll-wrapper");
const secaoLanternas = document.getElementById("secao-lanternas");
const lanternaMágica = document.getElementById("lanterna-rapunzel");
const nav = document.querySelector("nav");

const observadorTema = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Agora o navegador mede o wrapper comum se movendo na tela!
        if (entry.isIntersecting) {
            
            document.body.style.setProperty("background-color", "#2e1149", "important");
            nav.style.setProperty("background-color", "#d4a2fd", "important");

            document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(titulo => {
                titulo.style.setProperty("color", "#ffffff", "important");
            });

        } else {
            // Se o wrapper saiu totalmente da tela por cima ou por baixo, limpa tudo de forma direta e sem condições complexas!
            
            document.body.style.removeProperty("background-color");
            secaoLanternas.style.removeProperty("background-color");
            nav.style.removeProperty("background-color");
            
            document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span").forEach(elemento => {
                elemento.style.removeProperty("color");
            });
        }
    });
}, {
    // Mantemos o mesmo ponto de ativação perfeito que você escolheu na imagem
    threshold: 0.1
});

// A mágica está aqui: mandamos o observador olhar para o Wrapper em vez da seção
if (wrapperLanternas) {
    observadorTema.observe(wrapperLanternas);
}

window.addEventListener('scroll', () => {
  const wrapper = document.querySelector('.secao-scroll-wrapper');
  const lanternas = document.querySelectorAll('#secao-lanternas .lantern-item');
  if (!wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 1. Corrige o cálculo do progresso global baseado na rolagem real do bloco sticky
  const totalScrollable = rect.height - windowHeight;
  let progress = -rect.top / totalScrollable;
  progress = Math.max(0, Math.min(1, progress));

  const totalItens = lanternas.length;

  lanternas.forEach((lanterna, index) => {
    // 2. Cria um delay linear que garante que cada lanterna suba em um tempo único
    if (index === 0) { 
        var delay = 0; // Coluna da esquerda 
    } else if (index%2 === 0) {
        var delay = (index / 2) * 0.1; 
    } else { var delay = (Math.trunc(index / 2) + 1) * 0.12 // Colunas da direita 
    }
    const duration = 0.7; // Tempo que cada lanterna leva para fazer o percurso

    // 3. Normaliza o progresso individual para não estourar antes do fim da página
    let lanternProgress = (progress - delay) / duration;
    lanternProgress = Math.max(0, Math.min(1, lanternProgress));

    if (lanternProgress > 0) {
      // 4. Efeito de subida (ajuste o 800 e 2200 se precisar de mais ou menos movimento)
      const translateY = 800 - (lanternProgress * 2200);
      
      // 5. Fade-in suave no início e Fade-out no final do percurso
      let opacity = 0;
      if (lanternProgress < 0.15) {
        opacity = lanternProgress / 0.15;
      } else if (lanternProgress > 0.85) {
        opacity = (1 - lanternProgress) / 0.15;
      } else {
        opacity = 1;
      }

      lanterna.style.transform = `translateY(${translateY}px)`;
      lanterna.style.opacity = opacity;
    } else {
      lanterna.style.transform = 'translateY(800px)';
      lanterna.style.opacity = 0;
    }
  });
});



