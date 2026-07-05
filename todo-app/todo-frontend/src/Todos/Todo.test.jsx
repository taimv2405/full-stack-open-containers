import { render, screen } from '@testing-library/react'
import Todo from './Todo'

const todo = { _id: '1', text: 'Buy milk', done: false }
const doneTodo = { _id: '2', text: 'Buy eggs', done: true }

test('renders todo text', () => {
  render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />)
  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})

test('shows not done info when todo is not done', () => {
  render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />)
  expect(screen.getByText('This todo is not done')).toBeInTheDocument()
  expect(screen.getByText('Set as done')).toBeInTheDocument()
})

test('shows done info when todo is done', () => {
  render(<Todo todo={doneTodo} deleteTodo={() => {}} completeTodo={() => {}} />)
  expect(screen.getByText('This todo is done')).toBeInTheDocument()
  expect(screen.queryByText('Set as done')).not.toBeInTheDocument()
})
