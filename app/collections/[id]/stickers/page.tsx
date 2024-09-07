import StickerList from "./components/list";

export default function Collections({ params }: any) {
  const collectionId = params.id;
  return (
    <>
      <div className="mt-20 text-center mx-auto text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-200 ">
        <div className="mx-10 sm:mx-16 md:mx-32 lg:mx-68">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">
            Sticker Maker studio
          </span>
        </div>
      </div>
      <StickerList collectionId={collectionId} />
    </>
  );
}
