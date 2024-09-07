"use client";

import { RefreshCw, Plus } from "lucide-react";
import { Button, CircularProgress, Pagination } from "@nextui-org/react";
import EmptyData from "@/components/emptyData";

export default function GridContent({
  children,
  className,
  data,
  title,
  textBtn,
  subTitle,
  refreshFn,
  openModal,
  noDataTitle,
  noDataSubTitle,
  isLoading,
  ...props
}: any) {
  return (
    <>
      <div className={`bg-pureBackground rounded-lg ${className}`}>
        <div className="pb-5">
          <div className="flex justify-between items-center h-16 border-b border-slate-600">
            <span className="text-md ml-3">{title}</span>
            <Button
              onPress={refreshFn}
              className="mr-3 bg-primary-200 text-primary"
              endContent={<RefreshCw />}
            >
              Refresh
            </Button>
          </div>

          <div className="flex justify-center">
            <span className="text-sm text-center text-slate-600 mt-4">
              {subTitle}
            </span>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-2 justify-center items-center m-10">
              <CircularProgress color="primary" aria-label="Loading..." />
              <span className="text-default-500 text-md">Data loading...</span>
            </div>
          )}

          {/* Affichage des donées si la grille n'est pas vide */}
          {!isLoading && data.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 px-3 py-3 mt-5">
              {/* Bouton pour ajouter un nouvel élément */}
              <div
                onClick={openModal}
                className="w-auto h-auto border border-dashed hover:border-none border-primary-200 bg-transparent rounded-xl flex items-center justify-center cursor-pointer hover:bg-lightBackground hover:text-white transform hover:translate-y-[-10px] duration-500 ease-in-out"
              >
                <div className="flex flex-col justify-center items-center p-3">
                  <Plus size={34} className="text-primary-500" />
                  <span className="text-center text-slate-600">{textBtn}</span>
                </div>
              </div>

              {/* Affichage des éléments de la grille */}
              {children}
            </div>
          )}

          {!isLoading && data.length > 8 && (
            <div className="flex justify-center mb-5 p-4 mx-3 rounded-xl border border-slate-600 overflow-auto">
              <Pagination
                loop
                showControls
                total={data.length}
                initialPage={1}
                color="primary"
              />
            </div>
          )}

          {/* Affichage des éléments vides si la grille est vide */}
          {!isLoading && data.length === 0 && (
            <EmptyData title={noDataTitle} subTitle={noDataSubTitle} />
          )}
        </div>
      </div>
    </>
  );
}
