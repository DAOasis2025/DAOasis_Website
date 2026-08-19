# CONTENT_REQUIRED — DAOasis trust & legal layer

Unresolved legal and factual inputs in the seven trust pages, created 17 August 2026.

Every item below appears on a live page as a visible `[TO BE CONFIRMED]` marker
(`<span class="tbc">`). They are shown rather than hidden on purpose: a privacy policy
that quietly omits its own contact address is worse than one that says the address is
not settled yet. Search any page for `class="tbc"` to find them in place.

**These pages are not a substitute for review by qualified legal counsel.** They are
structurally and substantively complete and internally consistent with the product as
described on the website, but they have not been reviewed by a lawyer.

---

## LEGAL ENTITY

| Needed | Appears on |
|---|---|
| Registered legal entity name of the DAOasis operating company | `privacy.html` §01, §19 · `terms.html` §01, §24 |
| Registered address | `privacy.html` §19 · `terms.html` §24 |
| Company registration number, and any trading names | Not yet referenced — add once known |

Nothing was invented here. No entity name, number, address or jurisdiction appears
anywhere in the project files, so none was written.

---

## PRIVACY CONTACT

| Needed | Appears on |
|---|---|
| Public privacy / data-protection email address | `privacy.html` §19 · `cookies.html` §08 · `contact.html` route 04 |
| Whether a Data Protection Officer is required, and in which jurisdictions | `privacy.html` §19 |
| Whether an EU / UK representative is required under GDPR Art. 27 | `privacy.html` §19 |

---

## GENERAL CONTACT

No email address of any kind exists in the project. All five contact routes on
`contact.html` are placeholders.

| Needed | Appears on | Status |
|---|---|---|
| ~~General enquiries address~~ | `contact.html` route 01 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Investor relations address~~ | `contact.html` route 02 · `investors.html` | **`info@daoasis.xyz`** — 19 Aug |
| ~~Partnerships address~~ | `contact.html` route 03 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Privacy address~~ | `contact.html` route 04 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Contributor / community address~~ | `contact.html` route 05 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Careers route address~~ | `contact.html` route 06 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Accessibility reports address~~ | `accessibility.html` §06 | **`info@daoasis.xyz`** — 19 Aug |
| ~~Privacy enquiries address~~ | `privacy.html` §12 · `cookies.html` | **`info@daoasis.xyz`** — 19 Aug |
| ~~Legal notices address~~ | `terms.html` §24 | **`info@daoasis.xyz`** — 19 Aug. Terms now states a notice sent there is treated as received, since it is the only route for formal notice until the registered address exists |
| **Target response time commitment** | `contact.html` · `accessibility.html` §06 | **Still `tbc` — the only unresolved marker left on `contact.html`** |

### One address for everything (19 August)

**`info@daoasis.xyz` is the single contact address for the whole site.** Every route on
`contact.html` — general, investors, partnerships, privacy, contributors, careers —
resolves to it, and so does `investors.html`. This is deliberate: a small team would
rather publish one address that is read than six that are not, so the routes exist to
tell a visitor what to put in the subject line, not to send them somewhere different.

Dedicated per-route addresses can be added later; each one is a `mailto:` swap on
`contact.html` plus, for investors, the `INVESTOR_CONTACT` constant below.

`cookies.html` and `privacy.html` are unaffected — no analytics or cookies were added.

### The investor address (19 August — now set)

`investors.html` has a working request flow — a `Request this resource` button on every
on-request card, a `Request Investor Information` CTA under the grid, and a request panel
that collects resource / name / email / company / message.

**All of it reads one constant:**

```js
const INVESTOR_CONTACT = 'info@daoasis.xyz';
```

Submitting now opens the visitor's email client with the request pre-composed and
addressed; the note under the form, the done-state and the closing line all name it.
To change or remove the address, change that one line — set it back to `null` and the
panel reverts to composing the request for **Copy request** with a `<span class="tbc">`
in place of the address, with no other edit needed.

**The panel never claims a request was sent** — it says the email client "should have
opened" and offers the text to copy if it did not. There is still no form backend
anywhere in this project, and the page must not imply otherwise.

---

## JURISDICTION

| Needed | Appears on |
|---|---|
| Governing law | `terms.html` §23 |
| Courts with jurisdiction | `terms.html` §23 |
| Consumer-law carve-outs required for target markets | `terms.html` §19, §20, §21, §23 |
| Liability cap figure | `terms.html` §20 |

---

## RETENTION

| Needed | Appears on |
|---|---|
| Specific retention period per data category | `privacy.html` §13 |

Section 13 currently sets out retention *by purpose* with no numbers, which is
defensible on its own but should be replaced with a real schedule.

