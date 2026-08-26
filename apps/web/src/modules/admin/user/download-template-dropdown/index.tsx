"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react"
import { jsPDF } from "jspdf"
import * as XLSX from "xlsx"

const HEADERS = ["#", "Name", "Email", "Phone Number", "Role", "District"]
const HEADERS_KEYS = ["name", "email", "phoneNumber", "role", "district"]
const SAMPLE_ROWS = [
  ["John Doe", "john@example.com", "+1234567890", "USER", "Central"],
  ["Jane Smith", "jane@example.com", "+0987654321", "MANAGER", "Northern"],
]

function downloadExcel() {
  const ws = XLSX.utils.aoa_to_sheet([HEADERS_KEYS, ...SAMPLE_ROWS])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Template")
  XLSX.writeFile(wb, "bulk_user_import_template.xlsx")
}

async function downloadPDF() {
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

  doc.setFillColor(34, 139, 34)
  doc.rect(tableX, currentY, tableWidth, rowHeight, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  let x = tableX
  HEADERS.forEach((header, i) => {
    doc.text(header, x + 3, currentY + 6.5)
    x += colWidths[i]
  })
  currentY += rowHeight

  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)

  SAMPLE_ROWS.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(245, 247, 250)
      doc.rect(tableX, currentY, tableWidth, rowHeight, "F")
    }

    let cx = tableX
    const rowData = [String(rowIdx + 1), ...row]
    rowData.forEach((cell, colIdx) => {
      doc.text(cell, cx + 3, currentY + 6.5)
      cx += colWidths[colIdx]
    })

    doc.setDrawColor(220, 220, 220)
    doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight)
    currentY += rowHeight
  })

  doc.setDrawColor(34, 139, 34)
  doc.setLineWidth(0.5)
  doc.rect(tableX, currentY - rowHeight * SAMPLE_ROWS.length - rowHeight, tableWidth, rowHeight * (SAMPLE_ROWS.length + 1))

  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    14,
    pageHeight - 10
  )

  doc.save("all_system_users_template.pdf")
}

export default function DownloadTemplateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Template
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Download as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
