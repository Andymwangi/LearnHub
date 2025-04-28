@echo off
echo Configuring Git...
git config --global user.email "admin@example.com"
git config --global user.name "Admin"

echo Committing changes...
git commit -m "Fixed API type errors and replaced Stripe with PayPal and MPESA"

echo Setting remote repository...
git remote add origin https://github.com/Andymwangi/LearnHub.git

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause 