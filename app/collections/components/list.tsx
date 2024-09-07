/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Pagination,
  Card,
  CardHeader,
  CardBody,
  Image,
  CircularProgress,
} from "@nextui-org/react";
import GridContent from "@/components/girdContent";
import Link from "next/link";
import { useUserStore } from "@/app/home/store/user-store";
import { trpc } from "@/server/client";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "@/components/toast";
import { useCollectionStore } from "../store/collection_store";
import { useRouter } from "next/navigation";

export default function CollectionsList({ className, ...props }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const setCurrentCollection = useCollectionStore(
    (state) => state.setCurrentCollection
  );
  const refreshCollections = useCollectionStore(
    (state) => state.refreshCollections
  );
  const refreshCollectionsList = useCollectionStore(
    (state) => state.refreshCollectionsList
  );
  const setCollections = useCollectionStore((state) => state.setCollections);
  const CollectionsList = useCollectionStore((state) => state.collectionList);
  const setUser = useUserStore((state) => state.setUser);
  const userLocalData = localStorage.getItem("user");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({ name: "", tag: "" });
  const [isAddLoading, setIsAddLoading] = useState(false);

  const { data, error, isLoading, refetch }: any =
    trpc.collection.getCollections.useQuery(userId, {
      enabled: !!userId,
    });
  const addCollection = trpc.collection.addCollection.useMutation();

  // État pour les éléments de la grille
  const [items, setItems]: any = useState([]);

  const opentModal = () => {
    onOpenChange();
  };

  const handleSubmit = async () => {
    setIsAddLoading(true);
    const payload = {
      name: formData.name,
      tag: formData.tag,
      userId: userId,
    };
    try {
      await addCollection.mutateAsync(payload);
      notifySuccess(`Collection ${formData.name} added successfully`);
      setFormData({ name: "", tag: "" }); // Réinitialise le formulaire
      setIsAddLoading(false);
      onOpenChange();
      refetch();
    } catch (error) {
      setIsAddLoading(false);
      notifyError("Failed to add collection");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStickersCollection = (collection: any) => {
    setCurrentCollection(collection);
    router.push(`/collections/${collection.id}/stickers`);
  };

  useEffect(() => {
    if (userLocalData) {
      const user: any = JSON.parse(userLocalData);
      setUser(user);
      setUserId(user.id);
    }
  }, []);

  // call when data is loaded or change
  useEffect(() => {
    if (!isLoading && data) {
      setItems(data);
      setCollections(data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    refetch();
    refreshCollectionsList(false);
  }, [refreshCollections]);

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center mt-5 ">
        {items.length === 0 && (
          <Button onPress={onOpenChange} color="primary" endContent={<Plus />}>
            New collection
          </Button>
        )}
      </div>
      <GridContent
        className="mt-16 mx-10 sm:mx-16 md:mx-20 lg:mx-36"
        data={items}
        title="Collections"
        textBtn="New collection"
        subTitle="You'll find a list of all your collections. Select one to manage add new stickers."
        refreshFn={refetch}
        openModal={opentModal}
        isLoading={isLoading}
        noDataTitle="No collections yet"
        noDataSubTitle="Create a collection to get started"
      >
        <CardItems items={items} onCardClick={getStickersCollection} />
      </GridContent>
      <div className="h-16"></div>

      {/* <Modal /> */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        classNames={{
          header: "pink-dark",
          body: "pink-dark",
          backdrop: "bg-[#292f46]/50",
          base: "border-[#292f46] bg-pureBackground",
          footer: "pink-dark",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-primary">
                New collection
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  placeholder="Enter a collection name"
                  variant="bordered"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-white focus:border-primary"
                />
                <Input
                  label="Tag(Optional)"
                  placeholder="Enter a collection tag"
                  variant="bordered"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="text-white focus:border-primary"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-white text-black"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={isAddLoading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={isAddLoading}
                  onPress={handleSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * @function CardItems
 * @description A function component that renders a collection card,
 *              which displays the collection's name, number of stickers,
 *              and a tag if present.
 * @param {Object} items an object containing the collection's data
 * @returns {JSX.Element} a collection card component
 */
const CardItems = ({
  items,
  onCardClick,
}: {
  items: any;
  onCardClick: any;
}): JSX.Element => {
  const onItemClick = (item: any) => {
    onCardClick(item);
  };
  return (
    <>
      {items.slice(0, 9).map((item: any) => (
        <Card
          key={item.id}
          isPressable
          onPress={() => onItemClick(item)}
          className="py-4 bg-background hover:cursor-pointer hover:bg-lightBackground transform hover:translate-y-[-10px] duration-500 ease-in-out"
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Collection</p>
            <small className="text-default-500">
              {item.stickers.length} Stickers-
              {item.tag !== "" ? item.tag : "No Tag"}
            </small>
            <h4 className="font-bold text-large">{item.name}</h4>
          </CardHeader>
          <CardBody className="flex justify-center overflow-visible">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="/assets/collection_icon.png"
              width={100}
              height={100}
            />
          </CardBody>
        </Card>
      ))}
    </>
  );
};
