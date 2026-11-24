const base = process.env.VITE_BASE_PATH || '/';

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [`http://127.0.0.1:4174${base}`],
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
      startServerReadyPattern: 'Local:',
      settings: { formFactor: 'mobile', chromeFlags: '--headless --no-sandbox' },
    },
    assert: {
      assertions: Object.fromEntries(
        ['performance', 'accessibility', 'best-practices', 'seo'].map((category) => [
          `categories:${category}`,
          ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        ]),
      ),
    },
    upload: { target: 'filesystem', outputDir: 'lighthouse-report' },
  },
};
