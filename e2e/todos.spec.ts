import type { Page } from '@playwright/test'
import { expect, test } from './evidence.ts'

async function addTodo(page: Page, title: string) {
  await page.getByRole('textbox', { name: 'New todo' }).fill(title)
  await page.getByRole('textbox', { name: 'New todo' }).press('Enter')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('AC-1: adds a todo', async ({ page, evidence }) => {
  await expect(page.getByText('No todos yet')).toBeVisible()
  await evidence('AC-1-before-empty')

  await addTodo(page, 'Buy milk')

  await expect(page.getByRole('checkbox', { name: 'Buy milk' })).not.toBeChecked()
  await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('')
  await evidence('AC-1-todo-added')
})

test('AC-3: toggles completion', async ({ page, evidence }) => {
  await addTodo(page, 'Buy milk')
  const checkbox = page.getByRole('checkbox', { name: 'Buy milk' })
  const title = page.getByRole('listitem').getByText('Buy milk')

  await checkbox.check()
  await expect(checkbox).toBeChecked()
  await expect(title).toHaveCSS('text-decoration-line', 'line-through')
  await evidence('AC-3-completed')

  await checkbox.uncheck()
  await expect(checkbox).not.toBeChecked()
  await expect(title).toHaveCSS('text-decoration-line', 'none')
  await evidence('AC-3-active-again')
})

test('AC-4: deletes a todo', async ({ page, evidence }) => {
  await addTodo(page, 'A')
  await addTodo(page, 'B')
  await expect(page.getByRole('listitem')).toHaveCount(2)
  await evidence('AC-4-before-delete')

  await page.getByRole('button', { name: 'Delete A' }).click()

  await expect(page.getByRole('listitem')).toHaveCount(1)
  await expect(page.getByRole('checkbox', { name: 'B' })).toBeVisible()
  await evidence('AC-4-deleted')
})

test('AC-5: persists across reload', async ({ page, evidence }) => {
  await addTodo(page, 'Buy milk')
  await addTodo(page, 'Walk dog')
  await page.getByRole('checkbox', { name: 'Buy milk' }).check()
  await expect(page.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked()
  await evidence('AC-5-before-reload')

  await page.reload()

  await expect(page.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Walk dog' })).not.toBeChecked()
  await evidence('AC-5-after-reload')
})
