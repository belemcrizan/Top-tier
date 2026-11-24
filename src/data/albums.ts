import type { Album } from './types';

export const albums: Album[] = [
  {
    id: 'evermore',
    titulo: 'evermore',
    ano: 2020,
    edicao: 'Deluxe',
    estetica: 'Indie folk · outono · histórias entrelaçadas',
    descricao:
      'Amores que terminam, memórias que ficam. Um universo de personagens ' +
      'imperfeitos, texturas orgânicas e sentimentos que amadurecem a cada escuta.',
    destaque:
      'O piano de champagne problems transforma uma despedida em uma pequena obra de ' + 'cinema.',
    color: '#A4623A',
    accent: '#E8CDB5',
    ordemReferencia: 1,
  },
  {
    id: 'folklore',
    titulo: 'folklore',
    ano: 2020,
    edicao: 'Deluxe',
    estetica: 'Indie folk · névoa · memória e ficção',
    descricao:
      'Um refúgio em preto e branco onde cada detalhe conta uma história. Narradores ' +
      'se cruzam, o verão vira lembrança e a intimidade ocupa o centro do palco.',
    destaque: 'A expansão instrumental de august traduz a beleza de uma lembrança que não volta.',
    color: '#6F8471',
    accent: '#CBD5C9',
    ordemReferencia: 2,
  },
  {
    id: 'reputation',
    titulo: 'reputation',
    ano: 2017,
    edicao: 'Original',
    estetica: 'Electropop · noite · vulnerabilidade e reinvenção',
    descricao:
      'Batidas intensas por fora, um romance protegido por dentro. A teatralidade ' +
      'encontra a ternura em uma era feita de contrastes e refrões enormes.',
    destaque: 'Getaway Car combina fuga, culpa e um refrão que pede outra volta.',
    color: '#4A4D57',
    accent: '#C7C3BC',
    ordemReferencia: 3,
  },
];
