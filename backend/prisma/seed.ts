import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BOOKLY database...');

  // Create Categories
  const csCategory = await prisma.category.upsert({
    where: { slug: 'computer-science' },
    update: {},
    create: {
      name: 'Computer Science',
      slug: 'computer-science',
      description: 'Software engineering, algorithms, web development, and AI.',
    },
  });

  const fictionCategory = await prisma.category.upsert({
    where: { slug: 'fiction' },
    update: {},
    create: {
      name: 'Fiction',
      slug: 'fiction',
      description: 'Popular novels, literature, and fiction stories.',
    },
  });

  const selfHelpCategory = await prisma.category.upsert({
    where: { slug: 'self-help' },
    update: {},
    create: {
      name: 'Self-Help',
      slug: 'self-help',
      description: 'Personal development, productivity, and mindset.',
    },
  });

  const businessCategory = await prisma.category.upsert({
    where: { slug: 'business-finance' },
    update: {},
    create: {
      name: 'Business & Finance',
      slug: 'business-finance',
      description: 'Entrepreneurship, investment strategies, leadership, and economics.',
    },
  });

  const scienceCategory = await prisma.category.upsert({
    where: { slug: 'science-nature' },
    update: {},
    create: {
      name: 'Science & Nature',
      slug: 'science-nature',
      description: 'Physics, astronomy, biology, history of the universe, and discovery.',
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design-ui-ux' },
    update: {},
    create: {
      name: 'Design & UI/UX',
      slug: 'design-ui-ux',
      description: 'Visual aesthetics, typography, design systems, and digital product creation.',
    },
  });

  console.log('Categories seeded successfully.');

  // Create Users
  await prisma.user.upsert({
    where: { email: 'admin@bookly.com' },
    update: {},
    create: {
      email: 'admin@bookly.com',
      password: '$2a$10$wK5Ww2JqKqI1Ua3yqI1Uau0vF7K4sXf8jJk1pA1y2Z3X4w5v6u7t8', // admin123
      name: 'BOOKLY Admin',
      role: Role.ADMIN,
      phone: '+91 9876543210',
    },
  });

  await prisma.user.upsert({
    where: { email: 'rushit@bookly.com' },
    update: {},
    create: {
      email: 'rushit@bookly.com',
      password: '$2a$10$wK5Ww2JqKqI1Ua3yqI1Uau0vF7K4sXf8jJk1pA1y2Z3X4w5v6u7t8', // customer123
      name: 'Rushit Gondaliya',
      role: Role.CUSTOMER,
      phone: '+91 9123456789',
    },
  });

  console.log('Users seeded successfully.');

  const booksToSeed = [
    {
      title: 'Clean Code',
      subtitle: 'A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publisher: 'Prentice Hall',
      description: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees.',
      price: 699.0,
      discount: 15.0,
      stock: 45,
      categoryId: csCategory.id,
      rating: 4.8,
      numReviews: 342,
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Designing Data-Intensive Applications',
      subtitle: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
      author: 'Martin Kleppmann',
      isbn: '9781449373320',
      publisher: "O'Reilly Media",
      description: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out.',
      price: 1250.0,
      discount: 10.0,
      stock: 28,
      categoryId: csCategory.id,
      rating: 4.9,
      numReviews: 512,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'The Pragmatic Programmer',
      subtitle: '20th Anniversary Edition — Your Journey to Mastery',
      author: 'David Thomas, Andrew Hunt',
      isbn: '9780135957059',
      publisher: 'Addison-Wesley Professional',
      description: 'One of those rare tech books you will read, re-read, and read to your team over the years.',
      price: 899.0,
      discount: 20.0,
      stock: 35,
      categoryId: csCategory.id,
      rating: 4.9,
      numReviews: 280,
      coverImage: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Atomic Habits',
      subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      author: 'James Clear',
      isbn: '9780735211292',
      publisher: 'Avery',
      description: 'Tiny Changes, Remarkable Results. No matter your goals, Atomic Habits offers a proven framework for improving every day.',
      price: 499.0,
      discount: 25.0,
      stock: 120,
      categoryId: selfHelpCategory.id,
      rating: 4.9,
      numReviews: 1420,
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'The Psychology of Money',
      subtitle: 'Timeless lessons on wealth, greed, and happiness',
      author: 'Morgan Housel',
      isbn: '9780857197689',
      publisher: 'Harriman House',
      description: 'Doing well with money is not necessarily about what you know. It is about how you behave.',
      price: 399.0,
      discount: 15.0,
      stock: 80,
      categoryId: businessCategory.id,
      rating: 4.8,
      numReviews: 890,
      coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'The Alchemist',
      subtitle: 'A Fable About Following Your Dream',
      author: 'Paulo Coelho',
      isbn: '9780062315007',
      publisher: 'HarperOne',
      description: 'Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery.',
      price: 299.0,
      discount: 10.0,
      stock: 65,
      categoryId: fictionCategory.id,
      rating: 4.7,
      numReviews: 950,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Refactoring',
      subtitle: 'Improving the Design of Existing Code',
      author: 'Martin Fowler',
      isbn: '9780134757599',
      publisher: 'Addison-Wesley',
      description: 'Improving the design of existing code and enhancing maintainability.',
      price: 1199.0,
      discount: 12.0,
      stock: 22,
      categoryId: csCategory.id,
      rating: 4.7,
      numReviews: 185,
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Thinking, Fast and Slow',
      subtitle: 'Nobel Laureate in Economics',
      author: 'Daniel Kahneman',
      isbn: '9780374533557',
      publisher: 'Farrar, Straus and Giroux',
      description: 'A groundbreaking tour of the mind explaining the two systems that drive the way we think.',
      price: 549.0,
      discount: 18.0,
      stock: 40,
      categoryId: selfHelpCategory.id,
      rating: 4.6,
      numReviews: 760,
      coverImage: 'https://images.unsplash.com/photo-1507842229443-5a0a4c21966c?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: "Don't Make Me Think",
      subtitle: 'A Common Sense Approach to Web Usability',
      author: 'Steve Krug',
      isbn: '9780321965516',
      publisher: 'New Riders',
      description: 'The principles of intuitive navigation and information design.',
      price: 649.0,
      discount: 10.0,
      stock: 18,
      categoryId: designCategory.id,
      rating: 4.8,
      numReviews: 410,
      coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Cosmos',
      subtitle: 'The Story of Cosmic Evolution, Science and Civilisation',
      author: 'Carl Sagan',
      isbn: '9780345331359',
      publisher: 'Ballantine Books',
      description: 'Sagan reveals a jewel-like blue world inhabited by a life form beginning to discover its identity.',
      price: 499.0,
      discount: 15.0,
      stock: 30,
      categoryId: scienceCategory.id,
      rating: 4.9,
      numReviews: 620,
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Zero to One',
      subtitle: 'Notes on Startups, or How to Build the Future',
      author: 'Peter Thiel',
      isbn: '9780804139298',
      publisher: 'Crown Business',
      description: 'How to find singular ways to create new things and build monopolies of value.',
      price: 450.0,
      discount: 20.0,
      stock: 55,
      categoryId: businessCategory.id,
      rating: 4.7,
      numReviews: 430,
      coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: '1984',
      subtitle: 'A Dystopian Masterpiece',
      author: 'George Orwell',
      isbn: '9780451524935',
      publisher: 'Signet Classic',
      description: 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth.',
      price: 249.0,
      discount: 0.0,
      stock: 90,
      categoryId: fictionCategory.id,
      rating: 4.8,
      numReviews: 1850,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
    },
  ];

  for (const b of booksToSeed) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {
        coverImage: b.coverImage,
        price: b.price,
        discount: b.discount,
        stock: b.stock,
      },
      create: b,
    });
  }

  console.log(`Seeded ${booksToSeed.length} books successfully.`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
