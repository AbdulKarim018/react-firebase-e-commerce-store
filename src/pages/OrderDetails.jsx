import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import { ordersCollectionRef } from "../lib/firebase";
import { dateFormatter, statusColorMap } from "../lib/utils";
import { Chip } from "@nextui-org/react";

export default function OrderDetails() {
  const params = useParams();

  const orderId = params.id || "";

  const {
    data: order,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      // await sleep(1000000);
      const docRef = doc(ordersCollectionRef, orderId);
      const p = await getDoc(docRef);
      return {
        id: p.id,
        ...p.data(),
      };
    },
  });

  return (
    <div className="container mx-auto max-w-6xl">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {isError}</p>}
      {isSuccess && (
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <h4 className="my-2 flex items-center gap-2 text-xl">
            This Order is{" "}
            <Chip color={statusColorMap[order.status]}>{order.status}</Chip>
          </h4>
          <p>Order ID: {order.id}</p>
          <p>Order Date: {dateFormatter(order.timestamp.toDate())}</p>
          <p>Order Status: {order.status}</p>
          <p>Order Total: {order.total}</p>
          <h2 className="text-xl font-bold">
            Items{" "}
            <span>
              (Items: {order.items.length} Total: ${order.total})
            </span>
          </h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <p>Item: {item.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Unit Price: ${item.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
