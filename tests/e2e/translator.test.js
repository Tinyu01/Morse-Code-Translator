const { test, expect } = require('@playwright/test');

test('Morse Code Translator E2E', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test text to Morse
    await page.fill('#msgInput', 'SOS');
    await expect(page.locator('#msgOutput')).toHaveValue('... --- ...');

    // Test Morse to text
    await page.fill('#msgInput', '... --- ...');
    await expect(page.locator('#msgOutput')).toHaveValue('SOS');

    // Test clear button
    await page.click('#clearBtn');
    await expect(page.locator('#msgInput')).toHaveValue('');
    await expect(page.locator('#msgOutput')).toHaveValue('');

    // Test copy button
    await page.fill('#msgInput', 'HELLO');
    await page.click('#copyBtn');
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('.... . .-.. .-.. ---');

    // Test swap button
    await page.fill('#msgInput', '... --- ...');
    await page.click('#swapBtn');
    await expect(page.locator('#msgInput')).toHaveValue('SOS');
    await expect(page.locator('#msgOutput')).toHaveValue('... --- ...');
});