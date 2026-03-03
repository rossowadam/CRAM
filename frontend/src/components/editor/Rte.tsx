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
import TipTap from "./Tiptap"
import { Button } from "../ui/button"

type RteProps = {
    onSuccess?: () => void;
};

export default function Rte({onSuccess}: RteProps){

    const formSchema = z.object({
        title: z.string().min(5,{message: "Title is not long enough"}),
        subtitle: z.string().min(5,{message: "Please add a longer description"}),
        content: z.string().min(10,{message:"Please add some more information"})
        

    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues:{
            title: '',
            subtitle: '',
            content: '',
        }
    })

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
                                <TipTap description={field.name} onChange={field.onChange}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
            <Button type="submit" className="m-2 hover:cursor-pointer hover:text-secondary"> Submit</Button>
            </form>
        </Form>
      </div>  
    );

    
}