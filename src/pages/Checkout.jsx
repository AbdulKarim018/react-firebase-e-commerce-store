import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { addDoc, serverTimestamp } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";
import HeroSection from "../components/HeroSection";
import { useCart } from "../contexts/Cart";
import { useUser } from "../contexts/User";
import { ordersCollectionRef } from "../lib/firebase";

const CheckoutFormSchema = z.object({
  firstName: z.string().trim().min(2, "First Name cannot be blank"),
  lastName: z.string().trim().min(2, "Last Name cannot be blank"),
  companyName: z.string().trim().optional(),
  country: z.enum(["1"], {
    message: "Country / Region cannot be blank",
  }),
  address: z.string().trim().min(10, "Address cannot be blank"),
  city: z.string().trim().min(2, "City cannot be blank"),
  state: z.string().trim().min(2, "State cannot be blank"),
  zipcode: z.string().trim().min(2, "Zip Code cannot be blank"),
  email: z.string().email("Invalid email"),
  phone: z.string().trim().min(10, "Phone number cannot be blank"),
});

export default function Checkout() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: user, isAuthenticated } = useUser();
  const { cart, cartPrice, clearCart } = useCart();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      firstName: user?.name.split(" ")[0],
      lastName: user?.name.split(" ").slice(1).join(" "),
      email: user?.email,
    },
  });

  const createOrder = useCallback((userId, values) => {
    return new Promise(async (resolve, reject) => {
      try {
        await addDoc(ordersCollectionRef, {
          userId,
          ...values,
          items: cart,
          total: cartPrice,
          status: "pending",
          timestamp: serverTimestamp(),
        });
        clearCart();
        navigate("/orders");
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }, []);

  const onSubmit = (values) => {
    setIsSubmitting(true);
    // console.log(values);

    toast.promise(createOrder(user.id, values), {
      loading: "Placing order...",
      success: () => {
        setIsSubmitting(false);
        return "Order placed successfully";
      },
      error: () => {
        setIsSubmitting(false);
        return "Failed to place order";
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shippingCost = useMemo(() => (cartPrice > 150 ? 0 : 10), [cart]);

  return (
    <div className="container mx-auto max-w-7xl">
      <HeroSection title="Checkout" href="/checkout" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto my-6 flex max-w-6xl max-md:flex-col">
          <div className="flex w-1/2 flex-col gap-4 max-md:w-full">
            <h2 className="text-3xl font-semibold">Billing Details</h2>
            <div className="flex flex-1 gap-3 max-md:flex-col">
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  {...register("firstName")}
                  label="First Name"
                  labelPlacement="outside"
                  placeholder="Enter your first name"
                  className="pt-4"
                  size="lg"
                  variant="bordered"
                />
                <ErrorMessage error={errors.firstName?.message} />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  {...register("lastName")}
                  label="Last Name"
                  labelPlacement="outside"
                  placeholder="Enter your last name"
                  className="pt-4"
                  size="lg"
                  variant="bordered"
                />
                <ErrorMessage error={errors.lastName?.message} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                {...register("companyName")}
                label="Company Name (Optional)"
                size="lg"
                placeholder="Enter your company name"
                className="pt-4"
                variant="bordered"
              />
              <ErrorMessage error={errors.companyName?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Select
                variant="bordered"
                label="Country / Region"
                placeholder="Select your country / region"
                size="lg"
                className="pt-4"
                {...register("country")}
              >
                {[
                  {
                    key: "1",
                    label: "Pakistan",
                  },
                ].map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
              <ErrorMessage error={errors.country?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="Street Address"
                placeholder="Enter your street address"
                size="lg"
                className="pt-4"
                {...register("address")}
              />
              <ErrorMessage error={errors.address?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="City / Town"
                placeholder="Enter your City / Town"
                size="lg"
                className="pt-4"
                {...register("city")}
              />

              <ErrorMessage error={errors.city?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="State / Province"
                placeholder="Enter your state / province"
                size="lg"
                className="pt-4"
                {...register("state")}
              />

              <ErrorMessage error={errors.state?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="Zip code"
                placeholder="Enter your zip code"
                size="lg"
                className="pt-4"
                {...register("zipcode")}
              />
              <ErrorMessage error={errors.zipcode?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="Phone"
                placeholder="Enter your Phone number"
                size="lg"
                className="pt-4"
                {...register("phone")}
              />
              <ErrorMessage error={errors.phone?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                label="Email"
                placeholder="Enter your Email address"
                size="lg"
                className="pt-4"
                {...register("email")}
              />

              <ErrorMessage error={errors.email?.message} />
            </div>
          </div>

          <div className="flex w-1/2 flex-col p-4 max-md:w-full md:pl-14">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">Product</h3>
              <h3 className="text-xl font-semibold">Subtotal</h3>
            </div>
            <div className="flex flex-col gap-2">
              {cart.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex w-full justify-between gap-8"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-clamp-1 max-w-[55vw] text-foreground-500 md:max-w-xs">
                        {item.title}
                      </span>
                      <span className="font-semibold text-black">
                        x{item.quantity}
                      </span>
                    </div>
                    <div>$ {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span> <span>$ {cartPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping Cost</span>
                <span>$ {shippingCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-xl font-bold text-yellow-600">
                  $ {(+cartPrice + shippingCost).toFixed(2)}
                </span>
              </div>
              <div className="mx-auto inline-block min-w-[20vw] border-b border-gray-400" />
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                className="px-12 py-8 hover:bg-yellow-600 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                size="lg"
                variant="bordered"
                disabled={!isAuthenticated || isSubmitting || cart.length === 0}
              >
                Place Order
              </Button>
            </div>
            {!isAuthenticated && (
              <Link to="/login" className="mx-auto mt-4 w-fit underline">
                Login to place order
              </Link>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
