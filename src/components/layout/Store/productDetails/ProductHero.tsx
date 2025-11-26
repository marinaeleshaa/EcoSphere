
import { IProduct } from "@/types/ProductType";
import Link from "next/link";

const ProductHero = ({ product }: { product: IProduct }) => {


  return (
    <section className="relative w-full h-[200px] bg-primary overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-foreground rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-4">
        {/* Main heading with subtle animation-ready structure */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-primary-foreground font-bold tracking-tight">
            Store
          </h1>
        </div>

        {/* Breadcrumb navigation with improved styling */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm md:text-base"
        >
          <Link
            href="/"
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 hover:underline underline-offset-4"
          >
            Home
          </Link>
          <span className="text-primary-foreground/50">/</span>
          <Link
            href="/store"
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 hover:underline underline-offset-4"
          >
            Store
          </Link>
          <span className="text-primary-foreground/50">/</span>
          <span className="text-primary-foreground font-medium">
            {product ? product.productName : "Product"}
          </span>
        </nav>
      </div>
    </section>
  );
};

export default ProductHero;
