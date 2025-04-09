import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './Button';
import TypeAnimation from './TypeAnimation';

const Hero = ({
  titlePrefix = "Streamlined CSV",
  titleAnimations = ["Generation", 2000, "Mapping", 2000, "Validation", 2000, "Transformation", 2000],
  subtitlePrefix = "Unlock the Power of CSV Data.",
  title = "Generate, Map, Validate, and Transform Your CSV Files — Visually and Effortlessly",
  subtitle = "No code. No confusion. Just clean, structured data.",
  ctaText = "Get Started",
  ctaLink = "/signup",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "#features",
  backgroundImage = "/assets/images/hero-background.jpg",
}) => {
  return (
    <div 
      className="relative px-4 pt-12 pb-20 md:pt-15 md:pb-32 items-center min-h-[80vh]"
      style={{
        backgroundImage: `linear-gradient(rgb(219, 238, 249), rgb(200, 232, 249)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto relative z-10">
      <div style={{ marginLeft: '15px' }} className="inset-0 bg-gradient-to-b from-primary/60 to-primary/95">
      <h1 style={{"color": "#2c5282", fontSize: '30px'}} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
            {title}
          </h1>
          
          <p style={{"color": "#2c5282"}} className="text-xl md:text-2xl text-accent/90 mb-10 leading-relaxed">
            {subtitle}
          </p>
      </div>
      <div className="max-w-4xl mx-auto text-center">
          <h1 style={{"color": "#2c5282"}} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {titlePrefix}{" "}
            <TypeAnimation
              sequences={titleAnimations}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              className="text-accent"
            />
          </h1>
          <p style={{"color": "#2c5282"}} className="text-xl md:text-2xl text-accent/90 mb-10 leading-relaxed">
            {subtitlePrefix}
          </p>

          
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={ctaLink}>
              <Button 
                variant="outlineExt" 
                size="lg" 
                className="w-full sm:w-auto text-black"
              >
                {ctaText}
              </Button>
            </Link>
            
            <Link to={secondaryCtaLink}>
              <Button 
                variant="outlineExt" 
                size="lg" 
                className="w-full sm:w-auto border-black text-black hover:bg-black/10"
              >
                {secondaryCtaText}
              </Button>
            </Link>
          </div>


      </div>
      
      
      {/* <div className="container mx-auto relative z-10">
      
        
      </div>
      <div className="container mx-auto relative z-10">
      
      </div> */}
    </div>
  );
};

Hero.propTypes = {
  titlePrefix: PropTypes.string,
  titleAnimations: PropTypes.array,
  subtitle: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  secondaryCtaText: PropTypes.string,
  secondaryCtaLink: PropTypes.string,
  backgroundImage: PropTypes.string,
};

export default Hero;