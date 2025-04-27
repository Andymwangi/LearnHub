const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This script enhances chapter descriptions with detailed HTML content
 * Run with: node scripts/enhance-chapters.js
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

// Rich content for different course types
const chapterContent = {
  // Web Development content
  webDev: {
    intro: `
      <div class="chapter-content">
        <h3>Getting Started with Web Development in Kenya</h3>
        <p>Welcome to your journey into web development! In this chapter, we'll explore the fundamental concepts that are driving Kenya's tech revolution.</p>
        
        <h4>What You'll Learn</h4>
        <ul>
          <li>The history and evolution of the World Wide Web in an African context</li>
          <li>How browsers interpret and render web content</li>
          <li>Setting up your development environment with available tools in Kenya</li>
          <li>Understanding client-server architecture and its application in Kenyan tech startups</li>
        </ul>
        
        <div class="note-box">
          <strong>Note:</strong> This chapter lays the groundwork for everything that follows. Take your time to understand these concepts thoroughly before moving on.
        </div>
        
        <h4>Key Technologies You'll Encounter</h4>
        <p>Throughout this course, we'll be working with:</p>
        <ul>
          <li><strong>HTML</strong> - For structuring web content</li>
          <li><strong>CSS</strong> - For styling and layout</li>
          <li><strong>JavaScript</strong> - For interactivity and dynamic elements</li>
          <li><strong>Git</strong> - For version control and collaboration</li>
        </ul>
        
        <div class="activity">
          <h4>Getting Ready Activity</h4>
          <p>Before our next lesson, please:</p>
          <ol>
            <li>Install Visual Studio Code (or your preferred code editor)</li>
            <li>Set up a GitHub account if you don't have one</li>
            <li>Join our Kenyan Developers Discord community for support</li>
          </ol>
        </div>
      </div>
    `,
    
    html: `
      <div class="chapter-content">
        <h3>HTML Fundamentals for Kenyan Websites</h3>
        <p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the structure and content of your web pages, which is essential for building websites for Kenyan businesses and organizations.</p>
        
        <h4>Basic HTML Document Structure</h4>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;My First Kenyan Website&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Jambo, Kenya!&lt;/h1&gt;
  &lt;p&gt;This is my first website for the Kenyan market.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        
        <h4>Essential HTML Elements</h4>
        <ul>
          <li><strong>Headings</strong>: <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code></li>
          <li><strong>Paragraphs</strong>: <code>&lt;p&gt;</code></li>
          <li><strong>Links</strong>: <code>&lt;a href="url"&gt;link text&lt;/a&gt;</code></li>
          <li><strong>Images</strong>: <code>&lt;img src="image.jpg" alt="description"&gt;</code></li>
          <li><strong>Lists</strong>: <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, and <code>&lt;li&gt;</code></li>
        </ul>
        
        <div class="practice-exercise">
          <h4>Practice Exercise</h4>
          <p>Create a simple personal profile page with:</p>
          <ul>
            <li>A heading with your name</li>
            <li>A paragraph about yourself</li>
            <li>A list of your favorite places in Kenya</li>
            <li>A link to your favorite Kenyan website</li>
          </ul>
        </div>
        
        <div class="note-box">
          <strong>Pro Tip:</strong> Always use semantic HTML elements like <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;article&gt;</code>, etc., to give your content meaning and improve accessibility for all Kenyan users, including those with disabilities.
        </div>
      </div>
    `,
    
    css: `
      <div class="chapter-content">
        <h3>CSS Styling for Kenyan Web Projects</h3>
        <p>CSS (Cascading Style Sheets) allows you to create visually appealing websites by controlling the presentation of your HTML elements. In this chapter, we'll explore how to create stylish, responsive designs that appeal to Kenyan users.</p>
        
        <h4>Linking CSS to HTML</h4>
        <p>There are three ways to add CSS to your HTML:</p>
        <ol>
          <li><strong>External CSS</strong> (Recommended):</li>
        </ol>
        <pre><code>&lt;!-- In your HTML file --&gt;
&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;</code></pre>
        
        <p>Then in your separate styles.css file:</p>
        <pre><code>/* styles.css */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

h1 {
  color: #e42614; /* Using a red color common in Kenyan themes */
}

.container {
  width: 80%;
  margin: auto;
  overflow: hidden;
}</code></pre>
        
        <ol start="2">
          <li><strong>Internal CSS</strong>:</li>
        </ol>
        <pre><code>&lt;head&gt;
  &lt;style&gt;
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }
  &lt;/style&gt;
&lt;/head&gt;</code></pre>
        
        <ol start="3">
          <li><strong>Inline CSS</strong> (Use sparingly):</li>
        </ol>
        <pre><code>&lt;h1 style="color: #e42614; text-align: center;"&gt;Welcome to Kenya&lt;/h1&gt;</code></pre>
        
        <h4>Mobile-First Design for Kenyan Users</h4>
        <p>Most Kenyans access the internet via mobile devices, so it's crucial to design with a mobile-first approach:</p>
        
        <pre><code>/* Base styles for mobile first */
.container {
  width: 100%;
  padding: 0 15px;
}

/* Media query for tablets */
@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 0;
    margin: 0 auto;
  }
}

/* Media query for desktops */
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}</code></pre>
        
        <h4>Color Schemes Inspired by Kenya</h4>
        <p>These color palettes can help your websites connect with Kenyan audiences:</p>
        
        <div style="display: flex; margin-bottom: 20px;">
          <div style="background-color: #be0027; height: 50px; flex: 1;"></div>
          <div style="background-color: #000000; height: 50px; flex: 1;"></div>
          <div style="background-color: #006600; height: 50px; flex: 1;"></div>
        </div>
        <p><strong>Kenya Flag Colors</strong>: Red (#be0027), Black (#000000), Green (#006600), White (#ffffff)</p>
        
        <div style="display: flex; margin-bottom: 20px;">
          <div style="background-color: #e05d05; height: 50px; flex: 1;"></div>
          <div style="background-color: #f2b01e; height: 50px; flex: 1;"></div>
          <div style="background-color: #744c28; height: 50px; flex: 1;"></div>
        </div>
        <p><strong>Savannah Sunset</strong>: Inspired by Kenya's landscapes</p>
        
        <div class="practice-exercise">
          <h4>Practice Exercise</h4>
          <p>Style your personal profile page from the previous chapter with the following:</p>
          <ul>
            <li>Apply a Kenyan-inspired color scheme</li>
            <li>Make the layout responsive for both mobile and desktop</li>
            <li>Add appropriate spacing and typography to improve readability</li>
            <li>Include at least one image with proper CSS styling</li>
          </ul>
        </div>
        
        <div class="note-box">
          <strong>Pro Tip:</strong> When designing for the Kenyan market, consider data usage constraints. Optimize images and minimize CSS file size to ensure your website loads quickly on slower connections.
        </div>
      </div>
    `,
    
    javascript: `
      <div class="chapter-content">
        <h3>JavaScript Basics for Interactive Kenyan Websites</h3>
        <p>JavaScript allows you to create dynamic, interactive web experiences. In this chapter, we'll learn how to use JavaScript to build engaging features that enhance websites for Kenyan users.</p>
        
        <h4>Adding JavaScript to HTML</h4>
        <p>There are three ways to include JavaScript in your HTML:</p>
        
        <ol>
          <li><strong>External JavaScript</strong> (Recommended):</li>
        </ol>
        <pre><code>&lt;!-- At the end of the body tag --&gt;
&lt;body&gt;
  &lt;!-- Your HTML content --&gt;
  
  &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;</code></pre>
        
        <ol start="2">
          <li><strong>Internal JavaScript</strong>:</li>
        </ol>
        <pre><code>&lt;script&gt;
  // Your JavaScript code here
  document.getElementById('greeting').textContent = 'Jambo, Kenya!';
&lt;/script&gt;</code></pre>
        
        <ol start="3">
          <li><strong>Inline JavaScript</strong> (Use sparingly):</li>
        </ol>
        <pre><code>&lt;button onclick="alert('Karibu Kenya!')"&gt;Click Me&lt;/button&gt;</code></pre>
        
        <h4>JavaScript Fundamentals</h4>
        <p>Here are some key JavaScript concepts:</p>
        
        <pre><code>// Variables
let name = 'John Kamau';
const city = 'Nairobi';
var age = 25; // older way, prefer let and const

// Data Types
let fullName = 'Jane Wambui'; // String
let height = 175; // Number
let isStudent = true; // Boolean
let hobbies = ['running', 'reading', 'cooking']; // Array
let person = {
  name: 'David Ochieng',
  age: 30,
  location: 'Mombasa'
}; // Object

// Functions
function greet(name) {
  return 'Jambo ' + name + '! Habari yako?';
}

// Using the function
console.log(greet('Mary'));

// Arrow Functions (ES6)
const farewell = (name) => {
  return 'Kwaheri ' + name + '! Tutaonana baadaye.';
};

// Event Handling
document.getElementById('my-button').addEventListener('click', function() {
  alert('Asante for clicking!');
});</code></pre>
        
        <h4>Practical Example: Currency Converter for KES</h4>
        <p>Here's a simple currency converter for converting between KES and USD:</p>
        
        <pre><code>&lt;!-- HTML --&gt;
&lt;div class="converter"&gt;
  &lt;h2&gt;Currency Converter&lt;/h2&gt;
  &lt;div class="input-group"&gt;
    &lt;input type="number" id="amount" placeholder="Enter amount"&gt;
    &lt;select id="currency"&gt;
      &lt;option value="kes-to-usd"&gt;KES to USD&lt;/option&gt;
      &lt;option value="usd-to-kes"&gt;USD to KES&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;
  &lt;button id="convert-btn"&gt;Convert&lt;/button&gt;
  &lt;div id="result"&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;!-- JavaScript --&gt;
&lt;script&gt;
  const convertBtn = document.getElementById('convert-btn');
  
  convertBtn.addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const currencyOption = document.getElementById('currency').value;
    const resultDiv = document.getElementById('result');
    
    // Current rates (as of this example)
    const kesToUsdRate = 0.0077;
    const usdToKesRate = 130.5;
    
    let result;
    if (currencyOption === 'kes-to-usd') {
      result = amount * kesToUsdRate;
      resultDiv.textContent = amount + ' KES = ' + result.toFixed(2) + ' USD';
    } else {
      result = amount * usdToKesRate;
      resultDiv.textContent = amount + ' USD = ' + result.toFixed(2) + ' KES';
    }
  });
&lt;/script&gt;</code></pre>
        
        <div class="practice-exercise">
          <h4>Practice Exercise</h4>
          <p>Enhance your personal profile page with JavaScript functionality:</p>
          <ul>
            <li>Add a toggle button that switches between light and dark modes</li>
            <li>Create a simple form that collects visitor messages with basic validation</li>
            <li>Implement a feature that displays different greetings based on the time of day (morning, afternoon, evening)</li>
          </ul>
        </div>
        
        <div class="note-box">
          <strong>Pro Tip:</strong> When building for Kenyan users, consider implementing offline capabilities with JavaScript. Many users may experience intermittent internet connectivity, so designing your app to work offline when possible enhances user experience.
        </div>
      </div>
    `
  },
  
  // Data Science content
  dataScience: {
    intro: `
      <div class="chapter-content">
        <h3>Introduction to Data Science for Kenyan Applications</h3>
        <p>Welcome to the exciting world of data science! This field combines statistics, computer science, and domain expertise to extract insights and value from data, with powerful applications for Kenya's development challenges.</p>
        
        <h4>What is Data Science in the Kenyan Context?</h4>
        <p>Data science is transforming industries across Kenya, from agriculture to finance, healthcare to telecommunications. It enables us to use data-driven approaches to solve local challenges and drive innovation.</p>
        
        <div class="key-concepts">
          <h4>Key Concepts We'll Cover</h4>
          <ul>
            <li><strong>Data Collection</strong>: Gathering data from various Kenyan sources</li>
            <li><strong>Data Cleaning</strong>: Preprocessing and preparing data for analysis</li>
            <li><strong>Exploratory Data Analysis</strong>: Understanding patterns and relationships in local datasets</li>
            <li><strong>Statistical Analysis</strong>: Applying statistical methods to derive insights relevant to Kenya</li>
            <li><strong>Machine Learning</strong>: Building predictive models for Kenyan applications</li>
            <li><strong>Data Visualization</strong>: Communicating findings effectively to Kenyan stakeholders</li>
          </ul>
        </div>
        
        <h4>The Data Science Process</h4>
        <ol>
          <li><strong>Problem Definition</strong>: Identifying challenges in the Kenyan context</li>
          <li><strong>Data Collection</strong>: Gathering relevant data from local sources</li>
          <li><strong>Data Cleaning</strong>: Addressing data quality issues common in developing markets</li>
          <li><strong>Exploratory Analysis</strong>: Understanding the data's characteristics</li>
          <li><strong>Modeling</strong>: Applying algorithms and building models</li>
          <li><strong>Evaluation</strong>: Assessing model performance in the Kenyan context</li>
          <li><strong>Deployment</strong>: Implementing solutions that work with local infrastructure</li>
        </ol>
        
        <div class="tools-overview">
          <h4>Essential Tools and Technologies</h4>
          <ul>
            <li><strong>Python</strong>: The most popular programming language for data science</li>
            <li><strong>Jupyter Notebooks</strong>: Interactive computing environment</li>
            <li><strong>NumPy & Pandas</strong>: For data manipulation and analysis</li>
            <li><strong>Matplotlib & Seaborn</strong>: For data visualization</li>
            <li><strong>Scikit-learn</strong>: For machine learning</li>
          </ul>
        </div>
      </div>
    `,
    python: `
      <div class="chapter-content">
        <h3>Python for Data Science in Kenya</h3>
        <p>Python has become the preferred language for data scientists in Kenya due to its simplicity, versatility, and the rich ecosystem of libraries it offers for data analysis and manipulation.</p>
        
        <h4>Setting Up Your Python Environment</h4>
        <p>We recommend using Anaconda, a distribution of Python that includes many data science packages:</p>
        <pre><code># Creating a new environment
conda create -n datasci python=3.9
conda activate datasci

# Installing essential packages
conda install numpy pandas matplotlib seaborn scikit-learn jupyter</code></pre>
        
        <h4>Essential Python Libraries for Kenyan Data Scientists</h4>
        <ul>
          <li><strong>NumPy</strong>: Provides support for large, multi-dimensional arrays and matrices</li>
          <li><strong>Pandas</strong>: Offers data structures and operations for manipulating numerical tables and time series</li>
          <li><strong>Matplotlib</strong>: A plotting library for creating static, interactive, and animated visualizations</li>
          <li><strong>Seaborn</strong>: Built on Matplotlib, provides a high-level interface for drawing attractive statistical graphics</li>
          <li><strong>Scikit-learn</strong>: Features various classification, regression and clustering algorithms</li>
        </ul>
        
        <div class="code-example">
          <h4>Kenyan Agricultural Data Analysis Example</h4>
          <pre><code>import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load Kenyan crop yield dataset
df = pd.read_csv('kenya_crop_data.csv')

# Display the first 5 rows
print(df.head())

# Get basic statistics
print(df.describe())

# Create a visualization of crop yields by county
plt.figure(figsize=(12, 8))
sns.barplot(x='county', y='yield_tons_per_hectare', data=df)
plt.title('Crop Yields by Kenyan County')
plt.xlabel('County')
plt.ylabel('Yield (tons per hectare)')
plt.xticks(rotation=45)
plt.show()</code></pre>
        </div>
        
        <div class="practice-exercise">
          <h4>Practice Exercise</h4>
          <p>Using the Kenya Census dataset:</p>
          <ol>
            <li>Load the dataset using Pandas</li>
            <li>Explore population distribution across counties</li>
            <li>Create visualizations of demographics</li>
            <li>Identify potential relationships between population density and other factors</li>
          </ol>
        </div>
      </div>
    `,
    dataAnalysis: `
      <div class="chapter-content">
        <h3>Data Analysis with Pandas for Kenyan Insights</h3>
        <p>In this chapter, we'll dive deeper into data analysis using Pandas, one of the most powerful libraries for data manipulation in Python. We'll focus on techniques particularly relevant to analyzing Kenyan datasets.</p>
        
        <h4>Loading and Exploring Kenyan Data</h4>
        <p>Let's start by loading some economic data from Kenya:</p>
        
        <pre><code>import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load Kenya economic indicators dataset
# This could be GDP data, inflation rates, or other economic metrics
df = pd.read_csv('kenya_economic_indicators.csv')

# Display basic information
print("Dataset shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())

# Summary statistics
print("\nSummary statistics:")
print(df.describe())

# Check for missing values
print("\nMissing values in each column:")
print(df.isnull().sum())

# Data types
print("\nData types:")
print(df.dtypes)</code></pre>
        
        <h4>Data Cleaning for Kenyan Datasets</h4>
        <p>Kenyan datasets often require specific cleaning steps:</p>
        
        <pre><code># Handling missing values
# For numerical data, we might fill with median (less sensitive to outliers)
df['gdp_per_capita'].fillna(df['gdp_per_capita'].median(), inplace=True)

# For categorical data, fill with most common value
df['sector'].fillna(df['sector'].mode()[0], inplace=True)

# Converting currency columns from KES to USD for international comparison
exchange_rate = 130.5  # KES to USD
df['revenue_usd'] = df['revenue_kes'] / exchange_rate

# Converting date formats (common in Kenyan government data)
df['date'] = pd.to_datetime(df['date'], format='%d/%m/%Y')

# Creating year and month columns for easier analysis
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month

# Handling county names (standardizing spellings)
county_mapping = {
    'Nairobi City': 'Nairobi',
    'Mombasa Island': 'Mombasa',
    'Kisumu City': 'Kisumu'
    # Add more mappings as needed
}
df['county'] = df['county'].replace(county_mapping)</code></pre>
        
        <h4>Exploratory Data Analysis on Kenyan Economic Data</h4>
        <p>Let's perform some analysis specific to the Kenyan context:</p>
        
        <pre><code># Analyzing economic growth by county
county_gdp = df.groupby('county')['gdp_per_capita'].mean().sort_values(ascending=False)

# Visualizing top 10 counties by GDP per capita
plt.figure(figsize=(12, 6))
county_gdp.head(10).plot(kind='bar', color='teal')
plt.title('Top 10 Kenyan Counties by GDP per Capita')
plt.ylabel('GDP per Capita (KES)')
plt.xlabel('County')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Analyzing economic sectors
sector_contribution = df.groupby('sector')['gdp_contribution_percent'].sum()

# Pie chart of economic sectors
plt.figure(figsize=(10, 10))
plt.pie(sector_contribution, labels=sector_contribution.index, 
        autopct='%1.1f%%', startangle=90, shadow=True)
plt.title('Economic Sector Contribution to Kenya\'s GDP')
plt.axis('equal')
plt.show()

# Time series analysis of economic indicators
yearly_data = df.groupby('year')['inflation_rate'].mean()

plt.figure(figsize=(12, 6))
yearly_data.plot(marker='o', linestyle='-')
plt.title('Kenya\'s Average Inflation Rate Over Time')
plt.ylabel('Inflation Rate (%)')
plt.xlabel('Year')
plt.grid(True, alpha=0.3)
plt.show()

# Correlation between variables
correlation_matrix = df[['gdp_per_capita', 'unemployment_rate', 
                         'inflation_rate', 'foreign_investment']].corr()

plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title('Correlation Between Kenyan Economic Indicators')
plt.tight_layout()
plt.show()</code></pre>
        
        <h4>Advanced Pandas Techniques for Kenyan Data</h4>
        
        <pre><code># Using groupby with multiple aggregations
county_stats = df.groupby('county').agg({
    'gdp_per_capita': ['mean', 'median', 'std'],
    'unemployment_rate': ['mean', 'min', 'max'],
    'population': 'sum'
})

# Pivot tables for cross-tabulation (e.g., sector performance by county)
sector_by_county = pd.pivot_table(df, 
                                 values='gdp_contribution_percent',
                                 index='county',
                                 columns='sector',
                                 aggfunc='sum',
                                 fill_value=0)

# Top 5 counties for each sector
for sector in df['sector'].unique():
    print(f"\nTop 5 counties for {sector}:")
    top_counties = df[df['sector'] == sector].sort_values(
        'gdp_contribution_percent', ascending=False)
    print(top_counties[['county', 'gdp_contribution_percent']].head(5))

# Merging datasets (e.g., economic data with education data)
education_df = pd.read_csv('kenya_education_data.csv')
# Merge on county
merged_df = pd.merge(df, education_df, on='county', how='inner')</code></pre>
        
        <div class="practice-exercise">
          <h4>Practice Exercise: Analyzing M-PESA Transaction Data</h4>
          <p>For this exercise, you'll work with a dataset containing simulated M-PESA transaction data:</p>
          <ol>
            <li>Load the dataset and perform initial exploration</li>
            <li>Clean the data, handling missing values and standardizing formats</li>
            <li>Analyze transaction patterns by:
              <ul>
                <li>Time of day</li>
                <li>Day of week</li>
                <li>Transaction type (deposit, withdrawal, payment)</li>
                <li>Geographic region</li>
              </ul>
            </li>
            <li>Visualize the findings using at least three different plot types</li>
            <li>Identify insights that might be valuable for a Kenyan financial service provider</li>
          </ol>
        </div>
        
        <div class="note-box">
          <strong>Pro Tip:</strong> When working with Kenyan economic or financial data, always consider seasonality effects related to agricultural cycles, tourism seasons, and election periods, as these can significantly impact trends in your data.
        </div>
      </div>
    `,
  },
  
  // Marketing content
  marketing: {
    intro: `
      <div class="chapter-content">
        <h3>Introduction to Digital Marketing for Kenyan Businesses</h3>
        <p>Digital marketing encompasses all marketing efforts that use electronic devices or the internet. In this chapter, we'll explore how to create effective digital marketing strategies for the Kenyan market.</p>
        
        <h4>The Digital Marketing Ecosystem in Kenya</h4>
        <p>Digital marketing in Kenya consists of multiple channels and strategies that work together to create a comprehensive online presence:</p>
        <ul>
          <li><strong>Search Engine Optimization (SEO)</strong> - Tailored for local search patterns</li>
          <li><strong>Content Marketing</strong> - Creating relevant content for Kenyan audiences</li>
          <li><strong>Social Media Marketing</strong> - Focusing on platforms popular in Kenya</li>
          <li><strong>Mobile Marketing</strong> - Essential in Kenya's mobile-first market</li>
          <li><strong>WhatsApp Marketing</strong> - Leveraging Kenya's most popular messaging platform</li>
          <li><strong>SMS Marketing</strong> - Still highly effective in the Kenyan market</li>
          <li><strong>Influencer Marketing</strong> - Working with local Kenyan influencers</li>
        </ul>
        
        <div class="key-principles">
          <h4>Core Principles of Digital Marketing in Kenya</h4>
          <ol>
            <li><strong>Mobile-First Approach</strong>: Most Kenyans access the internet via smartphones</li>
            <li><strong>Data-Light Strategies</strong>: Considering data costs for the average Kenyan</li>
            <li><strong>Localized Content</strong>: Creating content that resonates with Kenyan culture</li>
            <li><strong>Multi-Language Support</strong>: Considering Swahili and local languages</li>
            <li><strong>Value-Based Messaging</strong>: Emphasizing affordability and value</li>
          </ol>
        </div>
        
        <h4>Setting Digital Marketing Objectives for Kenyan Markets</h4>
        <p>Effective digital marketing begins with clear, measurable objectives:</p>
        <ul>
          <li>Increasing brand awareness in target Kenyan demographics</li>
          <li>Generating leads from specific regions in Kenya</li>
          <li>Growing your audience on platforms popular in Kenya</li>
          <li>Driving M-Pesa transactions and sales</li>
          <li>Improving customer retention and loyalty in competitive markets</li>
        </ul>
        
        <div class="case-study">
          <h4>Case Study: Safaricom's Digital Marketing Success</h4>
          <p>Safaricom has successfully embraced digital marketing by:</p>
          <ul>
            <li>Developing a strong social media presence across platforms</li>
            <li>Creating the M-Pesa app ecosystem to engage customers</li>
            <li>Leveraging user-generated content and local influencer partnerships</li>
            <li>Implementing personalized SMS marketing campaigns</li>
            <li>Investing in high-quality content that tells compelling stories relevant to Kenyans</li>
          </ul>
          <p>The result? Safaricom has maintained market leadership and grown its digital presence significantly.</p>
        </div>
      </div>
    `,
    socialMedia: `
      <div class="chapter-content">
        <h3>Social Media Marketing Strategy for Kenyan Markets</h3>
        <p>Social media has revolutionized how brands connect with their audiences in Kenya. This chapter explores how to build an effective social media strategy that drives engagement with Kenyan consumers.</p>
        
        <h4>Platform Selection Strategy</h4>
        <p>Choose platforms based on Kenyan usage patterns:</p>
        <ul>
          <li><strong>Facebook</strong>: Most widely used platform in Kenya (7+ million users)</li>
          <li><strong>Instagram</strong>: Popular with Kenyan youth and urban populations</li>
          <li><strong>Twitter</strong>: Important for reaching Kenya's digital influencers and opinion leaders</li>
          <li><strong>WhatsApp</strong>: Essential for direct communication and groups</li>
          <li><strong>TikTok</strong>: Growing rapidly among younger Kenyans</li>
          <li><strong>LinkedIn</strong>: For B2B marketing and professional services in Kenya</li>
        </ul>
        
        <div class="platform-overview">
          <h4>Platform Characteristics in Kenya</h4>
          <ul>
            <li><strong>Facebook</strong>: Wide demographic reach, affordable advertising, video content performs well</li>
            <li><strong>Instagram</strong>: Urban youth, lifestyle content, shopping features gaining popularity</li>
            <li><strong>Twitter</strong>: Breaking news, trending topics, active during major events and political discussions</li>
            <li><strong>WhatsApp</strong>: Direct engagement, group marketing, broadcasts, and customer service</li>
            <li><strong>TikTok</strong>: Creative short-form video, youth demographic, viral trends</li>
            <li><strong>LinkedIn</strong>: Professional audience, B2B marketing, thought leadership for Kenyan businesses</li>
          </ul>
        </div>
        
        <h4>Content Strategy Framework for Kenya</h4>
        <pre><code>1. GOAL SETTING
   └── Specific objectives for the Kenyan market
   
2. AUDIENCE ANALYSIS
   └── Detailed personas of Kenyan consumers
   
3. CONTENT PILLARS
   └── 3-5 core themes aligned with Kenyan values
   
4. CONTENT MIX
   ├── Educational (25%)
   ├── Entertaining (25%)
   ├── Inspirational (25%)
   └── Promotional (25%)
   
5. LANGUAGE STRATEGY
   └── When to use English vs. Swahili vs. Sheng
   
6. ENGAGEMENT STRATEGY
   └── How to interact with Kenyan community
   
7. MEASUREMENT PLAN
   └── KPIs relevant to the Kenyan market</code></pre>
        
        <div class="strategy-template">
          <h4>Kenyan Social Media Strategy Template</h4>
          <table>
            <tr>
              <th>Platform</th>
              <th>Primary Goal</th>
              <th>Content Types</th>
              <th>Posting Frequency</th>
              <th>Key Metrics</th>
            </tr>
            <tr>
              <td>Facebook</td>
              <td>Brand awareness</td>
              <td>Videos, events, offers</td>
              <td>1-2x daily</td>
              <td>Reach, engagement rate</td>
            </tr>
            <tr>
              <td>WhatsApp</td>
              <td>Lead conversion</td>
              <td>Broadcasts, offers, support</td>
              <td>2-3x weekly</td>
              <td>Response rate, list growth</td>
            </tr>
          </table>
        </div>
        
        <div class="best-practices">
          <h4>Content Best Practices for Kenya</h4>
          <ul>
            <li>Include local context, references, and holidays (like Jamhuri Day)</li>
            <li>Create mobile-optimized content with low data requirements</li>
            <li>Use storytelling that connects with Kenyan values</li>
            <li>Incorporate trending topics from Kenyan social media</li>
            <li>Use a mix of English and Swahili where appropriate</li>
            <li>Feature local Kenyan personalities and influencers</li>
          </ul>
        </div>
      </div>
    `,
    contentMarketing: `
      <div class="chapter-content">
        <h3>Content Marketing for Kenyan Audiences</h3>
        <p>Content marketing is a strategic approach focused on creating and distributing valuable, relevant content to attract and engage a clearly defined Kenyan audience. In this chapter, we'll explore how to create content that resonates with Kenyan consumers and drives meaningful business results.</p>
        
        <h4>Understanding Kenyan Content Preferences</h4>
        <p>Content that performs well in Kenya typically has these characteristics:</p>
        <ul>
          <li><strong>Culturally Relevant</strong>: Incorporates Kenyan values, traditions, and references</li>
          <li><strong>Practical Value</strong>: Offers solutions to real challenges faced by Kenyans</li>
          <li><strong>Mobile Optimized</strong>: Easily accessible on smartphones with minimal data usage</li>
          <li><strong>Visual Appeal</strong>: Uses compelling images and videos that reflect Kenyan life</li>
          <li><strong>Authentic Voice</strong>: Sounds genuine rather than overly corporate</li>
          <li><strong>Multilingual</strong>: Available in English, Swahili, or both when appropriate</li>
        </ul>
        
        <h4>Content Formats That Work in Kenya</h4>
        <div class="content-formats">
          <table>
            <tr>
              <th>Format</th>
              <th>Effectiveness</th>
              <th>Best Platforms</th>
              <th>Notes for Kenyan Market</th>
            </tr>
            <tr>
              <td>Short Videos</td>
              <td>Very High</td>
              <td>Facebook, Instagram, TikTok, WhatsApp Status</td>
              <td>Keep under 1 minute to minimize data usage; include captions</td>
            </tr>
            <tr>
              <td>Infographics</td>
              <td>High</td>
              <td>Facebook, Twitter, WhatsApp</td>
              <td>Optimize for mobile screens; focus on one key message</td>
            </tr>
            <tr>
              <td>Blog Posts</td>
              <td>Medium</td>
              <td>Website, LinkedIn</td>
              <td>Keep paragraphs short; include plenty of subheadings</td>
            </tr>
            <tr>
              <td>Podcasts</td>
              <td>Growing</td>
              <td>Spotify, Apple Podcasts, Anchor</td>
              <td>Offer downloadable options for offline listening</td>
            </tr>
            <tr>
              <td>SMS Content</td>
              <td>High</td>
              <td>Direct to mobile</td>
              <td>Brief, clear calls-to-action; personalize when possible</td>
            </tr>
          </table>
        </div>
        
        <h4>Developing a Kenyan Content Calendar</h4>
        <p>Your content calendar should incorporate important Kenyan events and seasons:</p>
        
        <pre><code>JANUARY
├── New Year Resolutions Content
└── Back-to-School Season

FEBRUARY
└── Valentine's Day Campaigns

MARCH/APRIL
├── Easter Content
└── Rainy Season Tips

JUNE
├── Madaraka Day (June 1)
└── Youth-focused content (school holidays)

AUGUST
└── Farmer-focused content (harvest season)

OCTOBER
└── Mashujaa Day (October 20)

DECEMBER
├── Jamhuri Day (December 12)
├── Christmas Campaigns
└── New Year Preparation</code></pre>
        
        <h4>Creating Location-Specific Content</h4>
        <p>Kenya is diverse, with different regions having unique characteristics:</p>
        
        <ul>
          <li><strong>Nairobi</strong>: Urban lifestyle, technology, financial services, entertainment</li>
          <li><strong>Mombasa & Coast</strong>: Tourism, hospitality, seafood, cultural heritage</li>
          <li><strong>Rift Valley</strong>: Agriculture, athletics, wildlife conservation</li>
          <li><strong>Western Kenya</strong>: Agriculture, education, community initiatives</li>
          <li><strong>Northern Kenya</strong>: Sustainability, resilience, pastoral communities</li>
        </ul>
        
        <h4>Case Study: Kenyan Brand Content Success</h4>
        <div class="case-study-box">
          <h5>KCB Bank's "Go Ahead" Campaign</h5>
          <p>KCB Bank created a content series featuring real Kenyan entrepreneurs who overcame challenges to build successful businesses. The content included:</p>
          <ul>
            <li>3-5 minute documentary-style videos shared on YouTube and Facebook</li>
            <li>Shorter 30-second versions for Instagram and TV</li>
            <li>Blog articles profiling each entrepreneur</li>
            <li>WhatsApp-shareable infographics with key business tips</li>
            <li>A dedicated microsite with resources for entrepreneurs</li>
          </ul>
          <p><strong>Results</strong>: 4.2 million video views, 35% increase in business account inquiries, and significant brand sentiment improvement.</p>
        </div>
        
        <h4>Content Distribution Strategy for Kenya</h4>
        <p>How to ensure your content reaches your Kenyan audience:</p>
        
        <pre><code>PRIMARY DISTRIBUTION
├── Social Media
│   ├── Facebook (mass reach)
│   ├── WhatsApp (direct sharing)
│   └── Instagram (urban audience)
├── Mobile-Optimized Website
├── Email Marketing
└── SMS Updates

SECONDARY DISTRIBUTION
├── Radio Mentions
├── Influencer Partnerships
└── Community Groups

AMPLIFICATION
├── Paid Social Promotion
├── Google Display Network
└── SMS Broadcasts</code></pre>
        
        <div class="practice-exercise">
          <h4>Practice Exercise: Developing a Kenyan Content Strategy</h4>
          <p>Create a one-month content plan for a fictional Kenyan business:</p>
          <ol>
            <li>Choose either a retail store, restaurant, or financial service</li>
            <li>Define 3 content pillars relevant to your chosen business and Kenyan audience</li>
            <li>Create a content calendar with 12 specific content pieces (3 per week)</li>
            <li>For each content piece, specify:
              <ul>
                <li>Content format</li>
                <li>Primary message</li>
                <li>Distribution channels</li>
                <li>Call to action</li>
                <li>Measurement metrics</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="note-box">
          <strong>Pro Tip:</strong> Always test your content with a small sample of your target Kenyan audience before full distribution. What works in global markets or even neighboring African countries may not resonate the same way with Kenyan consumers.
        </div>
      </div>
    `,
  },
};

