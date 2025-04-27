const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script automatically fixes common issues that prevent the project from deploying:
 * 1. Removes Form import from @/components/ui/form since it doesn't exist
 * 2. Removes <Form> wrapper component usages
 * 3. Fixes any toast usage with incorrect object literals
 */

// Files likely to have Form import issues
const filesToCheck = [
  'src/app/checkout/mpesa/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/(auth)/sign-in/page.tsx',
  'src/app/(auth)/sign-up/page.tsx'
];

// Function to fix Form imports
function fixFormImports(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`Checking ${filePath} for Form imports...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has Form import
    if (content.includes('Form,') && content.includes('@/components/ui/form')) {
      console.log(`Found Form import in ${filePath}, fixing...`);
      
      // Replace Form import
      content = content.replace(/import\s*{\s*Form,([^}]*)}\s*from\s*["']@\/components\/ui\/form["']/g, 
        (match, p1) => `import {${p1}} from "@/components/ui/form"`);
      
      // Replace <Form {...form}> with just form
      content = content.replace(/<Form[\s\n]+{\.\.\.form}[^>]*>([\s\S]*?)<\/Form>/g, '$1');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Form imports in ${filePath}`);
    } else {
      console.log(`No Form imports found in ${filePath}`);
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
}

// Function to fix useToast with titles
function fixToastUsage(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`Checking ${filePath} for toast usage with title...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has toast with title
    if (content.includes('toast({') && (content.includes('title:') || content.includes('description:'))) {
      console.log(`Found toast with object literals in ${filePath}, fixing...`);
      
      // Replace toast({ title: "message" }) with toast("message")
      content = content.replace(/toast\(\{\s*title:\s*["']([^"']+)["']\s*(?:,\s*[^}]*)?\}\)/g, 
        (match, p1) => `toast("${p1}")`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed toast usage in ${filePath}`);
    } else {
      console.log(`No problematic toast usage found in ${filePath}`);
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
}

// Fix all files
console.log("Fixing import issues...");
filesToCheck.forEach(file => {
  fixFormImports(file);
  fixToastUsage(file);
});

console.log("\nAll fixes applied! Try building the project again with 'npm run build'"); 