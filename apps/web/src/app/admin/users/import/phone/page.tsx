"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { bulkImportPhoneNumbers } from "@/modules/admin/actions"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Download,
  FileText,
  Upload,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Papa from "papaparse"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import * as XLSX from "xlsx"

interface ParsedRow {
  name: string
  email: string
  phoneNumber: string
}

interface ValidatedRow extends ParsedRow {
  rowIndex: number
  isValid: boolean
  errors: string[]
}

interface PhoneImportResult {
  row: number
  email?: string
  name?: string
  phoneNumber: string
  status: "success" | "failed" | "unmatched" | "ambiguous"
  reason?: string
  matchedUserId?: string
  message?: string
}

interface ImportSummary {
  total: number
  succeeded: number
  failed: number
  unmatched: number
  ambiguous: number
  results: PhoneImportResult[]
}

type Step = "upload" | "preview" | "processing" | "results"

function isValidE164Phone(phone: string): boolean {
  try {
    const parsed = parsePhoneNumberFromString(phone)
    return parsed ? parsed.isValid() && parsed.number === phone : false
  } catch {
    return false
  }
}

function validateRow(row: ParsedRow, rowIndex: number): ValidatedRow {
  const errors: string[] = []

  if (!row.name?.trim() && !row.email?.trim()) {
    errors.push("At least one of name or email is required for matching")
  }
  if (!row.phoneNumber || !isValidE164Phone(row.phoneNumber.trim())) {
    errors.push(
      "A valid phone number in E.164 format is required (e.g., +1234567890)"
    )
  }

  return {
    name: (row.name || "").trim(),
    email: (row.email || "").trim(),
    phoneNumber: (row.phoneNumber || "").trim(),
    rowIndex,
    isValid: errors.length === 0,
    errors,
  }
}

