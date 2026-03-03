import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import Rte from "../editor/Rte";

type SectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit"; 
};

export default function SectionDialog({
  open,
  onOpenChange,
  mode,
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

        <Rte onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}