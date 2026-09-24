const { test, expect } = require('../support/index')

test('deve logar como administrador', async ({page}) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.login.isLoggedin()
})

test('não deve logar com senha incorreta', async ({page}) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'abc123')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente'
    await page.toast.containText(message)
})

test('não deve logar quando email é invalido', async ({page}) => {
    await page.login.visit()
    await page.login.submit('www.237.com.br', 'abc123')
    await page.login.alertHaveText('Email incorreto')
})

test('não deve logar quando o email não é preenchido', async ({page}) => {
    await page.login.visit()
    await page.login.submit('', 'abc123')
    await page.login.alertHaveText('Campo Obrigatorio')
})

test('não deve logar quando a senha não é preenchida', async ({page}) => {
    await page.login.visit()
    await page.login.submit('n4ndo8@example.com', '')
    await page.login.alertHaveText('Campo Obrigatorio')
})

test('não deve logar quando nenhum campo é preenchido', async ({page}) => {
    await page.login.visit()
    await page.login.submit('', '')
    await page.login.alertHaveText('Campo Obrigatório', 'Campo Obrigatório')
})