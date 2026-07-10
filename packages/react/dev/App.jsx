import '@natura11y/core/dist/natura11y.css';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FormTemplate from './templates/Form';
import LandingTemplate from './templates/Landing';
import SearchResultsTemplate from './templates/SearchResults';
import TwoColumnTemplate from './templates/TwoColumn';
import { getNavigationTarget, getRoutePath } from './data';

const templatePageMap = {
  '/templates/landing': LandingTemplate,
  '/templates/form': FormTemplate,
  '/templates/search-results': SearchResultsTemplate,
  '/templates/two-column': TwoColumnTemplate,
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(getRoutePath);
  const [currentSearch, setCurrentSearch] = useState(() => window.location.search);
  const TemplatePage = templatePageMap[currentPath] ?? LandingTemplate;

  const navigate = (target) => {
    const nextRoute = getNavigationTarget(target);

    if (nextRoute.path === currentPath && nextRoute.search === currentSearch) return;

    window.history.pushState({}, '', nextRoute.url);
    setCurrentPath(nextRoute.path);
    setCurrentSearch(nextRoute.search);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getRoutePath());
      setCurrentSearch(window.location.search);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <div className="skip-links">
        <a href="#main-content">Jump to main content</a>
        <a href="#global-footer">Jump to website footer</a>
      </div>

      <Header currentPath={currentPath} onNavigate={navigate} />
      <TemplatePage currentPath={currentPath} currentSearch={currentSearch} onNavigate={navigate} />
      <Footer />
    </>
  );
};

export default App;
