/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SuccessCases from './pages/SuccessCases';
import SuccessCaseDetail from './pages/SuccessCaseDetail';
import Lawyers from './pages/Lawyers';
import Process from './pages/Process';
import Consultation from './pages/Consultation';
import Admin from './pages/Admin';

// Main Application Component
// GitHub connection troubleshooting: If the platform save button is inactive, 
// it might be because there are no unsaved changes or a connection issue.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cases" element={<SuccessCases />} />
          <Route path="cases/:id" element={<SuccessCaseDetail />} />
          <Route path="lawyers" element={<Lawyers />} />
          <Route path="process" element={<Process />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
