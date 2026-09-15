# OSINT Policial — Central de Consultas

Ferramenta web estática (HTML/CSS/JS puro) para organizar pesquisas OSINT
a partir de um identificador (e-mail, telefone, CPF/CNPJ, IP, domínio,
username, imagem, placa, endereço de criptoativo).

**Não usa IA/LLM.** O sistema apenas monta URLs de pesquisa pré-formatadas
com base na Knowledge Base e abre/aponta para as fontes públicas/oficiais
correspondentes. Não simula nem inventa resultados.

**Sem banco de dados.** Não há login, cadastro, cookies de rastreio ou
`localStorage`. Todos os dados existem apenas na memória da aba enquanto
ela está aberta; ao atualizar ou fechar a página, tudo desaparece.

---

## Estrutura

```
/
├── index.html                    # interface (formulário + tabela de resultados)
├── style.css                     # estilos (tema branco/minimalista)
├── app.js                        # motor de pesquisa + exportação PDF/XLSX
├── knowledge/
│   ├── knowledge-base.js         # fontes/URLs por categoria de identificador
│   └── skill-rules.js            # textos/rótulos/metodologia (SKILL)
├── README.md
└── wrangler.toml                 # configuração de publicação no Cloudflare Pages
```

A lógica é intencionalmente separada em duas camadas, como pedido:

- `knowledge/knowledge-base.js` → **o quê** e **onde** pesquisar (fontes e URLs).
- `knowledge/skill-rules.js` → **como** apresentar/rotular o fluxo (metodologia).
- `app.js` → executa o fluxo (não contém URLs nem regras de negócio "hardcoded").

## Como cada fonte funciona

Cada fonte em `knowledge-base.js` tem um `mode`:

- **`auto`** — existe um padrão de URL de pesquisa direta (ex.:
  `https://crt.sh/?q={q}`). O sistema substitui `{q}` pelo identificador
  informado (devidamente codificado) e oferece o link "Abrir pesquisa".
- **`manual`** — a fonte exige login, CAPTCHA, upload de arquivo, colagem
  de cabeçalho de e-mail, ou não tem um padrão de busca por URL confiável.
  O sistema aponta para a página correta da fonte, mas o investigador
  precisa realizar a consulta manualmente ali.

Isso respeita a regra de não tentar contornar CAPTCHA/CORS/robots.txt de
terceiros.

## Atualizando a Knowledge Base

Edite `knowledge/knowledge-base.js`. Cada categoria é um objeto dentro do
array `categories`:

```js
{
  id: "email",              // identificador interno, não mude sem necessidade
  label: "E-mail",          // nome exibido no seletor
  section: "§1",            // referência à seção da KB original
  placeholder: "exemplo@dominio.com",
  sources: [
    { name: "Nome da ferramenta", mode: "auto", url: "https://site.com/busca?q={q}", note: "o que faz" },
    { name: "Outra ferramenta",   mode: "manual", url: "https://site.com/", note: "requer CAPTCHA" },
  ],
}
```

Para adicionar uma nova categoria de identificador (ex.: "IMEI"), copie um
bloco existente, ajuste `id`/`label`/`section`/`placeholder`/`sources` e
adicione ao array — o formulário é gerado dinamicamente a partir desse
arquivo, nenhuma mudança em `app.js` é necessária.

## Atualizando o SKILL (metodologia)

Edite `knowledge/skill-rules.js` para mudar textos de status, o aviso de
integridade exibido acima da tabela de resultados, ou o texto padrão de
cadeia de custódia incluído nas exportações.

## Rodando localmente

Não há build step. Basta servir os arquivos estáticos:

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Depois abra `http://localhost:8080` (ou a porta indicada).

## Publicando no Cloudflare Pages

### Opção A — via dashboard
1. Suba esta pasta para um repositório no GitHub.
2. No Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
3. Selecione o repositório. Build command: (nenhum). Output directory: `/`.
4. Deploy.

### Opção B — via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy . --project-name osint-policial
```

`wrangler.toml` já está configurado para publicação estática (sem Worker
de backend — não é necessário, pois todo processamento é client-side).

## Exportação

- **PDF**: gerado no navegador com `jsPDF` (CDN, carregado apenas em tempo
  de execução — nenhum dado sai da máquina do investigador além das
  próprias consultas às fontes públicas).
- **XLSX**: gerado no navegador com `SheetJS` (CDN), mesmas condições.

Ambas as bibliotecas são carregadas via CDN (`cdnjs.cloudflare.com`) e
processam os dados inteiramente no navegador — nenhum servidor
intermediário recebe os dados da pesquisa.

## Checklist de teste sugerido

- [ ] Buscar cada tipo de identificador (e-mail, telefone, CPF/CNPJ, IP,
      domínio, username, imagem, placa, cripto)
- [ ] Conferir que links `auto` abrem a pesquisa já preenchida
- [ ] Conferir que links `manual` abrem a página correta da fonte
- [ ] Baixar PDF e conferir conteúdo
- [ ] Baixar XLSX e conferir colunas
- [ ] Testar com campo de observações vazio e preenchido
- [ ] Testar em desktop e em mobile (layout responsivo)
- [ ] Confirmar que fechar/atualizar a aba limpa os resultados (sem
      persistência)

## Aviso legal

Uso exclusivo para investigações legalmente amparadas, por profissionais
de segurança pública, perícia digital, Ministério Público, Poder
Judiciário, advocacia ou cibersegurança corporativa. Consulte sempre a
legislação vigente (LGPD, Marco Civil da Internet, Código Penal) antes de
usar qualquer achado em peça processual.
