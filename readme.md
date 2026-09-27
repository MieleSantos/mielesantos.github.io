# 🦖 Portfólio - Miele Silva

Portfólio pessoal publicado no GitHub Pages, alinhado ao perfil [@MieleSantos](https://github.com/MieleSantos), com foco em Backend Engineer Python, IA aplicada e projetos recentes do GitHub.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna e responsiva
- **JavaScript** - Interatividade e animações
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Poppins)

## 📋 Funcionalidades

- ✅ Design moderno e responsivo
- ✅ Navegação suave entre seções
- ✅ Menu mobile hambúrguer acessível por teclado (Esc fecha)
- ✅ Animações ao scroll
- ✅ Cards de projetos interativos com filtro por categoria (`IA`, `API`, `Dados`, `Nuvem`, `Estudos`)
- ✅ Card de **Projetos Recentes** carregado automaticamente da GitHub API
- ✅ Seção de artigos/tutoriais baseada no repositório `pattern_chain`
- ✅ Card de perfil e estatísticas do GitHub carregados da API (com cache de 1h no `localStorage`)
- ✅ Botão scroll to top
- ✅ Tema dark moderno

## 🎨 Seções

1. **Hero** - Apresentação principal
2. **Sobre** - Informações pessoais e estatísticas
3. **Tecnologias** - Stack tecnológico organizado por categoria
4. **Projetos** - Projetos em destaque + filtros + card dinâmico de projetos recentes
5. **Artigos** - Conteúdo prático sobre Prompt Template e Sequential Chain
6. **Contato** - LinkedIn, e-mail, WhatsApp e card de perfil do GitHub

## 📦 Como Usar

### Para GitHub Pages:

1. Faça o push deste repositório para o GitHub
2. Vá em Settings > Pages
3. Em *Source*, selecione *Deploy from a branch*, a branch `main` e a pasta `/ (root)`
4. Salve e aguarde alguns minutos
5. O portfólio fica disponível em: `https://mielesantos.github.io/`

### Para desenvolvimento local:

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador
3. Ou use um servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (com http-server)
   npx http-server
   ```

## 🎯 Personalização

### Cores
Edite as variáveis CSS em `css/styles.css`:
```css
:root {
    --primary-color: #6366F1; /* Indigo */
    --accent-color: #06B6D4; /* Cyan */
    --bg-dark: #060814; /* Obsidian Deep */
    /* ... */
}
```

### Conteúdo
- Edite `index.html` para alterar textos e links
- Adicione ou remova projetos na seção de projetos
- Atualize as tecnologias na seção de skills

### Dados do GitHub
- Os **Projetos Recentes** são carregados via endpoint público:
  - `https://api.github.com/users/MieleSantos/repos?sort=updated&direction=desc&per_page=100`
- O **card de perfil** e os contadores da seção *Sobre* usam `https://api.github.com/users/MieleSantos`.
- As respostas ficam em cache por 1h no `localStorage` para respeitar o limite de 60 requisições/hora da API sem autenticação. Se a API falhar, os valores estáticos do HTML são mantidos.
- Ao alterar `css/styles.css` ou `js/script.js`, incremente o parâmetro `?v=` em `index.html` para invalidar o cache do navegador.

## 📱 Responsividade

O portfólio é totalmente responsivo e funciona bem em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1200px+)

## 🔗 Links

- **Perfil GitHub**: [MieleSantos](https://github.com/MieleSantos)
- **GitHub**: [@MieleSantos](https://github.com/MieleSantos)
- **LinkedIn**: [mielesilva](https://www.linkedin.com/in/mielesilva/)
- **Portfólio online**: [mielesantos.github.io](https://mielesantos.github.io/)

## 📄 Licença

Este projeto é de uso pessoal.

---

Desenvolvido com ❤️ por Miele Silva

