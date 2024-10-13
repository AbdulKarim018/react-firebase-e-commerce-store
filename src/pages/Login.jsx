import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/User";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop");
    }

    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values) => {
    // login logic here
    setIsSubmitting(true);
    toast.promise(
      signInWithEmailAndPassword(auth, values.email, values.password),
      {
        loading: "Logging in...",
        success: () => {
          setIsSubmitting(false);
          navigate("/shop");
          return "Logged in successfully!";
        },
        error: () => {
          setIsSubmitting(false);
          return "Invalid email or password";
        },
      },
    );
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          autoComplete="email"
          label="Email"
          labelPlacement="outside-left"
          placeholder="Enter your email"
          className="mb-4 block"
          {...register("email")}
        />
        <ErrorMessage error={errors.email?.message} />
        <Input
          type="password"
          autoComplete="current-password"
          label="Password"
          labelPlacement="outside-left"
          placeholder="Enter your password"
          className="mb-4 block"
          {...register("password")}
        />
        <ErrorMessage error={errors.password?.message} />
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-md bg-yellow-600 p-2 text-white shadow-sm hover:bg-yellow-700"
        >
          Login
        </Button>
        <Link to="/register" className="mx-auto mt-4 block w-fit underline">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}
