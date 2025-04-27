const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Web Development",
          description: "Learn to build modern web applications",
        }
      }),
      prisma.category.create({
        data: {
          name: "Data Science",
          description: "Master data analysis and machine learning",
        }
      }),
      prisma.category.create({
        data: {
          name: "Mobile Development",
          description: "Create apps for iOS and Android",
        }
      }),
      prisma.category.create({
        data: {
          name: "Business",
          description: "Entrepreneurship and management skills",
        }
      }),
      prisma.category.create({
        data: {
          name: "Design",
          description: "UI/UX and graphic design principles",
        }
      }),
      prisma.category.create({
        data: {
          name: "Marketing",
          description: "Digital marketing and growth strategies",
        }
      }),
    ]);

    console.log(`Created ${categories.length} categories`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@learnhub.com",
        password: adminPassword,
        role: "ADMIN",
      }
    });

    // Create teacher users
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teachers = await Promise.all([
      prisma.user.create({
        data: {
          name: "John Smith",
          email: "john@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "Full-stack developer with 10+ years of experience in web technologies and education.",
          avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        }
      }),
      prisma.user.create({
        data: {
          name: "Sarah Johnson",
          email: "sarah@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "Data scientist and ML expert with a PhD in Computer Science from Stanford.",
          avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        }
      }),
    ]);

    console.log(`Created ${teachers.length} teachers`);

    // Create student users
    const studentPassword = await bcrypt.hash('student123', 10);
    const students = await Promise.all([
      prisma.user.create({
        data: {
          name: "Student One",
          email: "student1@example.com",
          password: studentPassword,
          role: "STUDENT",
        }
      }),
      prisma.user.create({
        data: {
          name: "Student Two",
          email: "student2@example.com",
          password: studentPassword,
          role: "STUDENT",
        }
      }),
    ]);

    console.log(`Created ${students.length} students`);

    // Create some basic courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: "Web Development Basics",
          description: "Learn the fundamentals of web development",
          price: 9999,
          imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
          isPublished: true,
          categoryId: categories[0].id,
          userId: teachers[0].id,
          chapters: {
            create: [
              {
                title: "Introduction to HTML",
                description: "Learn the basics of HTML",
                position: 1,
                isPublished: true,
                isFree: true,
              },
              {
                title: "CSS Fundamentals",
                description: "Style your web pages with CSS",
                position: 2,
                isPublished: true,
                isFree: false,
              }
            ]
          }
        }
      }),
      prisma.course.create({
        data: {
          title: "Data Science Fundamentals",
          description: "Introduction to data analysis and visualization",
          price: 12999,
          imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
          isPublished: true,
          categoryId: categories[1].id,
          userId: teachers[1].id,
          chapters: {
            create: [
              {
                title: "Introduction to Python",
                description: "Learn the basics of Python for data science",
                position: 1,
                isPublished: true,
                isFree: true,
              },
              {
                title: "Data Visualization",
                description: "Create insightful visualizations with matplotlib and seaborn",
                position: 2,
                isPublished: true,
                isFree: false,
              }
            ]
          }
        }
      })
    ]);

    console.log(`Created ${courses.length} courses`);
    console.log("Database has been seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 