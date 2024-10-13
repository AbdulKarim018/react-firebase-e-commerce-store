import {
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { EditIcon, Trash2 } from "lucide-react";
import { useCallback } from "react";
// import products from "../../../data.json";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { useQuery } from "@tanstack/react-query";
import { getDocs, query } from "firebase/firestore";
import { productCollectionRef } from "../../lib/firebase";
import ProductDeleteModal from "../../components/admin/ProductDeleteModal";

const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "CATEGORY", uid: "category" },
  { name: "PRICE", uid: "price" },
  { name: "COLOR", uid: "color" },
  { name: "ACTIONS", uid: "actions" },
];

export default function AdminProductsPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { docs } = await getDocs(productCollectionRef);
      const products = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    },
  });

  return (
    <div className="container mx-auto flex max-w-6xl flex-col">
      {isError && <div>Error: {isError.message}</div>}
      {isLoading && (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {products && products.length === 0 && (
        <div className="flex h-screen w-full items-center justify-center">
          No products found
        </div>
      )}

      {products && products.length > 0 && (
        <>
          <div className="my-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Products</h1>
            <ProductFormModal />
          </div>
          <div>
            <ProductsTable products={products} />
          </div>
        </>
      )}
    </div>
  );
}

function ProductsTable({ products }) {
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-4">
            <Image src={product.imageUrl} className="size-12" />
            <div className="text-lg">{product.name}</div>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex justify-center gap-2">
            <Tooltip content="Edit product">
              <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <ProductDeleteModal productId={product.id} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={products}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
