const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get existing categories and teachers
    const categories = await prisma.category.findMany();
    const teachers = await prisma.user.findMany({
      where: {
        role: 'TEACHER'
      }
    });

    // Make sure we have teachers and categories
    if (categories.length === 0 || teachers.length === 0) {
      console.log('Please seed the database with basic data first');
      return;
    }

    // Get category IDs by name for easier reference
    const categoryMap = categories.reduce((map, category) => {
      map[category.name] = category.id;
      return map;
    }, {});

    // Create additional courses
    const additionalCourses = [
      // More Web Development courses
      {
        title: "React and Next.js Masterclass",
        description: "Build modern, server-rendered React applications with Next.js. Learn SSR, static generation, API routes, and more.",
        price: 14999,
        imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
        categoryId: categoryMap["Web Development"],
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to React", description: "Learn the basics of React", position: 1, isFree: true },
          { title: "Components and Props", description: "Understanding component architecture", position: 2, isFree: false },
          { title: "State and Lifecycle", description: "Managing state in React components", position: 3, isFree: false },
          { title: "Introduction to Next.js", description: "Next.js fundamentals", position: 4, isFree: false },
          { title: "Server-Side Rendering", description: "Implementing SSR with Next.js", position: 5, isFree: false }
        ]
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable backend services with Node.js. Learn Express, MongoDB, authentication, and RESTful API development.",
        price: 12999,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
        categoryId: categoryMap["Web Development"],
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to Node.js", description: "Node.js basics and runtime", position: 1, isFree: true },
          { title: "Express Framework", description: "Building web applications with Express", position: 2, isFree: false },
          { title: "REST API Design", description: "Best practices for RESTful APIs", position: 3, isFree: false },
          { title: "MongoDB Integration", description: "Working with MongoDB and Mongoose", position: 4, isFree: false },
          { title: "Authentication and Authorization", description: "Implementing secure user authentication", position: 5, isFree: false }
        ]
      },

      // More Data Science courses
      {
        title: "Machine Learning Fundamentals",
        description: "Introduction to machine learning algorithms and techniques. Learn supervised and unsupervised learning with Python.",
        price: 15999,
        imageUrl: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
        categoryId: categoryMap["Data Science"],
        userId: teachers[1].id,
        chapters: [
          { title: "Introduction to Machine Learning", description: "Core concepts and applications", position: 1, isFree: true },
          { title: "Supervised Learning", description: "Classification and regression algorithms", position: 2, isFree: false },
          { title: "Unsupervised Learning", description: "Clustering and dimensionality reduction", position: 3, isFree: false },
          { title: "Model Evaluation", description: "Metrics and validation techniques", position: 4, isFree: false },
          { title: "Machine Learning in Production", description: "Deploying ML models", position: 5, isFree: false }
        ]
      },
      {
        title: "Deep Learning with TensorFlow",
        description: "Master neural networks and deep learning with TensorFlow and Keras. Build image classifiers, NLP models, and more.",
        price: 16999,
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
        categoryId: categoryMap["Data Science"],
        userId: teachers[1].id,
        chapters: [
          { title: "Neural Networks Fundamentals", description: "Understanding neural networks", position: 1, isFree: true },
          { title: "TensorFlow Basics", description: "Getting started with TensorFlow", position: 2, isFree: false },
          { title: "Convolutional Neural Networks", description: "CNN for image processing", position: 3, isFree: false },
          { title: "Recurrent Neural Networks", description: "RNN for sequence data", position: 4, isFree: false },
          { title: "Generative Adversarial Networks", description: "Introduction to GANs", position: 5, isFree: false }
        ]
      },

      // Mobile Development courses 
      {
        title: "Flutter App Development",
        description: "Build beautiful cross-platform apps for iOS and Android with Flutter. Master Dart programming and Flutter widgets.",
        price: 13999,
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
        categoryId: categoryMap["Mobile Development"],
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to Flutter", description: "Flutter framework overview", position: 1, isFree: true },
          { title: "Dart Programming", description: "Dart language essentials", position: 2, isFree: false },
          { title: "Flutter Widgets", description: "Building UIs with widgets", position: 3, isFree: false },
          { title: "State Management", description: "Managing state in Flutter apps", position: 4, isFree: false },
          { title: "Building a Complete App", description: "From design to deployment", position: 5, isFree: false }
        ]
      },
      {
        title: "React Native from Zero to Hero",
        description: "Learn to build native mobile apps using JavaScript and React Native. Deploy to both iOS and Android platforms.",
        price: 14999,
        imageUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b",
        categoryId: categoryMap["Mobile Development"],
        userId: teachers[0].id,
        chapters: [
          { title: "React Native Basics", description: "Getting started with React Native", position: 1, isFree: true },
          { title: "Components and Navigation", description: "Building and navigating between screens", position: 2, isFree: false },
          { title: "Styling and UI", description: "Creating beautiful interfaces", position: 3, isFree: false },
          { title: "Native Modules", description: "Accessing device features", position: 4, isFree: false },
          { title: "Deploying to App Stores", description: "Publishing your app", position: 5, isFree: false }
        ]
      },

      // Business courses
      {
        title: "Startup Business Fundamentals",
        description: "Learn how to validate your business idea, create a business plan, and launch your startup successfully.",
        price: 9999,
        imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d",
        categoryId: categoryMap["Business"],
        userId: teachers[1].id,
        chapters: [
          { title: "Idea Validation", description: "Testing your business concept", position: 1, isFree: true },
          { title: "Business Planning", description: "Creating an effective business plan", position: 2, isFree: false },
          { title: "Funding Strategies", description: "Raising capital for your startup", position: 3, isFree: false },
          { title: "Legal Foundations", description: "Legal aspects of starting a business", position: 4, isFree: false },
          { title: "Growth and Scaling", description: "Strategies for business growth", position: 5, isFree: false }
        ]
      },
      {
        title: "Digital Marketing for Entrepreneurs",
        description: "Master digital marketing strategies to grow your business online. Learn SEO, content marketing, and social media.",
        price: 11999,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        categoryId: categoryMap["Business"],
        userId: teachers[1].id,
        chapters: [
          { title: "Digital Marketing Fundamentals", description: "Core concepts and strategy", position: 1, isFree: true },
          { title: "SEO Essentials", description: "Search engine optimization basics", position: 2, isFree: false },
          { title: "Content Marketing", description: "Creating valuable content", position: 3, isFree: false },
          { title: "Social Media Strategy", description: "Building a social presence", position: 4, isFree: false },
          { title: "Analytics and Optimization", description: "Measuring and improving results", position: 5, isFree: false }
        ]
      },

      // Design courses
      {
        title: "UI/UX Design Principles",
        description: "Master the fundamentals of user interface and user experience design. Create intuitive, beautiful digital experiences.",
        price: 12999,
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
        categoryId: categoryMap["Design"],
        userId: teachers[0].id,
        chapters: [
          { title: "Design Thinking", description: "User-centered design approach", position: 1, isFree: true },
          { title: "UI Design Fundamentals", description: "Visual design principles", position: 2, isFree: false },
          { title: "UX Research Methods", description: "Understanding user needs", position: 3, isFree: false },
          { title: "Wireframing and Prototyping", description: "Creating interactive prototypes", position: 4, isFree: false },
          { title: "Design Systems", description: "Building scalable design systems", position: 5, isFree: false }
        ]
      },
      {
        title: "Adobe Creative Suite Masterclass",
        description: "Comprehensive guide to Photoshop, Illustrator, and Adobe XD. Create stunning graphics and design assets.",
        price: 13999,
        imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766",
        categoryId: categoryMap["Design"],
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to Adobe Suite", description: "Overview of Adobe design tools", position: 1, isFree: true },
          { title: "Photoshop Essentials", description: "Image editing techniques", position: 2, isFree: false },
          { title: "Illustrator Vector Graphics", description: "Creating scalable vector art", position: 3, isFree: false },
          { title: "Adobe XD for UI Design", description: "Designing user interfaces", position: 4, isFree: false },
          { title: "Design Projects", description: "Applying skills to real projects", position: 5, isFree: false }
        ]
      },

      // Marketing courses
      {
        title: "Social Media Marketing Strategy",
        description: "Develop effective social media marketing campaigns. Learn content creation, scheduling, and analytics.",
        price: 10999,
        imageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf",
        categoryId: categoryMap["Marketing"],
        userId: teachers[1].id,
        chapters: [
          { title: "Social Media Fundamentals", description: "Platform overview and strategy", position: 1, isFree: true },
          { title: "Content Creation", description: "Creating engaging content", position: 2, isFree: false },
          { title: "Community Management", description: "Building and engaging your audience", position: 3, isFree: false },
          { title: "Paid Social Campaigns", description: "Advertising on social platforms", position: 4, isFree: false },
          { title: "Analytics and Optimization", description: "Measuring campaign performance", position: 5, isFree: false }
        ]
      },
      {
        title: "Email Marketing Mastery",
        description: "Learn to build effective email marketing campaigns. Master list building, automation, and conversion optimization.",
        price: 9999,
        imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f",
        categoryId: categoryMap["Marketing"],
        userId: teachers[1].id,
        chapters: [
          { title: "Email Marketing Fundamentals", description: "Core concepts and strategy", position: 1, isFree: true },
          { title: "List Building Techniques", description: "Growing your email list", position: 2, isFree: false },
          { title: "Email Copywriting", description: "Writing compelling emails", position: 3, isFree: false },
          { title: "Automation Sequences", description: "Setting up effective automations", position: 4, isFree: false },
          { title: "Testing and Optimization", description: "Improving open and conversion rates", position: 5, isFree: false }
        ]
      }
    ];

    // Create the courses
    for (const courseData of additionalCourses) {
      const { chapters, ...courseInfo } = courseData;
      
      await prisma.course.create({
        data: {
          ...courseInfo,
          isPublished: true,
          chapters: {
            create: chapters.map((chapter, index) => ({
              ...chapter,
              isPublished: true,
            }))
          }
        }
      });
    }

    console.log(`Added ${additionalCourses.length} more courses to the platform`);

  } catch (error) {
    console.error("Error adding more courses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 