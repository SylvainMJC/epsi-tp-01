import { Book } from '../models/book.model';

export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'Un pilote d\'avion, échoué dans le désert du Sahara, rencontre un petit garçon venu des étoiles.',
    category: 'Roman',
    rating: 4,
    isFavorite: true
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    description: 'Une dystopie qui décrit un futur où la société est soumise à une dictature totalitaire.',
    category: 'Science-Fiction',
    rating: 5,
    isFavorite: false
  },
  {
    id: '3',
    title: 'harry potter à l\'école des sorciers',
    author: 'J.K. Rowling',
    description: 'Le premier tome de la série Harry Potter qui raconte les aventures d\'un jeune sorcier.',
    category: 'Fantasy',
    rating: 4,
    isFavorite: true
  },
  {
    id: '4',
    title: 'les misérables',
    author: 'Victor Hugo',
    description: 'Un roman qui suit la vie et les luttes de l\'ex-bagnard Jean Valjean.',
    category: 'Roman',
    rating: 3,
    isFavorite: false
  },
  {
    id: '5',
    title: 'L\'Étranger',
    author: 'Albert Camus',
    description: 'Un homme qui assiste à l\'enterrement de sa mère sans manifester de tristesse et qui, quelques jours plus tard, tue un Arabe.',
    category: 'Roman',
    rating: 4,
    isFavorite: false
  },
  {
    id: '6',
    title: 'le seigneur des anneaux',
    author: 'J.R.R. Tolkien',
    description: 'Un livre qui raconte les aventures d\'un jeune homme qui doit détruire un anneau maudit.',
    category: 'Fantasy',
    rating: 5,
    isFavorite: true
  },
  {
    id: '7',
    title: 'MOBY DICK',
    author: 'Herman Melville',
    description: 'Un livre qui raconte les aventures d\'un capitaine de bateau qui doit détruire un baleine.',
    category: 'Roman',
    rating: 5,
    isFavorite: true
  },
  {
    id: '8',
    title: 'Le comte de monte-cristo',
    author: 'Alexandre Dumas',
    description: 'Un livre qui raconte les aventures d\'un homme qui doit détruire un comte.',
    category: 'Roman',
    rating: 5,
    isFavorite: true
  },
  {
    id: '9',
    title: 'le parfum',
    author: 'Patrick Süskind',
    description: 'Un livre qui raconte les aventures d\'un parfumeur qui doit détruire un parfum.',
    category: 'Roman',
    rating: 5,
    isFavorite: true
  },
  {
    id: '10',
    title: 'titanic',
    author: 'James Cameron',
    description: 'Un livre qui raconte les aventures d\'un bateau qui coule.',
    category: 'Science-Fiction',
    rating: 5,
    isFavorite: true
  }
];
