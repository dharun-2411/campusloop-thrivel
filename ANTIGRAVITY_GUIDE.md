# Antigravity Guide — CampusLoop

1. Extract this ZIP.
2. Open the `CampusLoop_Full_Website` folder in Antigravity.
3. Open the built-in terminal.
4. Run `npm start`.
5. Visit `http://localhost:3000`.

## Prompt to give Antigravity

Read the complete existing CampusLoop project before making changes. Preserve the current working features and project structure. Run the app, inspect the frontend and backend, and fix any errors you find. Do not replace working functionality with mock buttons. If adding features, implement and test both frontend and backend behavior. Keep the design responsive and preserve the animated 3D CSS hero. Keep secrets out of frontend code.

## Current implementation notes

- Node.js native HTTP server with plain HTML, CSS and JavaScript.
- No `npm install` is needed; there are no third-party runtime dependencies.
- The hero includes CSS 3D animation.
- Loop AI is a local product-matching assistant; a hosted Gemini integration is not configured.
- Checkout is demo checkout, not a real payment gateway.
- Data is stored in a local JSON file created automatically on first run.