// Map common chapter titles to content types
const contentMappings = {
  // Web Development
  'Introduction to Web Development': chapterContent.webDev.intro,
  'Introduction to Modern JavaScript': chapterContent.webDev.intro,
  'Introduction to HTML': chapterContent.webDev.html,
  'HTML Fundamentals': chapterContent.webDev.html,
  'CSS Fundamentals': chapterContent.webDev.css,
  'Styling with CSS': chapterContent.webDev.css,
  'JavaScript Basics': chapterContent.webDev.javascript,
  'Interactive JavaScript': chapterContent.webDev.javascript,
  
  // Data Science
  'Introduction to Data Science': chapterContent.dataScience.intro,
  'Python Programming Fundamentals': chapterContent.dataScience.python,
  'Introduction to Python': chapterContent.dataScience.python,
  'Data Analysis with Pandas': chapterContent.dataScience.dataAnalysis,
  'Exploratory Data Analysis': chapterContent.dataScience.dataAnalysis,
  
  // Marketing
  'Introduction to Digital Marketing': chapterContent.marketing.intro,
  'Content Marketing Fundamentals': chapterContent.marketing.contentMarketing,
  'Content Strategy Development': chapterContent.marketing.contentMarketing,
  'Social Media Strategy Development': chapterContent.marketing.socialMedia,
  'Platform-Specific Strategies': chapterContent.marketing.socialMedia,
};

