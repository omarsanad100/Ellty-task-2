import { SectionCard } from './section-card'

export const CreateRootPanel = () => {
  return (
    <SectionCard
      title="Start New Calculation"
      description="Creates a root number in the discussion tree."
    >
      <form className="grid gap-3">
        <label className="grid gap-1 text-sm text-slate-700">
          Root Value
          <input
            type="number"
            placeholder="42"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          Create Root
        </button>
      </form>
    </SectionCard>
  )
}
