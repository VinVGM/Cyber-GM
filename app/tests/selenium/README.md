# Selenium Test Suite

## Purpose
This folder contains Selenium WebDriver tests for the Next.js application.

## How to run
1. Start the application:
   ```powershell
   npm run dev
   ```
2. In a second terminal, run:
   ```powershell
   npm run test:selenium
   ```

## What is tested
- Landing page loads and displays branding
- Login page contains email and password fields
- Invalid login returns an error message
- Forgot password link navigates to `/forgot-password`
- Register page link navigates to `/register`
- Valid login redirects to `/dashboard`
- Dashboard contains profile and issue tracker navigation
- Profile page loads and returns to dashboard
- Issue tracker allows issue creation and search
- Logout returns the user to `/login`

## Valid test credentials
- Email: `wow2@gmail.com`
- Password: `lmao123!@`

## Reports
- The script generates a JSON report at `tests/selenium/report/selenium-report.json`

## Notes
- The script uses Chrome and requires ChromeDriver.
- If the browser does not start, confirm Chrome is installed and matches the ChromeDriver version.
