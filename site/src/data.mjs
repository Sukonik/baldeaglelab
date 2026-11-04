export const repo = "https://github.com/Sukonik/baldeaglelab";
export const version = "0.1.0";
export const pages = [
  {
    slug: "analysis",
    number: "01",
    title: "Document analysis",
    short: "Understand the input.",
    group: "Framework",
    status: "Design specification",
    description:
      "A framework for knowing what a document contains, how it was read, and where uncertainty begins.",
    summary:
      "Trace discovery, extraction, OCR, classification, and naming as separate decisions. A readable file and a useful filename are different outcomes.",
    input:
      "A manifest of synthetic documents, stable source IDs, and expected outcomes.",
    output:
      "One explicit result per input and stage, including exclusions, errors, and the origin of each proposed name.",
    sections: [
      [
        "Inventory before inference",
        "Establish the input set first. Give each unique file an ID and SHA-256 hash. Count discovery, exclusions, processing attempts, and retries separately so a retry cannot inflate the number of documents handled.",
      ],
      [
        "Readability is a measured outcome",
        "Record extraction status and text length. Keep native text, OCR, conversion, repair, and still-unreadable outcomes distinct. Do not interpret a successful dependency check as successful extraction.",
      ],
      [
        "Content must inform the name",
        "Compare a suggested name with fixture expectations. Record whether it came from document content, a rule, the original filename, or a fallback. A nonempty document type alone does not prove that the proposed name is useful.",
      ],
      [
        "Review with a reason",
        "Store confidence and an explicit reason for review. Sensitivity, unreadability, and ambiguous categories are separate conditions, each with its own expected behavior.",
      ],
    ],
    checks: [
      "Every manifest entry has a result or an explicit exclusion.",
      "Readable fixtures produce nonempty extracted text.",
      "Expected types and categories match the fixture contract.",
      "Content-derived names include expected concepts and avoid fallback-only output.",
    ],
    example:
      "SYN-001 → native text → agreement → content-derived name → ready for review",
    next: "ledger",
  },
  {
    slug: "migration",
    number: "02",
    title: "Verified migration",
    short: "Prove the destination.",
    group: "Framework",
    status: "Design specification",
    description:
      "A framework for explicit approval, normal destination routing, verified copies, and an auditable trail.",
    summary:
      "A preview describes an intention. Migration evidence records an actual copy and checks both the destination and the untouched source.",
    input:
      "Synthetic source copies, an approved plan, expected routes, and a disposable destination.",
    output:
      "Copy records with source and destination hashes, route outcomes, and recovery information.",
    sections: [
      [
        "Analyze first, approve explicitly",
        "Analysis produces a proposed plan. The application owns approval and execution. The lab checks whether the approved synthetic set was actually copied to its expected destinations.",
      ],
      [
        "Normal routes must work",
        "A file appearing somewhere is insufficient. Verify its expected category and folder. Quarantine and fallback routes are tested as their own scenarios and cannot substitute for normal-route success.",
      ],
      [
        "Verify source and destination",
        "For each expected copy, compare the destination SHA-256 with the original source hash, then rehash the source to check it stayed unchanged. Missing copies and mismatched hashes fail the scenario.",
      ],
      [
        "Keep recovery practical",
        "The application should maintain a transaction trail and its own rollback behavior. Test interruption, name collisions, partial failure, and reruns using disposable synthetic files. The public website never performs a migration.",
      ],
    ],
    checks: [
      "The success scenario has a positive approved count.",
      "All expected normal-route copies exist at the expected destinations.",
      "Copied hashes match and source hashes remain unchanged.",
      "Missing approval blocks migration certification.",
    ],
    example:
      "Approved synthetic file → expected folder → real copy → matching hash",
    next: "testing",
  },
  {
    slug: "testing",
    number: "03",
    title: "Testing & benchmarks",
    short: "Make failure visible.",
    group: "Framework",
    status: "Design specification",
    description:
      "A framework for deterministic fixtures, independent expectations, and evidence that cannot pass at zero.",
    summary:
      "Start with a small known input set, define what must happen, and include a deliberately broken case. Repeat larger runs only after the small gate passes.",
    input:
      "A versioned synthetic fixture manifest, a scenario profile, and an application ledger.",
    output:
      "PASS, FAIL, or BLOCKED for a named scenario, with explicit evidence and limitations.",
    sections: [
      [
        "Fixtures with independent expectations",
        "A fixture manifest defines expected types, categories, naming concepts, routes, and review conditions before the application runs. Expectations must not be generated from the same application output they evaluate.",
      ],
      [
        "Three verdicts, one meaning each",
        "PASS means the scenario requirements were met. FAIL means observed evidence contradicts those requirements. BLOCKED means required execution or evidence is missing. An empty run never certifies behavior.",
      ],
      [
        "Negative controls are mandatory",
        "An empty ledger, all-Unknown classification, fallback-only routing, missing copies, changed sources, and simulated output labeled as real must fail or block the relevant success scenario.",
      ],
      [
        "Separate speed from correctness",
        "Benchmark durations only after correctness passes. Record environment, input count, cache state, warm or cold run, and model identity. This release publishes no performance rankings or application certification.",
      ],
    ],
    checks: [
      "A known-good synthetic ledger passes its specified scenario.",
      "An intentionally broken result fails for the expected reason.",
      "Review-only tests may pass without copies, but cannot certify migration.",
      "Repository checks never appear as document-processing evidence.",
    ],
    example:
      "Expected outcome + observed ledger + scenario rules → explicit verdict",
    next: "models",
  },
  {
    slug: "models",
    number: "04",
    title: "Models & response contracts",
    short: "Inspect the decision.",
    group: "Framework",
    status: "Design specification",
    description:
      "A provider-neutral framework for model invocation evidence, strict parsing, and honest evaluation labels.",
    summary:
      "Distinguish the model requested from the model invoked. Separate live evaluation, cached output, rules, and simulated responses.",
    input:
      "Synthetic requests, versioned response contracts, and deterministic malformed-response cases.",
    output:
      "A classified response or explicit error, plus invocation and parse provenance.",
    sections: [
      [
        "Model identity is evidence",
        "Record the requested model, resolved model and digest where available, actual invocation, provider, decision tier, and response origin. Configuration alone does not prove that a model ran.",
      ],
      [
        "Fail explicitly at the parser",
        "Malformed JSON, missing document_type, Unknown values, enum drift, truncation, and timeouts need distinct error codes. Never silently promote an invalid response into a valid classification.",
      ],
      [
        "Keep fake and real separate",
        "Simulated responses are useful for offline contract checks. They are labeled simulated and cannot satisfy a real-model profile. A label alone is not proof: real runs also need invocation provenance from the private or local adapter.",
      ],
      [
        "Run live models deliberately",
        "A future manual local or self-hosted runner can evaluate Ollama using synthetic inputs. It stays outside default public CI. Credentials, private prompts, and private-corpus results stay in their originating environment.",
      ],
    ],
    checks: [
      "Each malformed-response case produces its expected error code.",
      "Requested, resolved, and invoked model fields are distinguishable.",
      "Cached and simulated responses cannot satisfy a live-invocation requirement.",
      "No raw model responses or document bodies enter public artifacts.",
    ],
    example:
      "Requested model ≠ proof of invocation; provenance must show the actual call.",
    next: "modules",
  },
  {
    slug: "modules",
    number: "05",
    title: "Modular applications",
    short: "Build once. Verify anywhere.",
    group: "Framework",
    status: "Design specification",
    description:
      "A framework for reusable contracts and checks that preserve each application’s unique implementation.",
    summary:
      "Keep the lab independent. Applications emit a shared ledger through a thin adapter; the lab evaluates the contract without importing their pipeline code.",
    input:
      "A documented adapter boundary, a versioned ledger, and an application-owned execution environment.",
    output:
      "Reusable verification components that applications can pin to a reviewed release.",
    sections: [
      [
        "A narrow shared boundary",
        "The public lab owns the contract, fixture definitions, and verdict rules. Each application owns its adapter, extraction pipeline, models, prompts, storage, user interface, and data.",
      ],
      [
        "BlackBowAI integration",
        "BlackBowAI is a prospective consumer. Its root-cause work and real-Windows comparisons remain in its own development environment. This website does not claim that an adapter exists or that any installer is certified.",
      ],
      [
        "WindSwordAI integration",
        "WindSwordAI is another prospective consumer of the provider-neutral contract. Integration is planned and must follow its own scope and acceptance criteria. No WindSwordAI code is changed by this release.",
      ],
      [
        "Pin the exported result",
        "After a stable contract and successful controlled comparisons, publish a tagged lab release. Consumers pin the reviewed version and record it with their application SHA. No PyPI package or shared hosted service is required for the initial design.",
      ],
    ],
    checks: [
      "The public harness imports no private application code.",
      "Adapters and private results remain in the application environment.",
      "Consumers record the exact lab and application versions.",
      "Changes to the ledger contract have a documented compatibility policy.",
    ],
    example:
      "Application-owned adapter → versioned ledger → independent lab checks",
    next: "ledger",
  },
  {
    slug: "ledger",
    number: "06",
    title: "The stage ledger",
    short: "One file. Every decision.",
    group: "Contract",
    status: "Draft contract",
    description:
      "The proposed shared evidence boundary between document applications and Bald Eagle Lab.",
    summary:
      "Each file must be traceable from discovery through the final result. Run metadata identifies the environment; stage records explain each decision.",
    input: "Application-emitted run provenance and per-file stage records.",
    output:
      "A machine-readable evidence record and human-readable stage comparison. Schema v1 is not finalized in this release.",
    sections: [
      [
        "Run identity",
        "Proposed fields: schema_version, run_id, scenario_id, fixture_manifest_sha256, application_commit, executable_sha256 when testing an installer, harness_version, operating_system, cache_state, and evidence_mode.",
      ],
      [
        "Discovery and extraction",
        "Proposed fields: source_id, source_sha256, discovered, excluded_reason, processing_status, attempt_count, extraction_status, and extracted_text_length. Public records use synthetic IDs and paths only.",
      ],
      [
        "Decision and review",
        "Proposed fields: decision_tier, model_requested, model_resolved, model_invoked, response_origin, parse_error_code, document_type, canonical_category, suggested_filename, filename_origin, confidence, needs_review, review_reasons, and sensitivity.",
      ],
      [
        "Approval and copy",
        "Proposed fields: migration_eligibility, approval_status, preview_route, copied_destination, destination_sha256, and source_sha256_after. Null means no observed value; it must not be interpreted as success.",
      ],
    ],
    checks: [
      "Every stage records success, failure, exclusion, or not-run explicitly.",
      "Run provenance identifies the exact application and test inputs.",
      "Private paths and raw text never enter public examples.",
      "Field changes are coordinated with application adapter owners before freezing v1.",
    ],
    example:
      "Synthetic trace: SYN-001 / extracted / classified / named / approved / copied / verified",
    next: "roadmap",
  },
  {
    slug: "base3",
    number: "07",
    title: "BASE3 UI system",
    short: "Clarity is the interface.",
    group: "Design system",
    status: "Implemented on this site",
    description:
      "Bald Eagle Lab’s responsive interface format: editorial structure, accessible primitives, and an American blue-and-white identity.",
    summary:
      "BASE3 is our project design format, not a separate third-party framework. It combines GoldBrief-inspired structure with React, Base UI, and layered CSS.",
    input:
      "Content hierarchy, semantic HTML, shared tokens, and accessible interaction primitives.",
    output:
      "Consistent pages that work across narrow phones, tablets, and wide desktop screens.",
    sections: [
      [
        "01 / Foundation",
        "White is the primary canvas. Old Glory Blue anchors headings, navigation, and key surfaces. Old Glory Red is reserved for small accents and important markers. A brighter blue supports interactive emphasis.",
      ],
      [
        "02 / Behavior",
        "React renders the site. Base UI supplies the desktop framework menu and modal navigation drawer. Native links preserve real page URLs. Escape dismissal, focus containment, and focus return are handled by the primitives.",
      ],
      [
        "03 / Editorial layout",
        "Borrow GoldBrief’s compact masthead, grouped navigation, geometric headlines, readable body type, numbered content, and transparent status labels. Use Outfit for headings and Inter for body text, with Helvetica and Arial fallbacks.",
      ],
      [
        "Responsive by construction",
        "CSS layers are tokens → base → components → responsive → baldeaglelab. Layouts collapse deliberately; tables scroll inside their own region; targets stay comfortably tappable. Motion respects prefers-reduced-motion. All core text and footer navigation are pre-rendered.",
      ],
    ],
    checks: [
      "Skip link, landmark structure, and visible keyboard focus on every page.",
      "Menu supports keyboard use, Escape dismissal, and focus return.",
      "No document-level horizontal overflow at the tested viewport widths.",
      "Core page content remains readable without JavaScript.",
    ],
    example: "tokens → base → components → responsive → baldeaglelab",
    next: "analysis",
  },
  {
    slug: "roadmap",
    number: "08",
    title: "Roadmap & releases",
    short: "Evidence before expansion.",
    group: "Project",
    status: "Published plan",
    description:
      "The build sequence for an independent document verification lab, with clear acceptance gates.",
    summary:
      "Website Build 1 documents the system. Harness implementation follows in small reviewed slices. A published website does not certify a document application.",
    input:
      "A bounded proposal with acceptance criteria, evidence requirements, and a named owner.",
    output:
      "A reviewed change with recorded checks, known limitations, and version history.",
    sections: [
      [
        "Now / Website Build 1",
        "Publish the project README, eight dedicated framework and reference pages, BASE3 styling, responsive navigation, pre-rendered content, and GitHub Pages deployment. No document-processing engine ships in this release.",
      ],
      [
        "Next / BE-00 and BE-01",
        "BE-00 adds a synthetic-data policy, controlled fixture admission, and repository hygiene checks. BE-01 implements the ledger schema and scenario verdict library using the Python standard library. Website build dependencies are separate from the future harness.",
      ],
      [
        "Then / BE-02 through BE-04",
        "BE-02 adds ten deterministic synthetic documents and expected outcomes. BE-03 tests response contracts and explicit parser errors. BE-04 adds a manual real-model evaluation path outside default public CI.",
      ],
      [
        "Later / BE-05",
        "Export a pinned release only after the application comparison yields a stable ledger and meaningful positive evidence. Consumers integrate through thin adapters and retain their own unique code.",
      ],
    ],
    checks: [
      "Each slice has independently stated acceptance criteria.",
      "Negative controls prove the checks detect failure.",
      "Real-model and private-corpus evidence stay distinctly labeled.",
      "Release notes state what shipped and what remains unverified.",
    ],
    example:
      "Website v0.1.0 → hygiene → schema → fixtures → contracts → live eval → export",
    next: "analysis",
  },
];
export const frameworks = pages.slice(0, 5);
export function getPage(slug) {
  return pages.find((p) => p.slug === slug);
}
