import test from '@lib/BaseTest';

test('Search conditions are set correctly', { tag: '@Smoke' }, async ({ homePage }) => {
    await test.step('Navigate to Homepage', async () => {
        await homePage.navigateToHomePage();
    });

    await test.step('Perform Search Navigation', async () => {
        await homePage.clickSearchBox();
        await homePage.navigateToCategory();
    });

    await test.step('Select Categories', async () => {
        await homePage.selectTier1Category('本・雑誌・漫画');
        await homePage.selectTier2Category('本', true);
        await homePage.selectTier3Category('コンピュータ・IT');
    });

    await test.step('Verify Final Category Selection', async () => {
        await homePage.verifySelectedCategory({
            tier1: '本・雑誌・漫画',
            tier2: '本',
            tier3: 'コンピュータ・IT'
        });
    });
    
});