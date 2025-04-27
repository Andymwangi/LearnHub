// Script to check database content
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log('Categories count:', categories.length);
    
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    
    const courses = await prisma.course.findMany();
    console.log('Courses count:', courses.length);
    
    if (categories.length === 0 && users.length === 0 && courses.length === 0) {
      console.log('No data found in the database. Seeding may not have been successful.');
    } else {
      console.log('Database has been seeded successfully!');
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 