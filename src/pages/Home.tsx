import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedWork from '../components/FeaturedWork';
import ShortsShowcase from '../components/ShortsShowcase';
import ClientProjects from '../components/ClientProjects';
import Reviews from '../components/Reviews';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-main-bg text-primary-text selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <ShortsShowcase />
        <Reviews />
        <About />
        <Services />
        <ClientProjects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
