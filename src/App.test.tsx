import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './storage'

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('AC-1: adds a todo and clears the input', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByRole('textbox', { name: 'New todo' })
    await user.type(input, 'Buy milk{Enter}')

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).not.toBeChecked()
    expect(input).toHaveValue('')
  })

  it('AC-2: does not add a todo for blank input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'New todo' }), '   ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(screen.getByText('No todos yet')).toBeInTheDocument()
  })

  it('AC-6: shows the empty state when stored data is invalid', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    render(<App />)
    expect(screen.getByText('No todos yet')).toBeInTheDocument()
  })
})
