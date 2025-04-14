
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

export type CarouselApi = EmblaCarouselType;

export interface CarouselOptions extends EmblaOptionsType {}

export interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: any[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

export interface CarouselContextProps {
  carouselRef: React.RefObject<HTMLDivElement>;
  api: CarouselApi | undefined;
  opts?: CarouselOptions;
  orientation?: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export interface CarouselNextProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export interface CarouselPrevProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}
