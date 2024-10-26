import { test, expect } from '@playwright/test';

test.setTimeout(50000);
test('Search conditions are set correctly', async ({ page }) => {


  await page.goto('/');
  await page.getByRole('search', { name: '検索' }).click();
  // await expect(page.getByRole('heading', { name: 'カテゴリー' })).toBeVisible();
  // await expect(page.getByRole('heading', { name: 'カテゴリー' })).toHaveText('カテゴリー');
  
  await page.getByRole('link', { name: 'カテゴリーからさがす' }).click();
  // await expect(page.getByRole('heading', { name: 'カテゴリー' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'カテゴリー' })).toHaveText('カテゴリー');

  await page.getByRole('link', { name: '本・雑誌・漫画' }).click();
  // await expect(page.getByRole('heading', { name: '本・雑誌・漫画' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '本・雑誌・漫画' })).toHaveText('本・雑誌・漫画');

  await page.getByTestId('category-list').getByRole('link', { name: '本', exact: true }).click();
  // await expect(page.getByRole('heading', { name: '本' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '本' })).toHaveText('本');

  await page.getByRole('link', { name: 'コンピュータ・IT' }).click();
  // await expect(page.getByRole('heading', { name: '本 コンピュータ・IT の検索結果' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '本 コンピュータ・IT の検索結果' })).toHaveText('本 コンピュータ・IT の検索結果');

  // await new Promise(resolve => setTimeout(resolve, 20000));
  await expect(page.getByTestId('カテゴリー').locator('div').filter({ hasText: 'すべてファッションベビー・キッズゲーム・おもちゃ・グッズホビー・楽器・アートチケット本・雑誌・漫画CD・DVD' }).nth(1)).toBeInViewport();
  const tier1CategoryText = await page.$eval("select.merInputNode", (dropdown: HTMLSelectElement) => 
    dropdown.options[dropdown.selectedIndex].innerText.trim()
  );
  expect(tier1CategoryText).toBe('本・雑誌・漫画');

});