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
import { bulkImportUsers } from "@/modules/admin/actions"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  FolderOpen,
  Upload,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Papa from "papaparse"
import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import * as XLSX from "xlsx"

interface ParsedRow {
  name: string
  email: string
  phoneNumber: string
  role: string
  district: string
}

interface ValidatedRow extends ParsedRow {
  rowIndex: number
  isValid: boolean
  errors: string[]
}

interface ImportResult {
  row: number
  email: string
  status: "success" | "failed"
  reason?: string
  userId?: string
  message?: string
}

interface ImportSummary {
  total: number
  succeeded: number
  failed: number
  results: ImportResult[]
}

type Step = "upload" | "preview" | "processing" | "results"

const VALID_ROLES = ["ADMIN", "MANAGER", "USER"]

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

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

  if (!row.name || row.name.trim().length < 2) {
    errors.push("Name is required (minimum 2 characters)")
  }
  if (!row.email || !isValidEmail(row.email.trim())) {
    errors.push("A valid email address is required")
  }
  if (!row.phoneNumber || !isValidE164Phone(row.phoneNumber.trim())) {
    errors.push(
      "A valid phone number in E.164 format is required (e.g., +1234567890)"
    )
  }
  const role = row.role?.trim().toUpperCase() || "USER"
  if (!VALID_ROLES.includes(role)) {
    errors.push(
      `Invalid role '${row.role}'. Must be one of: ADMIN, MANAGER, USER`
    )
  }

  return {
    ...row,
    rowIndex,
    isValid: errors.length === 0,
    errors,
  }
}

function checkDuplicates(rows: ValidatedRow[]): ValidatedRow[] {
  const seenEmails = new Map<string, number>()
  const seenPhones = new Map<string, number>()

  return rows.map((row) => {
    const newErrors = [...row.errors]
    const email = row.email?.trim().toLowerCase()
    const phone = row.phoneNumber?.trim()

    if (email && isValidEmail(email)) {
      if (seenEmails.has(email)) {
        newErrors.push(
          `Duplicate email (first seen in row ${seenEmails.get(email)! + 1})`
        )
      } else {
        seenEmails.set(email, row.rowIndex)
      }
    }

    if (phone && isValidE164Phone(phone)) {
      if (seenPhones.has(phone)) {
        newErrors.push(
          `Duplicate phone number (first seen in row ${seenPhones.get(phone)! + 1})`
        )
      } else {
        seenPhones.set(phone, row.rowIndex)
      }
    }

    return {
      ...row,
      errors: newErrors,
      isValid: newErrors.length === 0,
    }
  })
}

export default function BulkUserImportPage() {
  const [step, setStep] = useState<Step>("upload")
  const [fileName, setFileName] = useState<string>("")
  const [parsedRows, setParsedRows] = useState<ValidatedRow[]>([])
  const [importResult, setImportResult] = useState<ImportSummary | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function handleBrowseChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onDrop([file])
    e.target.value = ""
  }

  function processParsedData(data: ParsedRow[]) {
    const normalized = data.map((row) => ({
      name: (row.name || "").trim(),
      email: (row.email || "").trim(),
      phoneNumber: (row.phoneNumber || "").trim(),
      role: (row.role || "USER").trim(),
      district: (row.district || "").trim(),
    }))

    const validated = normalized.map((row, i) => validateRow(row, i))
    const withDupCheck = checkDuplicates(validated)
    setParsedRows(withDupCheck)
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
        users: validRows.map((r) => ({
          name: r.name,
          email: r.email,
          phoneNumber: r.phoneNumber,
          role: (r.role?.toUpperCase() || "USER") as string,
          district: r.district || undefined,
        })),
      }

      const result = await bulkImportUsers(payload)

      if (result.success && result.data) {
        setImportResult(result.data)
        setStep("results")
        toast.success(
          `Import completed: ${result.data.succeeded} succeeded, ${result.data.failed} failed`
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
          <h1 className="text-2xl font-bold">Bulk User Import</h1>
          <p className="text-muted-foreground">
            Import multiple users from a CSV or Excel file
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleBrowseChange}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Template Format</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your file should have the following columns:
            </p>
            <code className="block text-xs bg-background p-2 rounded">
              name,email,phoneNumber,role,district
              <br />
              John Doe,john@example.com,+1234567890,USER,Central
            </code>
            <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>
                <strong>name</strong> - Required (min 2 characters)
              </li>
              <li>
                <strong>email</strong> - Required (valid email format)
              </li>
              <li>
                <strong>phoneNumber</strong> - Required (E.164 format, e.g.,
                +1234567890)
              </li>
              <li>
                <strong>role</strong> - Optional (ADMIN, MANAGER, or USER.
                Defaults to USER)
              </li>
              <li>
                <strong>district</strong> - Optional
              </li>
            </ul>
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
                {isProcessing ? "Processing..." : `Import ${validCount} Users`}
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
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>District</TableHead>
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
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {row.phoneNumber}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {row.role?.toUpperCase() || "USER"}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.district || "—"}</TableCell>
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
            <p className="mt-4 text-lg font-medium">Processing import...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we create the user accounts
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

          <div className="grid grid-cols-3 gap-4">
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
                <p className="text-xs text-muted-foreground">
                  Successfully Created
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {importResult.failed}
                </div>
                <p className="text-xs text-muted-foreground">Failed</p>
              </CardContent>
            </Card>
          </div>

          {importResult.failed > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Failed Rows</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResult.results
                      .filter((r) => r.status === "failed")
                      .map((r) => (
                        <TableRow key={r.row}>
                          <TableCell className="font-mono">
                            {r.row + 1}
                          </TableCell>
                          <TableCell>{r.email}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Failed</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-red-600">
                            {r.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {importResult.succeeded > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Successfully Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
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
                          <TableCell>{r.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Created
                            </Badge>
                          </TableCell>
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