---

## CHILDREN / AGE POLICY

| Needed | Appears on |
|---|---|
| Minimum age for a DAOasis account | `privacy.html` §16 · `terms.html` §03 |

Depends on target jurisdictions, the age of digital consent in each, and whether the
$DVT layer attracts additional age restrictions. Deliberately left unanswered.

---

## DATA PROCESSORS

| Needed | Appears on |
|---|---|
| List of processors / sub-processors (hosting, storage, email, support, crash reporting) | `privacy.html` §10 |
| Hosting locations (countries where data is processed) | `privacy.html` §14 |
| International transfer mechanisms relied on (adequacy, SCCs, other) | `privacy.html` §14 |

Categories are described; **no vendor was named**, because none is verifiable from the
project files.

---

## ANALYTICS

**Verified against the source, not assumed.** A search of all six pre-existing pages for
`gtag`, `googletagmanager`, `google-analytics`, `fbq`, `facebook.net`, `plausible`,
`posthog`, `hotjar`, `clarity.ms`, `segment`, `mixpanel` and `matomo` returned
**zero matches**.

The site therefore currently has:

- no analytics of any kind
- no tag manager
- no advertising or conversion pixels
- no session recording
- no A/B testing tooling

`cookies.html` states this as fact. **If any analytics are added, `cookies.html` §04 and
§07 and `privacy.html` §09 must be updated before the script goes live**, not after.

| Needed | Appears on |
|---|---|
| Decision on whether analytics will be introduced, and which provider | `cookies.html` §04, §08 |

---

## COOKIE CONSENT

**There is no consent mechanism on the website, and currently none is needed.** The site
sets no cookies. The only client-side storage is one `localStorage` key,
`daoasis-theme`, holding the string `light` or `dark`.

This is disclosed accurately on `cookies.html` §03 and §07 rather than papered over.

| Needed | Appears on |
|---|---|
| A compliant consent management mechanism — **required before any non-essential cookie or analytics script is added** | `cookies.html` §07 |

---

## HEALTH DATA ARCHITECTURE

| Needed | Appears on |
|---|---|
| Where wellness data will be stored, and in which region | `privacy.html` §12, §14 |
| Encryption approach for stored wellness data | `privacy.html` §12 |
| Confirmation of which health platforms will ship in release one | `health-data.html` §07 · `privacy.html` §02 |
| Whether explicit consent will be collected separately for special-category data | `privacy.html` §04 |
| Security review / certification status | `privacy.html` §12 |

No security certification, audit or compliance claim was made anywhere. `privacy.html`
§12 explicitly states that DAOasis holds none.

---

## TOKEN LEGAL REVIEW

| Needed | Appears on |
|---|---|
| Regulatory analysis: is $DVT a security / e-money / other regulated instrument, per jurisdiction | `token-disclaimer.html` §08 |
| Jurisdictions where $DVT functionality will and will not be offered | `token-disclaimer.html` §08 |
| Blockchain, wallet connection method and technical infrastructure | `privacy.html` §08 · `terms.html` §10 |
| Official contract addresses and official communication channels (for anti-fraud verification) | `token-disclaimer.html` §10 |
| Legal review of the DRC → $DVT conversion mechanism | `token-disclaimer.html` §04 · `terms.html` §09 |
| Whether staking as designed constitutes a regulated activity | `terms.html` §10 · `token-disclaimer.html` §05 |
| Whether governance as designed creates any legal relationship | `terms.html` §10 |

---

## ACCESSIBILITY

| Needed | Appears on |
|---|---|
| Independent accessibility audit (none has been carried out) | `accessibility.html` §01, §04 |
| Testing with users who rely on assistive technology | `accessibility.html` §04 |
| Inclusive participation design — how DRC is earned by people with different physical capabilities | `accessibility.html` §05 |

No WCAG conformance claim was made. `accessibility.html` states that DAOasis is
*working toward* WCAG 2.2 AA and has not been audited.

---

## INVESTOR DOCUMENTS

**No document files exist in the project.** There is no `docs/` folder and no PDF
anywhere in the directory.

`investors.html` already renders its resources grid from a single `DOCS` array
(around line 2528) with `file: null` on all nine entries, which makes each card render
in an "Available on request" state. That mechanism was already correct and was
**not modified**.

To publish a document later: drop the file into a `docs/` folder next to the pages and
set `file:` on the matching `DOCS` entry — e.g.
`file: 'docs/DAOasis-Investor-Pack.pdf'`. The card becomes a real download link on its
own; no other change is needed.