export default function PhoneImportPage() {
  const [step, setStep] = useState<Step>("upload")
  const [fileName, setFileName] = useState<string>("")
  const [parsedRows, setParsedRows] = useState<ValidatedRow[]>([])
  const [importResult, setImportResult] = useState<ImportSummary | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const ext = file.name.split(".").pop()?.toLowerCase()
    if (ext !== "csv" && ext !== "xlsx") {
      toast.error("Only .csv and .xlsx files are accepted")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setFileName(file.name)

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data as ParsedRow[])
        },
        error: () => {
          toast.error("Failed to parse CSV file")
        },
      })
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(worksheet)
          processParsedData(jsonData)
        } catch {
          toast.error("Failed to parse Excel file")
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }, [])

  function processParsedData(data: ParsedRow[]) {
    const normalized = data.map((row) => ({
      name: (row.name || "").trim(),
      email: (row.email || "").trim(),
      phoneNumber: (row.phoneNumber || "").trim(),
    }))

    const validated = normalized.map((row, i) => validateRow(row, i))
    setParsedRows(validated)
    setStep("preview")
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    multiple: false,
  })

  function downloadTemplate() {
    const headers = ["name", "email", "phoneNumber"]
    const sampleRows = [
      ["John Doe", "john@example.com", "+1234567890"],
      ["Jane Smith", "jane@example.com", "+0987654321"],
    ]
    const csv = [headers.join(","), ...sampleRows.map((r) => r.join(","))].join(
      "\n"
    )
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "phone_import_template.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport() {
    const validRows = parsedRows.filter((r) => r.isValid)
    if (validRows.length === 0) {
      toast.error("No valid rows to import")
      return
    }

    setIsProcessing(true)
    setStep("processing")

    try {
      const payload = {
        phoneUpdates: validRows.map((r) => ({
          name: r.name || undefined,
          email: r.email || undefined,
          phoneNumber: r.phoneNumber,
        })),
      }

      const result = await bulkImportPhoneNumbers(payload)

      if (result.success && result.data) {
        setImportResult(result.data)
        setStep("results")
        toast.success(
          `Phone import completed: ${result.data.succeeded} updated, ${result.data.unmatched} unmatched, ${result.data.ambiguous} ambiguous`
        )
      } else {
        toast.error(result.error || "Import failed")
        setStep("preview")
      }
    } catch {
      toast.error("An unexpected error occurred")
      setStep("preview")
    } finally {
      setIsProcessing(false)
    }
  }

  function resetImport() {
    setStep("upload")
    setFileName("")
    setParsedRows([])
    setImportResult(null)
  }

  const validCount = parsedRows.filter((r) => r.isValid).length
  const invalidCount = parsedRows.filter((r) => !r.isValid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Phone Number Import</h1>
          <p className="text-muted-foreground">
            Update phone numbers for existing users by matching name or email
          </p>
        </div>
      </div>

      {step === "upload" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the file here..."
                    : "Drag and drop a CSV or Excel file here, or click to select"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Accepted formats: .csv, .xlsx (max 5MB)
                </p>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">How It Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Upload a file with <strong>name</strong>, <strong>email</strong>
                , and <strong>phoneNumber</strong> columns
              </li>
              <li>
                Users are matched first by <strong>exact email</strong>, then by{" "}
                <strong>fuzzy name match</strong>
              </li>
              <li>
                If multiple users match a name, the row is flagged as{" "}
                <strong>ambiguous</strong> for manual review
              </li>
              <li>
                At least one of name or email must be provided for matching
              </li>
            </ul>
            <h3 className="font-medium mt-4 mb-2">Template Format</h3>
            <code className="block text-xs bg-background p-2 rounded">
              name,email,phoneNumber
              <br />
              John Doe,john@example.com,+1234567890
            </code>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <div>
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {parsedRows.length} rows found
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetImport}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={validCount === 0 || isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Update ${validCount} Phone Numbers`}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{parsedRows.length}</div>
                <p className="text-xs text-muted-foreground">Total Rows</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {validCount}
                </div>
                <p className="text-xs text-muted-foreground">Valid Rows</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {invalidCount}
                </div>
                <p className="text-xs text-muted-foreground">Invalid Rows</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row) => (
                      <TableRow
                        key={row.rowIndex}
                        className={row.isValid ? "" : "bg-red-50"}
                      >
                        <TableCell className="font-mono text-sm">
                          {row.rowIndex + 1}
                        </TableCell>
                        <TableCell>{row.name || "—"}</TableCell>
                        <TableCell>{row.email || "—"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {row.phoneNumber}
                        </TableCell>
                        <TableCell>
                          {row.isValid ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Valid
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Invalid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          {row.errors.length > 0 && (
                            <ul className="text-xs text-red-600 list-disc list-inside">
                              {row.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "processing" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-lg font-medium">
              Processing phone updates...
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we match and update phone numbers
            </p>
          </CardContent>
        </Card>
      )}

      {step === "results" && importResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Import Results</h2>
            <Button onClick={resetImport}>Import Another File</Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{importResult.total}</div>
                <p className="text-xs text-muted-foreground">Total Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.succeeded}
                </div>
                <p className="text-xs text-muted-foreground">Updated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {importResult.unmatched}
                </div>
                <p className="text-xs text-muted-foreground">Unmatched</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">
                  {importResult.ambiguous}
                </div>
                <p className="text-xs text-muted-foreground">Ambiguous</p>
              </CardContent>
            </Card>
          </div>

          {importResult.succeeded > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Successfully Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>New Phone</TableHead>
                      <TableHead>Match Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResult.results
                      .filter((r) => r.status === "success")
                      .map((r) => (
                        <TableRow key={r.row}>
                          <TableCell className="font-mono">
                            {r.row + 1}
                          </TableCell>
                          <TableCell>{r.name || "—"}</TableCell>
                          <TableCell>{r.email || "—"}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {r.phoneNumber}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {r.message}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {(importResult.unmatched > 0 ||
            importResult.ambiguous > 0 ||
            importResult.failed > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Unresolved Rows</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResult.results
                      .filter(
                        (r) =>
                          r.status === "unmatched" ||
                          r.status === "ambiguous" ||
                          r.status === "failed"
                      )
                      .map((r) => (
                        <TableRow key={r.row}>
                          <TableCell className="font-mono">
                            {r.row + 1}
                          </TableCell>
                          <TableCell>{r.name || "—"}</TableCell>
                          <TableCell>{r.email || "—"}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {r.phoneNumber}
                          </TableCell>
                          <TableCell>
                            {r.status === "unmatched" && (
                              <Badge
                                variant="outline"
                                className="text-yellow-600"
                              >
                                Unmatched
                              </Badge>
                            )}
                            {r.status === "ambiguous" && (
                              <Badge
                                variant="outline"
                                className="text-orange-600"
                              >
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Ambiguous
                              </Badge>
                            )}
                            {r.status === "failed" && (
                              <Badge variant="destructive">Failed</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{r.reason}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
