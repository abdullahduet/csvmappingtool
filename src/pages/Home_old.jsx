import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Hero from '../components/common/Hero';
import Button from '../components/common/Button';
// import csvAdvLogo from '../assets/images/csv-advance.svg';
import csvAdv from '../assets/images/csvAdv.svg';

const Home = () => {
  // Features section data
  const features = [
    {
      id: 'advancedCSVGenerator',
      title: "Advanced CSV Generator",
      description: "Streamlined workflow with Advanced CSV Generator. Support Custom Input and Validation",
      icon: (
        // <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        // </svg>
        <img style={{ width: '48px', height: '48px' }} src={csvAdv} alt="Advanced CSV Generator" className="w-12 h-12 text-primary" />
      ),
    },
    // {
    //   title: "Responsive Design",
    //   description: "Create beautiful user interfaces that work seamlessly across all devices with Tailwind CSS.",
    //   icon: (
    //     <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    //     </svg>
    //   ),
    // },
    {
      id: 'performanceOptimized',
      title: "Performance Optimized",
      description: "A high-performance CSV Mapping and Data Transformation Tool",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    // {
    //   title: "Secure Authentication",
    //   description: "Implement robust authentication flows with protected routes and user management.",
    //   icon: (
    //     <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    //     </svg>
    //   ),
    // },
  ];

  // Testimonials data
  // const testimonials = [
  //   {
  //     quote: "This toolkit has dramatically reduced our development time and improved code quality.",
  //     author: "Jane Cooper",
  //     role: "CTO, TechCorp",
  //     avatar: "/assets/images/avatar-1.jpg",
  //   },
  //   {
  //     quote: "The best React Redux solution we've used. Clean, efficient, and well-documented.",
  //     author: "Alex Richards",
  //     role: "Lead Developer, InnoSoft",
  //     avatar: "/assets/images/avatar-2.jpg",
  //   },
  //   {
  //     quote: "Perfect balance of flexibility and structure. Highly recommended for teams.",
  //     author: "Sarah Johnson",
  //     role: "Product Manager, Nexus",
  //     avatar: "/assets/images/avatar-3.jpg",
  //   },
  // ];

  return (
    <>
      <SEOHead
        title="Home"
        description="Streamlined Solutions for Complex Challenges. Build powerful, efficient applications with our modern React Redux toolkit."
        keywords="react, redux, react hooks, modern web development, state management, frontend framework, javascript application"
      />

      {/* Hero Section */}
      <Hero
        title="Generate, Map, Validate, Convert, and Transform CSV Files — Visually and Effortlessly"
        subtitle="No code. No confusion. Just clean, structured data."
        ctaText="Get Started"
        ctaLink="/signup"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/demo"
      />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
              Powerful Features
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-600">
              The Ultimate CSV Mapping and Data Transformation Tool for Seamless Data Integration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature) => (
              // <div 
              //   key={index} 
              //   className="bg-accent-50 rounded-lg p-6 transition-shadow duration-300 hover:shadow-lg"
              // >
              //   <div className="mb-4">
              //     {feature.icon}
              //   </div>
              //   <h3 className="text-xl font-semibold text-text-900 mb-2">
              //     {feature.title}
              //   </h3>
              //   <p className="text-text-600">
              //     {feature.description}
              //   </p>
              // </div>
              <Link
                key={feature.id}
                to={`/features/${feature.id}`}
                className="bg-accent-50 rounded-lg p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-text-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="max-w-xl mx-auto text-lg text-text-900/80 mb-8">
            A drag-and-drop CSV Wizard that allows users to upload spreadsheets/CSV files, map columns, and validate data all within a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button
                variant="outlineExt"
                size="lg"
              >
                Start Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outlineExt"
                size="lg"
                className="border-white text-text-900 hover:bg-white/10"
              >
                Contact US
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-accent-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
              What Our Users Say
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-600">
              Trusted by developers and companies worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  <svg className="text-secondary h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-lg mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-text-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Bottom CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-text-900 mb-6">
            Transform Your Development Workflow Today
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-600 mb-8">
            Join us and start building better applications with our modern CSV Mapping and Data Transformation toolkit.
          </p>
          <Link to="/signup">
            <Button
              variant="outlineExt"
              size="lg"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;