
import type { UseEmblaCarouselType } from "embla-carousel-react"
import type useEmblaCarousel from "embla-carousel-react"

// Export type definitions
export type CarouselApi = UseEmblaCarouselType[1]
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]
export type CarouselPlugin = UseCarouselParameters[1]
