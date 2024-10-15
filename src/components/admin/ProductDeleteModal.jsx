import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { db } from "../../lib/firebase";

export default function ProductDeleteModal({ productId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);
    const docRef = doc(db, "products", productId);

    toast.promise(deleteDoc(docRef), {
      loading: "Deleting product...",
      success: () => {
        setIsLoading(false);
        onOpenChange();
        return "Product deleted successfully!";
      },
      error: () => {
        setIsLoading(false);
        return "Error deleting product";
      },
    });

    await queryClient.invalidateQueries(["admin_products"]);
  };

  return (
    <>
      <span
        onClick={onOpen}
        className="cursor-pointer text-lg text-danger active:opacity-50"
      >
        <Trash2 />
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Product
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this product?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={isLoading}
                  onClick={handleDelete}
                  color="danger"
                >
                  Delete Product
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
