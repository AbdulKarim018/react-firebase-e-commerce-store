import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getDocs, limit, query } from "firebase/firestore";
import { productsCollectionRef } from "../lib/firebase";

const homepageCats = [
  {
    name: "living",
    imageUrl: "https://furniro-kappa.vercel.app/images/living.webp",
    href: "living room",
  },
  {
    name: "dining",
    imageUrl: "https://furniro-kappa.vercel.app/images/dining.webp",
    href: "dining room",
  },
  {
    name: "bedroom",
    imageUrl: "https://furniro-kappa.vercel.app/images/bedroom.webp",
    href: "bedroom",
  },
];

export default function HomePage() {
  const { data: displayProducts } = useQuery({
    queryKey: ["displayProducts"],
    queryFn: async () => {
      const q = query(productsCollectionRef, limit(4));
      const { docs } = await getDocs(q);
      const products = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <section className="bg-gray-100 bg-[url('https://res.cloudinary.com/dgwuhfo96/image/upload/f_auto,q_auto/mnlhkhvsf6jcrvgwproi')] bg-center bg-no-repeat py-16">
          <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
            <div className="mb-8 md:mb-0 md:w-1/2"></div>
            <div className="rounded-lg bg-amber-50 p-8 md:w-1/2 md:pl-12">
              <h2 className="mb-2 text-sm uppercase tracking-wide text-gray-500">
                New Arrival
              </h2>
              <h1 className="mb-4 text-4xl font-bold text-amber-700">
                Discover Our New Collection
              </h1>
              <p className="mb-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis.
              </p>
              <Link
                to="/shop"
                className="rounded bg-amber-600 px-6 py-2 text-white transition-colors hover:bg-amber-700"
              >
                BUY NOW
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center text-3xl font-bold">
              Browse The Range
            </h2>
            <p className="mb-8 text-center text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex flex-col justify-center gap-8 md:flex-row md:gap-16">
              {homepageCats.map((cat) => (
                <Link
                  to={`/shop?category=${cat.href}`}
                  key={cat.name}
                  className="text-center"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={400}
                    height={300}
                    className="mb-4 rounded-lg"
                  />
                  <h3 className="text-xl font-semibold">
                    {cat.name[0].toUpperCase() + cat.name.slice(1)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Our Products
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts &&
                displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg bg-gray-100"
                  >
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="w-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-semibold">
                        {product.title}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {product.category}
                      </p>
                      <p className="font-bold">{product.price}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="my-8 flex items-center justify-center">
            <Link
              to="/shop"
              className="w-full max-w-[245px] border border-solid border-yellow-600 bg-white px-16 py-3 text-center text-base font-semibold text-yellow-600"
            >
              Show More
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
