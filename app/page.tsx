import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { HoursStrip } from "./_components/sections/HoursStrip";
import { ScissorsSequence } from "./_components/sections/ScissorsSequence";
import { About } from "./_components/sections/About";
import { Services } from "./_components/sections/Services";
import { Atmosphere } from "./_components/sections/Atmosphere";
import { Testimonials } from "./_components/sections/Testimonials";
import { Contact } from "./_components/sections/Contact";
import { Footer } from "./_components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HoursStrip />
        <ScissorsSequence />
        <About />
        <Services />
        <Atmosphere />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
