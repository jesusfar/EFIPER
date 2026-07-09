import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Layout } from './Layout';

// Lazy-loaded route components — cada uno se descarga solo cuando se navega a su ruta.
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TestPage = lazy(() => import('../features/tests/TestPage').then(m => ({ default: m.TestPage })));
const OralPage = lazy(() => import('../features/oral/OralPage').then(m => ({ default: m.OralPage })));
const CasePage = lazy(() => import('../features/cases/CasePage').then(m => ({ default: m.CasePage })));
const ReviewsPage = lazy(() => import('../features/reviews/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const SimulationPage = lazy(() => import('../features/simulation/SimulationPage').then(m => ({ default: m.SimulationPage })));
const TeoriaPageLazy = lazy(() => import('../features/teoria/TeoriaPage').then(m => ({ default: m.TeoriaPage })));
const TheoryReaderPageLazy = lazy(() => import('../features/teoria/TeoriaPage').then(m => ({ default: m.TheoryReaderPage })));
const AccountPage = lazy(() => import('../features/account/AccountPage').then(m => ({ default: m.AccountPage })));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="font-display text-stud animate-pulse-stud rounded-full px-6 py-3">Cargando…</div>
    </div>
  );
}

export function App() {
  const init = useStore((s) => s.init);
  const ready = useStore((s) => s.ready);

  useEffect(() => { void init(); }, [init]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="font-display text-stud animate-pulse-stud rounded-full px-6 py-3">Cargando EFIPER…</div>
      </div>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/teoria" element={<TeoriaPageLazy />} />
          <Route path="/teoria/:topic" element={<TheoryReaderPageLazy />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/oral" element={<OralPage />} />
          <Route path="/caso/:id" element={<CasePage />} />
          <Route path="/repaso" element={<ReviewsPage />} />
          <Route path="/repaso/teoria" element={<TestPage />} />
          <Route path="/simulacro" element={<SimulationPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
