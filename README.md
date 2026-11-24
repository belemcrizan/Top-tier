# Top Tier — The Taylor Swift Collection

Uma aplicação responsiva para explorar as músicas de **evermore, folklore e reputation**, comparar as posições e criar um ranking pessoal. Construída com React 19, Vite 7, TypeScript 5, CSS e ícones Lucide.

O recorte segue os três álbuns presentes na imagem de referência, na ordem de preferência informada: **1. evermore; 2. folklore; 3. reputation**. A foto não define posições das músicas. As notas, os comentários e o ranking das faixas são uma curadoria editorial subjetiva criada para o projeto, sem vínculo com a artista e sem pretensão de consenso.

## Rodar localmente

Use Node.js **22.12 ou superior**; Node.js 24 é recomendado.

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

```bash
# Testes de dados e regras de ranking
npm test

# Verificação TypeScript e build de produção
npm run build

# Conferir o build localmente
npm run preview
```

O build estático é gerado em `dist/`. O script de testes usa `node --import tsx --test src/lib/ranking.test.ts`.

## O que a aplicação oferece

- **A coleção:** escolha de álbum, resumo da era, média de pontuação, faixa líder e ranking com justificativas.
- **Ranking geral:** as 49 faixas reunidas, com busca por título, filtros de álbum, tier, nota mínima e favoritos; ordenação por posição, nota, álbum ou número da faixa.
- **Meu ranking:** avaliação de 0 a 100 por música, recálculo de tier e posições e restauração da curadoria original.
- **Detalhes da faixa:** posição geral e no álbum, justificativa, contexto musical, favorito e link de busca no Spotify.
- Temas claro e escuro, interface responsiva, foco visível e modal nativo com fechamento por Escape.

O link do Spotify abre uma busca externa; a aplicação não reproduz áudio. Preferências de tema, favoritos e notas pessoais ficam no `localStorage` do navegador. Não há conta, backend ou sincronização entre dispositivos. Se o armazenamento estiver indisponível, as alterações continuam na sessão aberta.

## Dados e curadoria

O arquivo central é [`src/data/rankings.ts`](src/data/rankings.ts).

| Álbum | Ano | Edição | Faixas |
|---|---:|---|---:|
| evermore | 2020 | Deluxe | 17 |
| folklore | 2020 | Deluxe | 17 |
| reputation | 2017 | Original | 15 |
| **Total** | | | **49** |

Os metadados ficam em `albums`; as músicas são editadas em `songSeeds`. Cada registro de entrada contém:

```ts
{
  album: 'evermore',
  numeroFaixa: 2,
  titulo: 'champagne problems',
  pontuacao: 100,
  justificativa: 'Explique a posição considerando a escrita, o arranjo, a emoção e o replay.',
  contexto: 'Descreva a proposta musical ou narrativa da faixa dentro do álbum.',
}
```

Edite a pontuação e os textos diretamente nesse registro. As notas são opiniões editoriais de 0 a 100, considerando letra e storytelling, produção e arranjo, impacto emocional e melódico e vontade de revisitar. Não existe uma média ponderada oculta entre esses critérios.

O módulo exporta `songs`, com todos os campos pedidos: `id`, `titulo`, `album`, `numeroFaixa`, `tier`, `posicaoNoAlbum`, `posicaoGeral`, `pontuacao`, `justificativa` e `contexto`. ID, tier e posições são calculados automaticamente. O ID usa o álbum e o número original da faixa, por exemplo `evermore-02`.

| Tier | Nome | Pontuação |
|---|---|---:|
| S+ | God-Tier | 97–100 |
| S | Top-Tier | 92–96 |
| A | High-Tier | 85–91 |
| B | Solid | 78–84 |
| C | Situational | 0–77 |

A função `tierForScore` centraliza esses limites. Se mudar a escala, atualize também a legenda de faixas de pontos em `src/App.tsx`.

O ranking base é ordenado por nota decrescente. Empates usam `ordemReferencia` do álbum e, depois, o número original da faixa. No ranking pessoal, empates preservam a posição editorial original. Os filtros são aplicados depois do cálculo das posições, de modo que uma busca não transforma a posição de uma música no catálogo.

### Adicionar uma música

