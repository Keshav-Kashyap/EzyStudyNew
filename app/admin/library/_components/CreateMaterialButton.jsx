"use client";

import React, { useState } from 'react'
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Plus, BookOpen, FileText, Users } from 'lucide-react'
import FormCreateMaterial from './formCreateMaterail'
import FormCreateCourse from './FormCreateCourse'
import FormCreateSemester from './FormCreateSemester'
import FormCreateSubject from './FormCreateSubject'
const CreateMaterialButton = ({ formtype, buttonText, icon: IconComponent, onSuccess, category, semesterName }) => {
    console.log("formType", formtype);
    const [isOpen, setIsOpen] = useState(false)

    // Button configuration based on formtype
    const getButtonConfig = () => {
        switch (formtype) {
            case "material":
                return {
                    text: buttonText || "Upload Material",
                    icon: IconComponent || Upload,
                    className: "bg-white text-black hover:bg-gray-200"
                }
            case "course":
                return {
                    text: buttonText || "Create Course",
                    icon: IconComponent || BookOpen,
                    className: "bg-blue-600 text-white hover:bg-blue-700"
                }
            case "semester":
                return {
                    text: buttonText || "Add Semester",
                    icon: IconComponent || Plus,
                    className: "bg-green-600 text-white hover:bg-green-700"
                }
            case "subject":
                return {
                    text: buttonText || "Add Subject",
                    icon: IconComponent || FileText,
                    className: "bg-purple-600 text-white hover:bg-purple-700"
                }
            default:
                return {
                    text: buttonText || "Create",
                    icon: IconComponent || Plus,
                    className: "bg-gray-600 text-white hover:bg-gray-700"
                }
        }
    }

    const buttonConfig = getButtonConfig()
    const ButtonIcon = buttonConfig.icon

    return (
        <div className='bg-[#242426] flex items-center justify-center p-4'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className={`${buttonConfig.className} px-8 py-6 text-lg`}>
                        <ButtonIcon className="mr-2 h-5 w-5" />
                        {buttonConfig.text}
                    </Button>
                </DialogTrigger>

                {/* Render different forms based on formtype */}
                {formtype === "material" && <FormCreateMaterial onClose={() => setIsOpen(false)} onSuccess={onSuccess} />}
                {formtype === "course" && <FormCreateCourse onClose={() => setIsOpen(false)} onSuccess={onSuccess} />}
                {formtype === "semester" && <FormCreateSemester onClose={() => setIsOpen(false)} onSuccess={onSuccess} />}
                {formtype === "subject" && (
                    <FormCreateSubject
                        onClose={() => setIsOpen(false)}
                        onSuccess={onSuccess}
                        category={category}
                        semesterName={semesterName}
                    />
                )}
            </Dialog>
        </div>
    )
}

export default CreateMaterialButton