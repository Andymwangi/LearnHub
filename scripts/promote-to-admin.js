// This script promotes an existing user to ADMIN role
// Usage: node scripts/promote-to-admin.js <email>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteToAdmin(email) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    // Update the user's role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`User ${email} has been promoted to ADMIN role`);
    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node scripts/promote-to-admin.js <email>');
  process.exit(1);
}

promoteToAdmin(email); 