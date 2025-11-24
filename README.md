# 🕹️ TicTacThree – Coleção de Jogos da Velha

Bem-vindo ao **TicTacThree**, uma coleção com três versões exclusivas e aprimoradas do clássico **Jogo da Velha (Tic-Tac-Toe)**.  
Este projeto foi desenvolvido com foco em **design moderno**, **animações**, **responsividade**, **modo escuro**, além de regras diferenciadas que tornam cada jogo único.

---

## 🚀 Demonstração

*Adicione aqui o link do GitHub Pages quando publicar o projeto.*

---

## 🎮 Modos de Jogo

### 🔹 Velha #1 – 3×3 Clássico
A versão tradicional do jogo da velha.

**Regras:**
- Jogadores: **X** e **O**.
- O jogador **X** começa.
- Jogadores alternam marcando uma das 9 células.
- Vence quem fizer 3 símbolos em linha (horizontal, vertical ou diagonal).
- Se todas as células forem usadas sem vencedor → **velha**.

Arquivo:  
`assets/html/velha1.html`

---

### 🔹 Velha #2 – Modo com Tempo e Limite de Peças
Uma versão mais estratégica com tempo por jogada e peças limitadas.

**Regras:**
- Cada jogador pode colocar **apenas 3 peças** no tabuleiro.
- A partir da **4ª rodada**, peças devem ser **movidas** para células vazias.
- Tempo configurável de **1 a 6 segundos** por jogada.
- O contador inicia somente após a primeira jogada.

Arquivo:  
`assets/html/velha2.html`

---

### 🔹 Velha #3 – Ultimate Tic Tac Toe (Modo Estratégico)
Um tabuleiro 3×3 composto por **9 tabuleiros menores**, cada um também 3×3.

**Regras:**
- Cada jogada em um tabuleiro menor determina onde o oponente deve jogar depois.
- Se o tabuleiro direcionado já estiver concluído, o jogador pode escolher qualquer tabuleiro.
- Ao vencer um tabuleiro menor, o jogador marca um **símbolo grande** no tabuleiro principal.
- Tabuleiro menor com velha: ponto para o **penúltimo jogador que jogou nele**.
- Vence quem formar 3 símbolos grandes em linha no tabuleiro principal.
- Velha no tabuleiro maior → vence quem tiver mais símbolos grandes.
- É possível **desfazer até 3 jogadas**.

Arquivo:  
`assets/html/velha3.html`

---

## 🧩 Funcionalidades Globais

- Tema claro/escuro com animações
- Efeito de partículas animadas em canvas
- Pop-ups explicativos em cada modo
- Loader animado ao abrir cada página
- Botões neon com efeitos
- Estrutura modular limpa e organizada
- Altamente responsivo
- Animações personalizadas em CSS

---

## 📁 Estrutura do Projeto

C:.
│ index.html
│ README.md
│
└───assets
├───css
│ animations.css
│ loader.css
│ style.css
│ variables.css
│ velha2.css
│ velha3.css
│
├───html
│ velha1.html
│ velha2.html
│ velha3.html
│
├───img
│ │ logo.gif
│ │
│ └───icon
│ android-chrome-192x192.png
│ android-chrome-512x512.png
│ apple-touch-icon.png
│ favicon-16x16.png
│ favicon-32x32.png
│ favicon.ico
│ site.webmanifest
│
└───js
global.js
home.js
particles.js
velha1.js
velha2.js
velha3.js


---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- HTML5  
- CSS3  
- JavaScript (Vanilla)

### **Ferramentas**
- VS Code – desenvolvimento  
- ChatGPT – apoio na lógica e melhorias  
- Canva – criação do logo e elementos visuais  