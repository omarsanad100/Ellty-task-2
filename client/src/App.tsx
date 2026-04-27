import { NavBar } from './components/layout/NavBar'
import { AuthModal } from './components/modals/AuthModal'
import { CreateOperationPanel } from './components/panels/CreateOperationPanel'
import { CreateRootPanel } from './components/panels/CreateRootPanel'
import { CalculationTreePreview } from './components/thread/CalculationTreePreview'
import { usePostAuthToast } from './hooks/use-post-auth-toast'
import { useTreeNodeOptions } from './hooks/use-tree-node-options'
import { useTreeQuery } from './react-query/use-posts-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const treeQuery = useTreeQuery()
  const roots = Array.isArray(treeQuery.data) ? treeQuery.data : []
  const nodeOptions = useTreeNodeOptions(roots)
  usePostAuthToast()

  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8'>
      <NavBar />
      <section className='grid gap-4 lg:grid-cols-2'>
        <CreateRootPanel />
        <CalculationTreePreview
          roots={roots}
          isLoading={treeQuery.isLoading}
        />
      </section>
      <section className='mt-4 grid gap-4'>
        <CreateOperationPanel nodeOptions={nodeOptions} />
      </section>
      <AuthModal />
      <ToastContainer
        position='top-right'
        autoClose={3500}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </main>
  )
}

export default App
