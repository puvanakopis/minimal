'use client'

import { useRouter } from 'next/navigation'

export default function useNavigateTo() {
    const router = useRouter()

    const navigateTo = (path: string, isTop: boolean = true) => {
        router.push(path)

        if (isTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return navigateTo
}