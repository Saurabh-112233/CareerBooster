"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import FormField from "./FormFeild";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";
//import { Input } from "@/components/ui/input";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z
            .string()
            .min(3, { message: "Name must be at least 3 characters long." })
            .nonempty({ message: "Name is required." })
        : z.string().optional(),
    email: z.string().email(),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long." })
      .regex(/[@#$%^&*!]/, {
        message:
          "Password must include at least one special character (@, #, $, %, etc.).",
      })
      .regex(/[0-9]/, {
        message: "Password must include at least one digit (0-9).",
      }),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">CareerCatalyst</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mt-4 form"
          >
            {!isSignIn && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Your Name"
                />
                {form.formState.errors.name && (
                  <div className="text-sm text-red-500">
                    {form.formState.errors.name?.message}
                  </div>
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            {form.formState.errors.password && (
              <div className="text-sm text-red-500 space-y-1">
                {Array.isArray(form.formState.errors.password.types) ? (
                  form.formState.errors.password.types.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                ) : (
                  <p>{form.formState.errors.password?.message}</p>
                )}
              </div>
            )}

            {isSignIn && (
              <p className="text-center text-sm text-gray-500">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
            )}

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
