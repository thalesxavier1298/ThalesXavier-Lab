/**
 * Real social-media pieces produced by Thales for Eliane Xavier.
 * Titles are the pieces' own Portuguese titles; alt text is translated.
 * To add a piece: drop the image in src/assets/social/ and add an entry.
 */
import flyerCocriacao from '../assets/social/flyer-cocriacao.jpg'
import flyerAtomos from '../assets/social/flyer-atomos-arquetipos.jpg'
import flyerTunelamento from '../assets/social/flyer-tunelamento.jpg'
import thumbCocriacao from '../assets/social/thumb-cocriacao.jpg'
import thumbSchrodinger from '../assets/social/thumb-schrodinger.jpg'
import thumbTunelamento from '../assets/social/thumb-tunelamento.jpg'
import cc01 from '../assets/social/carousel-cocriacao-01.jpg'
import cc02 from '../assets/social/carousel-cocriacao-02.jpg'
import cc03 from '../assets/social/carousel-cocriacao-03.jpg'
import cc04 from '../assets/social/carousel-cocriacao-04.jpg'
import cc05 from '../assets/social/carousel-cocriacao-05.jpg'
import cc06 from '../assets/social/carousel-cocriacao-06.jpg'
import cc07 from '../assets/social/carousel-cocriacao-07.jpg'
import l01 from '../assets/social/carousel-7leis-01.jpg'
import l02 from '../assets/social/carousel-7leis-02.jpg'
import l03 from '../assets/social/carousel-7leis-03.jpg'
import l04 from '../assets/social/carousel-7leis-04.jpg'
import l05 from '../assets/social/carousel-7leis-05.jpg'
import l06 from '../assets/social/carousel-7leis-06.jpg'
import l07 from '../assets/social/carousel-7leis-07.jpg'
import l08 from '../assets/social/carousel-7leis-08.jpg'
import l09 from '../assets/social/carousel-7leis-09.jpg'

export interface GalleryImage {
  id: string
  src: string
  width: number
  height: number
  title: string
  alt: { en: string; pt: string }
}

export const flyers: GalleryImage[] = [
  {
    id: 'flyer-tunelamento',
    src: flyerTunelamento,
    width: 1200,
    height: 1200,
    title: 'O Tunelamento Quântico e a Realização do Impossível',
    alt: {
      en: 'Live announcement flyer: Eliane Xavier beside a glowing wave passing through a barrier, with the date and time of the Instagram and YouTube broadcast.',
      pt: 'Flyer de live: Eliane Xavier ao lado de uma onda luminosa atravessando uma barreira, com data e horário da transmissão no Instagram e YouTube.',
    },
  },
  {
    id: 'flyer-cocriacao',
    src: flyerCocriacao,
    width: 1200,
    height: 1200,
    title: 'O Segredo da Cocriação',
    alt: {
      en: 'Terça Quântica live flyer in violet and pink tones, with Eliane Xavier at the center and the live date and time.',
      pt: 'Flyer da live Terça Quântica em tons de violeta e rosa, com Eliane Xavier ao centro e a data e o horário da live.',
    },
  },
  {
    id: 'flyer-atomos-arquetipos',
    src: flyerAtomos,
    width: 1092,
    height: 1441,
    title: 'Entre Átomos e Arquétipos',
    alt: {
      en: 'Extracurricular event flyer for a postgraduate program in quantum physics and spirituality, featuring guest speaker Maria Júlia Botto.',
      pt: 'Flyer de atividade extracurricular da pós-graduação em física quântica e espiritualidade, com a convidada Maria Júlia Botto.',
    },
  },
]

export const thumbnails: GalleryImage[] = [
  {
    id: 'thumb-schrodinger',
    src: thumbSchrodinger,
    width: 1600,
    height: 900,
    title: 'O Gato de Schrödinger e as Interpretações da Física Quântica',
    alt: {
      en: 'YouTube thumbnail: Eliane Xavier beside a box holding a cat shown half alive and half as a blue wave.',
      pt: 'Thumbnail do YouTube: Eliane Xavier ao lado de uma caixa com um gato metade real, metade em onda azul.',
    },
  },
  {
    id: 'thumb-tunelamento',
    src: thumbTunelamento,
    width: 1600,
    height: 900,
    title: 'O Tunelamento Quântico e a Realização do Impossível',
    alt: {
      en: 'YouTube thumbnail for the quantum tunneling live, adapted from the square flyer to a 16:9 layout.',
      pt: 'Thumbnail do YouTube da live sobre tunelamento quântico, adaptada do flyer quadrado para o formato 16:9.',
    },
  },
  {
    id: 'thumb-cocriacao',
    src: thumbCocriacao,
    width: 1600,
    height: 900,
    title: 'O Segredo da Cocriação',
    alt: {
      en: 'YouTube thumbnail for the Terça Quântica live, adapted from the square flyer to a 16:9 layout.',
      pt: 'Thumbnail do YouTube da live Terça Quântica, adaptada do flyer quadrado para o formato 16:9.',
    },
  },
]

