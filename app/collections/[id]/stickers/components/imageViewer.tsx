import React, { useState } from "react";
import { Button, Image, Tooltip } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import "../../../../css/viewImage.css";
import { Trash2, X } from "lucide-react";
export const ImageViewer = ({
  images,
  initialIndex = 0,
  sizes = "",
  brightness = "",
  customClass = "",
  isProcessing = false,
}: {
  images: string[];
  initialIndex: number;
  sizes: string;
  brightness: string;
  customClass: string;
  isProcessing: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleImageClick = (index: any) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleOverlayClick = (event: any) => {
    if (event.target.classList.contains("overlay")) {
      handleCloseViewer();
    }
  };

  const handleNextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div>
      {images.map((image, index) => (
        <div key={index} className="rounded-lg">
          <Tooltip
            showArrow={true}
            color="danger"
            content={isProcessing ? "Processing..." : "Click to show full size"}
            offset={20}
          >
            <Image
              src={image}
              className={"rounded-lg object-cover " + customClass}
              sizes={sizes}
              alt="selected image"
              isZoomed
              onClick={() => (isProcessing ? null! : handleImageClick(index))}
              style={{
                filter: brightness,
              }}
            />
          </Tooltip>
        </div>
      ))}

      {isViewerOpen && (
        <div
          className="overlay flex flex-col justify-center items-center"
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={images[currentIndex]}
              alt={`Image ${currentIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="rounded-xl"
              style={{ width: "80%", height: "80%" }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              // onDragEnd={(e, { offset, velocity }) => {
              //   const swipe = swipePower(offset.x, velocity.x);

              //   if (swipe < -swipeConfidenceThreshold) {
              //     paginate(1);
              //   } else if (swipe > swipeConfidenceThreshold) {
              //     paginate(-1);
              //   }
              // }}
            />
          </AnimatePresence>
          <div>
            <Button
              isIconOnly
              color="danger"
              variant="faded"
              aria-label="Exit"
              onPress={handleCloseViewer}
              className="w-14 h-14 my-2"
            >
              <X size={25} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageViewerAll = ({
  images,
  initialIndex = 0,
}: {
  images: string[];
  initialIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleImageClick = (index: any) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleOverlayClick = (event: any) => {
    if (event.target.classList.contains("overlay")) {
      handleCloseViewer();
    }
  };

  const handleNextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div>
      {images.map((image, index) => (
        <div key={index} className="rounded-lg">
          <Image
            src={image}
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="selected image"
            onClick={() => handleImageClick(index)}
          />
        </div>
      ))}

      {isViewerOpen && (
        <motion.div
          className="overlay"
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={images[currentIndex]}
              alt={`Image ${currentIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ width: "80%", height: "80%" }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            />
          </AnimatePresence>
          <div className="next" onClick={() => paginate(1)}>
            {"‣"}
          </div>
          <div className="prev" onClick={() => paginate(-1)}>
            {"‣"}
          </div>
          {/* <AnimatePresence>
            <motion.img
              src={images[currentIndex]}
              alt={`Image ${currentIndex}`}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ width: "80%", height: "80%" }}
            />
          </AnimatePresence> */}
        </motion.div>
      )}
    </div>
  );
};
