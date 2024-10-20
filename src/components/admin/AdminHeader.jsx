import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/furniro.webp";
import { useUser } from "../../contexts/User";
import { LogOutIcon, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { toast } from "sonner";

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { data: user } = useUser();

  const menuItems = [
    {
      label: "Products",
      href: "products",
    },
    {
      label: "Orders",
      href: "orders",
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img
            src={Logo}
            alt="Furniro Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-2xl font-bold">Furniro</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem className="flex items-center gap-4">
          <Link color="foreground" to={"/admin/products"}>
            Products
          </Link>
          <Link color="foreground" to={"/admin/orders"}>
            Orders
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {user && user.role === "admin" && (
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
          >
            Go to Public View
          </Link>
        )}
        <UserIcon />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              to={`/admin/${item.href}`}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

const UserIcon = () => {
  const { data: user } = useUser();

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
