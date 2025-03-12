export function withLayout(content) {
  return `
    <html>
      <head>
        <style>
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>Open Source Catalog POC</h1>
        <main>
          ${content}
        </main>
      </body>
    </html>
  `;
}
