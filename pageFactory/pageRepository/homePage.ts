import { expect, Locator, Page, BrowserContext } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    // Locators
    readonly searchBox: Locator;
    readonly categoryLink: Locator;
    readonly categoryHeading: Locator;
    // readonly booksCategory: Locator;
    // readonly booksHeading: Locator;
    // readonly bookSubCategory: Locator;
    // readonly computerITCategory: Locator;
    // readonly searchResultHeading: Locator;
    readonly categoryDropdown: Locator;
    readonly categoryTestId: Locator;


     // Add new locators
     readonly browsingHistoryItems: Locator;
     readonly latestHistoryItem: Locator;
     readonly searchInput: Locator;
     readonly searchButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        
        // Initialize locators
        this.searchBox = page.getByRole('search', { name: '検索' });
        this.categoryLink = page.getByRole('link', { name: 'カテゴリーからさがす' });
        this.categoryHeading = page.getByRole('heading', { name: 'カテゴリー' });
        this.categoryDropdown = page.locator('select.merInputNode');
        this.categoryTestId = page.getByTestId('カテゴリー');

        // this.browsingHistoryItems = page.locator('[data-testid="search-history"] .merListItem');
        this.browsingHistoryItems = page.getByTestId('search-history').locator('.merListItem');
        this.latestHistoryItem = page.getByTestId('search-history').locator('.merListItem').first();
        // this.searchInput = page.getByPlaceholder('なにをお探しですか？');
        this.searchInput = page.locator('input[aria-label="検索キーワードを入力"]');
        // this.searchButton = page.getByRole('button', { name: '検索' });
        this.searchButton = page.getByRole('button', { name: '検索' , exact: true});

    }
    async navigateToHomePage(): Promise<void> {
        await this.page.goto('/');
    
        // Wait for essential states
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            this.page.waitForLoadState('networkidle'),
            this.page.waitForLoadState('load')
        ]);  
    }

    async clickSearchBox(): Promise<void> {
        await this.searchBox.click();
    }

    async navigateToCategory(): Promise<void> {
        await this.categoryLink.click();
        await expect(this.categoryHeading).toHaveText('カテゴリー');
    }

    async selectTier1Category(name: string): Promise<void> {
        const tier1Category = this.page.getByRole('link', { name });
        await tier1Category.click();
        await expect(this.page.getByRole('heading', { name })).toHaveText(name);
    }

    async selectTier2Category(name: string, exact: boolean = false): Promise<void> {
        const tier2Category = this.page.getByTestId('category-list').getByRole('link', { name, exact });
        await tier2Category.click();
        await expect(tier2Category).toHaveText(name);
    }

    async selectTier3Category(name: string, tier2Name?: string): Promise<void> {
        const tier3Category = this.page.getByRole('link', { name });
        await tier3Category.click();
        
        // If tier2Name is provided, use it in the heading verification
        if (tier2Name) {
            await expect(this.page.getByRole('heading', { name: `${tier2Name} ${name} の検索結果` }))
                .toHaveText(`${tier2Name} ${name} の検索結果`);
        } else {
            await expect(this.page.getByRole('link', { name })).toBeVisible();
        }
    }

    async verifySelectedCategory(expectedCategories: {
        tier1: string;
        tier2: string;
        tier3: string;
    }): Promise<void> {
        await expect(this.categoryTestId.locator('div')
            .filter({ hasText: 'すべてファッションベビー・キッズゲーム・おもちゃ・グッズホビー・楽器・アートチケット本・雑誌・漫画CD・DVD' })
            .nth(1)).toBeInViewport();
        
        // Get tier1 category text
        const tier1CategoryText = await this.page.locator("select.merInputNode").nth(0)
            .evaluate((dropdown: HTMLSelectElement) => dropdown.options[dropdown.selectedIndex].innerText.trim());
        
        // Get tier2 category text
        const tier2CategoryText = await this.page.locator("select.merInputNode").nth(1)
            .evaluate((dropdown: HTMLSelectElement) => dropdown.options[dropdown.selectedIndex].innerText.trim());
        
        // Get tier3 category text
        const tier3CategoryText = await this.page.evaluate(() => {
            const checkedCheckbox = document.querySelector('input[type="checkbox"][aria-checked="true"]');
            if (!checkedCheckbox) return null;
            const textElement = checkedCheckbox.closest('.merCheckboxLabel')?.querySelector('.merText');
            return (textElement as HTMLElement)?.innerText.trim();
        });
    
        console.log(`Selected tier1 category text: ${tier1CategoryText}`);
        console.log(`Selected tier2 category text: ${tier2CategoryText}`);
        console.log(`Selected tier3 category text: ${tier3CategoryText}`);
    
        expect(tier1CategoryText).toBe(expectedCategories.tier1);
        expect(tier2CategoryText).toBe(expectedCategories.tier2);
        expect(tier3CategoryText).toBe(expectedCategories.tier3);
    }

    // New methods
    async verifyBrowsingHistoryCount(expectedCount: number): Promise<void> {
        await expect(this.browsingHistoryItems).toHaveCount(expectedCount);
    }
    
    async verifyLatestBrowsingHistory(expectedText: string): Promise<void> {
        const historyText = this.latestHistoryItem.locator('.merText');
        await expect(historyText).toHaveText(expectedText);
    }
    
    async clickLatestBrowsingHistory(): Promise<void> {
        // Wait for history section to be visible
        await this.page.locator('[data-testid="search-history"]').waitFor({ state: 'visible' });
        // Click the first history item's link
        await this.latestHistoryItem.locator('a').click();
    }
    
    async searchWithKeyword(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
        // Wait for search results
        await this.page.waitForLoadState('networkidle');
    }

}