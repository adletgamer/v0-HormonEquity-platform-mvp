'use client'

import { useRouter } from 'next/navigation'
import { CareNavigator, type NavigatorResult } from '@/components/care-navigator'

export default function EvaluarPage() {
  const router = useRouter()

  const handleComplete = (result: NavigatorResult) => {
    const encoded = encodeURIComponent(JSON.stringify(result))
    router.push(`/resultados?data=${encoded}`)
  }

  return <CareNavigator onComplete={handleComplete} />
}
