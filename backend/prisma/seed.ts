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

  console.log('Categories seeded successfully.');

  // Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bookly.com' },
    update: {},
    create: {
      email: 'admin@bookly.com',
      password: 'hashed_admin_password_placeholder',
      name: 'BOOKLY Admin',
      role: Role.ADMIN,
      phone: '+91 9876543210',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'rushit@bookly.com' },
    update: {},
    create: {
      email: 'rushit@bookly.com',
      password: 'hashed_customer_password_placeholder',
      name: 'Rushit Gondaliya',
      role: Role.CUSTOMER,
      phone: '+91 9123456789',
    },
  });

  console.log('Users seeded successfully.');

  // Create Books
  const book1 = await prisma.book.upsert({
    where: { isbn: '978-0132350884' },
    update: {},
    create: {
      title: 'Clean Code',
      subtitle: 'A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
      price: 699.0,
      discount: 10.0,
      stock: 50,
      categoryId: csCategory.id,
      rating: 4.8,
      numReviews: 125,
    },
  });

  const book2 = await prisma.book.upsert({
    where: { isbn: '978-0307474278' },
    update: {},
    create: {
      title: 'The Alchemist',
      subtitle: 'A Fable About Following Your Dream',
      author: 'Paulo Coelho',
      isbn: '978-0307474278',
      publisher: 'HarperOne',
      description: 'Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery.',
      price: 299.0,
      discount: 15.0,
      stock: 100,
      categoryId: fictionCategory.id,
      rating: 4.9,
      numReviews: 320,
    },
  });

  const book3 = await prisma.book.upsert({
    where: { isbn: '978-0735211292' },
    update: {},
    create: {
      title: 'Atomic Habits',
      subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      author: 'James Clear',
      isbn: '978-0735211292',
      publisher: 'Avery',
      description: 'Tiny Changes, Remarkable Results. No matter your goals, Atomic Habits offers a proven framework for improving every day.',
      price: 499.0,
      discount: 20.0,
      stock: 75,
      categoryId: selfHelpCategory.id,
      rating: 4.9,
      numReviews: 450,
    },
  });

  console.log('Books seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
