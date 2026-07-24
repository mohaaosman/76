import { Link, Navigate, useParams } from 'react-router-dom';
import { templates } from '../../content/compositions';
import { compositionRender } from '../../compositions';

/** Full-screen template preview — rendered OUTSIDE the docs shell so the
 * template's own band reads as the page chrome. */
export function TemplateViewPage() {
  const { slug } = useParams();
  const comp = templates.find((t) => t.slug === slug);
  const render = slug ? compositionRender[slug] : undefined;
  if (!comp || !render) return <Navigate to="/templates" replace />;
  const Screen = render.Component;
  return (
    <>
      <Screen />
      <Link className="sv-btn sv-btn--ghost tpl-back" to="/templates">
        ← Templates
      </Link>
    </>
  );
}
