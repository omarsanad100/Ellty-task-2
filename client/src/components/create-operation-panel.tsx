import { SectionCard } from './section-card'

export const CreateOperationPanel = () => {
  return (
    <SectionCard
      title="Reply With Operation"
      description="Apply add/sub/mul/div on any existing node."
    >
      <form className="grid gap-3">
        <label className="grid gap-1 text-sm text-slate-700">
          Parent Node Id
          <input
            type="text"
            placeholder="paste node id"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Operation
          <select className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2">
            <option value="add">add</option>
            <option value="sub">sub</option>
            <option value="mul">mul</option>
            <option value="div">div</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Right Operand
          <input
            type="number"
            placeholder="2"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>

        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          Add Operation
        </button>
      </form>
    </SectionCard>
  )
}
