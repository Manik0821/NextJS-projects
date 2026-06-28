'use client'
import Link from 'next/link';
import { Card } from '@/lib/card/card';
import './feature-container.css'; 
import { features } from '@/app/features/feature-list'; // Adjust path if needed

const getFeatureTag = (path: string): string => {
  if (path.includes('weather')) return 'Utility';
  if (path.includes('movie')) return 'Entertainment';
  if (path.includes('game')) return 'Interactive';
  if (path.includes('poll')) return 'Social';
  if (path.includes('ai')) return 'AI Assistant';
  if (path.includes('carousel')) return 'UI Component';
  if (path.includes('schedler')) return 'Task Scheduler';
  return 'App';
};

export default function FeatureContainer() {
  // Count only the active visible applications
  const appCount = features.filter((f) => f.path !== '/' && f.display).length;

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
          {features
            .filter((feature) => feature.path !== '/' && feature.display) // Combined display filter
            .map((app, index) => {
              const tag = getFeatureTag(app.path);
              
              return (
                <Link key={index} href={app.path} className="card-wrapper">
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
