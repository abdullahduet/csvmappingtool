import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTemplates } from '../hooks/useTemplates';
import { useOperationHistory } from '../hooks/useOperationHistory';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { templates, loadTemplates, deleteTemplate } = useTemplates();
  const { history, loadHistory } = useOperationHistory();
  
  const [activeTab, setActiveTab] = useState('templates');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load user data
  useEffect(() => {
    if (isAuthenticated) {
      loadTemplates();
      loadHistory();
    }
  }, [isAuthenticated, loadTemplates, loadHistory]);
  
  // Handle template deletion
  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };
  
  return (
    <>
      <SEOHead 
        title="Dashboard - CSV Mapping Tool"
        description="Manage your CSV templates, mapping configurations, and operation history."
        keywords="csv dashboard, saved templates, mapping history"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
              <p className="text-text-600">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link to="/csv/map">
                <Button variant="primary">
                  New Mapping
                </Button>
              </Link>
              
              <Link to="/csv/convert">
                <Button variant="secondary">
                  Convert CSV
                </Button>
              </Link>
              
              <Link to="/csv/generate">
                <Button variant="outline">
                  Generate CSV
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-8 border-b border-border">
            <div className="flex">
              <button
                className={`py-3 px-5 font-medium ${
                  activeTab === 'templates' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-text-600 hover:text-primary'
                }`}
                onClick={() => setActiveTab('templates')}
              >
                Saved Templates
              </button>
              
              <button
                className={`py-3 px-5 font-medium ${
                  activeTab === 'history' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-text-600 hover:text-primary'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Operation History
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'templates' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Saved Templates</h2>
              
              {templates.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-text-600 hover:text-error"
                            aria-label="Delete template"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-600 mb-3">
                        {template.description || 'No description'}
                      </p>
                      
                      <div className="text-xs text-text-500 mb-4">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">
                          {template.type === 'mapping' 
                            ? `${template.mappingCount || 0} field mappings` 
                            : template.type}
                        </span>
                        
                        <Link to={`/templates/${template.id}`}>
                          <Button variant="outline" size="sm">
                            Use Template
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-text-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  
                  <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                  <p className="text-text-600 mb-6">
                    Save your mapping configurations as templates to reuse them later.
                  </p>
                  
                  <Link to="/csv/map">
                    <Button variant="primary">
                      Create Your First Template
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Operation History</h2>
              
              {history.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                          Operation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                          Results
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      {history.map((operation) => (
                        <tr key={operation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{operation.type}</div>
                            <div className="text-sm text-text-500">{operation.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(operation.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              operation.status === 'completed' 
                                ? 'bg-success/10 text-success' 
                                : operation.status === 'failed'
                                ? 'bg-error/10 text-error'
                                : 'bg-gray-100 text-text-600'
                            }`}>
                              {operation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {operation.status === 'completed' && (
                              <a 
                                href={operation.resultUrl} 
                                className="text-primary hover:underline"
                                download
                              >
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-text-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  
                  <h3 className="text-lg font-medium mb-2">No Operation History</h3>
                  <p className="text-text-600 mb-6">
                    Your CSV operations will appear here once you start using the tool.
                  </p>
                  
                  <Link to="/csv/map">
                    <Button variant="primary">
                      Start Mapping
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;