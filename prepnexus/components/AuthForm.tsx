"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === "sign-in";

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed. Please try again.");
          return;
        }

        await signIn({ email, idToken });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      toast.error(`There was an error: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f3f2ef]">


      <div className="w-full max-w-md bg-[#f9f9f9] p-10 rounded-lg shadow border border-gray-200">
        {/* Prepin Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-2xl font-semibold text-black">Prep</span>
            <div className="bg-blue-600 text-white text-xl font-bold px-2 py-1 rounded-md">in</div>
          </Link>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          {isSignIn ? "Sign in" : "Join now"}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {isSignIn
            ? "Stay updated on your professional world"
            : "Make the most of your professional life"}
        </p>

        {/* Auth Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
            />

            <Button
              type="submit"
              className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-2 rounded-full"
            >
              {isSignIn ? "Sign In" : "Agree & Join"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 text-sm">
          {isSignIn ? "New to PrepIn?" : "Already have an account?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="text-[#0a66c2] font-semibold ml-1 hover:underline"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;