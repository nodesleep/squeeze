# squeeze
Squeeze is an application that serves compressed HTML files through dynamically generated routes.

## Features

- **Automatic Route Generation:** Automatically generates endpoints for HTML files placed in the `/routes` directory.
- **HTML Compression:** Compresses HTML files using `html-minifier-terser` before serving them to clients.
- **Static Assets:** Serves CSS files and images from the `/static` directory.
- **Middleware Support:** Watches for new HTML files and updates routes dynamically.
- **HTMX:** Routes are retrieved via HTMX and rendered in the index.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nodesleep/squeeze.git
   cd squeeze

2. Install the dependencies:

   ```bash
   npm install

3. Compile the TypeScript files and run Nodemon:

   ```bash
   npm run dev

### Usage

Add HTML files to `/src/routes` and CSS/Images to `/src/static`

## Moving forward
This is merely the start of a framework. Many of these processes will be automated in future releases. Happy hacking!
