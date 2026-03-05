import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/input"
import TipTap from "./TipTap"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import type { Section } from "@/api/sectionsApi"
import { createSection, updateSection } from "@/api/sectionsApi"

type RteProps = {
    onSuccess?: (section: Section) => void;
    courseCode: string;
    mode: "create" | "edit";
    sectionId?: string;
    initialValues?: {
        title?: string;
        description?: string;
        body?: string;
    };
};

export default function Rte({onSuccess, courseCode, mode, sectionId, initialValues}: RteProps) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const formSchema = z.object({
        title: z.string().min(5,{message: "Title is not long enough"}),
        description: z.string().min(5,{message: "Please add a longer description"}),
        body: z.string().min(10,{message:"Please add some more information"})
        

    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues:{
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? '',
            body: initialValues?.body ?? '',
        }
    })

    useEffect(() => {
        form.reset({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? "",
        body: initialValues?.body ?? "",
        });
    }, [initialValues, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
         const { title, description, body } = values;

        try {
            setLoading(true);

            let result: Section;

            if (mode === "create") {
                result = await createSection({
                    courseCode,
                    title,
                    description,
                    body,
                });
            } else {
                if (!sectionId) throw new Error("Missing section id");

                result = await updateSection({
                    sectionId,
                    title,
                    description: description,
                    body: body,
                });
            }

            onSuccess?.(result);
            form.reset();

        } catch (error) {
            console.error("Submission failed", error);
            setServerError(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Main title" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>description</FormLabel>
                                <FormControl>
                                    <Input placeholder="description" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="body"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>body</FormLabel>
                                <FormControl>
                                    <TipTap description={field.value} onChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                <Button type="submit" disabled={loading} className="m-2 hover:cursor-pointer hover:text-secondary"> 
                    {loading ? "Creating section..." : "Submit"}
                </Button>

                {serverError && (
                    <p className="text-destructive text-sm text-center mt-2">
                        {serverError}
                    </p>
                )}
            </form>
        </Form>
      </div>  
    );

    
}