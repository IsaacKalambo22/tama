"use client"

import { Card } from "@/components/ui/card"
import { formatCount } from "@/lib/utils"
import { JSX, useEffect, useState } from "react"

interface StatisticBlockProps {
  count: string | number
  label: string
  icon: JSX.Element // Icon prop
}

const StatisticBlock = ({ count, label, icon }: StatisticBlockProps) => {
  const [animatedCount, setAnimatedCount] = useState(0)

  useEffect(() => {
    const target =
      typeof count === "number"
        ? count
        : parseInt(count.replace(/[^0-9.-]+/g, ""))
    const increment = target / 100 // How fast to increment, you can adjust this value
    let current = 0

    const interval = setInterval(() => {
      if (current < target) {
        current += increment
        setAnimatedCount(Math.floor(current))
      } else {
        setAnimatedCount(target)
        clearInterval(interval)
      }
    }, 30) // Update every 30ms for smooth animation

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [count])

  return (
    <Card className="flex flex-col items-center p-6 rounded-2xl shadow-none">
      <div className=" text-4xl mb-4 text-gray-700">{icon}</div>
      <h1 className="text-[2.5rem] font-bold text-gray-700">
        {formatCount(animatedCount)}
      </h1>
      <p className="text-center mt-2 text-lg font-medium text-gray-700">
        {label}
      </p>
    </Card>
  )
}

export default StatisticBlock
