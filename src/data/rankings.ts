/**
 * Curadoria editorial subjetiva — não representa um ranking oficial ou consenso.
 * Escopo: evermore deluxe (17), folklore deluxe (17), reputation original (15).
 * Títulos e números de faixa seguem as fontes primárias ao fim do arquivo.
 * As notas avaliam o conjunto: escrita, produção, emoção e vontade de revisitar.
 */
export type AlbumId = 'evermore' | 'folklore' | 'reputation';
export type Tier = 'S+' | 'S' | 'A' | 'B' | 'C';

export interface Song {
  id: string;
  titulo: string;
  album: AlbumId;
  numeroFaixa: number;
  tier: Tier;
  posicaoNoAlbum: number;
  posicaoGeral: number;
  pontuacao: number;
  justificativa: string;
  contexto: string;
}

export interface Album {
  id: AlbumId;
  titulo: string;
  ano: number;
  edicao: string;
  estetica: string;
  descricao: string;
  destaque: string;
  cover: string;
  color: string;
  accent: string;
  ordemReferencia: number;
}

export const albums: Album[] = [
  {
    id: 'evermore', titulo: 'evermore', ano: 2020, edicao: 'Deluxe · 17 faixas',
    estetica: 'Indie folk · outono · histórias entrelaçadas',
    descricao: 'Amores que terminam, memórias que ficam. Um universo de personagens imperfeitos, texturas orgânicas e sentimentos que amadurecem a cada escuta.',
    destaque: 'O piano de champagne problems transforma uma despedida em uma pequena obra de cinema.',
    cover: '/images/evermore.jpg', color: '#a65c3b', accent: '#d89164', ordemReferencia: 1,
  },
  {
    id: 'folklore', titulo: 'folklore', ano: 2020, edicao: 'Deluxe · 17 faixas',
    estetica: 'Indie folk · névoa · memória e ficção',
    descricao: 'Um refúgio em preto e branco onde cada detalhe conta uma história. Narradores se cruzam, o verão vira lembrança e a intimidade ocupa o centro do palco.',
    destaque: 'A expansão instrumental de august traduz a beleza de uma lembrança que não volta.',
    cover: '/images/folklore.jpg', color: '#858b87', accent: '#b5c1b6', ordemReferencia: 2,
  },
  {
    id: 'reputation', titulo: 'reputation', ano: 2017, edicao: 'Original · 15 faixas',
    estetica: 'Electropop · noite · vulnerabilidade e reinvenção',
    descricao: 'Batidas intensas por fora, um romance protegido por dentro. A teatralidade encontra a ternura em uma era feita de contrastes e refrões enormes.',
    destaque: 'Getaway Car combina fuga, culpa e um refrão que pede outra volta.',
    cover: '/images/reputation.jpg', color: '#626768', accent: '#c1c3b1', ordemReferencia: 3,
  },
];

export const tierLabels: Record<Tier, string> = {
  'S+': 'God-Tier', S: 'Top-Tier', A: 'High-Tier', B: 'Solid', C: 'Situational',
};

export function tierForScore(score: number): Tier {
  if (score >= 97) return 'S+';
  if (score >= 92) return 'S';
  if (score >= 85) return 'A';
  if (score >= 78) return 'B';
  return 'C';
}

type SongSeed = Pick<Song, 'album' | 'numeroFaixa' | 'titulo' | 'pontuacao' | 'justificativa' | 'contexto'>;

