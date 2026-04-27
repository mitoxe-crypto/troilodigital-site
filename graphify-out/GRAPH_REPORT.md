# Graph Report - .  (2026-04-11)

## Corpus Check
- Corpus is ~9,447 words - fits in a single context window. You may not need a graph.

## Summary
- 45 nodes · 68 edges · 10 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.89)
- Token cost: 4,200 input · 1,800 output

## God Nodes (most connected - your core abstractions)
1. `Troilo Digital (Company)` - 16 edges
2. `Troilo Digital llms-full.txt (Documentation IA)` - 14 edges
3. `renderStep()` - 6 edges
4. `AI-Ready SEO` - 5 edges
5. `acceptCookies()` - 4 edges
6. `Audit SEO Essentiel 197€` - 4 edges
7. `Audit SEO Complet 397€` - 4 edges
8. `setCookie()` - 3 edges
9. `hideBanner()` - 3 edges
10. `declineCookies()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Troilo Digital Favicon (TD Monogram)` --references--> `Troilo Digital (Company)`  [INFERRED]
  favicon.svg → llms.txt
- `Troilo Digital Publisher Logo (Wordmark)` --references--> `Troilo Digital (Company)`  [INFERRED]
  publisher-logo.svg → llms.txt
- `Infographic: Résultats Audit SEO Avant/Après Artisan Liège` --conceptually_related_to--> `AI-Ready SEO`  [INFERRED]
  images/resultat-audit-seo-avant-apres-artisan-liege.svg → llms.txt
- `Portrait Photo: Michel Troilo, Consultant SEO` --references--> `Michel Troilo`  [INFERRED]
  images/consultant-seo-michel-troilo-liege-belgique.jpeg → llms.txt
- `Article: Meilleur consultant SEO Wallonie` --references--> `Troilo Digital (Company)`  [INFERRED]
  llms-full.txt → llms.txt

## Communities

### Community 0 - "Cookie & UI Components"
Cohesion: 0.43
Nodes (5): acceptCookies(), declineCookies(), hideBanner(), loadGA4(), setCookie()

### Community 1 - "Chatbot Widget"
Cohesion: 0.43
Nodes (6): addMsg(), clearActions(), renderStep(), sendToWhatsApp(), showTyping(), toggleChat()

### Community 2 - "Blog Articles SEO"
Cohesion: 0.32
Nodes (8): Article: Audit SEO pour artisan belge, Article: Comment choisir son consultant SEO artisan, Article: Meilleur consultant SEO Wallonie, Article: Prix audit SEO Belgique 2026, Troilo Digital llms-full.txt (Documentation IA), Audit + Implémentation 997€, Audit SEO Essentiel 197€, Suivi Mensuel SEO

### Community 3 - "Brand & Services Identity"
Cohesion: 0.47
Nodes (6): Troilo Digital Favicon (TD Monogram), Audit SEO Complet 397€, Liège, Wallonie, Belgique, Troilo Digital (Company), Troilo Digital Publisher Logo (Wordmark), Infographic: Résultats Audit SEO Avant/Après Artisan Liège

### Community 4 - "AI-Ready SEO Strategy"
Cohesion: 0.4
Nodes (5): Glossaire SEO pour artisans, AI-Ready SEO, Méthode ANCRE, AI Crawler Open Access Policy, robots.txt Troilo Digital

### Community 5 - "WhatsApp Button"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Mobile Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Artisans Target Market"
Cohesion: 1.0
Nodes (2): Article: Pourquoi votre site est invisible sur Google, Artisans et PMEs Wallonie

### Community 8 - "LLMs.txt & AI Visibility"
Cohesion: 1.0
Nodes (2): Article: Qu'est-ce que le llms.txt ?, Troilo Digital llms.txt

### Community 9 - "Michel Troilo Identity"
Cohesion: 1.0
Nodes (2): Michel Troilo, Portrait Photo: Michel Troilo, Consultant SEO

## Knowledge Gaps
- **3 isolated node(s):** `Liège, Wallonie, Belgique`, `Article: Comment choisir son consultant SEO artisan`, `Portrait Photo: Michel Troilo, Consultant SEO`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `WhatsApp Button`** (2 nodes): `whatsapp-btn.js`, `createButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mobile Navigation`** (2 nodes): `mobile-bar.js`, `createBar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Artisans Target Market`** (2 nodes): `Article: Pourquoi votre site est invisible sur Google`, `Artisans et PMEs Wallonie`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LLMs.txt & AI Visibility`** (2 nodes): `Article: Qu'est-ce que le llms.txt ?`, `Troilo Digital llms.txt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Michel Troilo Identity`** (2 nodes): `Michel Troilo`, `Portrait Photo: Michel Troilo, Consultant SEO`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Troilo Digital (Company)` connect `Brand & Services Identity` to `Blog Articles SEO`, `AI-Ready SEO Strategy`, `Artisans Target Market`, `LLMs.txt & AI Visibility`, `Michel Troilo Identity`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `Troilo Digital llms-full.txt (Documentation IA)` connect `Blog Articles SEO` to `LLMs.txt & AI Visibility`, `Brand & Services Identity`, `AI-Ready SEO Strategy`, `Artisans Target Market`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `Michel Troilo` connect `Michel Troilo Identity` to `Brand & Services Identity`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Troilo Digital (Company)` (e.g. with `Article: Meilleur consultant SEO Wallonie` and `robots.txt Troilo Digital`) actually correct?**
  _`Troilo Digital (Company)` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `AI-Ready SEO` (e.g. with `AI Crawler Open Access Policy` and `Infographic: Résultats Audit SEO Avant/Après Artisan Liège`) actually correct?**
  _`AI-Ready SEO` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Liège, Wallonie, Belgique`, `Article: Comment choisir son consultant SEO artisan`, `Portrait Photo: Michel Troilo, Consultant SEO` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._