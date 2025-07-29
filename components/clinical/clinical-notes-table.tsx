"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, FileText, Calendar, User, Stethoscope, Filter } from "lucide-react"
import Link from "next/link"
import { getClinicalNotesAction } from "@/app/actions/clinical"
import { toast } from "sonner"

interface ClinicalNotesTableProps {
  userRole: string
}

interface ClinicalNote {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  date: string
  treatmentType: string
  diagnosis: string
  chiefComplaint: string
  treatment: string
  status: string
  createdAt: string
}

export function ClinicalNotesTable({ userRole }: ClinicalNotesTableProps) {
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<ClinicalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadClinicalNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [clinicalNotes, searchTerm, statusFilter])

  const loadClinicalNotes = async () => {
    setLoading(true)
    try {
      const result = await getClinicalNotesAction()
      if (result.success) {
        setClinicalNotes(result.clinicalNotes || [])
      } else {
        toast.error("Failed to load clinical notes")
      }
    } catch (error) {
      toast.error("Error loading clinical notes")
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = clinicalNotes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.dentistName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((note) => note.status === statusFilter)
    }

    setFilteredNotes(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTreatmentTypeColor = (type: string) => {
    const colors = {
      Consultation: "bg-purple-100 text-purple-800",
      Cleaning: "bg-green-100 text-green-800",
      Filling: "bg-yellow-100 text-yellow-800",
      "Root Canal": "bg-red-100 text-red-800",
      "Crown Placement": "bg-blue-100 text-blue-800",
      "Tooth Extraction": "bg-orange-100 text-orange-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                  <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <CardTitle className="text-lg font-semibold text-gray-900">Clinical Notes ({filteredNotes.length})</CardTitle>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No clinical notes found</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Clinical notes will appear here after treatments"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{note.chiefComplaint}</h3>
                      <Badge className={getTreatmentTypeColor(note.treatmentType)}>{note.treatmentType}</Badge>
                      {getStatusBadge(note.status)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{note.patientName}</span>
                          <span className="text-gray-400">({note.patientId})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Stethoscope className="w-4 h-4" />
                          <span>{note.dentistName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(note.date)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p className="mb-1">
                          <strong>Diagnosis:</strong> {note.diagnosis}
                        </p>
                        <p className="truncate">
                          <strong>Treatment:</strong> {note.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/clinical/${note.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