1. Acrescente um registro em `songSeeds`, com álbum existente, número de faixa único naquele álbum, título, nota inteira entre 0 e 100 e os dois textos.
2. Não preencha posições ou tier manualmente; o módulo os gera.
3. Rode `npm test` e `npm run build`. Ao expandir o catálogo, revise as contagens esperadas nos testes e os totais editoriais da interface.

### Adicionar um álbum

1. Amplie a união `AlbumId` no módulo de dados.
2. Inclua um objeto em `albums` seguindo a interface `Album`: ano, edição, estética, descrição, destaque, cores, capa e ordem de referência.
3. Salve a capa em `public/images/` e informe seu caminho em `cover`.
4. Adicione as faixas em `songSeeds` e registre a fonte em `sources`.
5. Revise os textos e contadores de três álbuns e 49 faixas em `src/App.tsx`, além dos testes de integridade.

Manter os IDs estáveis preserva as avaliações e os favoritos já gravados no navegador. IDs removidos do catálogo são descartados na leitura do armazenamento.

## Estrutura do projeto

```text
Top-tier/
├── public/
│   ├── favicon.svg
│   └── images/                 # Capas, fotografia e CREDITS.md
├── src/
│   ├── components/
│   │   ├── Icons.tsx           # Ícones compartilhados
│   │   ├── SongDialog.tsx      # Ficha e avaliação pessoal
│   │   ├── SongList.tsx        # Lista de músicas e favoritos
│   │   └── TierBadge.tsx       # Identificação visual dos tiers
│   ├── data/
│   │   └── rankings.ts         # Catálogo, notas, posições e fontes
│   ├── lib/
│   │   ├── ranking.ts          # Funções puras de ranking, filtros e parsing
│   │   └── ranking.test.ts     # Testes das regras e dos dados
│   ├── App.tsx                # Navegação, telas e estado da aplicação
│   ├── main.tsx               # Entrada React
│   └── styles.css             # Layout, temas e responsividade
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

`personalizeSongs` recalcula as notas e as posições sem modificar o catálogo base. `filterSongs` combina os filtros e ordena uma cópia da lista. `parseScores` e `parseFavorites` validam o conteúdo recuperado do navegador, ignorando JSON inválido, notas fora do intervalo e IDs desconhecidos.

Os testes verificam a integridade do catálogo, posições contínuas, coerência dos tiers, personalização, desempates, filtros combinados e leitura de armazenamento inválido.

## Preparar commit e push

Repositório alvo: **https://github.com/belemcrizan/Top-tier**.

O projeto está preparado para versionamento. O envio para esse repositório depende da sua autenticação GitHub. Para um checkout com Git já inicializado:

```bash
git status
git add .
git commit -m "feat: add interactive Taylor Swift rankings"

# Use um remoto separado se origin estiver associado à hospedagem.
git remote add github https://github.com/belemcrizan/Top-tier.git
git push -u github main
```

Se o remoto `github` já existir, confira `git remote -v` e use `git remote set-url github https://github.com/belemcrizan/Top-tier.git` quando necessário. Em uma cópia sem `.git`, execute `git init -b main` antes dos comandos acima. Não versione `node_modules/`, `dist/` ou arquivos de ambiente; esses caminhos estão no `.gitignore`.

## Hospedagem estática

Execute `npm run build` e publique `dist/` em um serviço de hospedagem estática. O projeto usa `base: '/'` do Vite por padrão.

Para GitHub Pages no caminho `/Top-tier/`, configure `base: '/Top-tier/'` em `vite.config.ts` e adapte os caminhos absolutos das imagens e do favicon para usar `import.meta.env.BASE_URL` antes de gerar o build. Apenas alterar o `base` não reescreve os caminhos das capas definidos nos dados.

## Fontes e créditos

As fontes de catálogo estão exportadas em `sources`, no módulo de dados, e aparecem na seção “Como nasce esse ranking?” da interface. As capas são fornecidas pelo catálogo Apple Music; a fotografia promocional de folklore é de Beth Garrabrant, reproduzida pela Vogue México.

Veja [`public/images/CREDITS.md`](public/images/CREDITS.md) para os endereços dos arquivos. Os direitos das imagens pertencem aos respectivos titulares. Este é um projeto independente de fãs; não é uma aplicação oficial de Taylor Swift.
