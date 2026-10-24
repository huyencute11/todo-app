import { expect, test, type Page } from '@playwright/test'

async function addTodo(page: Page, title: string) {
  await page.getByRole('textbox', { name: 'New todo' }).fill(title)
  await page.getByRole('textbox', { name: 'New todo' }).press('Enter')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('AC-1: adds a todo', async ({ page }) => {
  await expect(page.getByText('No todos yet')).toBeVisible()

  await addTodo(page, 'Buy milk')

  await expect(page.getByRole('checkbox', { name: 'Buy milk' })).not.toBeChecked()
  await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('')
})

test('AC-3: toggles completion', async ({ page }) => {
  await addTodo(page, 'Buy milk')
  const checkbox = page.getByRole('checkbox', { name: 'Buy milk' })
  const title = page.getByRole('listitem').getByText('Buy milk')

  await checkbox.check()
  await expect(checkbox).toBeChecked()
  await expect(title).toHaveCSS('text-decoration-line', 'line-through')

  await checkbox.uncheck()
  await expect(checkbox).not.toBeChecked()
  await expect(title).toHaveCSS('text-decoration-line', 'none')
})

test('AC-4: deletes a todo', async ({ page }) => {
  await addTodo(page, 'A')
  await addTodo(page, 'B')

  await page.getByRole('button', { name: 'Delete A' }).click()

  await expect(page.getByRole('listitem')).toHaveCount(1)
  await expect(page.getByRole('checkbox', { name: 'B' })).toBeVisible()
})

test('AC-5: persists across reload', async ({ page }) => {
  await addTodo(page, 'Buy milk')
  await addTodo(page, 'Walk dog')
  await page.getByRole('checkbox', { name: 'Buy milk' }).check()

  await page.reload()

  await expect(page.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Walk dog' })).not.toBeChecked()
})
