import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import {
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useUser } from "../contexts/User";
import { ordersCollectionRef } from "../lib/firebase";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { dateFormatter, statusColorMap } from "../lib/utils";

const columns = [
  {
    key: "id",
    label: "Order ID",
  },
  {
    key: "timestamp",
    label: "DATE",
  },
  {
    key: "total",
    label: "TOTAL",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const deleteOrder = async (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteDoc(doc(ordersCollectionRef, orderId));
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};

export default function Orders() {
  const { data: user } = useUser();

  const navigate = useNavigate();

  const {
    data: rows,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      // await sleep(100000);
      const q = query(
        ordersCollectionRef,
        where("userId", "==", user.id),
        orderBy("timestamp", "desc"),
      );
      const { docs } = await getDocs(q);
      const orders = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return orders;
    },
  });

  if (isError) {
    console.error(error);
  }

  const renderCell = React.useCallback((order, columnKey) => {
    const cellValue = order[columnKey];

    switch (columnKey) {
      case "timestamp":
        return <span>{dateFormatter(cellValue.toDate())}</span>;

      case "total":
        return <p>${cellValue}</p>;

      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[order.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Ellipsis />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disabledKeys={[order.status !== "pending" ? "delete" : null]}
              >
                <DropdownItem
                  key={"view"}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem
                  key={"delete"}
                  onClick={() => {
                    toast.promise(deleteOrder(order.id), {
                      loading: "Deleting order...",
                      success: () => {
                        refetchOrders();
                        return "Order deleted successfully";
                      },
                      error: () => {
                        return "Failed to delete order";
                      },
                    });
                  }}
                  color="danger"
                  className="text-red-400"
                >
                  Delete Order
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p>Here you can view all your past orders</p>
      {isError && (
        <p className="text-2xl text-red-400">
          An error occurred while loading the orders. Please try again later. :(
        </p>
      )}
      {isLoading && (
        <p className="py-12 text-center text-2xl text-gray-400">
          Loading orders...
        </p>
      )}
      {isSuccess && (
        <div>
          <Table
            className="mt-6"
            aria-label="Example table with dynamic content"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Hmm... You have'nt ordered anything yet."}
              items={rows}
            >
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
