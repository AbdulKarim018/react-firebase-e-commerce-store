import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { addDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ErrorMessage from "../../components/ErrorMessage";
import { productsCollectionRef } from "../../lib/firebase";

const productFormSchema = z.object({
  title: z.string().min(2, "Title cannot be less than 2 characters"),
  category: z.string().min(2, "Category cannot be less than 2 characters"),
  price: z.number().min(1),
  color: z.string().min(2, "Color cannot be less than 2 characters"),
  brand: z.string().min(2, "Brand cannot be less than 2 characters"),
  description: z
    .string()
    .min(2, "Description cannot be less than 2 characters"),
  imageUrl: z.string().url("Not a valid url"),
});

function ProductFormModal() {
  const queryCLient = useQueryClient();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (values) => {
    setIsSubmitting(true);

    toast.promise(addDoc(productsCollectionRef, values), {
      loading: "Creating product...",
      success: () => {
        reset();

        onOpenChange();

        queryCLient.invalidateQueries("admin_products");

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
                  <Input {...register("title")} label="Title" />
                  <ErrorMessage error={errors.title?.message} />
                  <div className="flex w-full gap-2">
                    <div className="flex w-1/2 flex-col gap-1">
                      <Input
                        label="Price"
                        type="number"
                        {...register("price", {
                          valueAsNumber: true,
                        })}
                      />
                      <ErrorMessage error={errors.price?.message} />
                    </div>
                    <div className="flex w-1/2 flex-col gap-1">
                      <Input {...register("color")} label="Color" />
                      <ErrorMessage error={errors.color?.message} />
                    </div>
                  </div>
                  <div className="flex w-full gap-2">
                    <div className="flex w-1/2 flex-col gap-1">
                      <Input {...register("category")} label="Category" />
                      <ErrorMessage error={errors.category?.message} />
                    </div>
                    <div className="flex w-1/2 flex-col gap-1">
                      <Input {...register("brand")} label="Brand Name" />
                      <ErrorMessage error={errors.brand?.message} />
                    </div>
                  </div>
                  <Input {...register("imageUrl")} label="Image URL" />
                  <ErrorMessage error={errors.imageUrl?.message} />
                  <Textarea
                    {...register("description")}
                    label="Description"
                  ></Textarea>
                  <ErrorMessage error={errors.description?.message} />
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