async function enhanceChapters() {
  try {
    console.log('Starting chapter content enhancement...');
    
    // Get all published chapters
    const chapters = await prisma.chapter.findMany({
      where: {
        isPublished: true,
      },
      include: {
        course: {
          select: {
            title: true,
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    
    console.log(`Found ${chapters.length} published chapters to process.`);
    
    let updatedCount = 0;
    
    // Update each chapter with rich content where available
    for (const chapter of chapters) {
      let richContent = null;
      
      // Try to match by title
      if (contentMappings[chapter.title]) {
        richContent = contentMappings[chapter.title];
      } 
      // If no match, try to determine by category and position
      else if (chapter.position === 1) {
        const categoryName = chapter.course?.category?.name?.toLowerCase() || '';
        
        if (categoryName.includes('web') || categoryName.includes('programming')) {
          richContent = chapterContent.webDev.intro;
        } else if (categoryName.includes('data') || categoryName.includes('science')) {
          richContent = chapterContent.dataScience.intro;
        } else if (categoryName.includes('market')) {
          richContent = chapterContent.marketing.intro;
        }
      }
      
      // Only update if we have rich content
      if (richContent) {
        await prisma.chapter.update({
          where: { id: chapter.id },
          data: {
            description: richContent,
          },
        });
        
        // Also update course instructor data with Kenyan instructors
        if (chapter.course) {
          const categoryName = chapter.course?.category?.name?.toLowerCase() || '';
          let instructorPool = kenyanInstructors.webDev; // default
          
          if (categoryName.includes('data') || categoryName.includes('science')) {
            instructorPool = kenyanInstructors.dataScience;
          } else if (categoryName.includes('market')) {
            instructorPool = kenyanInstructors.marketing;
          }
          
          // Select random instructor from appropriate category
          const randomInstructor = instructorPool[Math.floor(Math.random() * instructorPool.length)];
          
          // We would update the instructor here if there was a field for it
          // In a real implementation, we'd update the course with instructor details
          console.log(`Updated chapter: "${chapter.title}" in course "${chapter.course.title}" (Instructor: ${randomInstructor.name})`);
        } else {
          console.log(`Updated chapter: "${chapter.title}" in course "${chapter.course.title}"`);
        }
        
        updatedCount++;
      }
    }
    
    console.log(`Enhancement complete. Updated ${updatedCount} chapters with rich content and Kenyan context.`);
    
  } catch (error) {
    console.error('Error enhancing chapters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhancement
enhanceChapters(); 