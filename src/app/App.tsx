import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Layout } from './Layout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TestPage } from '../features/tests/TestPage';
import { OralPage } from '../features/oral/OralPage';
import { CasePage } from '../features/cases/CasePage';
import { ReviewsPage } from '../features/reviews/ReviewsPage';
import { SimulationPage } from '../features/simulation/SimulationPage';
import { TeoriaPage, TheoryReaderPage } from '../features/teoria/TeoriaPage';

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
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/teoria" element={<TeoriaPage />} />
        <Route path="/teoria/:topic" element={<TheoryReaderPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/oral" element={<OralPage />} />
        <Route path="/caso/:id" element={<CasePage />} />
        <Route path="/repaso" element={<ReviewsPage />} />
        <Route path="/repaso/teoria" element={<TestPage />} />
        <Route path="/simulacro" element={<SimulationPage />} />
      </Routes>
    </Layout>
  );
}
