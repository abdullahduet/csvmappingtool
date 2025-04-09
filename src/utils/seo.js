/**
 * SEO utility functions
 */

// Generate structured data for organization
export const generateOrganizationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ReactRedux Pro",
      "url": "https://your-domain.com",
      "logo": "https://your-domain.com/logo.png",
      "sameAs": [
        "https://twitter.com/your-twitter",
        "https://www.linkedin.com/company/your-company",
        "https://github.com/your-github"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-555-5555",
        "contactType": "customer service",
        "email": "support@your-domain.com"
      }
    };
  };
  
  // Generate structured data for software application
  export const generateSoftwareApplicationSchema = (
    name = "ReactRedux Pro",
    description = "Streamlined Solutions for Complex Challenges. Modern React applications with Redux.",
    price = "0",
    priceCurrency = "USD"
  ) => {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": name,
      "description": description,
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": priceCurrency
      }
    };
  };
  
  // Generate meta tags for a page
  export const generateMetaTags = (
    title = "ReactRedux Pro",
    description = "Streamlined Solutions for Complex Challenges. Modern React applications with Redux.",
    keywords = "react, redux, web application, modern, frontend"
  ) => {
    const tags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords }
    ];
    
    return { title, tags };
  };
  
  // Generate canonical URL
  export const generateCanonicalUrl = (path) => {
    const baseUrl = "https://your-domain.com";
    return `${baseUrl}${path}`;
  };