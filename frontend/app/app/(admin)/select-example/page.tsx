"use client";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormValues = {
  role: string;
};

const roles = [
  {
    value: "admin",
    label: "Administrator",
  },
  {
    value: "user",
    label: "Normal User",
  },
  {
    value: "manager",
    label: "Manager",
  },
];

export default function Example() {

  const form = useForm<FormValues>({
    defaultValues: {
      role: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-62.5"
      >

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (

            <FormItem>

              <FormLabel>
                Role
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue
                      placeholder="Select role"
                    />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {roles.map((role) => (

                    <SelectItem
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>

          )}
        />

        <Button type="submit">
          Submit
        </Button>

      </form>

    </Form>
  );
}