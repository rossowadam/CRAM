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
import { createSection } from "@/api/sectionsApi"

type RteProps = {
    onSuccess?: () => void;
    initialValues?: {
    title?: string;
    subtitle?: string;
    content?: string;
  };
};

export default function Rte({onSuccess, initialValues}: RteProps) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const formSchema = z.object({
        title: z.string().min(5,{message: "Title is not long enough"}),
        subtitle: z.string().min(5,{message: "Please add a longer description"}),
        content: z.string().min(10,{message:"Please add some more information"})
        

    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues:{
            title: initialValues?.title ?? "",
            subtitle: initialValues?.subtitle ?? '',
            content: initialValues?.content ?? '',
        }
    })

    useEffect(() => {
        form.reset({
        title: initialValues?.title ?? "",
        subtitle: initialValues?.subtitle ?? "",
        content: initialValues?.content ?? "",
        });
    }, [initialValues, form]);

    async function onSubmit(values: z.infer<typeof formSchema>){
        try{
            console.log(values)
            // Update database here

            onSuccess?.();
            form.reset();
        }catch (error){
            console.error("Submission failed", error)
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
                    name="subtitle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                                <Input placeholder="Subtitle" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
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