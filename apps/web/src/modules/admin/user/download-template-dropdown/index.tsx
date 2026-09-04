"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProps } from "@/lib/api"
import { jsPDF } from "jspdf"
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react"
import * as XLSX from "xlsx"

const TABLE_HEADERS = ["#", "Name", "Email", "Phone Number", "Role", "District"]
const EXCEL_HEADERS = ["name", "email", "phoneNumber", "role", "district"]

interface Props {
  users: UserProps[]
}

function downloadExcel(users: UserProps[]) {
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.phoneNumber,
    u.role,
    u.district || "",
  ])
  const ws = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Users")
  XLSX.writeFile(wb, "all_system_users.xlsx")
}

async function downloadPDF(users: UserProps[]) {
  const doc = new jsPDF()

  let logoDataUrl: string | null = null
  try {
    const res = await fetch("/assets/images/logo.png")
    const blob = await res.blob()
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    // Logo not available, continue without it
  }

  let currentY = 14

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 14, currentY, 30, 30)
    currentY += 12
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("All System Users", 50, currentY)
    currentY += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("Tama Farmers Trust", 50, currentY)
    currentY += 14
  } else {
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("All System Users", 14, currentY + 10)
    currentY += 16
  }

  doc.setTextColor(0, 0, 0)

  const tableX = 14
  const colWidths = [10, 35, 50, 35, 25, 30]
  const rowHeight = 9
  const tableWidth = colWidths.reduce((a, b) => a + b, 0)
  const pageWidth = doc.internal.pageSize.getWidth()
  const usableWidth = pageWidth - 2 * 14

  function drawHeader() {
    doc.setFillColor(34, 139, 34)
    doc.rect(tableX, currentY, tableWidth, rowHeight, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    let hx = tableX
    TABLE_HEADERS.forEach((header, i) => {
      doc.text(header, hx + 3, currentY + 6.5)
      hx += colWidths[i]
    })
    currentY += rowHeight
  }

  function checkPageBreak() {
    if (currentY + rowHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      currentY = 20
      drawHeader()
    }
  }

  drawHeader()

  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)

  users.forEach((user, rowIdx) => {
    checkPageBreak()

    if (rowIdx % 2 === 0) {
      doc.setFillColor(245, 247, 250)
      doc.rect(tableX, currentY, tableWidth, rowHeight, "F")
    }

    const rowData = [
      String(rowIdx + 1),
      user.name || "",
      user.email || "",
      user.phoneNumber || "",
      user.role || "",
      user.district || "",
    ]

    let cx = tableX
    rowData.forEach((cell, colIdx) => {
      const maxChars = Math.floor(colWidths[colIdx] / 2)
      const truncated =
        cell.length > maxChars ? cell.slice(0, maxChars - 2) + ".." : cell
      doc.text(truncated, cx + 3, currentY + 6.5)
      cx += colWidths[colIdx]
    })

    doc.setDrawColor(220, 220, 220)
    doc.line(
      tableX,
      currentY + rowHeight,
      tableX + tableWidth,
      currentY + rowHeight
    )
    currentY += rowHeight
  })

  doc.setDrawColor(34, 139, 34)
  doc.setLineWidth(0.5)
  doc.rect(
    tableX,
    currentY - rowHeight * users.length - rowHeight,
    tableWidth,
    rowHeight * (users.length + 1)
  )

  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Total: ${users.length} users | Generated on ${new Date().toLocaleDateString()}`,
    14,
    pageHeight - 10
  )

  doc.save("all_system_users.pdf")
}

export default function DownloadTemplateDropdown({ users }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Users
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => downloadExcel(users)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Download as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadPDF(users)}>
          <FileText className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