export interface Carousel {
  id: string
  title: string
  slides: GalleryImage[]
}

/** Slide text, in reading order, for alt text (the slides are in Portuguese). */
const cocriacaoText = [
  'O Segredo da Cocriação',
  'Queremos cocriar uma vida melhor, mas não queremos abrir mão de nossas identidades.',
  'Aí está um paradoxo: a vida melhor que você quer não cabe nesta identidade estreita que você está operando.',
  'Não é fácil se livrar das identidades, e uma das partes mais difíceis é deixar pra trás os ódios e mágoas.',
  'Mas você também quer uma vida livre, feliz e abundante! Só que, ao mesmo tempo, não quer abrir mão das identidades que têm cocriado a sua vida atual.',
  'Percebe a contradição? É aí que as pessoas empacam por anos e vidas.',
  'Siga o perfil. Compartilhe, comente, salve.',
]

const leisText = [
  'Praticando as 7 Leis Espirituais. 7 princípios eternos que transformam sua vida por dentro e por fora.',
  '1ª Lei, Lei da Potencialidade Pura: tudo é energia em movimento. Reconhecer isso é acessar infinitas possibilidades.',
  '2ª Lei, Lei da Doação: dar de coração sem esperar nada em troca é o caminho para a verdadeira abundância.',
  '3ª Lei, Lei do Carma: cada ação gera uma reação. Escolhas conscientes criam um futuro mais leve e alinhado.',
  '4ª Lei, Lei do Mínimo Esforço: não é sobre fazer mais, é sobre estar alinhado.',
  '5ª Lei, Lei da Intenção e do Desejo: sua intenção direciona sua energia. Seu desejo revela o que sua alma busca.',
  '6ª Lei, Lei do Desapego: soltar é confiar. Quando você solta o que não é para você, o universo abre espaço para o que realmente é.',
  '7ª Lei, Lei da Permissão: permita-se receber o que a vida já está pronta para te dar.',
  'Praticando as 7 Leis Espirituais: 7 dias para alinhar sua vida com as leis que regem o universo. De 16/08 a 22/08, sempre às 12:30.',
]
const leisSizes = [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1086]

export const carousels: Carousel[] = [
  {
    id: 'carousel-cocriacao',
    title: 'O Segredo da Cocriação',
    slides: [cc01, cc02, cc03, cc04, cc05, cc06, cc07].map((src, i) => ({
      id: `carousel-cocriacao-${i + 1}`,
      src,
      width: 1024,
      height: 1280,
      title: 'O Segredo da Cocriação',
      alt: {
        en: `Carousel slide ${i + 1} of 7, sunset scene in violet tones, text in Portuguese: “${cocriacaoText[i]}”`,
        pt: `Slide ${i + 1} de 7 do carrossel, cena de pôr do sol em tons de violeta, com o texto: “${cocriacaoText[i]}”`,
      },
    })),
  },
  {
    id: 'carousel-7leis',
    title: 'Praticando as 7 Leis Espirituais',
    slides: [l01, l02, l03, l04, l05, l06, l07, l08, l09].map((src, i) => ({
      id: `carousel-7leis-${i + 1}`,
      src,
      width: leisSizes[i],
      height: leisSizes[i],
      title: 'Praticando as 7 Leis Espirituais',
      alt: {
        en: `Carousel slide ${i + 1} of 9, violet cosmic design featuring Eliane Xavier, text in Portuguese: “${leisText[i]}”`,
        pt: `Slide ${i + 1} de 9 do carrossel, arte em tons de violeta com Eliane Xavier, com o texto: “${leisText[i]}”`,
      },
    })),
  },
]

/** Short-form cuts published on Instagram. Linked out rather than embedded. */
export const reels = [
  { id: 'DfpOKA9P1ZZ', url: 'https://www.instagram.com/reel/DfpOKA9P1ZZ/' },
  { id: 'DflAInXRzL0', url: 'https://www.instagram.com/reel/DflAInXRzL0/' },
  { id: 'De7Hayuvms3', url: 'https://www.instagram.com/reel/De7Hayuvms3/' },
]
