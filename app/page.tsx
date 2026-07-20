import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { SignatureSequence } from "./_components/sections/SignatureSequence";
import { About } from "./_components/sections/About";
import { Services } from "./_components/sections/Services";
import { Team } from "./_components/sections/Team";
import { Gallery } from "./_components/sections/Gallery";
import { Testimonials } from "./_components/sections/Testimonials";
import { Contact } from "./_components/sections/Contact";
import { Footer } from "./_components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SignatureSequence />
        <About />
        <Services />
        <Team />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
