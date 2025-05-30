"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, X, Building2 } from "lucide-react"

export function DepartmentCreationModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headOfDepartment: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Department name is required"
    if (!formData.code) newErrors.code = "Department code is required"
    if (!formData.headOfDepartment) newErrors.headOfDepartment = "Head of Department is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch("http://localhost:8080/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setLoading(false)
      onCreated?.()
      onClose()
    } catch {
      setLoading(false)
      setErrors({ submit: "Failed to create department" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-6 h-6 text-orange-600" />
            Add New Department
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="dept-name">Department Name *</Label>
            <Input
              id="dept-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="dept-code">Department Code *</Label>
            <Input
              id="dept-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
          </div>
          <div>
            <Label htmlFor="dept-head">Head of Department *</Label>
            <Input
              id="dept-head"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              className={errors.headOfDepartment ? "border-red-500" : ""}
            />
            {errors.headOfDepartment && <p className="text-xs text-red-500">{errors.headOfDepartment}</p>}
          </div>
          {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}