'use client'
import Dropdown from '../lib/Filter-list-dropdown/Dropdown';
import cities from 'public/assets/data/dropdown/cities.json' with { type: 'json' };
import fruits from 'public/assets/data/dropdown/fruits.json' with {type: 'json'};
import FeatureContainer from './features/feature-container';

export default function Home() {
  return (
    /* The main wrapper now provides the stylish, animated backdrop canvas */
    <main className="main-dashboard-viewport">
      <div className="animated-background-mesh"></div>
      
      <div className="dashboard-content-layer">
        <FeatureContainer />
      </div>
    </main>
  );
}
