const { expect } = require('@playwright/test')

export class TvShows {
    constructor(page) {
        this.page = page
    }

    async goList() {
        await this.page.locator('a[href="/admin/tvshows"]').click()
        await expect(this.page.getByRole('heading', { name: 'Séries de TV', exact: true })).toBeVisible()
    }

    async goForm() {
        await this.page.locator('a[href="/admin/tvshows/register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(tvshow) {
        await this.goForm()
        await this.page.getByLabel('Titulo da série').fill(tvshow.title)
        await this.page.getByLabel('Sinopse').fill(tvshow.overview)
        await this.page.locator('#select_company_id .react-select__indicator').click()
        await this.page.locator('.react-select__option').getByText(tvshow.company, { exact: true }).click()
        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option').getByText(String(tvshow.release_year), { exact: true }).click()
        await this.page.getByLabel('Temporadas').fill(String(tvshow.seasons))
        await this.page.locator('input[name=cover]').setInputFiles('tests/support/fixtures' + tvshow.cover)
        if (tvshow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }
        await this.submit()
    }

    row(title) {
        return this.page.getByRole('row').filter({ has: this.page.getByRole('img', { name: title, exact: true }) })
    }

    async remove(title) {
        await this.row(title).getByRole('button').click()
        await this.page.locator('.confirm-removal').click()
    }

    async shouldNotHave(title) {
        await expect(this.row(title)).toHaveCount(0)
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)
        await this.page.locator('.actions button').click()
    }

    async tableHave(titles) {
        await expect(this.page.getByRole('row')).toHaveCount(titles.length)
        for (const title of titles) {
            await expect(this.row(title)).toBeVisible()
        }
    }

    async alertHaveText(messages) {
        await expect(this.page.locator('.alert')).toHaveText(messages)
    }
}
