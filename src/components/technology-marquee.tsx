import type { CSSProperties } from 'react';
import { technologies } from '@/lib/technologies';
import { Eyebrow } from '@/components/ui';

export function TechnologyMarquee() {
  return (
    <section className="technology-section" aria-labelledby="technology-title">
      <div className="wrap">
        <div className="technology-heading">
          <div>
            <Eyebrow>TECHNOLOGY EXPERIENCE</Eyebrow>
            <h2 id="technology-title">Technologies We Work With</h2>
            <p>Experience across the platforms businesses rely on every day.</p>
          </div>
          <label className="technology-pause">
            <input type="checkbox" />
            Pause animation
          </label>
        </div>
        <div className="technology-window" tabIndex={0} aria-label="Technology logos. Focus here to pause the animation.">
          <div className="technology-track">
            {[false, true].map(duplicate => (
              <ul className="technology-list" key={String(duplicate)} aria-hidden={duplicate || undefined}>
                {technologies.map(technology => (
                  <li className="technology-logo" key={technology.name}>
                    <img src={technology.logo} alt={duplicate ? '' : technology.name}
                      width={technology.width} height={technology.height} decoding="async"
                      style={{ '--logo-height': `${technology.opticalHeight}px` } as CSSProperties} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
