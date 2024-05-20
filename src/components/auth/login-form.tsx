'use client'

import { Input } from '@/components/ui/input'
import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useSearchParams } from 'next/navigation';

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import LoginPage from "@/app/auth/login/page";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/general/form-error";
import { FormSuccess } from "@/components/general/form-success";
import { login } from "@/actions/login";

export const LoginForm = ({}) => {

  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "An account already exists with this email" : ""

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values : z.infer<typeof LoginSchema>) => {
    setError("")
    startTransition(() =>
    {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Please login below"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
      googleButtonText='Login with Google'
    >
      <Form { ...form }>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={isPending}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="sweetbeasts123"
                      type="password"
                      disabled={isPending}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

