import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import Rte from "../editor/Rte";
import type { Section } from "@/api/sectionsApi";

type SectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  courseCode: string;
  initialValues?: Section; 
};

export default function SectionDialog({
  open,
  onOpenChange,
  mode,
  courseCode,
  initialValues,
}: SectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create a New Section" : "Edit Section"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "When done, this section will be added to the course!"
              : "Update the content of this section."}
          </DialogDescription>
        </DialogHeader>

        <Rte onSuccess={() => onOpenChange(false)}
            initialValues={{
              title: initialValues?.title,
              subtitle: initialValues?.description,
              content: initialValues?.body,
            }}
            courseCode={courseCode}
            />
      </DialogContent>
    </Dialog>
  );
}