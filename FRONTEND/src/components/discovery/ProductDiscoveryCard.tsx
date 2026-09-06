import { ProductCard, type ProductCardProps } from "../shared/ProductCard";

/**
 * ProductDiscoveryCard is an alias for the canonical ProductCard component.
 * This guarantees 100% unified behavior, touch reveal animations, and
 * dynamic Pinterest layout sizing across all pages of DressMe.
 */
export const ProductDiscoveryCard = ProductCard;
export type ProductDiscoveryCardProps = ProductCardProps;
