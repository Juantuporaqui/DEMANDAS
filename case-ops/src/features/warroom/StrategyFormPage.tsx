// ============================================
// CASE OPS - Strategy Form Page (Create/Edit)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { strategiesRepo, casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

type CaseKey = 'picassent' | 'mislata' | 'quart';

function inferCaseKey(caseId: string, cases: Case[]): CaseKey | null {
  const match = cases.find((x) => x.id === caseId);
  return (match?.caseKey as CaseKey) ?? null;
}

export function StrategyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;

  const queryCaseId = searchParams.get('caseId');
  const queryCaseKey = searchParams.get('caseKey') as CaseKey | null;
  const returnTo = searchParams.get('returnTo');

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    caseId: '',
    attack: '',
    risk: '',
    rebuttal: '',
    evidencePlan: '',
    questions: '',
    tags: '',
  });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  async function loadInitialData() {
    setLoading(true);
    try {
      const allCases = await casesRepo.getAll();
      setCases(allCases);

      if (id) {
        // Editing: load strategy data, ignore query params for caseId
        const strategy = await strategiesRepo.getById(id);
        if (strategy) {
          setFormData({
            caseId: strategy.caseId,
            attack: strategy.attack,
            risk: strategy.risk,
            rebuttal: strategy.rebuttal,
            evidencePlan: strategy.evidencePlan,
            questions: strategy.questions,
            tags: strategy.tags.join(', '),
          });
        }
      } else {
        // Creating: preselect from query params
        if (queryCaseId && allCases.some((c) => c.id === queryCaseId)) {
          setFormData((prev) => ({ ...prev, caseId: queryCaseId }));
        } else if (allCases.length === 1) {
          setFormData((prev) => ({ ...prev, caseId: allCases[0].id }));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function navigateBack(savedCaseId?: string) {
    if (returnTo) {
      navigate(decodeURIComponent(returnTo));
      return;
    }
    const effectiveCaseId = savedCaseId || formData.caseId;
    if (queryCaseKey && ['picassent', 'mislata', 'quart'].includes(queryCaseKey)) {
      navigate(`/warroom?caseKey=${queryCaseKey}`);
      return;
    }
    const inferred = inferCaseKey(effectiveCaseId, cases);
    navigate(inferred ? `/warroom?caseKey=${inferred}` : '/warroom');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.caseId) {
      alert('Selecciona un caso');
      return;
    }

    if (!formData.attack.trim()) {
      alert('El ataque es obligatorio');
      return;
    }

    if (!formData.rebuttal.trim()) {
      alert('La réplica es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const strategyData = {
        caseId: formData.caseId,
        attack: formData.attack.trim(),
        risk: formData.risk.trim(),
        rebuttal: formData.rebuttal.trim(),
        evidencePlan: formData.evidencePlan.trim(),
        questions: formData.questions.trim(),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await strategiesRepo.update(id!, strategyData);
      } else {
        await strategiesRepo.create(strategyData);
      }

      navigateBack(formData.caseId);
    } catch (error) {
      console.error('Error saving strategy:', error);
      alert('Error al guardar la estrategia');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta estrategia?')) return;

    try {
      await strategiesRepo.delete(id!);
      navigateBack(formData.caseId);
    } catch (error) {
      console.error('Error deleting strategy:', error);
    }
  }

  function handleBack() {
    if (returnTo) {
      navigate(decodeURIComponent(returnTo));
    } else {
      navigate(-1);
    }
  }

  if (loading && isEditing) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={handleBack}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          {isEditing ? 'Editar estrategia' : 'Nueva estrategia'}
        </h1>
      </div>

      <div className="mb-md">
        <button
          type="button"
          className="text-xs text-slate-400 hover:text-slate-200 transition"
          onClick={handleBack}
        >
          Cancelar y volver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* Case */}
            <div className="form-group">
              <label className="form-label">Caso *</label>
              <select
                className="form-select"
                value={formData.caseId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, caseId: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar caso...</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Attack */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ marginRight: 8 }}>⚔️</span>
                Ataque probable *
              </label>
              <textarea
                className="form-textarea"
                value={formData.attack}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, attack: e.target.value }))
                }
                placeholder="¿Qué argumentará la parte contraria?"
                rows={4}
                required
              />
            </div>

            {/* Risk */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ marginRight: 8 }}>⚠️</span>
                Riesgo
              </label>
              <textarea
                className="form-textarea"
                value={formData.risk}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, risk: e.target.value }))
                }
                placeholder="¿Cuál es el riesgo si este ataque tiene éxito?"
                rows={2}
              />
            </div>

            {/* Rebuttal */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ marginRight: 8 }}>🛡️</span>
                Réplica *
              </label>
              <textarea
                className="form-textarea"
                value={formData.rebuttal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rebuttal: e.target.value }))
                }
                placeholder="¿Cómo rebatir este ataque?"
                rows={4}
                required
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
              />
            </div>

            {/* Evidence Plan */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ marginRight: 8 }}>📋</span>
                Plan probatorio
              </label>
              <textarea
                className="form-textarea"
                value={formData.evidencePlan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, evidencePlan: e.target.value }))
                }
                placeholder="¿Qué pruebas necesitamos para defender esta posición?"
                rows={3}
              />
            </div>

            {/* Questions */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ marginRight: 8 }}>❓</span>
                Preguntas / Interrogatorio
              </label>
              <textarea
                className="form-textarea"
                value={formData.questions}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, questions: e.target.value }))
                }
                placeholder="Preguntas para testigos o perito..."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <input
                type="text"
                className="form-input"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Separadas por comas"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-lg">
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading
              ? 'Guardando...'
              : isEditing
              ? 'Guardar cambios'
              : 'Crear estrategia'}
          </button>
        </div>

        {isEditing && (
          <button
            type="button"
            className="btn btn-danger btn-block mt-md"
            onClick={handleDelete}
          >
            Eliminar estrategia
          </button>
        )}
      </form>
    </div>
  );
}
