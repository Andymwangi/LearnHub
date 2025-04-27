import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

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
    const adminPassword = await hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@learnhub.com",
        password: adminPassword,
        role: "ADMIN",
      }
    });

    // Create teacher users
    const teacherPassword = await hash('teacher123', 10);
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
      prisma.user.create({
        data: {
          name: "Ahmed Hassan",
          email: "ahmed@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "Mobile app developer specializing in React Native and Flutter frameworks.",
          avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        }
      }),
      prisma.user.create({
        data: {
          name: "Lisa Chen",
          email: "lisa@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "UI/UX designer with experience at top tech companies. Passionate about usable interfaces.",
          avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        }
      }),
      prisma.user.create({
        data: {
          name: "Michael Omondi",
          email: "michael@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "Business strategist and former startup founder with MBA from Harvard Business School.",
          avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        }
      }),
      prisma.user.create({
        data: {
          name: "Priya Patel",
          email: "priya@learnhub.com",
          password: teacherPassword,
          role: "TEACHER",
          bio: "Digital marketing specialist with focus on SEO, content strategy, and social media.",
          avatarUrl: "https://randomuser.me/api/portraits/women/6.jpg",
        }
      }),
    ]);

    console.log(`Created ${teachers.length} teachers`);

    // Create student users
    const studentPassword = await hash('student123', 10);
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

    // Create courses
    const courses = [
      // Web Development courses
      {
        title: "Modern Full-Stack Web Development Bootcamp",
        description: "A comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build and deploy real-world web applications from scratch. Perfect for beginners and intermediate developers looking to expand their skills.",
        imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
        price: 12999,
        categoryId: categories[0].id,
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to Web Development", isFree: true },
          { title: "HTML Fundamentals", isFree: true },
          { title: "CSS Styling and Layout", isFree: false },
          { title: "Responsive Design Principles", isFree: false },
          { title: "JavaScript Basics", isFree: false },
          { title: "DOM Manipulation", isFree: false },
          { title: "Asynchronous JavaScript", isFree: false },
          { title: "Introduction to React", isFree: false },
          { title: "React Hooks and State Management", isFree: false },
          { title: "Building a React Frontend Application", isFree: false },
          { title: "Node.js and Express Fundamentals", isFree: false },
          { title: "RESTful API Development", isFree: false },
          { title: "MongoDB Database Integration", isFree: false },
          { title: "Authentication and Authorization", isFree: false },
          { title: "Deployment and DevOps Basics", isFree: false },
          { title: "Final Project: Full-Stack Application", isFree: false },
        ]
      },
      {
        title: "Advanced JavaScript: Modern ES6+ Features",
        description: "Deep dive into modern JavaScript features introduced in ES6 and beyond. Master arrow functions, destructuring, async/await, modules, and more. This course will take your JavaScript skills to the next level.",
        imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
        price: 8999,
        categoryId: categories[0].id,
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to Modern JavaScript", isFree: true },
          { title: "Let, Const, and Block Scoping", isFree: true },
          { title: "Arrow Functions and Lexical This", isFree: false },
          { title: "Template Literals and String Methods", isFree: false },
          { title: "Destructuring Arrays and Objects", isFree: false },
          { title: "Spread and Rest Operators", isFree: false },
          { title: "Enhanced Object Literals", isFree: false },
          { title: "Maps and Sets", isFree: false },
          { title: "Symbols and Iterators", isFree: false },
          { title: "Promises and Async Programming", isFree: false },
          { title: "Async/Await Syntax", isFree: false },
          { title: "ES Modules and Import/Export", isFree: false },
          { title: "JavaScript Classes and Inheritance", isFree: false },
          { title: "Proxies and Reflection", isFree: false },
          { title: "Performance Optimization Techniques", isFree: false },
          { title: "Practical Project: Building a Modern JS App", isFree: false },
        ]
      },
      {
        title: "React and Next.js: Server-Side Rendering Mastery",
        description: "Learn to build high-performance web applications with React and Next.js. This course covers server-side rendering, static site generation, API routes, and deployment strategies for modern web applications.",
        imageUrl: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1",
        price: 9999,
        categoryId: categories[0].id,
        userId: teachers[0].id,
        chapters: [
          { title: "Introduction to React and Next.js", isFree: true },
          { title: "Setting Up a Next.js Project", isFree: true },
          { title: "Pages and Routing in Next.js", isFree: false },
          { title: "Data Fetching Methods", isFree: false },
          { title: "Server-Side Rendering (SSR)", isFree: false },
          { title: "Static Site Generation (SSG)", isFree: false },
          { title: "Incremental Static Regeneration", isFree: false },
          { title: "Dynamic Routes and Path Parameters", isFree: false },
          { title: "API Routes and Backend Functionality", isFree: false },
          { title: "Authentication in Next.js Applications", isFree: false },
          { title: "State Management with Context and SWR", isFree: false },
          { title: "Styling and UI Libraries", isFree: false },
          { title: "Performance Optimization", isFree: false },
          { title: "SEO and Meta Tags", isFree: false },
          { title: "Deployment Strategies", isFree: false },
          { title: "Final Project: E-commerce Application", isFree: false },
        ]
      },
      
      // Data Science courses
      {
        title: "Data Science and Machine Learning Bootcamp with Python",
        description: "A comprehensive course on data science, machine learning, and deep learning with Python. Learn NumPy, Pandas, Matplotlib, Scikit-Learn, TensorFlow, and more while working on real-world projects and datasets.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        price: 14999,
        categoryId: categories[1].id,
        userId: teachers[1].id,
        chapters: [
          { title: "Introduction to Data Science", isFree: true },
          { title: "Python Programming Fundamentals", isFree: true },
          { title: "NumPy for Numerical Computing", isFree: false },
          { title: "Data Analysis with Pandas", isFree: false },
          { title: "Data Visualization with Matplotlib and Seaborn", isFree: false },
          { title: "Statistical Analysis and Hypothesis Testing", isFree: false },
          { title: "Data Cleaning and Preprocessing", isFree: false },
          { title: "Exploratory Data Analysis Techniques", isFree: false },
          { title: "Introduction to Machine Learning", isFree: false },
          { title: "Supervised Learning: Regression Models", isFree: false },
          { title: "Supervised Learning: Classification Models", isFree: false },
          { title: "Unsupervised Learning: Clustering", isFree: false },
          { title: "Feature Engineering and Selection", isFree: false },
          { title: "Introduction to Deep Learning", isFree: false },
          { title: "Neural Networks with TensorFlow", isFree: false },
          { title: "Final Project: Predictive Modeling", isFree: false },
        ]
      },
      {
        title: "Deep Learning Specialization: Neural Networks and AI",
        description: "Master the fundamentals of deep learning and build your own neural networks. This course covers CNNs, RNNs, LSTM, transformers, and practical applications in computer vision and natural language processing.",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        price: 13999,
        categoryId: categories[1].id,
        userId: teachers[1].id,
        chapters: [
          { title: "Introduction to Neural Networks", isFree: true },
          { title: "Deep Learning Mathematics", isFree: true },
          { title: "Building Neural Networks from Scratch", isFree: false },
          { title: "TensorFlow and Keras Fundamentals", isFree: false },
          { title: "Training and Optimization Techniques", isFree: false },
          { title: "Convolutional Neural Networks (CNNs)", isFree: false },
          { title: "Computer Vision Applications", isFree: false },
          { title: "Transfer Learning and Fine-tuning", isFree: false },
          { title: "Recurrent Neural Networks (RNNs)", isFree: false },
          { title: "Long Short-Term Memory (LSTM) Networks", isFree: false },
          { title: "Natural Language Processing Fundamentals", isFree: false },
          { title: "Transformers and Attention Mechanisms", isFree: false },
          { title: "Generative Adversarial Networks (GANs)", isFree: false },
          { title: "Deep Reinforcement Learning", isFree: false },
          { title: "Deploying Deep Learning Models", isFree: false },
          { title: "Capstone Project: AI Application", isFree: false },
        ]
      },
      {
        title: "Data Analytics and Visualization for Business",
        description: "Learn how to analyze data and create compelling visualizations for business decision-making. This course focuses on practical skills with Excel, SQL, Tableau, and Power BI that you can immediately apply in your work.",
        imageUrl: "https://images.unsplash.com/photo-1535572290543-960a8046f5af",
        price: 8999,
        categoryId: categories[1].id,
        userId: teachers[1].id,
        chapters: [
          { title: "Introduction to Business Analytics", isFree: true },
          { title: "Data Collection and Preparation", isFree: true },
          { title: "Excel for Data Analysis", isFree: false },
          { title: "SQL for Data Querying", isFree: false },
          { title: "Database Design and Management", isFree: false },
          { title: "Introduction to Tableau", isFree: false },
          { title: "Creating Interactive Dashboards", isFree: false },
          { title: "Data Storytelling Techniques", isFree: false },
          { title: "Introduction to Power BI", isFree: false },
          { title: "Power BI DAX and Advanced Functions", isFree: false },
          { title: "Statistical Analysis for Business", isFree: false },
          { title: "Market Basket Analysis", isFree: false },
          { title: "Customer Segmentation", isFree: false },
          { title: "Sales Forecasting Methods", isFree: false },
          { title: "Presenting Data to Stakeholders", isFree: false },
          { title: "Capstone Project: Business Intelligence Dashboard", isFree: false },
        ]
      },
      
      // Mobile Development courses
      {
        title: "React Native: Build Mobile Apps for iOS and Android",
        description: "Learn to build native mobile applications for both iOS and Android using React Native. This course covers components, navigation, state management, API integration, and deployment to app stores.",
        imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6",
        price: 10999,
        categoryId: categories[2].id,
        userId: teachers[2].id,
        chapters: [
          { title: "Introduction to React Native", isFree: true },
          { title: "Setting Up Your Development Environment", isFree: true },
          { title: "React Native Components", isFree: false },
          { title: "Styling in React Native", isFree: false },
          { title: "Navigation and Routing", isFree: false },
          { title: "State Management with Context API", isFree: false },
          { title: "Using Redux in React Native", isFree: false },
          { title: "Working with APIs and Networking", isFree: false },
          { title: "Local Storage and Data Persistence", isFree: false },
          { title: "Camera and Image Handling", isFree: false },
          { title: "Geolocation and Maps", isFree: false },
          { title: "Push Notifications", isFree: false },
          { title: "Testing and Debugging", isFree: false },
          { title: "Performance Optimization", isFree: false },
          { title: "Publishing to App Stores", isFree: false },
          { title: "Capstone Project: Social Media App", isFree: false },
        ]
      },
      {
        title: "Flutter Development: Cross-Platform Mobile Apps",
        description: "Master Flutter and Dart to build beautiful, responsive, and high-performance mobile applications. Learn to create UI components, handle state, integrate APIs, and deploy to iOS and Android platforms.",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        price: 9999,
        categoryId: categories[2].id,
        userId: teachers[2].id,
        chapters: [
          { title: "Introduction to Flutter and Dart", isFree: true },
          { title: "Flutter Development Environment Setup", isFree: true },
          { title: "Dart Programming Language Basics", isFree: false },
          { title: "Flutter Widgets and Layout", isFree: false },
          { title: "Stateless and Stateful Widgets", isFree: false },
          { title: "Navigation and Routing in Flutter", isFree: false },
          { title: "State Management with Provider", isFree: false },
          { title: "HTTP and API Integration", isFree: false },
          { title: "Working with Firebase", isFree: false },
          { title: "Local Database with SQLite", isFree: false },
          { title: "UI Design and Animations", isFree: false },
          { title: "Authentication and User Management", isFree: false },
          { title: "Platform-Specific Code", isFree: false },
          { title: "Testing Flutter Applications", isFree: false },
          { title: "Deploying to App Stores", isFree: false },
          { title: "Final Project: E-commerce Mobile App", isFree: false },
        ]
      },
      
      // Business courses
      {
        title: "Entrepreneurship: Start and Grow Your Business",
        description: "Learn how to start and scale a successful business from idea to execution. This course covers business planning, market research, funding, legal considerations, marketing, and growth strategies for entrepreneurs.",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
        price: 7999,
        categoryId: categories[3].id,
        userId: teachers[4].id,
        chapters: [
          { title: "The Entrepreneurial Mindset", isFree: true },
          { title: "Finding and Validating Business Ideas", isFree: true },
          { title: "Market Research and Competitive Analysis", isFree: false },
          { title: "Business Model Development", isFree: false },
          { title: "Creating a Business Plan", isFree: false },
          { title: "Legal Structures and Considerations", isFree: false },
          { title: "Funding Your Business", isFree: false },
          { title: "Financial Planning and Management", isFree: false },
          { title: "Branding and Identity Development", isFree: false },
          { title: "Marketing Strategy for Startups", isFree: false },
          { title: "Sales Fundamentals for Entrepreneurs", isFree: false },
          { title: "Team Building and Management", isFree: false },
          { title: "Growth Hacking Techniques", isFree: false },
          { title: "Scaling Your Business", isFree: false },
          { title: "Crisis Management and Pivoting", isFree: false },
          { title: "Capstone: Comprehensive Business Launch Plan", isFree: false },
        ]
      },
      {
        title: "Project Management Professional (PMP) Certification",
        description: "Comprehensive preparation for the PMP certification exam. Learn project management methodologies, tools, and best practices while preparing for one of the most valuable certifications in business management.",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
        price: 11999,
        categoryId: categories[3].id,
        userId: teachers[4].id,
        chapters: [
          { title: "Introduction to Project Management", isFree: true },
          { title: "Project Management Framework", isFree: true },
          { title: "Project Integration Management", isFree: false },
          { title: "Project Scope Management", isFree: false },
          { title: "Project Schedule Management", isFree: false },
          { title: "Project Cost Management", isFree: false },
          { title: "Project Quality Management", isFree: false },
          { title: "Project Resource Management", isFree: false },
          { title: "Project Communications Management", isFree: false },
          { title: "Project Risk Management", isFree: false },
          { title: "Project Procurement Management", isFree: false },
          { title: "Project Stakeholder Management", isFree: false },
          { title: "Agile Project Management", isFree: false },
          { title: "PMP Exam Strategies", isFree: false },
          { title: "Practice Exams and Review", isFree: false },
          { title: "Final Preparation and Next Steps", isFree: false },
        ]
      },
      
      // Design courses
      {
        title: "UI/UX Design: Create User-Centered Digital Experiences",
        description: "Master the principles and practices of user interface and user experience design. Learn to create wireframes, prototypes, and high-fidelity designs using industry-standard tools like Figma and Adobe XD.",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
        price: 9499,
        categoryId: categories[4].id,
        userId: teachers[3].id,
        chapters: [
          { title: "Introduction to UI/UX Design", isFree: true },
          { title: "Design Thinking Process", isFree: true },
          { title: "User Research Methods", isFree: false },
          { title: "Creating User Personas", isFree: false },
          { title: "Information Architecture", isFree: false },
          { title: "Wireframing Fundamentals", isFree: false },
          { title: "Prototyping with Figma", isFree: false },
          { title: "Visual Design Principles", isFree: false },
          { title: "Typography in Digital Design", isFree: false },
          { title: "Color Theory and Application", isFree: false },
          { title: "Responsive Design Principles", isFree: false },
          { title: "Design Systems and Libraries", isFree: false },
          { title: "Usability Testing", isFree: false },
          { title: "Accessibility in Design", isFree: false },
          { title: "Handoff to Developers", isFree: false },
          { title: "Portfolio Project: End-to-End Design", isFree: false },
        ]
      },
      {
        title: "Graphic Design Masterclass",
        description: "Learn the fundamentals of graphic design from composition to typography. This course covers both theory and practical application using Adobe Creative Suite, including Photoshop, Illustrator, and InDesign.",
        imageUrl: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1",
        price: 8999,
        categoryId: categories[4].id,
        userId: teachers[3].id,
        chapters: [
          { title: "Introduction to Graphic Design", isFree: true },
          { title: "Design Elements and Principles", isFree: true },
          { title: "Typography Fundamentals", isFree: false },
          { title: "Color Theory and Psychology", isFree: false },
          { title: "Composition and Layout", isFree: false },
          { title: "Introduction to Adobe Photoshop", isFree: false },
          { title: "Photo Editing and Manipulation", isFree: false },
          { title: "Introduction to Adobe Illustrator", isFree: false },
          { title: "Vector Graphics and Illustration", isFree: false },
          { title: "Introduction to Adobe InDesign", isFree: false },
          { title: "Editorial and Publication Design", isFree: false },
          { title: "Logo Design and Brand Identity", isFree: false },
          { title: "Packaging Design", isFree: false },
          { title: "Print Production and Preparation", isFree: false },
          { title: "Digital Design for Social Media", isFree: false },
          { title: "Portfolio Development", isFree: false },
        ]
      },
      
      // Marketing courses
      {
        title: "Digital Marketing Strategy and Implementation",
        description: "A complete guide to digital marketing, covering SEO, content marketing, social media, email campaigns, PPC advertising, analytics, and creating an integrated marketing strategy that drives results.",
        imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
        price: 9999,
        categoryId: categories[5].id,
        userId: teachers[5].id,
        chapters: [
          { title: "Introduction to Digital Marketing", isFree: true },
          { title: "Building a Digital Marketing Strategy", isFree: true },
          { title: "SEO Fundamentals", isFree: false },
          { title: "On-Page and Off-Page SEO", isFree: false },
          { title: "Content Marketing Strategy", isFree: false },
          { title: "Content Creation and Distribution", isFree: false },
          { title: "Social Media Marketing Fundamentals", isFree: false },
          { title: "Platform-Specific Strategies", isFree: false },
          { title: "Email Marketing Campaigns", isFree: false },
          { title: "Pay-Per-Click Advertising", isFree: false },
          { title: "Google Ads and Facebook Ads", isFree: false },
          { title: "Analytics and Measurement", isFree: false },
          { title: "Conversion Rate Optimization", isFree: false },
          { title: "Marketing Automation", isFree: false },
          { title: "Integrated Marketing Campaigns", isFree: false },
          { title: "Final Project: Digital Marketing Plan", isFree: false },
        ]
      },
      {
        title: "Social Media Marketing Mastery",
        description: "Learn how to build and execute a social media strategy across all major platforms. This course covers content creation, community management, paid advertising, analytics, and measuring ROI on social media.",
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
        price: 7999,
        categoryId: categories[5].id,
        userId: teachers[5].id,
        chapters: [
          { title: "Introduction to Social Media Marketing", isFree: true },
          { title: "Social Media Strategy Development", isFree: true },
          { title: "Instagram Marketing", isFree: false },
          { title: "Facebook Marketing", isFree: false },
          { title: "Twitter Marketing", isFree: false },
          { title: "LinkedIn Marketing", isFree: false },
          { title: "TikTok Marketing", isFree: false },
          { title: "YouTube Marketing", isFree: false },
          { title: "Content Creation for Social Media", isFree: false },
          { title: "Visual Content and Design", isFree: false },
          { title: "Community Management", isFree: false },
          { title: "Influencer Marketing", isFree: false },
          { title: "Social Media Advertising", isFree: false },
          { title: "Analytics and Performance Tracking", isFree: false },
          { title: "Social Media Crisis Management", isFree: false },
          { title: "Capstone: Social Media Campaign", isFree: false },
        ]
      },
    ];

    // Create courses with chapters
    for (const courseData of courses) {
      const { chapters, ...courseInfo } = courseData;
      
      const course = await prisma.course.create({
        data: {
          ...courseInfo,
          isPublished: true,
        }
      });

      // Create chapters for each course
      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          await prisma.chapter.create({
            data: {
              title: chapters[i].title,
              description: `Description for ${chapters[i].title}`,
              position: i + 1,
              isPublished: true,
              isFree: chapters[i].isFree || false,
              courseId: course.id,
              videoUrl: i < 2 ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : null, // Sample video for first two chapters
            }
          });
        }
      }
    }

    console.log(`Created ${courses.length} courses with chapters`);

    // Create some initial purchases for students
    await prisma.purchase.create({
      data: {
        userId: students[0].id,
        courseId: courses[0].title === "Modern Full-Stack Web Development Bootcamp" 
          ? (await prisma.course.findFirst({ where: { title: courses[0].title } }))?.id || ""
          : (await prisma.course.findFirst({}))?.id || "",
      }
    });

    await prisma.purchase.create({
      data: {
        userId: students[1].id,
        courseId: courses[1].title === "Advanced JavaScript: Modern ES6+ Features"
          ? (await prisma.course.findFirst({ where: { title: courses[1].title } }))?.id || ""
          : (await prisma.course.findFirst({ skip: 1 }))?.id || "",
      }
    });

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 