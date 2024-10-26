import { TestInfo, test as baseTest } from '@playwright/test';

import { HomePage } from '@pages/homePage';
import AxeBuilder from '@axe-core/playwright'; 

const test = baseTest.extend<{
    homePage: HomePage;
    makeAxeBuilder: AxeBuilder;
    testInfo: TestInfo;
}>({
    homePage: async ({ page, context }, use) => {
        await use(new HomePage(page, context));
    },
    makeAxeBuilder: async ({ page }, use) => {
        await use(new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .exclude('#commonly-reused-element-with-known-issue'));
    }

})

export default test;