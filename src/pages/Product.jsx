import { Button, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, ShoppingCartIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contexts/Cart";
import { productsCollectionRef } from "../lib/firebase";

export default function Product() {
  const params = useParams();
  const productId = params.id || "";

  const navigate = useNavigate();

  const { cart, addToCart } = useCart();

  const {
    data: product,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      // await sleep(1000000);
      const docRef = doc(productsCollectionRef, productId);
      const p = await getDoc(docRef);
      return {
        id: p.id,
        ...p.data(),
      };
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isItemExists =
    product && cart.findIndex((p) => p.id === product.id) !== -1;

  return (
    <section className="overflow-hidden text-gray-600">
      <div className="container mx-auto px-5 py-16">
        <Button
          onClick={() => navigate(-1)}
          className="md:ml-16"
          variant="light"
          disableRipple
        >
          <ArrowLeft />
        </Button>

        {isLoading && (
          <div className="mx-auto flex flex-wrap lg:w-4/5">
            <Skeleton
              alt="ecommerce"
              className="h-64 w-full rounded-lg object-contain object-center lg:size-[30rem] lg:w-1/2"
            />
            <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
              <Skeleton className="w-fit rounded-lg">
                <div className="h-4 w-24" />
              </Skeleton>
              <Skeleton className="my-2 w-full rounded-lg">
                <div className="h-8 w-full" />
              </Skeleton>
              <div>
                <Skeleton className="my-2 w-full rounded-lg">
                  <div className="h-6 w-full" />
                </Skeleton>
                <Skeleton className="my-2 w-fit rounded-lg">
                  <div className="h-6 w-80" />
                </Skeleton>
                <Skeleton className="my-2 w-full rounded-lg">
                  <div className="h-6 w-full" />
                </Skeleton>
                <Skeleton className="my-2 w-full rounded-lg">
                  <div className="h-6 w-full" />
                </Skeleton>
                <Skeleton className="my-2 w-fit rounded-lg">
                  <div className="h-6 w-80" />
                </Skeleton>
                <Skeleton className="my-2 w-full rounded-lg">
                  <div className="h-6 w-full" />
                </Skeleton>
              </div>
            </div>
          </div>
        )}

        {isSuccess && product && (
          <div className="mx-auto flex flex-wrap lg:w-4/5">
            <img
              alt="ecommerce"
              className="h-64 w-full rounded object-contain object-center lg:size-[30rem] lg:w-1/2"
              src={
                product.image ||
                product.imageUrl ||
                "https://dummyimage.com/400x400"
              }
            />
            <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
              <h2 className="text-sm font-bold tracking-widest text-yellow-500">
                {product.brand || "BRAND NAME"}
              </h2>
              <h1 className="mb-1 text-3xl font-semibold text-gray-900">
                {/* The Catcher in the Rye */}
                {product.title}
              </h1>
              <p className="leading-relaxed">
                {/* Fam locavore kickstarter distillery. Mixtape chillwave tumeric
              sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo
              juiceramps cornhole raw denim forage brooklyn. Everyday carry +1
              seitan poutine tumeric. Gastropub blue bottle austin listicle
              pour-over, neutra jean shorts keytar banjo tattooed umami
              cardigan. */}
                {product.description}
              </p>
              <div className="mb-5 mt-6 flex items-center border-b-2 border-yellow-500 pb-5">
                <div className="flex">
                  <span className="mr-3">
                    Color: {product.color || "Black"}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="title-font text-2xl font-medium text-gray-900">
                  {/* $58.00 */}${product.price?.toFixed(2)}
                </span>
                {/* <button className="ml-auto flex rounded border-0 bg-yellow-600 px-6 py-2 text-white hover:bg-yellow-700 focus:outline-none">
                <ShoppingCartIcon className="me-2" />
                Add to Cart
              </button> */}
                <Button
                  radius="sm"
                  className="ml-auto flex items-center gap-4 bg-yellow-600 p-6 text-white"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCartIcon />
                  {isItemExists ? "Add +1" : "Add to Cart"}
                </Button>
                {/* <button className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-200 p-0 text-gray-500">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
