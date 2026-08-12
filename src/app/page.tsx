import dynamic from "next/dynamic";
import { OrnamentalDivider } from "@/components/zariya/ornamental-divider";

const Hero = dynamic(() => import("@/components/zariya/sections/hero"));
const Categories = dynamic(() => import("@/components/zariya/sections/categories"));
const BestSellers = dynamic(() => import("@/components/zariya/sections/best-sellers"));
const NewArrivals = dynamic(() => import("@/components/zariya/sections/new-arrivals"));
const LuxuryCollection = dynamic(() => import("@/components/zariya/sections/luxury-collection"));
const LimitedEdition = dynamic(() => import("@/components/zariya/sections/limited-edition"));
const CelebrityCollection = dynamic(() => import("@/components/zariya/sections/celebrity-collection").then((m) => m.CelebrityCollection));
const LuxuryPackaging = dynamic(() => import("@/components/zariya/sections/luxury-packaging").then((m) => m.LuxuryPackaging));
const GiftCards = dynamic(() => import("@/components/zariya/sections/gift-cards").then((m) => m.GiftCards));
const ZariyaCircle = dynamic(() => import("@/components/zariya/sections/zariya-circle").then((m) => m.ZariyaCircle));
const Sustainability = dynamic(() => import("@/components/zariya/sections/sustainability").then((m) => m.Sustainability));
const ArtisanStory = dynamic(() => import("@/components/zariya/sections/artisan-story"));
const JournalTeaser = dynamic(() => import("@/components/zariya/sections/journal-teaser").then((m) => m.JournalTeaser));
const RecentlyViewed = dynamic(() => import("@/components/zariya/sections/recently-viewed").then((m) => m.RecentlyViewed));
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
      <OrnamentalDivider variant="diamond" />
      <BestSellers />
      <NewArrivals />
      <LuxuryCollection />
      <OrnamentalDivider variant="lotus" />
      <LimitedEdition />
      <CelebrityCollection />
      <LuxuryPackaging />
      <GiftCards />
      <ZariyaCircle />
      <Sustainability />
      <OrnamentalDivider variant="simple" />
      <ArtisanStory />
      <AboutBrand />
      <JournalTeaser />
      <RecentlyViewed />
      <Testimonials />
      <InstagramGallery />
      <FAQs />
      <Newsletter />
    </main>
  );
}
