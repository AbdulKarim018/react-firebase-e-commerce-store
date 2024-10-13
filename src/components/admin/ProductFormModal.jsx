import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ErrorMessage from "../../components/ErrorMessage";
import { productCollectionRef } from "../../lib/firebase";
import { useState } from "react";

const productFormSchema = z.object({
  name: z.string().min(2, "Name cannot be less than 2 characters"),
  category: z.string().min(2, "Category cannot be less than 2 characters"),
  price: z.number().min(1),
  color: z.string().min(2, "Color cannot be less than 2 characters"),
  imageUrl: z.string().url("Not a valid url"),
});

function ProductFormModal() {
  const queryCLient = useQueryClient();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (values) => {
    setIsSubmitting(true);

    toast.promise(addDoc(productCollectionRef, values), {
      loading: "Creating product...",
      success: () => {
        reset();

        onOpenChange();

        queryCLient.invalidateQueries("products");

        setIsSubmitting(false);

        return "Product created successfully!";
      },
      error: () => {
        setIsSubmitting(false);
        return "Error creating product";
      },
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      color: "",
      imageUrl: "",
    },
  });

  return (
    <>
      <Button onPress={onOpen} color="primary">
        New Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Create a New Product
                </ModalHeader>
                <ModalBody>
                  <Input {...register("name")} label="Name" />
                  <ErrorMessage error={errors.name?.message} />
                  <Input {...register("category")} label="Category" />
                  <ErrorMessage error={errors.category?.message} />
                  <Input
                    label="Price"
                    type="number"
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                  />
                  <ErrorMessage error={errors.price?.message} />
                  <Input {...register("color")} label="Color" />
                  <ErrorMessage error={errors.color?.message} />
                  <Input {...register("imageUrl")} label="Image Url" />
                  <ErrorMessage error={errors.imageUrl?.message} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    isLoading={isSubmitting}
                    color="primary"
                    type="submit"
                  >
                    Create
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProductFormModal;
