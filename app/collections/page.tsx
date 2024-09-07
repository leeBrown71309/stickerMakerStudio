/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useUserStore } from "../home/store/user-store";
import CollectionsList from "./components/list";

export default function Collections() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <div className="mt-20 text-center mx-auto text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-200 ">
        <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">
          Welcome {user?.fullname}
        </div>
        <div className="mx-10 sm:mx-16 md:mx-32 lg:mx-68">
          Create personalised collections to organise your library
          <div className="mt-5 text-sm text-slate-500">
            Collections are an excellent way of organising your library and
            organise your stikers <br />
            by category so you can find them easily.
          </div>
        </div>
      </div>
      <CollectionsList />
    </>
  );
}