| Needed | Notes |
|---|---|
| Investor Pack | `DOCS[0]` — set `file` |
| Business Plan | `DOCS[1]` |
| One Page Overview | `DOCS[2]` |
| Whitepaper | `DOCS[3]` |
| Tokenomics | `DOCS[4]` — marked "Subject to legal review" |
| Feasibility Study | `DOCS[5]` |
| Competitor Analysis | `DOCS[6]` |
| Brand Kit | `DOCS[7]` |
| Quarterly Update | `DOCS[8]` |

The new footer's **Resources** column links these four names to
`investors.html#resources` rather than to invented file paths, so every link resolves
today and none 404s.

---

## OTHER — issues found while building, not caused by this work

### 1. The site-wide primary CTA does not work
`index.html`'s waitlist section (`#waitlistSection`) contains **no form**. Its
"Join the Waitlist" button is `<a href="#">` — a dead link. Every page's nav CTA,
drawer CTA and footer Waitlist link points here, so the single most important
conversion path on the website currently does nothing.

This is the largest functional gap on the site and is worth fixing before any
institutional or partner review. It also has a privacy consequence: `privacy.html` §02
currently states that the website collects no personal information, which is *accurate
today precisely because this is broken*. **If a waitlist form is wired up,
`privacy.html` §02 and `cookies.html` §01 must be updated at the same time.**

### 2. Sanctuary early-access form is front-end only
`sanctuary.html`'s form calls `preventDefault()` and displays a message stating that
nothing has been submitted or stored. That is honest and was left alone.
`contact.html` references it accurately.

### 3. Genuine contradiction — device integrations, present vs future tense
- `app.html` line ~1866 (Section 9): *"DAOasis **connects** to your existing health
  platforms so your data flows automatically"* — present tense, and the six integration
  cards (Apple Health, Google Health Connect, Whoop, Oura, Garmin, Fitbit) read as live
  with no status qualifier.
- `investors.html` line ~1353: HealthKit and Google Health Connect are *"the priority
  integrations **identified** for the app's first release."*
- `about.html` line ~1049: *"Core architecture is built; end-to-end flows are **in
  development**."*

The app page reads as though six integrations are live; the investor page says two are
planned. **The trust pages follow the investor/about framing** (integrations described
as "where you choose to connect them", labelled *In development* on
`health-data.html` §07 and `privacy.html` §02).

Per the brief, `app.html` was **not** changed to suit the legal pages. Recommendation:
add a status qualifier to `app.html`'s integrations section — a one-line
"Integrations planned for the app's first release" would resolve it. Owner's call.

### 4. `app.html` integration cards show each brand name twice
Pre-existing, noted in `CLAUDE.md`. Once as `<text>` inside the `.int-logo` SVG, once as
`.int-card-name`. A content/branding call, left alone.

### 5. No favicon
Site-wide, pre-existing. Every page logs one 404 on load, including the seven new ones.
`favicon.ico` does not exist in the project.

### 6. `images/about-hero-mobile.jpg` still missing
`images/about-hero.jpg` now exists; the mobile portrait crop does not. `about.html`
degrades to a colour field, as designed.

### 7. Terminology — no `DRT` anywhere
A project-wide search for `DRT` returned **zero matches** across all HTML files. The
retired terminology is fully cleared. `DRC` and `$DVT` are used consistently, and the
new pages introduce DRC by its full name (DAOasis Reward Credits) on first use.

### 8. Dead lightbox in `index.html`
Pre-existing, documented in `CLAUDE.md`. CSS and markup with zero JS references. Not
touched.

---

## TEAM PAGE — added 18 August 2026

The About page team structure was corrected: Trong moved out of the founding team and
into Technology, and Uchenna was added as App Developer.

| Needed | Appears on |
|---|---|
| **Uchenna's real profile copy** — the current bio is placeholder text | `about.html` §Technology |
| **Uchenna's quote** — his card carries a "Quote to follow" placeholder | `about.html` §Technology |
| Portrait for Uchenna — `images/team-uchenna.jpg` | `about.html` §Technology |

**Do not write a quote for Uchenna, or for anyone else, to fill the layout.** The
`.pf-soon` placeholder exists specifically so the three-up row stays balanced without
words being attributed to a real person who did not say them.

Portrait files still missing for **every** profile on the page: Jamie, Nelson, Dan,
Trong, Uchenna, Etiosa, George. Each has an HTML comment giving the intended filename;
dropping an `<img>` inside the `<figure class="pt">` covers the monogram automatically,
with no CSS change. Do not fill these with stock or generated portraits.

`images/about-hero-mobile.jpg` is also still missing — the hero degrades to a colour
field by design, and it is the only 404 the page logs.
