import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Testler ayrı bir PostgreSQL veritabanı kullanır (otocenter_test);
    // paralel çalışırlarsa aynı tabloları truncate ederler.
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 20_000,
    hookTimeout: 60_000,
    include: ['tests/**/*.test.ts'],
  },
})
