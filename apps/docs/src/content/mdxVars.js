export const cdnIcons = 'https://cdn.jsdelivr.net/npm/natura11y-icons@v2/dist/natura11y-icons.min.css';
export const cdnCSS = 'https://cdn.jsdelivr.net/npm/natura11y@5/dist/natura11y.min.css';
export const cdnJS = 'https://cdn.jsdelivr.net/npm/natura11y@5/dist/natura11y.min.js';
export const codeImgPlaceholderBackdrop = '<img class="opacity-50" src="https://placehold.co/1500x750" alt="Placeholder" />';

export const quickStartCdnHtml = `<!DOCTYPE html>
<html dir="ltr" lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Page Title • Your Website Name</title>

        <!-- Natura11y Icons -->
        <link rel="stylesheet" href="${cdnIcons}" />

        <!-- Natura11y Stylesheet -->
        <link rel="stylesheet" href="${cdnCSS}" />
    </head>

    <body>
        <header id="global-header"></header>

        <main id="skip-header-content">
            <h1>Hello World!</h1>
        </main>

        <footer id="global-footer"></footer>

        <!-- Natura11y JavaScript -->
        <script src="${cdnJS}"></script>
    </body>
</html>`;