// Edite as notas aqui. Tier e posições são recalculados automaticamente.
// Empates: ordem dos álbuns na referência e, depois, número original da faixa.
const songSeeds: SongSeed[] = [
  {
    album: 'evermore', numeroFaixa: 1, titulo: 'willow', pontuacao: 90,
    justificativa: 'O violão circular e a melodia sinuosa criam um encantamento imediato. A escrita trabalha mais a atmosfera que uma trama complexa; o refrão e a fluidez da produção garantem enorme vontade de repetir.',
    contexto: 'Abertura de evermore. Funciona como passagem para o lado mais orgânico e misterioso do disco.',
  },
  {
    album: 'evermore', numeroFaixa: 2, titulo: 'champagne problems', pontuacao: 100,
    justificativa: 'Uma recusa de casamento ganha dimensão por meio de pequenos objetos, perspectivas e consequências. O piano contido prepara uma ponte devastadora; a combinação de narrativa precisa, melodia e clímax faz dela o primeiro lugar desta curadoria.',
    contexto: 'Balada ao piano que coloca um momento privado diante das expectativas de uma família inteira.',
  },
  {
    album: 'evermore', numeroFaixa: 3, titulo: 'gold rush', pontuacao: 92,
    justificativa: 'A abertura suspensa se abre em um pop cintilante que imita a velocidade de uma fantasia. Sua forma compacta e o contraste entre fascínio e ciúme tornam o replay especialmente forte, embora a narrativa seja menos desenvolvida que a das líderes.',
    contexto: 'Uma pausa de brilho pop no repertório folk, estruturada ao redor de uma atração imaginada.',
  },
  {
    album: 'evermore', numeroFaixa: 4, titulo: '’tis the damn season', pontuacao: 91,
    justificativa: 'A guitarra repetida sustenta a tensão entre voltar para casa e voltar para uma pessoa. O vocabulário cotidiano dá peso a um reencontro temporário; fica logo abaixo do topo porque prefere a contenção a uma grande transformação musical.',
    contexto: 'Um retorno à cidade natal reacende uma relação atravessada pela distância e por escolhas de vida.',
  },
  {
    album: 'evermore', numeroFaixa: 5, titulo: 'tolerate it', pontuacao: 98,
    justificativa: 'O piano de pulso irregular torna audível o desequilíbrio de uma relação. A passagem da devoção silenciosa para a possibilidade de ruptura é construída com precisão; sua tensão emocional permanece mesmo depois de muitas escutas.',
    contexto: 'Retrato de alguém que oferece amor e presença, mas recebe uma aceitação indiferente.',
  },
  {
    album: 'evermore', numeroFaixa: 6, titulo: 'no body, no crime (feat. HAIM)', pontuacao: 85,
    justificativa: 'A narrativa policial entrega pistas, viradas e humor sombrio sobre um arranjo country direto. A história prende desde o início, mas a surpresa perde alguma força quando se conhece o desfecho, reduzindo o replay em relação às faixas mais ambíguas.',
    contexto: 'Ficção de crime e vingança com participação de HAIM e forte tradição de storytelling country.',
  },
  {
    album: 'evermore', numeroFaixa: 7, titulo: 'happiness', pontuacao: 93,
    justificativa: 'A letra aceita que uma relação possa ter sido feliz e ainda assim precisar terminar. O arranjo cresce devagar, preservando a ambivalência da voz; é uma das escritas mais maduras do recorte, com um impacto que exige atenção em vez de um refrão imediato.',
    contexto: 'Balada de separação que procura espaço para a gratidão sem apagar a dor.',
  },
  {
    album: 'evermore', numeroFaixa: 8, titulo: 'dorothea', pontuacao: 82,
    justificativa: 'O piano solto e o refrão acolhedor fazem o reencontro soar familiar. A perspectiva de quem ficou na cidade oferece carinho e alguma ironia, mas o desenvolvimento musical é mais previsível que nos retratos mais complexos do álbum.',
    contexto: 'Uma pessoa observa de longe a amiga que saiu da cidade e se tornou uma figura pública.',
  },
  {
    album: 'evermore', numeroFaixa: 9, titulo: 'coney island (feat. The National)', pontuacao: 88,
    justificativa: 'As duas vozes transformam o arrependimento em um diálogo de desencontros. A instrumentação discreta e as imagens de abandono recompensam escutas atentas; a melodia menos imediata a deixa abaixo das faixas com maior equilíbrio entre sutileza e impulso.',
    contexto: 'Dueto com The National sobre negligências pequenas que acumulam distância em uma relação.',
  },
  {
    album: 'evermore', numeroFaixa: 10, titulo: 'ivy', pontuacao: 96,
    justificativa: 'Cordas dedilhadas e uma melodia luminosa contrastam com uma paixão cercada de risco. A metáfora central se expande sem perder clareza; o arranjo cheio de detalhes e a tensão da história sustentam um replay excepcional.',
    contexto: 'Um romance proibido é contado com imagens de natureza, pertencimento e invasão.',
  },
  {
    album: 'evermore', numeroFaixa: 11, titulo: 'cowboy like me', pontuacao: 95,
    justificativa: 'A produção lenta e os timbres country deixam dois personagens desconfiados se reconhecerem aos poucos. O final mantém uma incerteza produtiva sobre amor e interesse; sua força está na interpretação e no subtexto, mais que em um clímax explosivo.',
    contexto: 'Dois oportunistas encontram afinidade em uma história que preserva suas zonas de ambiguidade.',
  },
  {
    album: 'evermore', numeroFaixa: 12, titulo: 'long story short', pontuacao: 87,
    justificativa: 'A percussão ágil devolve movimento ao álbum e acompanha uma narrativa de sobrevivência. O refrão funciona muito bem em repetição, mas as referências mais condensadas deixam menos espaço para os detalhes que elevam as melhores histórias do disco.',
    contexto: 'Uma retrospectiva de conflito e reconstrução contada com humor e aceleração pop.',
  },
  {
    album: 'evermore', numeroFaixa: 13, titulo: 'marjorie', pontuacao: 94,
    justificativa: 'A memória aparece em conselhos, arrependimentos cotidianos e uma voz preservada no arranjo. As camadas crescentes dão forma à ausência; a emoção nasce dos detalhes concretos, o que a coloca entre os momentos mais duradouros do álbum.',
    contexto: 'Homenagem à avó Marjorie Finlay, cuja voz integra a gravação como parte da lembrança.',
  },
  {
    album: 'evermore', numeroFaixa: 14, titulo: 'closure', pontuacao: 79,
    justificativa: 'A percussão áspera e o piano irregular expressam a resistência a uma reconciliação conveniente. A escolha de produção é interessante e coerente com o tema, mas sua fricção e o refrão curto tornam a experiência menos convidativa para repetição nesta seleção.',
    contexto: 'Uma resposta à expectativa de que toda ferida precise terminar em perdão ou amizade.',
  },
  {
    album: 'evermore', numeroFaixa: 15, titulo: 'evermore (feat. Bon Iver)', pontuacao: 94,
    justificativa: 'O piano invernal ganha instabilidade no encontro com Bon Iver e depois recupera o chão. A mudança musical faz a esperança parecer conquistada; sua arquitetura e a resolução emocional compensam uma estrutura menos imediata.',
    contexto: 'Encerramento da edição padrão, atravessando a sensação de dor permanente até uma abertura para o futuro.',
  },
  {
    album: 'evermore', numeroFaixa: 16, titulo: 'right where you left me', pontuacao: 97,
    justificativa: 'Uma cena de restaurante vira o mapa de uma vida emocional paralisada. O andamento insistente contrasta com a narradora que não consegue avançar; detalhes, tensão crescente e refrão muito forte dão à faixa bônus um lugar no topo.',
    contexto: 'Faixa bônus da edição deluxe. O tempo avança para todos, menos para a pessoa abandonada.',
  },
  {
    album: 'evermore', numeroFaixa: 17, titulo: 'it’s time to go', pontuacao: 77,
    justificativa: 'O arranjo sóbrio sustenta uma ideia clara: reconhecer quando permanecer deixa de fazer sentido. A mensagem oferece um fechamento útil, mas a escrita mais explicativa e a progressão familiar têm menos surpresa que o restante do disco.',
    contexto: 'Faixa bônus que encerra a edição deluxe com uma reflexão sobre limites e despedidas.',
  },
  {
    album: 'folklore', numeroFaixa: 1, titulo: 'the 1', pontuacao: 91,
    justificativa: 'O piano leve e a bateria discreta deixam a nostalgia respirar sem dramatização excessiva. O olhar para uma possibilidade perdida é elegante e fácil de revisitar; a menor amplitude dramática a mantém atrás dos pontos mais intensos do álbum.',
    contexto: 'Abertura que apresenta o registro íntimo de folklore com um balanço entre aceitação e imaginação.',
  },
  {
    album: 'folklore', numeroFaixa: 2, titulo: 'cardigan', pontuacao: 97,
    justificativa: 'A voz próxima, o piano e a percussão discreta constroem uma lembrança cheia de textura. As imagens se conectam com a melodia sem parecer enfeite; a ponte amplia a história e garante um dos melhores encontros entre escrita e refrão do recorte.',
    contexto: 'Uma das perspectivas do triângulo narrativo também explorado em august e betty.',
  },
  {
    album: 'folklore', numeroFaixa: 3, titulo: 'the last great american dynasty', pontuacao: 88,
    justificativa: 'A narrativa atravessa festas, julgamento social e o destino de uma casa com agilidade rara. A virada de perspectiva dá uma ótima conclusão; o arranjo mais constante fica um passo atrás da riqueza da escrita.',
    contexto: 'História inspirada em Rebekah Harkness que aproxima uma figura do passado da narradora atual.',
  },
  {
    album: 'folklore', numeroFaixa: 4, titulo: 'exile (feat. Bon Iver)', pontuacao: 96,
    justificativa: 'O contraste entre as vozes encena uma conversa em que ninguém se sente ouvido. O piano abre espaço para um crescendo de respostas sobrepostas; o conflito fica tanto na forma quanto na letra, gerando grande impacto e alta permanência emocional.',
    contexto: 'Dueto com Bon Iver que coloca duas leituras incompatíveis da mesma separação em confronto.',
  },
  {
    album: 'folklore', numeroFaixa: 5, titulo: 'my tears ricochet', pontuacao: 99,
    justificativa: 'A imagem de um funeral transforma traição e luto em uma história de alcance amplo. Vozes fantasmagóricas e percussão crescente dão peso a cada retorno do refrão; a união de conceito, interpretação e clímax a torna a líder de folklore.',
    contexto: 'Uma despedida narrada por quem foi ferido, com espaço para leituras pessoais e profissionais.',
  },
  {
    album: 'folklore', numeroFaixa: 6, titulo: 'mirrorball', pontuacao: 95,
    justificativa: 'Guitarras nebulosas e uma voz delicada tornam a busca por aprovação quase palpável. A metáfora se mantém vulnerável em vez de grandiosa; é uma faixa cujo aparente tamanho pequeno esconde detalhes que crescem a cada escuta.',
    contexto: 'Um retrato de adaptação constante e do esforço de continuar encantando uma plateia.',
  },
  {
    album: 'folklore', numeroFaixa: 7, titulo: 'seven', pontuacao: 93,
    justificativa: 'O registro vocal elevado e o arranjo delicado preservam a percepção incompleta de uma lembrança infantil. A ternura convive com sinais de sofrimento sem resolver tudo; essa abertura interpretativa dá profundidade e um replay que revela novas nuances.',
    contexto: 'Memória de amizade na infância, contada com afeto, distância e compreensão limitada do passado.',
  },
  {
    album: 'folklore', numeroFaixa: 8, titulo: 'august', pontuacao: 98,
    justificativa: 'O arranjo cresce de uma lembrança íntima para uma onda de guitarras e cordas. A narradora encontra dignidade dentro de uma relação passageira; a ponte e a coda convertem saudade em movimento, com uma força melódica quase inesgotável.',
    contexto: 'O verão do triângulo narrativo aparece pelo ponto de vista de quem esperava mais do encontro.',
  },
  {
    album: 'folklore', numeroFaixa: 9, titulo: 'this is me trying', pontuacao: 94,
    justificativa: 'A produção enevoada acompanha uma confissão que evita uma vitória fácil. O esforço de simplesmente aparecer ganha valor emocional; sua contenção e as camadas do arranjo recompensam escutas concentradas, mesmo sem um grande refrão expansivo.',
    contexto: 'Uma tentativa de reconexão atravessada por arrependimento, dificuldades pessoais e desejo de ser reconhecido.',
  },
  {
    album: 'folklore', numeroFaixa: 10, titulo: 'illicit affairs', pontuacao: 91,
    justificativa: 'O violão discreto dá lugar a uma ponte que muda a escala da dor. A letra observa os pequenos rituais e o custo de uma relação secreta; a duração compacta favorece o replay, embora a gravação preserve um clímax mais contido.',
    contexto: 'Um vínculo clandestino é observado a partir do desgaste cotidiano e da desigualdade emocional.',
  },
  {
    album: 'folklore', numeroFaixa: 11, titulo: 'invisible string', pontuacao: 87,
    justificativa: 'O dedilhado recorrente costura coincidências e mudanças de vida com delicadeza. A leveza da melodia produz um descanso importante; a ideia de destino funciona bem, mas oferece menos tensão e surpresa que as faixas mais ambivalentes.',
    contexto: 'Um olhar afetuoso para caminhos separados que parecem conduzir duas pessoas ao mesmo encontro.',
  },
  {
    album: 'folklore', numeroFaixa: 12, titulo: 'mad woman', pontuacao: 84,
    justificativa: 'O piano sombrio e a interpretação controlada dão firmeza à crítica contra a deslegitimação da raiva. A perspectiva é clara e incisiva; a repetição de algumas ideias e a progressão musical estável limitam seu alcance dentro deste ranking.',
    contexto: 'Reflexão sobre provocação, poder e a forma como a reação de uma mulher pode ser usada contra ela.',
  },
  {
    album: 'folklore', numeroFaixa: 13, titulo: 'epiphany', pontuacao: 83,
    justificativa: 'Vozes amplas e timbres suspensos criam um espaço solene para experiências de choque e cuidado. O paralelismo das cenas é forte, mas o ritmo muito lento e a pouca resolução melódica fazem dela uma escuta mais dependente de contexto.',
    contexto: 'A canção aproxima experiências de guerra e de trabalho na linha de frente da saúde.',
  },
  {
    album: 'folklore', numeroFaixa: 14, titulo: 'betty', pontuacao: 90,
    justificativa: 'O violão e a harmônica devolvem o storytelling à tradição country. A voz de um adolescente mistura arrependimento e justificativas pouco confiáveis; o último refrão traz grande satisfação melódica, sem apagar as contradições do narrador.',
    contexto: 'A perspectiva de James completa o triângulo de personagens de cardigan e august.',
  },
  {
    album: 'folklore', numeroFaixa: 15, titulo: 'peace', pontuacao: 92,
    justificativa: 'O pulso constante e o arranjo enxuto deixam uma pergunta difícil em primeiro plano: amor basta quando a vida traz instabilidade? A exposição vocal é intensa e a escrita evita promessas fáceis, mesmo com uma forma menos imediata para cantar junto.',
    contexto: 'Uma declaração de compromisso que reconhece os limites do que se pode oferecer a outra pessoa.',
  },
  {
    album: 'folklore', numeroFaixa: 16, titulo: 'hoax', pontuacao: 86,
    justificativa: 'O piano frio e a voz quase imóvel dão unidade a uma coleção de imagens de ruptura. A ambiguidade amplia as leituras, mas também reduz a progressão narrativa; funciona melhor como fechamento íntimo que como faixa de impacto imediato.',
    contexto: 'Encerramento da edição padrão, preservando questões sobre perda, lealdade e permanência.',
  },
  {
    album: 'folklore', numeroFaixa: 17, titulo: 'the lakes', pontuacao: 89,
    justificativa: 'As cordas e o vocabulário literário criam uma fantasia de retiro longe da exposição. A melodia elegante sustenta a atmosfera romântica; algumas imagens deliberadamente ornamentadas a deixam abaixo das composições mais diretas e precisas do disco.',
    contexto: 'Faixa bônus da edição deluxe, com referências ao Lake District e ao desejo de privacidade criativa.',
  },
  {
    album: 'reputation', numeroFaixa: 1, titulo: '...Ready For It?', pontuacao: 89,
    justificativa: 'Graves agressivos e versos rítmicos se abrem em um refrão de sonho romântico. O choque entre as duas partes apresenta a dualidade do álbum com energia; a construção é marcante, mas menos coesa emocionalmente que os romances do topo.',
    contexto: 'Abertura que estabelece o contraste entre armadura pública e intimidade amorosa.',
  },
  {
    album: 'reputation', numeroFaixa: 2, titulo: 'End Game (feat. Ed Sheeran & Future)', pontuacao: 80,
    justificativa: 'A batida espaçosa e as participações dão variedade ao diálogo entre desejo e imagem pública. O refrão é eficiente, mas a sucessão de versos dilui o foco narrativo e oferece menos identidade melódica que os melhores momentos do álbum.',
    contexto: 'Colaboração pop com Future e Ed Sheeran em torno da vontade de ser uma relação duradoura.',
  },
  {
    album: 'reputation', numeroFaixa: 3, titulo: 'I Did Something Bad', pontuacao: 90,
    justificativa: 'A produção pesada e os cortes vocais tratam a provocação como espetáculo. A ponte amplia a teatralidade sem perder o ritmo; funciona muito bem pela energia, ainda que a personagem domine mais que a complexidade emocional.',
    contexto: 'Um dos momentos mais confrontadores do disco, feito de exagero cênico e afirmação de controle.',
  },
  {
    album: 'reputation', numeroFaixa: 4, titulo: 'Don’t Blame Me', pontuacao: 96,
    justificativa: 'A progressão de sintetizadores e vozes com inflexão gospel transforma obsessão amorosa em cerimônia. O clímax vocal entrega a promessa da produção; a escrita é menos narrativa, mas a força melódica e a interpretação sustentam um replay altíssimo.',
    contexto: 'Uma declaração de paixão extrema com construção gradual e um dos ápices vocais da era.',
  },
  {
    album: 'reputation', numeroFaixa: 5, titulo: 'Delicate', pontuacao: 97,
    justificativa: 'Os vocais processados e a batida leve fazem a insegurança soar íntima em vez de distante. Pequenos gestos constroem a tensão de um começo de romance; o equilíbrio entre fragilidade, groove e refrão a coloca entre as mais completas do recorte.',
    contexto: 'O medo de gostar de alguém quando a própria imagem pública parece tornar tudo mais difícil.',
  },
  {
    album: 'reputation', numeroFaixa: 6, titulo: 'Look What You Made Me Do', pontuacao: 82,
    justificativa: 'O arranjo seco e o refrão repetitivo fazem da vingança uma peça de teatro pop. A identidade é imediata e a ponte diverte, mas a ênfase no gesto e na repetição oferece menos desenvolvimento melódico para escutas sucessivas.',
    contexto: 'O single de apresentação da era dramatiza uma mudança de persona e a disputa pelo próprio relato.',
  },
  {
    album: 'reputation', numeroFaixa: 7, titulo: 'So It Goes...', pontuacao: 87,
    justificativa: 'Sintetizadores escuros, graves e voz próxima criam uma atmosfera noturna consistente. A tensão cresce de forma discreta e o refrão recompensa a espera; a letra menos específica a deixa abaixo das faixas que unem sensualidade a cenas mais nítidas.',
    contexto: 'Uma relação é descrita como um jogo de atração, poder e perda momentânea de controle.',
  },
  {
    album: 'reputation', numeroFaixa: 8, titulo: 'Gorgeous', pontuacao: 84,
    justificativa: 'O brilho da produção e o humor autoconsciente dão leveza à atração embaraçosa. O refrão é pegajoso e a interpretação abraça a falta de compostura; sua proposta deliberadamente simples tem menos camadas que as melhores canções românticas da era.',
    contexto: 'Um respiro cômico e colorido no meio da paleta escura de reputation.',
  },
  {
    album: 'reputation', numeroFaixa: 9, titulo: 'Getaway Car', pontuacao: 98,
    justificativa: 'A metáfora da fuga organiza toda a narrativa e transforma o romance em um filme de perseguição. Sintetizadores velozes, ponte explosiva e refrão preciso se reforçam mutuamente; é a melhor síntese de storytelling e impulso pop de reputation nesta curadoria.',
    contexto: 'Uma relação usada como saída para outra já carrega, desde o começo, a possibilidade de abandono.',
  },
  {
    album: 'reputation', numeroFaixa: 10, titulo: 'King of My Heart', pontuacao: 91,
    justificativa: 'A percussão ampla e os vocais eletrônicos fazem a entrega amorosa ganhar escala física. A ponte injeta detalhes cotidianos que humanizam a grandiosidade; alguns encaixes entre seções são menos fluidos que nos pontos mais altos do álbum.',
    contexto: 'A sensação de autossuficiência cede espaço ao reconhecimento de uma conexão inesperada.',
  },
  {
    album: 'reputation', numeroFaixa: 11, titulo: 'Dancing With Our Hands Tied', pontuacao: 95,
    justificativa: 'A batida acelerada converte o medo de perder um amor em movimento. A melodia mantém a urgência sem sacrificar vulnerabilidade; produção e tema se encontram no contraste entre dançar livremente e se sentir cercado por limites.',
    contexto: 'Um romance é vivido com intensidade enquanto a narradora antecipa forças que podem ameaçá-lo.',
  },
  {
    album: 'reputation', numeroFaixa: 12, titulo: 'Dress', pontuacao: 94,
    justificativa: 'A voz respirada e a produção espaçosa tratam desejo como uma conversa particular. A ponte acrescenta memória e reconhecimento à sensualidade; a contenção do arranjo deixa espaço para uma intimidade que resiste bem à repetição.',
    contexto: 'O desejo de ultrapassar uma relação aparente e ser conhecido para além da imagem pública.',
  },
  {
    album: 'reputation', numeroFaixa: 13, titulo: 'This Is Why We Can’t Have Nice Things', pontuacao: 76,
    justificativa: 'O piano percussivo e o refrão de festa tornam a ruptura de amizade uma provocação divertida. O humor funciona como cena, mas a estrutura repetitiva e a caricatura reduzem a nuance emocional e a vontade de revisitar frente ao restante do disco.',
    contexto: 'Uma despedida sarcástica de relações marcadas por confiança quebrada e exposição pública.',
  },
  {
    album: 'reputation', numeroFaixa: 14, titulo: 'Call It What You Want', pontuacao: 93,
    justificativa: 'A batida macia e as camadas vocais criam um refúgio em meio ao ruído da era. O romance é contado por imagens de cuidado e recuperação; sua segurança emocional e o refrão discreto fazem dela uma das faixas mais acolhedoras para retornar.',
    contexto: 'Depois da queda de uma imagem pública, o foco se desloca para uma conexão vivida em particular.',
  },
  {
    album: 'reputation', numeroFaixa: 15, titulo: 'New Year’s Day', pontuacao: 92,
    justificativa: 'O piano quase sem ornamentos traz o disco da encenação para os cuidados depois da festa. A escolha de um gesto cotidiano dá força à promessa amorosa; não busca o maior clímax, mas encerra a era com precisão e afeto duradouro.',
    contexto: 'Encerramento acústico que encontra intimidade em permanecer para a arrumação do dia seguinte.',
  },
];

