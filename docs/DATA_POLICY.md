# Public synthetic-data policy

Bald Eagle Lab is public. Every committed document fixture, example, log, and published artifact must be synthetic and designed for this repository.

## Allowed

- Invented document content with deliberately fictitious entities.
- Synthetic identifiers such as `SYN-001` and disposable example destinations.
- Expected outcomes written independently of application results.
- Generated fixture manifests with generator versions and hashes.
- Website source and build artifacts containing only public project documentation.

## Excluded

Real municipal, client, legal-matter, or other private documents; document bodies; filenames; paths; prompts; model responses; private-corpus ledgers; credentials; private application code; private installer payloads.

Hashing or removing a name does not make a real document synthetic. Real-document metadata and hashes also stay in the originating private environment. Do not upload documents to public issues, actions, or a public self-hosted runner as a shortcut.

## Fixture admission, planned for BE-00

Record generator source, seed, version, synthetic provenance, expected outcomes, and file hashes in an explicit manifest. Limit fixture directories to approved paths and reviewed file types. Reject unmanifested inputs, unexpected binary files, and test documents that fail admission checks.

Use PII and secret scans as additional signals, not guarantees. A deliberately real-looking synthetic negative control should be rejected when it violates the policy's configured admission patterns. This tests a particular rule; it does not prove the scanner detects all real data. Human provenance review remains necessary.

## Evidence separation

Public CI handles synthetic fixtures only. Private applications may consume pinned lab rules locally or privately, retaining private ledgers and artifacts there. Public examples omit raw text and responses; errors use controlled codes rather than unrestricted exception strings.

Simulated output must be labeled simulated. Real-model certification requires invocation evidence, not a configuration label. Website integrity checks never certify document processing.

## Current enforcement status

Website Build 1 has no fixture upload feature, corpus runner, model calls, or document migration. Its deployment uploads only the generated `dist/` website. Fixture-admission checks and PII/secret scans are planned BE-00 work and are not implemented by `npm test`.
