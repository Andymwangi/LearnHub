const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This script updates course instructor information with Kenyan instructors
 * Run with: node scripts/update-instructors.js
 */

// Kenyan instructors for different course categories
const kenyanInstructors = {
  webDev: [
    { name: "John Kamau", bio: "Full-stack developer with 8+ years of experience building web applications for Kenyan startups.", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Faith Muthoni", bio: "Senior software engineer specializing in React and Next.js. Previously worked at Safaricom and Andela.", avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "David Ochieng", bio: "Web development consultant with expertise in e-commerce solutions for businesses across East Africa.", avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg" }
  ],
  dataScience: [
    { name: "Wambui Njoroge", bio: "Data scientist with a PhD from the University of Nairobi. Specializes in machine learning applications for agriculture.", avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg" },
    { name: "Samuel Maina", bio: "Former data analyst at MPESA and current AI researcher focusing on solutions for Kenyan businesses.", avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg" },
    { name: "Aisha Omar", bio: "Specialist in big data analytics with experience at Kenya's leading tech companies.", avatarUrl: "https://randomuser.me/api/portraits/women/6.jpg" }
  ],
  marketing: [
    { name: "Elizabeth Wangari", bio: "Digital marketing strategist who has helped over 50 Kenyan businesses establish their online presence.", avatarUrl: "https://randomuser.me/api/portraits/women/7.jpg" },
    { name: "James Mwangi", bio: "Social media expert and founder of Kenya's premier digital marketing agency.", avatarUrl: "https://randomuser.me/api/portraits/men/8.jpg" },
    { name: "Grace Kimani", bio: "Content marketing specialist with expertise in creating localized strategies for African markets.", avatarUrl: "https://randomuser.me/api/portraits/women/9.jpg" }
  ]
};

async function updateInstructors() {
  try {
    console.log('Starting instructor update process...');
    
    // Get all courses with their categories
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatarUrl: true,
          }
        }
      },
    });
    
    console.log(`Found ${courses.length} published courses to update.`);
    
    let updatedCount = 0;
    
    // Update each course's instructor with Kenyan instructors
    for (const course of courses) {
      // Determine appropriate instructor pool based on category
      const categoryName = course.category?.name?.toLowerCase() || '';
      let instructorPool = kenyanInstructors.webDev; // default
      
      if (categoryName.includes('data') || categoryName.includes('science')) {
        instructorPool = kenyanInstructors.dataScience;
      } else if (categoryName.includes('market')) {
        instructorPool = kenyanInstructors.marketing;
      }
      
      // Select random instructor from appropriate category
      const randomInstructor = instructorPool[Math.floor(Math.random() * instructorPool.length)];
      
      // Update the user associated with the course (the instructor)
      await prisma.user.update({
        where: { id: course.user.id },
        data: {
          name: randomInstructor.name,
          bio: randomInstructor.bio,
          avatarUrl: randomInstructor.avatarUrl,
        },
      });
      
      console.log(`Updated instructor for course "${course.title}" to ${randomInstructor.name}`);
      updatedCount++;
    }
    
    console.log(`Update complete. Updated ${updatedCount} courses with Kenyan instructors.`);
    
  } catch (error) {
    console.error('Error updating instructors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateInstructors(); 