import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TypeAnimation from '../components/common/TypeAnimation';
import Button from '../components/common/Button';
import { features } from '../data/featuresData';


{/* <Link
          key={feature.id}
          to={`/features/${feature.id}`}
          className="group bg-accent-50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full mb-4 group-hover:bg-secondary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-900 mb-2 group-hover:text-primary transition-colors">
            {feature.name}
          </h3>
          <p className="text-text-600">
            {feature.description}
          </p>
          <div className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <span className="mr-2">Learn more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link> */}



const Home = () => {
  return (
    <>
      <SEOHead 
        title="CSV Mapping Tool - Process, Convert and Transform CSV Data"
        description="Streamlined CSV Solutions for Data Professionals. Map, transform, convert, and visualize CSV data with our intuitive web-based tools."
        keywords="csv, csv mapping, csv converter, csv to json, data transformation, csv generator, csv validator"
      />
      
      {/* Hero Section with Type Animation */}
      <div className="relative px-4 pt-32 pb-20 md:pt-40 md:pb-32 flex items-center min-h-[80vh] bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/95"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Ultimate{" "}
              <TypeAnimation
                sequences={[
                  "CSV Mapping Tool", 2000,
                  "CSV Converter", 2000,
                  "CSV Generator", 2000,
                  "Data Transformer", 2000
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-accent"
              />
            </h1>
            
            <p className="text-xl md:text-2xl text-accent/90 mb-10 leading-relaxed">
              Streamlined CSV solutions for complex data challenges.
              Upload, transform, and visualize your CSV data in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/upload">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Upload CSV
                </Button>
              </Link>
              
              <Link to="/features">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
              Powerful CSV Tools
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-600">
              Everything you need to work with CSV data in one place.
              Transform, convert, and visualize your data with ease.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={`/features/${feature.id}`}
                className="bg-accent-50 rounded-lg p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
                  </svg>
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
      
      {/* How It Works Section */}
      <section className="py-20 bg-accent-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-600">
              Our CSV tools make data transformation simple and efficient.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-[21px] top-10 bottom-10 w-1 bg-primary hidden md:block"></div>
              
              {/* Step 1 */}
              <div className="flex items-start mb-12">
                <div className="flex-shrink-0 mr-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your CSV File</h3>
                  <p className="text-text-600">
                    Start by uploading your CSV file. Our tool automatically detects column headers and data types.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start mb-12">
                <div className="flex-shrink-0 mr-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select Your Transformation</h3>
                  <p className="text-text-600">
                    Choose the operation you want to perform: map to another structure, convert to a different format, or validate your data.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Download or Export Results</h3>
                  <p className="text-text-600">
                    Preview your transformed data and download it in your desired format, or continue processing with additional tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      // Sample Data Showcase
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-900 mb-4">
              See It in Action
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-600">
              Browse our examples to see how CSV Mapping Tool can transform your data.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-accent-50 rounded-lg p-6 md:p-8 shadow-md">
              <h3 className="text-xl font-semibold mb-6">CSV to JSON Conversion Example</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-primary">Source CSV</h4>
                  <div className="bg-white p-4 rounded border border-border overflow-auto max-h-64">
                    <pre className="text-sm">
                      {`id,name,email,department
      1,John Smith,john@example.com,Engineering
      2,Sara Johnson,sara@example.com,Marketing
      3,Michael Brown,michael@example.com,Finance
      4,Emily Davis,emily@example.com,HR`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-secondary">Result JSON</h4>
                  <div className="bg-white p-4 rounded border border-border overflow-auto max-h-64">
                    <pre className="text-sm">
                      {`[
        {
          "id": "1",
          "name": "John Smith",
          "email": "john@example.com",
          "department": "Engineering"
        },
        {
          "id": "2",
          "name": "Sara Johnson",
          "email": "sara@example.com",
          "department": "Marketing"
        },
        {
          "id": "3",
          "name": "Michael Brown",
          "email": "michael@example.com",
          "department": "Finance"
        },
        {
          "id": "4",
          "name": "Emily Davis",
          "email": "emily@example.com",
          "department": "HR"
        }
      ]`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link to="/examples">
                  <Button variant="primary">
                    View More Examples
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your CSV Data?
          </h2>
          <p className="max-w-xl mx-auto text-lg text-white/80 mb-8">
            Join thousands of data professionals who use CSV Mapping Tool to streamline their data workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload">
              <Button 
                variant="secondary" 
                size="lg"
              >
                Start Processing
              </Button>
            </Link>
            <Link to="/samples">
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Try Sample Data
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;