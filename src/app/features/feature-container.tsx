'use client'
import Link from 'next/link';
import { Card } from '@/lib/card/card';
import './feature-container.css'; 
import { features } from '@/app/features/feature-list'; // Adjust path if needed

const getFeatureTag = (path: string ): string => {
  if (path.includes('weather')) return 'Utility';
  if (path.includes('movie')) return 'Entertainment';
  if (path.includes('game')) return 'Interactive';
  if (path.includes('poll')) return 'Social';
  if (path.includes('ai')) return 'AI Assistant';
  if (path.includes('carousel')) return 'UI Component';
  if (path.includes('scheduler')) return 'Task Scheduler';

  
  return 'External App';
};

export default function FeatureContainer() {
  // Pre-filter the features array once to save computation cycles
  const activeFeatures = features.filter((f) => f.path !== '/' && f.display);
  const appCount = activeFeatures.length;

  return (
    <>
      {/* Background Mesh Overlay Layer */}
      <div className="dashboard-glow-canvas" />

      <div className="dashboard-content-layer">
        
        {/* Modern Section Heading */}
        <header className="dashboard-header">
          <div className="dashboard-title-row">
            <h1 className="dashboard-main-title">Explore Applications</h1>
            <span className="dashboard-count-pill">{appCount} Available</span>
          </div>
          <p className="dashboard-subtitle">
            Select a hub feature from the catalog workspace below to launch your target application micro-client.
          </p>
        </header>

        {/* The Layout Grid Workspace */}
        <div className="feature-grid">
          {activeFeatures.map((app) => {
            const tag = getFeatureTag(app.path);
            
            return (
              /* Replaced index key with stable, unique app.path for ideal React rendering */
              <Link key={app.path} href={app.path} className="card-wrapper">
                <div className="card-inner-stretch">
                  <Card title={app.title}>
                    <div className="card-content-layout">
                      <div className="card-tag-wrapper">
                        <span className={`card-badge badge-${tag.toLowerCase().replace(' ', '-')}`}>
                          {tag}
                        </span>
                      </div>

                      <p className="card-description">
                        {app.description}
                      </p>
                      
                      <span className="card-action-link">
                        Open App →
                      </span>
                    </div>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
