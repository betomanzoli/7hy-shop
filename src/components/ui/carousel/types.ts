
import * as React from "react";

export interface CarouselApi {
  selectedScrollSnap: () => number;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
}

export interface CarouselProps {
  opts?: any;
  plugins?: any[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

export interface CarouselContextProps {
  carouselRef: React.RefObject<HTMLDivElement>;
  api: CarouselApi | undefined;
  opts?: any;
  orientation?: "horizontal" | "vertical";
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

export interface CarouselNextProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export interface CarouselPrevProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}
