import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from "@nextui-org/react";
import {
  LogInIcon,
  LogOutIcon,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingCart,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/Cart";
import { useUser } from "../contexts/User";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "sonner";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center">
          <img
            src="/furniro.webp"
            alt="Furniro Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-2xl font-bold">Furniro</span>
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-900">
            Shop
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <UserIcon />
          {/* <Search className="h-6 w-6 text-gray-600" /> */}
          {/* <Heart className="h-6 w-6 text-gray-600" /> */}
          <ShoppingCartIcon />
        </div>
      </div>
    </header>
  );
}

const UserIcon = () => {
  const { data: user } = useUser();
  if (!user) {
    return (
      <Link
        to={"/login"}
        className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
      >
        <LogInIcon size={20} />
        Login
      </Link>
    );
  }
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <User className="size-6 cursor-pointer text-gray-600" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small">
            Logged in as <span className="font-bold">{user.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              signOut(auth);
              toast.success("Signed Out");
            }}
          >
            <LogOutIcon size={20} /> Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ShoppingCartIcon = () => {
  const { cart, getNmbrOfItemsInCart, removeFromCart, clearCart, cartPrice } =
    useCart();

  const navigate = useNavigate();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      placement="bottom-end"
      showArrow
    >
      <PopoverTrigger>
        <div className="cursor-pointer">
          <Badge
            isInvisible={getNmbrOfItemsInCart() === 0}
            content={getNmbrOfItemsInCart()}
            color="warning"
            className="text-white"
          >
            <ShoppingCart className="h-6 w-6 text-gray-600" />
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-4 py-6 md:w-[25vw]">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">
              Shopping Cart (Total: {cartPrice})
            </h4>
            <ShoppingBagIcon />
          </div>
          <div className="my-2 mb-4 border-b-2 border-gray-300" />
          {cart.length === 0 && (
            <div className="flex flex-col items-center">
              <ShoppingBasket size={35} />
              <p className="text-lg font-semibold text-black">
                Hmm... Your Cart seems to be empty...
              </p>
            </div>
          )}
          <ScrollShadow
            hideScrollBar
            className="flex max-h-[40vh] flex-col gap-4"
          >
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 border-b border-gray-400 pb-2 last:border-none"
              >
                <img
                  src={product.imageUrl || product.image}
                  alt={product.title}
                  width={40}
                />
                <div>
                  <Link
                    to={`/shop/${product.id}`}
                    className="line-clamp-1 text-lg leading-tight text-foreground hover:underline"
                  >
                    {product.title}
                  </Link>
                  <div className="text-foreground">
                    <p>
                      ${product.price.toFixed(2)} x {product.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <XCircle
                    onClick={() => removeFromCart(product.id)}
                    className="ml-auto cursor-pointer text-red-500"
                  />
                </div>
              </div>
            ))}
          </ScrollShadow>
        </div>
        {cart.length !== 0 && (
          <div className="flex w-full items-center gap-1 pb-2">
            <Button
              onClick={() => {
                navigate("/checkout");
                setIsPopoverOpen(false);
              }}
              className="flex-1 bg-yellow-500 text-white"
            >
              <ShoppingCart /> Checkout ({cartPrice})
            </Button>
            <Button color="danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
