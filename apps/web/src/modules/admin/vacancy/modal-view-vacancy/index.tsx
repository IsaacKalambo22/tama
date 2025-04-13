"use client"
import { Button } from "@/components/ui/button"
import { VacancyProps } from "@/lib/api" // Adjust this import to the actual location of VacancyProps
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  vacancy: VacancyProps // Make sure to adjust this based on the structure of your vacancy object
}

const ModalViewVacancy = ({ isOpen, onClose, vacancy }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={vacancy.title || "Vacancy Details"}
    >
      <div className="overflow-auto max-h-[80vh] p-4">
        {/* Vacancy Title */}
        <div>
          <h2 className="text-xl font-semibold">{vacancy.title}</h2>
          <p className="text-gray-600 text-sm mt-2">{vacancy.description}</p>
        </div>

        {/* Company and Location */}
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Company:</span> {vacancy.company}
          </p>
          <p className="text-sm">
            <span className="font-medium">Location:</span> {vacancy.location}
          </p>
        </div>

        {/* Salary */}
        {vacancy.salary && (
          <div>
            <h3 className="text-sm font-medium">Salary</h3>
            <p className="text-sm text-gray-800">{vacancy.salary}</p>
          </div>
        )}

        {/* Application Deadline */}
        {vacancy.applicationDeadline && (
          <div>
            <h3 className="text-sm font-medium">Application Deadline</h3>
            <p className="text-sm text-gray-800">
              {new Date(vacancy.applicationDeadline).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Vacancy Status */}
        <div>
          <h3 className="text-sm font-medium">Status</h3>
          <p className="text-sm text-gray-800">{vacancy.status}</p>
        </div>

        {/* Duties */}
        {vacancy.duties && (
          <div>
            <h3 className="text-sm font-medium">Duties</h3>
            <p className="text-sm text-gray-800">{vacancy.duties}</p>
          </div>
        )}

        {/* Qualifications */}
        {vacancy.qualifications && (
          <div>
            <h3 className="text-sm font-medium">Qualifications</h3>
            <p className="text-sm text-gray-800">{vacancy.qualifications}</p>
          </div>
        )}

        {/* How to Apply */}
        {vacancy.howToApply && (
          <div>
            <h3 className="text-sm font-medium">How to Apply</h3>
            <p className="text-sm text-gray-800">{vacancy.howToApply}</p>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default ModalViewVacancy
