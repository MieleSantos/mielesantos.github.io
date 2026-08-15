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
- ✅ Menu mobile hambúrguer
- ✅ Animações ao scroll
- ✅ Cards de projetos interativos com filtro por categoria (`IA`, `API`, `Dados`)
- ✅ Card de **Projetos Recentes** carregado automaticamente da GitHub API
- ✅ Seção de artigos/tutoriais baseada no repositório `pattern_chain`
- ✅ Estatísticas do GitHub integradas (com fallback recomendado)
- ✅ Botão scroll to top
- ✅ Tema dark moderno

## 🎨 Seções

1. **Hero** - Apresentação principal
2. **Sobre** - Informações pessoais e estatísticas
3. **Tecnologias** - Stack tecnológico organizado por categoria
4. **Projetos** - Projetos em destaque + filtros + card dinâmico de projetos recentes
5. **Artigos** - Conteúdo prático sobre Prompt Template e Sequential Chain
6. **Contato** - Links para LinkedIn e GitHub

## 📦 Como Usar

### Para GitHub Pages:

1. Faça o push deste repositório para o GitHub
2. Vá em Settings > Pages
3. Selecione a branch `main` (ou `master`)
4. Selecione a pasta `/root`
5. Salve e aguarde alguns minutos
6. Seu portfólio estará disponível em: `https://seu-usuario.github.io/nome-do-repo/`

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
- O bloco de **GitHub Stats** é um card de perfil nativo e dinâmico que puxa os dados em tempo real.
  - Se o serviço estiver indisponível, mantenha o card de projetos recentes como fonte principal dos dados dinâmicos.

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

