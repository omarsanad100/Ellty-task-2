import type { ReactNode } from 'react'

interface Props {
  title: string
  description: string
  children: ReactNode
}

export const SectionCard = ({ title, description, children }: Props) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </header>
      {children}
    </section>
  )
}
