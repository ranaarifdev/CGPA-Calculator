# Smart CGPA Calculator

A fully static, GitHub Pages-ready GPA calculator and curriculum browser. Open
`index.html` directly in a modern browser; no server, database connection,
package installation, or external library is required.

## Features

- Subject GPA calculator
- Weighted semester SGPA calculator
- Weighted overall CGPA calculator
- Reusable curriculum tabs for six BS programs
- Course search and category filtering
- Responsive and keyboard-accessible interface

## Supported curricula

- BS Cyber Security
- BS Artificial Intelligence
- BS Computer Science
- BS Software Engineering
- BS Information Technology
- BS Data Science

Curriculum data is bundled in `index.html` and `curricula.js`. The five source
Markdown documents can be regenerated with `node scripts/build-curricula.js`.
The SQL file documents a normalized schema for a possible future backend but is
not required by the website.

Developed by Muhammad Arif — BS Cyber Security.
