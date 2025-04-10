import { Layout } from "@/components/layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Portfolio Showcase</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-muted-foreground">
              Portfolio Showcase is a platform designed to help creators display and organize their work 
              in a clean, professional manner. We provide a simple yet powerful way to showcase your 
              creations and connect them directly to marketplaces where they can be purchased.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Clean, responsive design with customizable themes</li>
              <li>Category organization to keep your work well-structured</li>
              <li>Direct marketplace links to promote your items</li>
              <li>Smart tagging powered by AI to improve discoverability</li>
              <li>Social sharing capabilities to expand your reach</li>
              <li>Role-based access control for team management</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
            <p className="text-muted-foreground">
              Portfolio Showcase was created by a team of designers and developers who understand the 
              challenges of presenting creative work online. We built this platform to solve the common 
              problems faced by digital artists, photographers, musicians, and other creators who need 
              a professional way to display their portfolio and connect it to sales channels.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}