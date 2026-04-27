export const NavBar = () => {
  return (
    <nav className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white">
          N
        </div>
        <span className="text-sm font-semibold text-slate-900">NumericTree</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          Home
        </button>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          Login
        </button>
      </div>
    </nav>
  )
}
