import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import DefinitionForm from "./DefinitionForm";

type Definition = {
  term: string;
  definition: string;
  example: string;
};

type DefinitionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValues?: Definition;
};

export default function DefinitionDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
}: DefinitionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add New Definition"
              : "Edit Definition"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Add a new term to this course."
              : "Update this definition."}
          </DialogDescription>
        </DialogHeader>

        <DefinitionForm
          mode={mode}
          initialValues={initialValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}