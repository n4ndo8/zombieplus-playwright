const { expect } = require('@playwright/test')

export class Popup {

    constructor(page){
        this.page = page
    }

    async close() {
        await this.page.getByRole('button', { name: 'Ok', exact: true }).click()
        await expect(this.page.locator('.swal2-html-container')).toBeHidden()
    }

    async haveText(message) {
        const element = this.page.locator('.swal2-html-container')

        await expect(element).toContainText(message)
    }
}
