import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Definition = {
  term: string;
  definition: string;
  example: string;
};

type FormProps = {
  mode: "create" | "edit";
  initialValues?: Definition;
  onSuccess?: () => void;
};

const formSchema = z.object({
  term: z.string().min(1, { message: "Term Invalid" }),
  definition: z.string().min(5, { message: "Please add a longer definition" }),
  example: z.string().min(5, { message: "Please add some more information" }),
});

export default function DefinitionForm({
  mode,
  initialValues,
  onSuccess,
}: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialValues ?? {
      term: "",
      definition: "",
      example: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Submission failed", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input placeholder="New Term" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Input placeholder="Definition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <Input placeholder="Example" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
}