// components/Breadcrumbs.js
"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

const breadcrumbsStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: "rgba(255, 255, 255, 0.2)", // Fond légèrement transparent
  backdropFilter: "blur(10px)", // Effet de flou
  WebkitBackdropFilter: "blur(10px)", // Pour la compatibilité Safari
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Ombre légère pour un meilleur contraste
  transition: "background-color 0.3s ease", // Transition douce pour les changements d'état
};

const shouldCombineNextSegment = (segment: string, nextSegment: string) => {
  // Vérifiez si le segment actuel est un UUID et si le suivant est "stickers"
  const cuidRegex = /^[a-z0-9]+[a-z0-9][a-z0-9]+[a-z0-9]+[a-z0-9]+[a-z0-9]+$/;
  return segment && nextSegment;
};

const BreadcrumbsComponent = () => {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const newBreadcrumbItems: any = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      let href = "/" + pathSegments.slice(0, i + 1).join("/");
      let label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitaliser le segment

      // Vérifiez si le segment actuel doit être combiné avec le suivant
      if (
        i < pathSegments.length - 1 &&
        shouldCombineNextSegment(segment, pathSegments[i + 1])
      ) {
        const nextSegment = pathSegments[i + 1];
        label = `${nextSegment.charAt(0).toUpperCase() + nextSegment.slice(1)}`; // Modifier le label
        href += "/" + nextSegment; // Combinez l'URL
        i++; // Augmentez l'index pour sauter le prochain segment
      }

      newBreadcrumbItems.push({
        label,
        href,
      });
    }

    setBreadcrumbItems(newBreadcrumbItems);
  }, [pathname]);

  return (
    <div className="p-1 my-1 mx-5 rounded-full" style={breadcrumbsStyle}>
      <Breadcrumbs
        classNames={{
          list: "gap-2 ",
          base: "m-3",
        }}
        itemClasses={{
          item: [
            "px-2 py-0.5 border-small border-default-400 rounded-small",
            "data-[current=true]:border-foreground data-[current=true]:bg-transparent data-[current=true]:text-white transition-colors",
            "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-default-100",
          ],
          separator: "hidden",
        }}
      >
        {breadcrumbItems.map((item: any, index) => (
          <BreadcrumbItem key={index} href={item.href}>
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;
