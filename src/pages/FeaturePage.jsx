import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import { features } from '../data/featuresData';

const FeaturePage = () => {
  const { featureId } = useParams();
  const feature = features.find(f => f.id === featureId);
  
  // If feature doesn't exist, redirect to home
  if (!feature) {
    return <Navigate to="/" replace />;
  }
  
  const FeatureComponent = feature.component;
  
  return (
    <>
      <SEOHead 
        title={feature.name} 
        description={`Learn about ${feature.name}: ${feature.description}`}
        keywords={`react, redux, ${feature.id}, ${feature.name.toLowerCase()}, web development`}
      />
      
      <div className="pt-16">
        <FeatureComponent />
      </div>
    </>
  );
};

export default FeaturePage;