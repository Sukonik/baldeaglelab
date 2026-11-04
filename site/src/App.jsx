import React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { pages, frameworks, getPage, repo, version } from "./data.mjs";

const href = (slug) => (slug === "home" ? "index.html" : `${slug}.html`);
const Arrow = () => <span aria-hidden="true">↗</span>;
function Brand() {
  return (
    <a className="brand" href="index.html" aria-label="Bald Eagle Lab home">
      <img
        className="brand-logo"
        src="brand/logo/baldeaglelab-logo-blue-128.png"
        srcSet="brand/logo/baldeaglelab-logo-blue-128.png 1x, brand/logo/baldeaglelab-logo-blue-512.png 4x"
        width="52"
        height="52"
        alt=""
      />
      <span>
        Bald Eagle<span className="brand-lab">Lab</span>
      </span>
    </a>
  );
}
function Nav({ page }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary">
            <a
              href="index.html"
              aria-current={page === "home" ? "page" : undefined}
            >
              Overview
            </a>
            <Menu.Root>
              <Menu.Trigger className="nav-trigger">
                Frameworks <span aria-hidden="true">⌄</span>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner
                  sideOffset={16}
                  align="start"
                  className="menu-positioner"
                >
                  <Menu.Popup className="framework-menu">
                    {frameworks.map((p) => (
                      <Menu.LinkItem
                        key={p.slug}
                        href={href(p.slug)}
                        className="menu-link"
                      >
                        <span className="index-number">{p.number}</span>
                        <span>
                          <strong>{p.title}</strong>
                          <small>{p.short}</small>
                        </span>
                        <Arrow />
                      </Menu.LinkItem>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
            <a
              href="ledger.html"
              aria-current={page === "ledger" ? "page" : undefined}
            >
              Stage ledger
            </a>
            <a
              href="base3.html"
              aria-current={page === "base3" ? "page" : undefined}
            >
              BASE3 UI
            </a>
            <a
              href="roadmap.html"
              aria-current={page === "roadmap" ? "page" : undefined}
            >
              Roadmap
            </a>
          </nav>
          <a className="repo-link desktop-repo" href={repo}>
            GitHub <Arrow />
          </a>
          <div className="mobile-nav">
            <Dialog.Root>
              <Dialog.Trigger
                className="menu-trigger"
                aria-label="Open navigation menu"
              >
                <span>Menu</span>
                <span aria-hidden="true">☰</span>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop className="drawer-backdrop" />
                <Dialog.Popup className="drawer">
                  <div className="drawer-top">
                    <Dialog.Title>Explore the lab</Dialog.Title>
                    <Dialog.Close
                      className="close-button"
                      aria-label="Close navigation menu"
                    >
                      ✕
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="drawer-description">
                    Document frameworks, shared contracts, and project progress.
                  </Dialog.Description>
                  <nav aria-label="Mobile">
                    <a
                      href="index.html"
                      className="drawer-link"
                      aria-current={page === "home" ? "page" : undefined}
                    >
                      <span>00</span>Overview
                    </a>
                    {pages.map((p) => (
                      <a
                        href={href(p.slug)}
                        key={p.slug}
                        className="drawer-link"
                        aria-current={page === p.slug ? "page" : undefined}
                      >
                        <span>{p.number}</span>
                        {p.title}
                      </a>
                    ))}
                  </nav>
                  <a href={repo} className="drawer-repo">
                    Open GitHub repository <Arrow />
                  </a>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Independent evidence.
              <br />
              Dependable document systems.
            </p>
          </div>
          <nav aria-label="Footer frameworks">
            <h2>Frameworks</h2>
            {frameworks.map((p) => (
              <a key={p.slug} href={href(p.slug)}>
                {p.title}
              </a>
            ))}
          </nav>
          <nav aria-label="Footer project">
            <h2>The project</h2>
            {pages.slice(5).map((p) => (
              <a key={p.slug} href={href(p.slug)}>
                {p.title}
              </a>
            ))}
            <a href={`${repo}/blob/main/README.md`}>
              Read the README <Arrow />
            </a>
            <a href={`${repo}/blob/main/docs/DATA_POLICY.md`}>
              Synthetic-data policy <Arrow />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Bald Eagle Lab · MPL-2.0</span>
          <span>Website {version} · Framework implementation planned</span>
          <a href={`${repo}/issues`}>
            Contribute on GitHub <Arrow />
          </a>
        </div>
      </div>
    </footer>
  );
}
function Trace() {
  return (
    <div className="trace-panel">
      <div className="trace-head">
        <span className="micro-label">THE EVIDENCE TRAIL</span>
        <span className="tiny-tag">Illustrative</span>
      </div>
      <div className="trace-file">
        <span className="file-symbol" aria-hidden="true">
          ▤
        </span>
        <div>
          <strong>Synthetic agreement</strong>
          <span>SYN-001 · example document</span>
        </div>
        <span className="trace-file-id">01</span>
      </div>
      <ol className="trace-stages">
        {[
          ["Discover", "Source identified"],
          ["Extract", "Text recovered"],
          ["Classify", "Type recorded"],
          ["Name", "Content informs filename"],
          ["Verify", "Copy and source checked"],
        ].map(([a, b], i) => (
          <li key={a}>
            <span className="stage-node">{String(i + 1).padStart(2, "0")}</span>
            <strong>{a}</strong>
            <span>{b}</span>
          </li>
        ))}
      </ol>
      <div className="trace-foot">
        <span className="red-square" />
        <span>
          An example of the contract.
          <br />
          <strong>Not an application test result.</strong>
        </span>
      </div>
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="red-rule" />
              DOCUMENT SYSTEMS / OPEN RESEARCH LAB
            </p>
            <h1>
              Know what works.
              <br />
              <span>Prove every move.</span>
            </h1>
            <p className="lede">
              A shared lab for document analysis, migration testing, and modular
              application design. Build on evidence. Carry proven solutions
              forward.
            </p>
            <div className="actions">
              <a className="button primary" href="#frameworks">
                Explore the frameworks <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button secondary"
                href={`${repo}/blob/main/README.md`}
              >
                Read the README <Arrow />
              </a>
            </div>
            <p className="release-note">
              <span className="release-dot" />
              BUILD 1 / THE FOUNDATION{" "}
              <span>Documentation live. Harness planned.</span>
            </p>
          </div>
          <Trace />
        </div>
      </section>
      <div className="principle-strip">
        <div className="container">
          <span>
            <b>01</b> Synthetic by design
          </span>
          <span>
            <b>02</b> Provider neutral
          </span>
          <span>
            <b>03</b> Evidence over assumptions
          </span>
          <a className="text-link" href="roadmap.html">
            See the build plan <Arrow />
          </a>
        </div>
      </div>
      <section className="section container" id="frameworks">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE FRAMEWORK LIBRARY</p>
            <h2>One lab. Five disciplines.</h2>
          </div>
          <p>
            From the first readable word to the last verified copy. Each
            framework has its own scope, evidence, and acceptance criteria.
          </p>
        </div>
        <div className="framework-list">
          {frameworks.map((p) => (
            <a href={href(p.slug)} className="framework-row" key={p.slug}>
              <span className="framework-index">{p.number}</span>
              <div className="framework-name">
                <h3>{p.title}</h3>
                <span>{p.short}</span>
              </div>
              <p>{p.description}</p>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
        <p className="section-note">
          Frameworks are published design specifications. The verification
          harness is not implemented in Website Build 1.
        </p>
      </section>
      <section className="ledger-section">
        <div className="container ledger-grid">
          <div>
            <p className="eyebrow">A COMMON LANGUAGE</p>
            <h2>
              One file.
              <br />
              Every decision.
            </h2>
            <p>
              The stage ledger connects an application’s behavior to independent
              expectations. See where a file went, why a decision was made, and
              what the evidence actually proves.
            </p>
            <a className="button white-button" href="ledger.html">
              Explore the stage ledger <Arrow />
            </a>
          </div>
          <div className="ledger-specimen">
            <div className="specimen-heading">
              <span>ILLUSTRATIVE RECORD</span>
              <span>SYN-001</span>
            </div>
            <dl>
              {[
                ["source_id", "SYN-001"],
                ["extraction_status", "success"],
                ["document_type", "agreement"],
                ["filename_origin", "content"],
                ["approval_status", "approved"],
                ["copy_verification", "hash_match"],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt>{a}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
            <p>Synthetic example only · Draft contract</p>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A SHARED FOUNDATION</p>
            <h2>Useful across applications.</h2>
          </div>
          <p>
            Applications keep their own engines and data. The lab supplies a
            common way to describe and verify outcomes.
          </p>
        </div>
        <div className="connection-grid">
          <article>
            <span className="micro-label">
              PRIVATE APPLICATION / PLANNED CONSUMER
            </span>
            <h3>BlackBowAI</h3>
            <p>
              Document analysis and migration workflows. Its adapter and
              private-corpus evidence stay in its own environment.
            </p>
            <a className="text-link" href="modules.html">
              Read the integration boundary <Arrow />
            </a>
          </article>
          <article>
            <span className="micro-label">
              PUBLIC APPLICATION / PLANNED CONSUMER
            </span>
            <h3>WindSwordAI</h3>
            <p>
              A prospective consumer of the same provider-neutral contracts,
              without coupling the lab to a single application.
            </p>
            <a className="text-link" href="https://github.com/Sukonik/windswordai">
              Explore WindSwordAI <Arrow />
            </a>
          </article>
        </div>
      </section>
      <section className="base3-callout container">
        <span className="base3-word">
          BASE<span>3</span>
        </span>
        <div>
          <p className="eyebrow">THE INTERFACE FOUNDATION</p>
          <h2>Clear by default.</h2>
          <p>
            Editorial structure. Accessible behavior. White, blue, and a precise
            touch of red.
          </p>
        </div>
        <a href="base3.html" className="button secondary">
          Meet BASE3 UI <Arrow />
        </a>
      </section>
    </>
  );
}
function Palette() {
  return (
    <div className="palette" aria-label="BASE3 color palette">
      {[
        ["Old Glory Blue", "#002868"],
        ["White", "#FFFFFF"],
        ["Old Glory Red", "#B22234"],
        ["Signal Blue", "#165DDE"],
      ].map(([name, hex]) => (
        <div key={hex}>
          <div className="swatch" style={{ background: hex }} />
          <strong>{name}</strong>
          <code>{hex}</code>
        </div>
      ))}
    </div>
  );
}
function Detail({ page }) {
  const p = getPage(page);
  const next = getPage(p.next);
  return (
    <>
      <section className="detail-hero container">
        <a className="back-link" href="index.html#frameworks">
          ← Back to the lab
        </a>
        <div className="detail-title">
          <div>
            <p className="eyebrow">
              {p.group.toUpperCase()} / {p.number}
            </p>
            <h1>{p.title}</h1>
            <p className="detail-tagline">{p.short}</p>
          </div>
          <span className="status-label">{p.status}</span>
        </div>
        <p className="detail-summary">{p.summary}</p>
      </section>
      <div className="container doc-layout">
        <aside className="doc-sidebar">
          <p className="micro-label">IN THIS GUIDE</p>
          <nav aria-label="On this page">
            <a href="#contract">Inputs & outputs</a>
            {p.sections.map(([title], i) => (
              <a key={title} href={`#section-${i + 1}`}>
                {title}
              </a>
            ))}
            <a href="#acceptance">Acceptance criteria</a>
          </nav>
          <a
            className="sidebar-source"
            href={`${repo}/blob/main/site/src/data.mjs`}
          >
            View source <Arrow />
          </a>
        </aside>
        <article className="doc-body">
          <section id="contract" className="contract-block">
            <div>
              <span className="micro-label">INPUT</span>
              <p>{p.input}</p>
            </div>
            <div>
              <span className="micro-label">OUTPUT</span>
              <p>{p.output}</p>
            </div>
          </section>
          {page === "base3" && <Palette />}
          {p.sections.map(([title, body], i) => (
            <section
              className="doc-section"
              id={`section-${i + 1}`}
              key={title}
            >
              <span className="section-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          <section className="acceptance" id="acceptance">
            <p className="eyebrow">WHAT GOOD LOOKS LIKE</p>
            <h2>Acceptance criteria</h2>
            <ul>
              {p.checks.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="acceptance-note">
              {page === "base3"
                ? "These describe this site’s interface requirements."
                : "These are proposed requirements for future implementation, not claims of completed application tests."}
            </p>
          </section>
          <div className="example">
            <span className="micro-label">
              {page === "base3" ? "LAYER ORDER" : "CONCEPT EXAMPLE"}
            </span>
            <p>{p.example}</p>
          </div>
          <a className="next-guide" href={href(next.slug)}>
            <div>
              <span className="micro-label">CONTINUE EXPLORING</span>
              <h3>{next.title}</h3>
            </div>
            <Arrow />
          </a>
        </article>
      </div>
    </>
  );
}
export default function App({ page = "home" }) {
  return (
    <>
      <Nav page={page} />
      <main id="main" tabIndex="-1">
        {page === "home" ? <Home /> : <Detail page={page} />}
      </main>
      <Footer />
    </>
  );
}
