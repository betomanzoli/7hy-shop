
"use client";

import * as React from "react";
import { emblaCarousel, EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { cn } from "@/lib/utils";
import { createContext, useContext } from "react";

type CarouselApi = EmblaCarouselType;

type UseCarouselParameters = Parameters<typeof emblaCarousel>;
type UseCarouselOptions = UseCarouselParameters[0];
type UseCarouselReturn = [
  React.RefObject<HTMLDivElement>,
  CarouselApi | undefined
];

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: UseCarouselOptions;
  plugins?: UseCarouselParameters[1];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps {
  carouselRef: React.RefObject<HTMLDivElement>;
  api: CarouselApi | undefined;
  opts?: UseCarouselOptions;
  orientation?: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function useEmblaCarousel(
  options?: UseCarouselOptions,
  plugins?: UseCarouselParameters[1]
): UseCarouselReturn {
  const [emblaRef, setEmblaRef] = React.useState<HTMLDivElement | null>(null);
  const [emblaApi, setEmblaApi] = React.useState<EmblaCarouselType>();

  React.useEffect(() => {
    if (!emblaRef) return;

    const api = emblaCarousel(emblaRef, options, plugins);
    setEmblaApi(api);

    return () => {
      api.destroy();
    };
  }, [emblaRef, options, plugins]);

  return [React.useRef(emblaRef as any), emblaApi];
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("select", () => onSelect(api));
      api.on("reInit", () => onSelect(api));

      return () => {
        api?.off("select", () => onSelect(api));
        api?.off("reInit", () => onSelect(api));
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export { Carousel, useCarousel };
export type { CarouselApi };
