export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  price: number;
  rent: number;
  donor: {
    id: string;
    name: string;
    avatarImageId: string;
  };
  imageIds: string[];
};

export const books: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything differently, if you had the chance to undo your regrets?',
    category: 'Fiction',
    condition: 'Like New',
    price: 15.99,
    rent: 3.99,
    donor: { id: 'user1', name: 'Jane Doe', avatarImageId: 'donor1' },
    imageIds: ['book1'],
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    category: 'Non-Fiction',
    condition: 'Good',
    price: 12.50,
    rent: 2.99,
    donor: { id: 'user2', name: 'John Smith', avatarImageId: 'donor2' },
    imageIds: ['book2'],
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'Professor Yuval Noah Harari\'s book has become a global phenomenon, with more than 12 million copies sold. It explores how Homo sapiens came to rule the world, and what the future may hold for our species.',
    category: 'Science',
    condition: 'Good',
    price: 18.00,
    rent: 4.50,
    donor: { id: 'user3', name: 'Emily White', avatarImageId: 'donor3' },
    imageIds: ['book3'],
  },
  {
    id: '4',
    title: 'Educated: A Memoir',
    author: 'Tara Westover',
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    category: 'Biography',
    condition: 'New',
    price: 20.00,
    rent: 5.00,
    donor: { id: 'user1', name: 'Jane Doe', avatarImageId: 'donor1' },
    imageIds: ['book4'],
  },
  {
    id: '5',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    description: 'A heartbreaking coming-of-age story and a surprising tale of possible murder. Owens reminds us that we are forever shaped by the children we once were, and that we are all subject to the beautiful and violent secrets that nature keeps.',
    category: 'Fiction',
    condition: 'Fair',
    price: 8.99,
    rent: 1.99,
    donor: { id: 'user2', name: 'John Smith', avatarImageId: 'donor2' },
    imageIds: ['book5'],
  },
  {
    id: '6',
    title: 'The Very Hungry Caterpillar',
    author: 'Eric Carle',
    description: 'The classic story of a voracious caterpillar who eats his way through a wide variety of foodstuffs before pupating and emerging as a butterfly.',
    category: 'Kids',
    condition: 'Good',
    price: 5.00,
    rent: 0.99,
    donor: { id: 'user3', name: 'Emily White', avatarImageId: 'donor3' },
    imageIds: ['book6'],
  },
  {
    id: '7',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.',
    category: 'Science',
    condition: 'Like New',
    price: 17.50,
    rent: 4.00,
    donor: { id: 'user1', name: 'Jane Doe', avatarImageId: 'donor1' },
    imageIds: ['book7'],
  },
  {
    id: '8',
    title: 'Becoming',
    author: 'Michelle Obama',
    description: 'In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her.',
    category: 'Biography',
    condition: 'New',
    price: 22.00,
    rent: 5.50,
    donor: { id: 'user2', name: 'John Smith', avatarImageId: 'donor2' },
    imageIds: ['book8'],
  },
    {
    id: '9',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    category: 'Fiction',
    condition: 'Good',
    price: 14.99,
    rent: 3.49,
    donor: { id: 'user3', name: 'Emily White', avatarImageId: 'donor3' },
    imageIds: ['book9'],
  },
  {
    id: '10',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    category: 'Non-Fiction',
    condition: 'Like New',
    price: 16.00,
    rent: 3.50,
    donor: { id: 'user1', name: 'Jane Doe', avatarImageId: 'donor1' },
    imageIds: ['book10'],
  }
];