const albumOrder = new Map(albums.map((album) => [album.id, album.ordemReferencia]));
const orderedSeeds = [...songSeeds].sort((a, b) =>
  b.pontuacao - a.pontuacao ||
  (albumOrder.get(a.album) ?? 0) - (albumOrder.get(b.album) ?? 0) ||
  a.numeroFaixa - b.numeroFaixa,
);

const albumPositions: Partial<Record<AlbumId, number>> = {};

export const songs: Song[] = orderedSeeds.map((song, index) => {
  const position = (albumPositions[song.album] ?? 0) + 1;
  albumPositions[song.album] = position;
  return {
    ...song,
    id: `${song.album}-${String(song.numeroFaixa).padStart(2, '0')}`,
    tier: tierForScore(song.pontuacao),
    posicaoNoAlbum: position,
    posicaoGeral: index + 1,
  };
});

/** Fontes de catálogo; notas, ordem e comentários são criação editorial. */
export const sources = [
  {
    titulo: 'evermore deluxe — loja oficial Taylor Swift (tracklist)',
    url: 'https://storeeu.taylorswift.com/en-en/products/evermore-album-deluxe-edition-vinyl',
  },
  {
    titulo: 'folklore — Universal Music Brasil (tracklist e lançamento)',
    url: 'https://www.universalmusic.com.br/2020/07/24/de-surpresa-taylor-swift-lanca-novo-album-folklore/',
  },
  {
    titulo: 'folklore deluxe — Apple Music (edição e ano)',
    url: 'https://music.apple.com/us/album/folklore-deluxe-version/1528111535',
  },
  {
    titulo: 'reputation — catálogo oficial Taylor Swift',
    url: 'https://taylor.lnk.to/TS_rpt',
  },
  {
    titulo: 'reputation — Apple Music (edição e ano)',
    url: 'https://music.apple.com/us/album/reputation/1440933849',
  },
] as const;
