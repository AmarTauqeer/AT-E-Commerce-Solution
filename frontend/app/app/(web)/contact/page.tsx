"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";


export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});



export default function ContactForm() {

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // 2. Submit handler
  const onSubmit = (values: z.infer<typeof ContactFormSchema>) => {
    console.log(values);
    toast.success("Your message is sent successfully.")
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-3 p-2 space-y-4  md:max-w-md lg:max-w-lg xl:max-w-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="text-md pb-4">
          Please fill the form below, we will happy to answer your queries!
        </p>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="w-full px-3 py-2  bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message here..."
                  {...field}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary min-h-37.5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">
          Submit
        </Button>
      </form>
    </Form>
  );
}
