import { Link, Navigate, useParams } from 'react-router-dom';
import { templates } from '../../content/compositions';
import { compositionRender } from '../../compositions';
import { LocaleProvider } from '@/lib/i18n';

/** Full-screen template preview — rendered OUTSIDE the docs shell so the
 * template's own band reads as the page chrome. */
export function TemplateViewPage() {
  const { slug } = useParams();
  const comp = templates.find((t) => t.slug === slug);
  const render = slug ? compositionRender[slug] : undefined;
  if (!comp || !render) return <Navigate to="/templates" replace />;
  const Screen = render.Component;
  /* A template is an AUTHORED screen, and its copy is English. Rendering it
     under the reader's site language would mirror English sentences and
     mix Arabic component words into an English page — a half-translated
     screen, which is worse than either. It renders in the language it was
     written in; the playground is where translation is demonstrated. */
  return (
    <>
      <LocaleProvider locale="en">
        <Screen />
      </LocaleProvider>
      <Link className="sv-btn sv-btn--ghost tpl-back" to="/templates">
        ← Templates
      </Link>
    </>
  );
}
