import { Footer, Navbar } from '../components';
import { About, Hero, Features, Pricing, Contact } from '../sections';

const HomePage = () => (
  <div className="bg-primary-black overflow-hidden">
    <Navbar />
    <Hero />
    <div className="relative">
      <About />
      <div className="gradient-02 z-0" />
      <Features />
    </div>
    <div className="relative">
      <Pricing />
      <div className="gradient-03 z-0" />
      <Contact />
    </div>
    <Footer />
  </div>
);

export default HomePage;
