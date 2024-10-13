import { Chip, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getDocs } from "firebase/firestore";
import { Diamond, Settings2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { productCollectionRef } from "../lib/firebase";

const ShopPage = () => {
  const {
    data: products,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      return data;
      // const { docs } = await getDocs(productCollectionRef);
      // const products = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // return products;
    },
  });

  return (
    <div className="max-w-8xl container mx-auto">
      {/* hero section */}
      <HeroSection title={"Shop"} href={"/shop"} />

      {/* filter section */}
      <div className="flex h-[20vh] items-center justify-evenly gap-4 bg-[#F9F1E7] text-xl max-md:h-fit max-md:flex-col max-md:items-start max-md:px-4 max-md:py-4">
        <div>
          <h3 className="flex gap-2">
            <Settings2 />
            Filter
          </h3>
        </div>
        <div className="h-2/5 w-[1px] bg-black" />
        <div>
          Showing 1-{products?.length} of {products?.length}
        </div>
        <div className="flex w-3/12 items-center gap-2 max-md:w-full">
          <p className="whitespace-nowrap">Sort By:</p>
          <Select label="Sort By">
            <SelectItem value="1">Price: Low to High</SelectItem>
            <SelectItem value="2">Price: High to Low</SelectItem>
          </Select>
        </div>
        <div className="flex w-3/12 items-center gap-2 max-md:w-full">
          <p>Category:</p>
          <Select label="Category">
            <SelectItem value="1">All</SelectItem>
            <SelectItem value="2">Men</SelectItem>
            <SelectItem value="3">Women</SelectItem>
            <SelectItem value="4">Kids</SelectItem>
          </Select>
        </div>
      </div>

      {/* products section */}
      <div className="my-6 flex flex-wrap justify-center gap-10">
        {isLoading && (
          <>
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
          </>
        )}
        {isError && (
          <p className="text-2xl text-red-400">
            An error occurred while loading the products. Please try again
            later. :(
          </p>
        )}
        {isSuccess &&
          products.map((product) => (
            <Link key={product.id} to={`/shop/${product.id}`}>
              <div className="group relative h-[300px] w-[300px] bg-white">
                <Chip
                  color="secondary"
                  size="sm"
                  className="absolute right-2 top-2"
                >
                  <div className="flex items-center gap-2">
                    <Diamond size={15} />
                    {product.category
                      .split(" ")
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(" ")}
                  </div>
                </Chip>

                <img
                  src={product.image}
                  alt={product.title || product.name}
                  className="h-3/4 w-full object-contain"
                />

                <div className="">
                  <h3 className="line-clamp-2 text-xl font-bold group-hover:underline">
                    {product.title || product.name}
                  </h3>
                  <div className="mt-2 flex justify-between text-lg">
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ShopPage;
