# CV builder verification

Run `npm run build` and `node tests/model.test.mjs`.

Verified in the development browser:
- Four edit steps retain their values when navigating.
- Optional sections collapse and empty entries do not appear in the CV.
- Font size, line spacing and margins update the document and survive save/reload.
- Arabic and English interface at a 390px iframe viewport: no horizontal document overflow; edit/preview tabs work. This is responsive browser testing, not a physical mobile-device test.
- Arabic and English long descriptions: 65 bullets retained without horizontal overflow.
- Literal/synonym/missing keyword results; metadata field names and IDs are excluded from comparisons.
- Print review and print action run without an application error.

Remaining export verification: the remote browser does not expose the native Save as PDF dialog. Native browser PDF pagination, extracted text order, and real Android/iOS printing are not yet verified. Before claiming end-to-end export coverage, save Arabic and English PDFs with one and at least three pages, inspect all pages, and copy/extract the text to check reading order. Test both compact and wide margins.

The completeness indicator checks content presence and basic validation, not writing quality or ATS acceptance. The synonym dictionary is intentionally limited. Drafts, versions and backups stay in the browser unless the user exports them.
