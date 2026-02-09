import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { casesRepo } from '../../db/repositories';

export function AudienciaPreviaRedirect() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    casesRepo
      .getByCaseKey('picassent')
      .then((picassent) => {
        if (!mounted) return;
        if (picassent) {
          navigate(`/cases/${picassent.id}?tab=audiencia`, { replace: true });
        } else {
          navigate('/cases/picassent-715-2024?tab=audiencia', { replace: true });
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="p-8 text-center text-slate-400">
        Error al redirigir. <a href="/cases" className="text-amber-400 underline">Ir a casos</a>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-slate-400">
      Redirigiendo a Sala (AP) Picassent...
    </div>
  );
}
