export type StepNode = {
  id: string
  title: string
  children?: StepNode[]
}

export function isStepNode(x: any): x is StepNode {
  return x && typeof x === "object" && typeof x.title === "string" && (x.children === undefined || Array.isArray(x.children))
}

export function isSteps(data: any): data is StepNode[] {
  if (!Array.isArray(data)) return false
  for (const s of data) {
    if (!isStepNode(s)) return false
    if (Array.isArray(s.children)) {
      for (const c of s.children) if (!isStepNode(c)) return false
    }
  }
  return true
}

export function normalizeSteps(input: any): StepNode[] {
  if (isSteps(input)) return input
  if (Array.isArray(input)) {
    return input.map((v: any) => {
      if (typeof v === "string") return { id: cryptoId(), title: String(v) }
      if (v && typeof v.title === "string") {
        return {
          id: typeof v.id === "string" ? v.id : cryptoId(),
          title: v.title,
          children: Array.isArray(v.children)
            ? v.children.map((c: any) => ({
                id: typeof c?.id === "string" ? c.id : cryptoId(),
                title: String(c?.title ?? "")
              })).filter((c: StepNode) => c.title.trim() !== "")
            : undefined
        }
      }
      return { id: cryptoId(), title: String(v) }
    }).filter((s: StepNode) => s.title.trim() !== "")
  }
  return []
}

export function flattenSteps(steps: StepNode[]): { i: number; j: number | null; title: string }[] {
  const out: { i: number; j: number | null; title: string }[] = []
  steps.forEach((s, i) => {
    out.push({ i, j: null, title: s.title })
    if (s.children?.length) {
      s.children.forEach((c, j) => out.push({ i, j, title: c.title }))
    }
  })
  return out
}

export function countSteps(steps: StepNode[]): number {
  return flattenSteps(steps).length
}

export function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}
