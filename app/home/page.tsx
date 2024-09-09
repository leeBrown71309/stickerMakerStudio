/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Play, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Pagination,
} from "@nextui-org/react";
import { Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/server/client";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "./store/user-store";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isNewUserOpen,
    onOpen: onNewUserOpen,
    onOpenChange: onNewUserOpenChange,
  } = useDisclosure();

  const [isAddLoading, setIsAddLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const [formData, setFormData] = useState({ fullname: "", email: "" });
  const [userId, setUserId] = useState("");

  const { data, error, isLoading, refetch }: any = trpc.user.getUser.useQuery(
    userId,
    {
      enabled: !!userId,
    }
  );
  const addUser = trpc.user.addUser.useMutation();
  const getUserByEmail = trpc.user.getUserByEmail.useMutation();

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });

  const handleSubmit = async () => {
    setIsAddLoading(true);
    try {
      const data = await addUser.mutateAsync(formData);
      setUser(data);
      notifySuccess(`User ${formData.fullname} added successfully`);
      setFormData({ fullname: "", email: "" }); // Réinitialise le formulaire
      setIsAddLoading(false);
      onOpenChange();
      goToCollections();
    } catch (error) {
      setIsAddLoading(false);
      notifyError("Failed to add user");
      console.log("🚀 ~ onError ~ error:", error);
    }
  };

  const handleConnectSubmit = async () => {
    setIsAddLoading(true);
    try {
      const userByEmail = await getUserByEmail.mutateAsync(formData.email);
      if (!userByEmail) {
        notifyError("Invalid email, please try again");
        setIsAddLoading(false);
        return;
      }
      setUser(userByEmail);
      notifySuccess(`Login successfully`);
      setFormData({ fullname: "", email: "" }); // Réinitialise le formulaire
      setIsAddLoading(false);
      onNewUserOpenChange();
      goToCollections();
    } catch (error) {
      setIsAddLoading(false);
      notifyError("A error occurred, please try again");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goToCollections = () => {
    setTimeout(() => {
      router.push("/collections");
    }, 3000);
  };

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    const userLocalData = localStorage.getItem("user");
    if (userLocalData) {
      const user: any = JSON.parse(userLocalData);
      setUser(user);
      setUserId(user.id);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="mt-20 text-center mx-auto text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-200">
        <div className="mx-10 sm:mx-16 md:mx-32 lg:mx-68">
          Creating personalised stickers has never been easier
          <br />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">
            Sticker Maker
          </span>
          <div className="mt-5 text-sm text-slate-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi nam
            <br />
            molestias nemo eligendi minima, magni dicta animir.
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            onPress={onNewUserOpen}
            color="primary"
            endContent={<Play />}
            className="mt-10 md:mt-10 lg:mt-4"
          >
            Login
          </Button>
          <Button
            onPress={onOpen}
            endContent={<Plus />}
            className="mt-10 md:mt-10 lg:mt-4 bg-white text-black hover:bg-slate-100"
          >
            new account
          </Button>
        </div>
        <div className="-mt-10 flex justify-center">
          <Image
            width={400}
            height={400}
            src="/assets/dog.gif"
            alt="sticker"
          ></Image>
        </div>
      </div>

      {/* <Modal /> add new user*/}
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
                Fill the form
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Your name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Joe Doe"
                  variant="bordered"
                  className="text-white focus:border-primary"
                />
                <Input
                  endContent={
                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  variant="bordered"
                  className="text-white focus:border-primary"
                />
              </ModalBody>
              <ModalFooter className="flex flex-col justify-center">
                <Button
                  onPress={() => signIn("google")}
                  isLoading={isAddLoading}
                  isDisabled
                  className="w-full bg-white text-black hover:bg-slate-100"
                >
                  Connect with Google
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isAddLoading}
                  isDisabled={formData.email === "" || formData.fullname === ""}
                  className="w-full"
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* <Modal /> connnect user*/}
      <Modal
        isDismissable={false}
        isOpen={isNewUserOpen}
        onOpenChange={onNewUserOpenChange}
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
                Enter your email to get started
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  variant="bordered"
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
                  onPress={handleConnectSubmit}
                  isLoading={isAddLoading}
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
