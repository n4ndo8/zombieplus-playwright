const { test } = require('../support/index')
const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')

test.beforeEach(async () => {
    await executeSQL('DELETE FROM tvshows')
})

test('deve poder cadastrar uma nova série', async ({ page }) => {
    const tvshow = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goList()
    await page.tvshows.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
    await page.popup.close()
    await page.tvshows.tableHave([tvshow.title])
})

test('deve poder remover uma série', async ({ page, request }) => {
    const tvshow = data.to_remove
    await request.api.setToken()
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goList()
    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText('Série removida com sucesso.')
    await page.popup.close()
    await page.tvshows.shouldNotHave(tvshow.title)
})

test('não deve cadastrar série quando o título é duplicado', async ({ page, request }) => {
    const tvshow = data.duplicate
    await request.api.setToken()
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goList()
    await page.tvshows.create(tvshow)
    await page.popup.haveText(
        `O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    )
})

test('não deve cadastrar série quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goList()
    await page.tvshows.goForm()
    await page.tvshows.submit()
    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('deve realizar busca de séries pelo termo zumbi', async ({ page, request }) => {
    const tvshows = data.search
    await request.api.setToken()
    for (const tvshow of tvshows.data) {
        await request.api.postTvShow(tvshow)
    }

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goList()
    await page.tvshows.tableHave(tvshows.data.map(tvshow => tvshow.title))
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})
