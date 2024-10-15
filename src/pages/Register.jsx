import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, userCollectionRef } from "../lib/firebase";
import { useUser } from "../contexts/User";
import { addDoc, doc, setDoc } from "firebase/firestore";

const RegisterSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const registerUser = async (name, email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const userDocRef = doc(db, "furniro_users", user.uid);

  await setDoc(userDocRef, {
    id: user.uid,
    uid: user.uid,
    name: name,
    email: user.email,
    role: "user",
  });
};

export default function Register() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (values) => {
    // register logic here
    setIsSubmitting(true);

    toast.promise(registerUser(values.name, values.email, values.password), {
      loading: "Creating your account...",
      success: () => {
        setIsSubmitting(false);
        return "Registration Complete! Happy Shopping!";
      },
      error: () => {
        setIsSubmitting(false);
        return "An Error occured while creating your account";
      },
    });

    console.log("form values ==> ", values);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop");
    }

    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">Register</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          autoComplete="name"
          label="Name"
          labelPlacement="outside-left"
          placeholder="Enter your name"
          className="mb-4 block"
          {...register("name")}
        />
        <ErrorMessage error={errors.name?.message} />
        <Input
          type="email"
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
          autoComplete="new-password"
          label="Password"
          labelPlacement="outside-left"
          placeholder="Enter your password"
          className="mb-4 block"
          {...register("password")}
        />
        <ErrorMessage error={errors.password?.message} />

        <Input
          type="password"
          autoComplete="new-password"
          label="Confirm Password"
          labelPlacement="outside-left"
          placeholder="Confirm your password"
          className="mb-4 block"
          {...register("confirmPassword")}
        />
        <ErrorMessage error={errors.confirmPassword?.message} />

        <Button
          className="mt-2 w-full rounded-md bg-yellow-600 p-2 text-white shadow-sm hover:bg-yellow-700"
          type="submit"
          isLoading={isSubmitting}
        >
          Register
        </Button>
        <Link to="/login" className="mx-auto mt-4 block w-fit underline">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
