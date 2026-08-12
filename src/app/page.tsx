import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/zariya/sections/hero"));
const Categories = dynamic(() => import("@/components/zariya/sections/categories"));
const BestSellers = dynamic(() => import("@/components/zariya/sections/best-sellers"));
const NewArrivals = dynamic(() => import("@/components/zariya/sections/new-arrivals"));
const LuxuryCollection = dynamic(() => import("@/components/zariya/sections/luxury-collection"));
const LimitedEdition = dynamic(() => import("@/components/zariya/sections/limited-edition"));
const ArtisanStory = dynamic(() => import("@/components/zariya/sections/artisan-story"));
const Testimonials = dynamic(() => import("@/components/zariya/sections/testimonials"));
const InstagramGallery = dynamic(() => import("@/components/zariya/sections/instagram-gallery"));
const Newsletter = dynamic(() => import("@/components/zariya/sections/newsletter"));
const FAQs = dynamic(() => import("@/components/zariya/sections/faqs"));
const AboutBrand = dynamic(() => import("@/components/zariya/sections/about-brand"));

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Categories />
      <BestSellers />
      <NewArrivals />
      <LuxuryCollection />
      <LimitedEdition />
      <ArtisanStory />
      <AboutBrand />
      <Testimonials />
      <InstagramGallery />
      <FAQs />
      <Newsletter />
    </main>
  );
}
