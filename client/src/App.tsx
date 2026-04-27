import { AuthPanel } from './components/auth-panel'
import { CalculationTreePreview } from './components/calculation-tree-preview'
import { CreateOperationPanel } from './components/create-operation-panel'
import { CreateRootPanel } from './components/create-root-panel'
import { NavBar } from './components/nav-bar'
import type { CalculationNode } from './types/calculation.types'

const sampleTree: CalculationNode[] = [
  {
    id: 'root-44',
    value: 44,
    parentId: null,
    operation: null,
    right: null,
    userId: 'user-a',
    createdAt: '2026-04-27T00:00:00.000Z',
    children: [
      {
        id: 'node-50',
        value: 50,
        parentId: 'root-44',
        operation: 'add',
        right: 6,
        userId: 'user-a',
        createdAt: '2026-04-27T00:01:00.000Z',
        children: []
      }
    ]
  }
]

const App = () => {
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8'>
      <NavBar />
      <section className='grid gap-4 lg:grid-cols-2'>
        <AuthPanel />
        <CreateRootPanel />
      </section>
      <section className='mt-4 grid gap-4 lg:grid-cols-2'>
        <CreateOperationPanel />
        <CalculationTreePreview roots={sampleTree} />
      </section>
    </main>
  )
}

export default App
