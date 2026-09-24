const { expect } = require('@playwright/test')

export class MoviesPage {

    constructor(page) {
        this.page = page;
    }

    async isLoggedIn() {
        await this.page.waitForLoadState('networkidle')
        await expect(this.page).toHaveURL(/.*admin/)
    }

    async create(title, overview, company, realease_year) {

        await this.page.locator('a[href$="register"]').click()

        await this.page.getByLabel('Titulo do filme').fill(title)
        await this.page.getByLabel('Sinopse').fill(overview)

        await this.page.locator('#select_company_id .react-select_indicator')
            .click()
        
        await this.page.locator('react-select__option')
        .filter({hasText: company})
        .click()

        await this.page.locator('#select_year .react-select_indicator')
            .click()
        
        await this.page.locator('.react-select__option')
        .filter({hasText: realease_year})
        .click()

        await this.page.getByRole('button', { name: 'cadastrar'}).click()


    }
}