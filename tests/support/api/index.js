const { expect } = require('@playwright/test')

export class Api {

    constructor(request) {
        this.request = request
        this.token = undefined
    }

    async setToken() {
        const response = await this.request.post('http://localhost:3333/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        })

        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token
    }

    async getCompanyByName(companyName) {

        const response = await this.request.get('http://localhost:3333/companies', {
            headers: {
                Authorization: this.token,
            },
            params: {
                name: companyName
            }
        })

        expect(
            response.ok(),
            `GET /companies: ${response.status()} - ${await response.text()}`
        ).toBeTruthy()

        const body = await response.json()
        const company = body.data[0]

        expect(
            company,
            `Empresa "${companyName}" não encontrada. Resposta: ${JSON.stringify(body)}`
        ).toBeDefined()

        return company.id
    }

    async postTvShow(tvshow) {
        const companyId = await this.getCompanyByName(tvshow.company)
        const response = await this.request.post('http://localhost:3333/tvshows', {
            headers: { Authorization: this.token },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: companyId,
                release_year: tvshow.release_year,
                seasons: tvshow.seasons,
                featured: tvshow.featured
            }
        })

        expect(
            response.status(),
            `POST /tvshows: ${response.status()} - ${await response.text()}`
        ).toBe(201)
    }

    async postMovie(movie) {

        const companyId = await this.getCompanyByName(movie.company)


        const response = await this.request.post('http://localhost:3333/movies', {
            headers: {
                Authorization: this.token,
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                featured: movie.featured,
            }
        })

        expect(
            response.ok(),
            `POST /movies: ${response.status()} - ${await response.text()}`
        ).toBeTruthy()
    }

}
