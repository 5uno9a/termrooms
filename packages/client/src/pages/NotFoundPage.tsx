import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 text-center">
        <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-white mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
            <p className="text-xl text-white text-opacity-80 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-white text-opacity-70 mb-6">
              Here are some helpful links to get you back on track:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Go Home
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Games
                </Button>
              </Link>
              <Link to="/sandbox">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Dev Sandbox
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;
