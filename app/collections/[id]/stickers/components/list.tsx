/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Image as ImageIcon,
  ArrowDownToLine,
  Tag,
  Calendar,
  Sticker,
  ArrowUpToLine,
  Pencil,
  Trash2,
  Edit2,
  Eraser,
  RefreshCcw,
} from "lucide-react";
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
  Image,
  Chip,
  Progress,
  Tooltip,
  Skeleton,
  Card,
} from "@nextui-org/react";
import GridContent from "@/components/girdContent";
import { useStikerStore } from "../store/sticker_store";
import { trpc } from "@/server/client";
import { useCollectionStore } from "@/app/collections/store/collection_store";
import { useUserStore } from "@/app/home/store/user-store";
import { notifyError, notifySuccess } from "@/components/toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { removeBackground } from "@imgly/background-removal";
import useRmBgTimer from "@/utils/hooks/useRmBgTimer";
import { ImageViewer, ImageViewerAll } from "./imageViewer";

export default function StickersList({ collectionId }: any) {
  // *********store state************************
  const router = useRouter();
  const { seconds, isRunning, startTimer, stopTimer } = useRmBgTimer();
  const setUser = useUserStore((state) => state.setUser);
  const setCurrentSticker = useStikerStore((state) => state.setCurrentSticker);
  const currentSticker = useStikerStore((state) => state.currentSticker);
  const setCurrentCollection = useCollectionStore(
    (state) => state.setCurrentCollection
  );
  const currentCollection = useCollectionStore(
    (state) => state.currentCollection
  );
  const user = useUserStore((state) => state.user);
  const refreshCollectionsList = useCollectionStore(
    (state) => state.refreshCollectionsList
  );
  const [items, setItems]: any = useState([]);

  // *********simple state************************
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onOpenChange: onOpenUpdateChange,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isRbLoading, setIsRbLoading] = useState({
    firstMethod: false,
    secondMethod: false,
  });

  const [isActionSticker, setIsActionSticker] = useState("");
  const [whitchImageSelected, setWhitchImageSelected] = useState("original");

  const [tempImage, setTempImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selecteBlobdImage, setSelecteBlobdImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [tempsBlobdImage, setTempsBlobdImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [editedImage, setEditedImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
  });

  const [UpdateCollectionformData, setUpdateCollectionFormData] = useState({
    name: currentCollection?.name || "",
    tag: currentCollection?.tag || "",
  });

  const [stickerId, setStickerId] = useState("");
  const [removeBgProgress, setRemoveBgProgress] = useState("");
  const [processValue, setprocessValue] = useState(0);

  // *********api state************************
  const getCollectionById = trpc.collection.getCollectionById.useMutation();
  const updateCollection = trpc.collection.updateCollection.useMutation();
  const deleteCollection = trpc.collection.deleteCollection.useMutation();
  const refreshCollection = trpc.collection.getCollectionById.useMutation();
  const updateSticker = trpc.sticker.updateSticker.useMutation();
  const addSticker = trpc.sticker.addSticker.useMutation();
  const deleteSticker = trpc.sticker.deleteSticker.useMutation();
  const { data, error, isLoading, refetch }: any =
    trpc.sticker.getStickers.useQuery(collectionId, {
      enabled: !!collectionId,
    });

  // *********action function************************

  // Fonction pour gérer la sélection de l'image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files?.[0];
    setTempsBlobdImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données (base64)
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormUpdateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setUpdateCollectionFormData({ ...UpdateCollectionformData, [name]: value });
  };

  const handleSaveSticker = async () => {
    setIsSaveLoading(true);
    const payload: any = {
      name: formData.name,
      imageUrl: whitchImageSelected === "edited" ? editedImage : selectedImage,
      collectionId: collectionId,
    };

    try {
      await addSticker.mutateAsync(payload);
      setIsSaveLoading(false);
      notifySuccess(`Sticker ${formData.name} added successfully`);
      resetStudio();
      refetch();
    } catch (error) {
      setIsSaveLoading(false);
      notifyError("Failed to add sticker");
    }
  };

  const handleUpdateCollectionSubmit = async () => {
    setIsUpdateLoading(true);
    const payload: any = {
      id: currentCollection.id,
      userId: user?.id,
      name: UpdateCollectionformData.name,
      tag: UpdateCollectionformData.tag,
    };
    try {
      await updateCollection.mutateAsync(payload);
      const collection = await refreshCollection.mutateAsync({
        id: collectionId,
        userId: user?.id,
      });
      setCurrentCollection(collection);
      setIsUpdateLoading(false);
      notifySuccess(
        `Collection ${UpdateCollectionformData.name} updated successfully`
      );
      onOpenUpdateChange();
    } catch (error) {
      setIsUpdateLoading(false);
      notifyError("Failed to update collection");
    }
  };

  const handleUpdateStickerSubmit = async () => {
    setIsUpdateLoading(true);
    const payload: any = {
      id: stickerId,
      name: formData.name,
      imageUrl: selectedImage,
      collectionId: collectionId,
    };
    try {
      await updateSticker.mutateAsync(payload);
      await refetch();
      setSelectedImage(null);
      setFormData({ name: "" });
      setIsUpdateLoading(false);
      setIsActionSticker("");
      notifySuccess(`Sticker ${formData.name} updated successfully`);
    } catch (error) {
      setIsUpdateLoading(false);
      notifyError("Failed to update sticker");
    }
  };

  const handleDeleteCollectionSubmit = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteCollection.mutateAsync({
        id: collectionId,
        userId: user?.id,
      });
      notifySuccess(
        `Collection ${currentCollection.name} deleted successfully`
      );
      setTimeout(() => {
        setIsDeleteLoading(false);
        onOpenDeleteChange();
        refreshCollectionsList(true);
        router.push("/collections");
      }, 3000);
    } catch (error) {
      setIsDeleteLoading(false);
      notifyError("Failed to delete collection");
    }
  };

  const handleDeleteStickerSubmit = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteSticker.mutateAsync({
        id: stickerId,
        collectionId: collectionId,
      });
      await refetch();
      setIsDeleteLoading(false);
      onOpenDeleteChange();
      notifySuccess(`Sticker deleted successfully`);
      resetStudio();
    } catch (error) {
      setIsDeleteLoading(false);
      notifyError("Failed to delete sticker");
    }
  };

  async function removeBgFirstMethod(image: any) {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", image, image.name);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": "GqUbXDb5hpwbefuacNyurBLS" },
      body: formData,
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => setEditedImage(reader.result);
        reader.readAsDataURL(imageBlob);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function removeBgSecondMethod(image: any) {
    startTimer();
    notifySuccess(`training in progress...`);
    const imageBlob = await removeBackground(selecteBlobdImage!, {
      debug: true,
      progress: (key: string, current: number, total: number) => {
        console.log(`Processing: ${key}: ${current}/${total}`);
        const [type, subtype] = key.split(":");
        setRemoveBgProgress(
          `${type} ${subtype} ${((current / total) * 100).toFixed(0)}%`
        );
        setprocessValue((current / total) * 100);
      },
    });
    stopTimer();
    return imageBlob;
  }

  const handleRemoveBgImage = async (method: string) => {
    if (method === "first") {
      try {
        setIsRbLoading({ firstMethod: true, secondMethod: false });
        const result = await removeBgFirstMethod(selecteBlobdImage);
        notifySuccess(`SBackground removed successfully`);
        setIsRbLoading({ firstMethod: false, secondMethod: false });
        toggleSelectedImage("edited");
      } catch (error) {
        notifyError("Failed to remove background");
        setIsRbLoading({ firstMethod: false, secondMethod: false });
      }
    } else {
      try {
        setIsRbLoading({ firstMethod: false, secondMethod: true });
        const reader = new FileReader();
        const result = await removeBgSecondMethod(selecteBlobdImage);
        notifySuccess(`Background removed successfully`);
        setIsRbLoading({ firstMethod: false, secondMethod: false });
        reader.onloadend = () => setEditedImage(reader.result);
        reader.readAsDataURL(result);
        toggleSelectedImage("edited");
      } catch (error) {
        notifyError("Failed to remove background");
        setIsRbLoading({ firstMethod: false, secondMethod: false });
      }
    }
  };

  const getSelectedImage = () => {
    setSelectedImage(tempImage);
    setSelecteBlobdImage(tempsBlobdImage);
    setTempImage(null);
    opentModal();
  };

  const opentModal = () => {
    onOpenChange();
  };

  const decodeBase64ToBlob = (image: string) => {
    const base64Data = image.split(",")[1]; // extraire la chaîne de base64
    const binaryData = atob(base64Data); // décoder la chaîne de base64
    const blob: any = new Blob([binaryData], { type: "image/jpeg" });
    setSelecteBlobdImage(blob);
    return;
  };

  const toggleSelectedImage = (type: string) => {
    setWhitchImageSelected(type);
  };

  const onUploadImage = () => {
    setEditedImage(null);
    toggleSelectedImage("original");
    setRemoveBgProgress("");
    setprocessValue(0);
    onOpenChange();
  };

  const resetStudio = () => {
    setSelectedImage(null);
    setTempImage(null);
    setEditedImage(null);
    setSelecteBlobdImage(null);
    setFormData({ name: "" });
    setStickerId("");
    setIsActionSticker("");
    setRemoveBgProgress("");
    setprocessValue(0);
    toggleSelectedImage("original");
  };

  const onSelectStickerAction = (action: string, sticker?: any) => {
    if (action === "delete") {
      setIsActionSticker(action);
      onOpenDeleteChange();
    }
    if (action === "edit") {
      decodeBase64ToBlob(sticker.imageUrl);
      setStickerId(sticker.id);
      setCurrentSticker(sticker);
      setSelectedImage(sticker.imageUrl);
      setFormData({ name: sticker.name });
      setIsActionSticker(action);
    }
  };

  const handleGetCollectionById = async (id: string) => {
    const collection = await getCollectionById.mutateAsync({
      id: id,
      userId: user?.id,
    });
    setCurrentCollection(collection);
    setUpdateCollectionFormData({
      name: collection?.name || "",
      tag: collection?.tag || "",
    });
  };

  // *********global hook function************************

  useEffect(() => {
    if (collectionId && user?.id) {
      handleGetCollectionById(collectionId);
    }
  }, [collectionId, user?.id]);

  useEffect(() => {
    const userLocalData = localStorage.getItem("user");
    if (userLocalData) {
      const user: any = JSON.parse(userLocalData);
      setUser(user);
    }
  }, []);

  // call when data is loaded or change
  useEffect(() => {
    if (!isLoading && data) {
      setItems(data);
    }
  }, [isLoading, data]);
  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-1 mt-5 mx-10 sm:mx-16 md:mx-20 lg:mx-24">
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 w-full p-3 rounded-lg bg-pureBackground flex flex-col gap-2 items-start">
          <div>
            <h5 className="my-2 text-md ml-3">Collection details</h5>
          </div>
          {currentCollection ? (
            <div className="flex flex-col justify-center p-2 h-full w-full">
              <div className="flex flex-col justify-center p-5 h-full w-full rounded-lg  border border-slate-700">
                <div className="flex justify-between gap-x-10 mb-2">
                  <span>Collection : </span>
                  <span className="text-primary">
                    {currentCollection?.name}
                  </span>
                </div>

                <div className="flex justify-between gap-x-10 mb-2">
                  <span>Tag : </span>
                  <Chip
                    startContent={<Tag size={18} />}
                    variant="faded"
                    color="secondary"
                  >
                    {currentCollection?.tag !== ""
                      ? currentCollection?.tag
                      : "No tag"}
                  </Chip>
                </div>

                <div className="flex justify-between gap-x-10 mb-2">
                  <span>Created at : </span>
                  <Chip
                    startContent={<Calendar size={18} />}
                    variant="shadow"
                    color="secondary"
                  >
                    {currentCollection?.createdAt.toDateString()}
                  </Chip>
                </div>

                <div className="flex justify-between gap-x-10 mb-2">
                  <span>Updated at : </span>
                  <Chip
                    startContent={<Calendar size={18} />}
                    variant="shadow"
                    color="secondary"
                  >
                    {currentCollection?.updatedAt.toDateString()}
                  </Chip>
                </div>

                <div className="flex justify-between gap-x-10 mb-2">
                  <span>Stickers number : </span>
                  <Chip
                    startContent={<Sticker size={18} />}
                    variant="faded"
                    color="secondary"
                  >
                    {currentCollection?.stickers.length}/30
                  </Chip>
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-2">
                <Button
                  onPress={onOpenUpdateChange}
                  color="secondary"
                  className="w-full"
                  endContent={<Pencil />}
                >
                  Update collection
                </Button>
                <Button
                  onPress={onOpenDeleteChange}
                  isDisabled={
                    isRbLoading.firstMethod ||
                    isRbLoading.secondMethod ||
                    isSaveLoading ||
                    isUpdateLoading
                  }
                  color="danger"
                  className="w-full"
                  endContent={<Trash2 />}
                >
                  Delete collection
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full mt-2 py-5 px-20 rounded-lg border border-slate-700">
                <div className="flex flex-col justify-center gap-3 text-center">
                  <span className="text-primary">Loading data...</span>
                  <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 w-full p-3 rounded-lg bg-pureBackground flex flex-col gap-2 justify-center items-center">
          <div>
            {!selectedImage && (
              <div
                onClick={onOpenChange}
                className=" rounded-lg min-w-72 border border-dashed border-primary p-3  hover:border-none cursor-pointer hover:bg-lightBackground hover:text-white transform hover:translate-y-[-10px] duration-500 ease-in-out"
              >
                <div className="flex flex-col items-center gap-2 my-10 text-primary ">
                  <ImageIcon size={50} />
                  Upload new image
                </div>
              </div>
            )}
            {selectedImage && (
              <div className="flex flex-col justify-center gap-2">
                <ImageViewer
                  isProcessing={
                    isRbLoading.firstMethod || isRbLoading.secondMethod
                  }
                  images={
                    whitchImageSelected === "original"
                      ? [selectedImage]
                      : [editedImage]
                  }
                  customClass={
                    isRbLoading.firstMethod || isRbLoading.secondMethod
                      ? ""
                      : "cursor-pointer"
                  }
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  brightness={
                    isRbLoading.firstMethod || isRbLoading.secondMethod
                      ? "brightness(40%)"
                      : "brightness(100%)"
                  }
                  initialIndex={0}
                />
                {isActionSticker === "edit" && (
                  <span className="text-primary text-md text-center">
                    name : {currentSticker?.name}
                  </span>
                )}
                {removeBgProgress !== "" && (
                  <div className="flex flex-col justify-center gap-2">
                    <span className="text-withe text-md text-center">
                      Process : {removeBgProgress}
                    </span>
                    <Progress
                      aria-label="Downloading..."
                      size="md"
                      value={processValue}
                      color="primary"
                      showValueLabel={true}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="rounded-xl w-full p-3 border border-slate-700 ">
            <div className="flex justify-center items-center gap-4">
              {selectedImage && (
                <div>
                  <Tooltip showArrow={true} content="Original image">
                    <Image
                      className=" mx-auto"
                      src={selectedImage?.toString()}
                      width={60}
                      height={60}
                      alt="selected image"
                      onClick={() => toggleSelectedImage("original")}
                    />
                  </Tooltip>
                </div>
              )}
              {editedImage && (
                <div>
                  <Tooltip showArrow={true} content="Edited image">
                    <Image
                      className=" mx-auto"
                      src={editedImage?.toString()}
                      width={60}
                      height={60}
                      alt="edited image"
                      onClick={() => toggleSelectedImage("edited")}
                    />
                  </Tooltip>
                </div>
              )}
              <div>
                <Tooltip color="danger" showArrow={true} content="reset studio">
                  <Button
                    isIconOnly
                    size="lg"
                    color="secondary"
                    aria-label="reset"
                    className="w-16 h-16"
                    onPress={resetStudio}
                    isDisabled={
                      isRbLoading.firstMethod ||
                      isRbLoading.secondMethod ||
                      isSaveLoading
                    }
                  >
                    <RefreshCcw size={22} />
                  </Button>
                </Tooltip>
              </div>
              {isActionSticker === "edit" && (
                <div>
                  <Tooltip
                    color="danger"
                    showArrow={true}
                    content="Delete sticker"
                  >
                    <Button
                      isIconOnly
                      size="lg"
                      color="danger"
                      aria-label="reset"
                      className="w-16 h-16"
                      onPress={() => onSelectStickerAction("delete")}
                    >
                      <Trash2 size={22} />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 lg:col-start-2  w-full p-3 rounded-lg bg-pureBackground flex flex-col gap-2 items-start">
          <div>
            <h5 className="my-2 text-md ml-3">Configurations</h5>
          </div>
          <div className="flex flex-col justify-center p-2 h-full w-full">
            <div className="flex flex-col justify-center p-5 h-full w-full rounded-lg  border border-slate-700">
              <div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  isDisabled={!selectedImage}
                  label="Sticker name"
                  className="mb-5"
                />
              </div>
              <div>
                <span className="text-sm text-slate-400">
                  Remove background
                </span>
                <Button
                  onPress={() => handleRemoveBgImage("first")}
                  color="secondary"
                  size="sm"
                  isDisabled={
                    isSaveLoading ||
                    isUpdateLoading ||
                    !selectedImage ||
                    isRbLoading.firstMethod ||
                    isRbLoading.secondMethod ||
                    whitchImageSelected === "edited"
                  }
                  isLoading={isRbLoading.firstMethod}
                  className="w-full mb-1"
                  endContent={<Eraser />}
                >
                  First method
                </Button>
                <Button
                  onPress={() => handleRemoveBgImage("second")}
                  color="secondary"
                  size="sm"
                  isDisabled={
                    isSaveLoading ||
                    isUpdateLoading ||
                    !selectedImage ||
                    isRbLoading.secondMethod ||
                    isRbLoading.firstMethod ||
                    whitchImageSelected === "edited"
                  }
                  isLoading={isRbLoading.secondMethod}
                  className="w-full mb-1"
                  endContent={<Eraser />}
                >
                  Second method
                </Button>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-2">
              <Button
                onPress={onUploadImage}
                color="secondary"
                isDisabled={
                  isSaveLoading ||
                  isUpdateLoading ||
                  isRbLoading.firstMethod ||
                  isRbLoading.secondMethod ||
                  isUpdateLoading
                }
                className="w-full"
                endContent={<ArrowUpToLine />}
              >
                Upload image
              </Button>
              {isActionSticker === "edit" ? (
                <Button
                  isDisabled={
                    formData.name === "" ||
                    !selectedImage ||
                    isRbLoading.firstMethod ||
                    isRbLoading.secondMethod
                  }
                  isLoading={isUpdateLoading}
                  color="warning"
                  onPress={handleUpdateStickerSubmit}
                  className="w-full"
                  endContent={<Edit2 />}
                >
                  Update sticker
                </Button>
              ) : (
                <Button
                  isDisabled={
                    formData.name === "" ||
                    !selectedImage ||
                    isRbLoading.firstMethod ||
                    isRbLoading.secondMethod
                  }
                  isLoading={isSaveLoading}
                  onPress={handleSaveSticker}
                  color="primary"
                  className="w-full"
                  endContent={<ArrowDownToLine />}
                >
                  Save sticker
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <GridContent
        className="mt-16 mx-10 sm:mx-16 md:mx-20 lg:mx-36"
        data={items}
        title="Stickers"
        textBtn="New sticker"
        subTitle="You'll find a list of all your stickers. Select one to edit sticker."
        refreshFn={refetch}
        openModal={onUploadImage}
        noDataTitle="No sticker found"
        noDataSubTitle="Create a new sticker to get started"
      >
        <StckerItem
          items={items}
          onSelectStickerAction={onSelectStickerAction}
        />
      </GridContent>

      <div className="h-16"></div>

      {/* < select image Modal /> */}
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
                Select image file
              </ModalHeader>
              <ModalBody>
                <div className="mx-10">
                  <div className="flex p-2 justify-center items-center rounded-lg border border-dashed">
                    {!tempImage && (
                      <div className="flex flex-col items-center gap-2 my-10 text-primary">
                        <ImageIcon size={50} />
                        No image loaded
                      </div>
                    )}
                    {tempImage && (
                      <div>
                        <Image
                          className="object-cover"
                          src={tempImage?.toString()}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          alt="temp image"
                        />
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="doc"
                    className="flex items-center p-2 gap-3 mt-2 rounded-3xl border border-gray-300 border-dashed bg-gray-50 cursor-pointer"
                  >
                    <Image
                      className="h-16 w-auto"
                      src="/assets/upload-file.png"
                      width={50}
                      height={50}
                      alt="file input"
                    />
                    .
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-gray-700">
                        Upload a file
                      </h4>
                      <span className="text-sm text-gray-500">Max 5 MO</span>
                    </div>
                    <input
                      type="file"
                      id="doc"
                      name="doc"
                      accept="image/png, image/jpeg, image/webp, image/tiff"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-white text-black"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  isDisabled={!tempImage}
                  color="primary"
                  onPress={getSelectedImage}
                >
                  Add image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* <update collection Modal /> */}
      <Modal
        isDismissable={false}
        isOpen={isOpenUpdate}
        onOpenChange={onOpenUpdateChange}
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
                Update collection
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="New name"
                  placeholder="Enter a collection name"
                  variant="bordered"
                  name="name"
                  value={UpdateCollectionformData.name}
                  onChange={handleFormUpdateChange}
                  className="text-white focus:border-primary"
                />
                <Input
                  label="New tag(Optional)"
                  placeholder="Enter a collection tag"
                  variant="bordered"
                  name="tag"
                  value={UpdateCollectionformData.tag}
                  onChange={handleFormUpdateChange}
                  className="text-white focus:border-primary"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-white text-black"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={isUpdateLoading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={isUpdateLoading}
                  onPress={handleUpdateCollectionSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* <Delete sticker/collection Modal /> */}
      <Modal
        isDismissable={false}
        isOpen={isOpenDelete}
        onOpenChange={onOpenDeleteChange}
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
                {isActionSticker !== "delete"
                  ? "Delete collection"
                  : "Delete sticker"}
              </ModalHeader>
              <ModalBody>
                <div className="text-center flex flex-col gap-2 p-2 justify-center items-center">
                  <span className="text-primary font-bold uppercase text-lg">
                    {" "}
                    Warning!!!
                  </span>
                  <div className="p-3 w-full rounded-lg border border-slate-600">
                    {isActionSticker !== "delete" ? (
                      <span className="text-white text-sm">
                        You are about to delete this collection and all of its
                        stickers. This action cannot be undone.
                      </span>
                    ) : (
                      <span className="text-white text-sm">
                        You are about to delete this sticker it will no longer
                        be available in your collection. This action cannot be
                        undone.
                      </span>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-white text-black"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={isDeleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isDeleteLoading}
                  onPress={
                    isActionSticker !== "delete"
                      ? handleDeleteCollectionSubmit
                      : handleDeleteStickerSubmit
                  }
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

const StckerItem = ({
  items,
  onSelectStickerAction,
}: {
  items: any;
  onSelectStickerAction: any;
}) => {
  return (
    <>
      {items.map((item: any) => (
        <div key={item.id}>
          <Tooltip showArrow={true} content={item.name} offset={20}>
            <div className="h-44 py-2 flex justify-center items-center rounded-lg bg-pureBackground border border-primary-200 hover:border-none hover:bg-lightBackground transform hover:translate-y-[-10px] duration-500 ease-in-out">
              <Image
                alt="Card background"
                className="object-cover rounded-lg cursor-pointer"
                src={item.imageUrl}
                width={150}
                height={150}
                onClick={() => onSelectStickerAction("edit", item)}
              />
            </div>
          </Tooltip>
        </div>
      ))}
    </>
  );
};

const SkeletonSticker = () => {
  return (
    <Card className="w-full bg-lightBackground p-2" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="h-64 w-72 rounded-lg bg-default-200"></div>
      </Skeleton>
    </Card>
  );
};
