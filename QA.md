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

## A4 pagination update
- Preview now renders fixed physical A4 pages and scales them for narrow screens. Printing uses those same page nodes at 100% scale with zero browser margins; user-selected margins are inside each page.
- Browser QA: short Arabic CV: one page; 65-bullet Arabic and English descriptions: five pages, 65 bullets retained, no content-area overflow. A single long achievement was split across four pages, with normalized text integrity retained.
- A 390px iframe viewport shows the scaled A4 preview without horizontal overflow.
- Automatic comparison checks text order and completeness (excluding repeated section headings). Export is disabled during pagination, on a text mismatch, or on detected page overflow.
- This verifies rendered page DOM, not an exported PDF file or a third-party ATS parser. Native PDF-save and physical phone checks remain required.
