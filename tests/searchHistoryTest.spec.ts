// searchHistoryTestSpec.ts
import test from '@lib/BaseTest';

test('Search conditions are set from browsing history', { tag: '@Smoke' }, async ({ homePage }) => {
    // First create browsing history with fashion category
    await test.step('Create First Browsing History and verify selected categories', async () => {
        await homePage.navigateToHomePage();
        await homePage.clickSearchBox();
        await homePage.navigateToCategory();
        await homePage.selectTier1Category('CD・DVD・ブルーレイ');
        await homePage.selectTier2Category('DVD', true);
        await homePage.selectTier3Category('邦画・日本映画');
        await homePage.verifySelectedCategory({
            tier1: 'CD・DVD・ブルーレイ',
            tier2: 'DVD',
            tier3: '邦画・日本映画'
        });
    });

    // Second browsing history with computer category
    await test.step('Create Second Browsing History and verify selected categories', async () => {
        await homePage.navigateToHomePage();
        await homePage.clickSearchBox();
        await homePage.navigateToCategory();
        await homePage.selectTier1Category('本・雑誌・漫画');
        await homePage.selectTier2Category('本', true);
        await homePage.selectTier3Category('コンピュータ・IT');
        await homePage.verifySelectedCategory({
            tier1: '本・雑誌・漫画',
            tier2: '本',
            tier3: 'コンピュータ・IT'
        });
    });
    // Verify browsing histories and perform search
    await test.step('Verify Browsing History and Search', async () => {
        await homePage.navigateToHomePage();
        await homePage.clickSearchBox();
        await homePage.verifyBrowsingHistoryCount(2);
        await homePage.verifyLatestBrowsingHistory('コンピュータ・IT');
        await homePage.clickLatestBrowsingHistory();
        await homePage.verifySelectedCategory({
            tier1: '本・雑誌・漫画',
            tier2: '本',
            tier3: 'コンピュータ・IT'
        });
        await homePage.searchWithKeyword('javascript');
    });

    // Final verification
    await test.step('Verify Updated Browsing History', async () => {
        await homePage.navigateToHomePage();
        await homePage.clickSearchBox();
        await homePage.verifyBrowsingHistoryCount(3);
        await homePage.verifyLatestBrowsingHistory('javascript, コンピュータ・IT');
    });
});