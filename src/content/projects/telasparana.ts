import type { Project } from '../types'

export const telasparana: Project = {
  id: 'telasparana',
  name: 'Telas Paraná',
  kind: 'client',
  state: 'production',
  context: {
    en: 'Telas Paraná: perimeter fencing and protection, Londrina/PR. 40 years, three generations.',
    pt: 'Telas Paraná: cercamento e proteção perimetral, Londrina/PR. 40 anos, três gerações.',
  },
  period: { start: '2026-03-24', end: '2026-06-28' },
  commits: 368,
  wakatimeProject: 'telasparana',

  summary: {
    en: 'Conversion site, lead capture and customer authentication for a traditional fencing company, on Cloud Run and provisioned entirely by Terraform.',
    pt: 'Site de conversão, captura de leads e autenticação de cliente para uma empresa tradicional de cercamento, em Cloud Run e provisionado inteiramente por Terraform.',
  },

  problem: {
    en: 'A 40-year-old fencing company whose only inbound channel was the telephone and word of mouth. No contact capture, no marketing attribution, no record of who asked for a quote. Every lead that did not call at that exact moment was lost.',
    pt: 'Uma empresa de cercamento com 40 anos cujo único canal de entrada era telefone e boca a boca. Sem captura de contato, sem atribuição de marketing, sem registro de quem pediu orçamento. Todo lead que não ligava naquele instante era perdido.',
  },

  capabilities: {
    en: [
      'One-page institutional site built for conversion: hero, figures, products, services, segments, completed works, testimonials and contact.',
      'Every call to action composes a contextual message and opens WhatsApp already filled in, the business’s real conversion path.',
      'Lead capture with name, WhatsApp, e-mail, interest and LGPD consent, stored in a dedicated schema with UTM tracking.',
      'Full customer authentication: traditional signup plus Google social login through a server-side BFF, a protected account area, signup completion for incomplete Google accounts, and avatar upload.',
      'Live Google reviews through the Places API, filtered to four stars and above, with a static fallback.',
      'A 25-photo WebP gallery in three categories, a self-built institutional video player that pauses when it leaves the viewport, and dark/light theming with no flash.',
    ],
    pt: [
      'Site institucional one-page orientado à conversão: hero, números, produtos, serviços, segmentos, obras realizadas, depoimentos e contato.',
      'Todos os CTAs montam uma mensagem contextual e abrem o WhatsApp já preenchido, o caminho de conversão real do negócio.',
      'Captura de leads com nome, WhatsApp, e-mail, interesse e consentimento LGPD, gravado em schema próprio com rastreio de UTMs.',
      'Autenticação de cliente completa: cadastro tradicional e login social Google por BFF server-side, área de conta protegida, conclusão de cadastro para contas Google incompletas e upload de avatar.',
      'Avaliações do Google em tempo real via Places API, filtradas em quatro estrelas ou mais, com fallback estático.',
      'Galeria de 25 fotos WebP em três categorias, player de vídeo institucional próprio que pausa ao sair da viewport, e tema dark/light sem flash.',
    ],
  },

  stack: [
    { group: 'frontend', items: ['nextjs', 'typescript', 'tailwind', 'vitest'] },
    { group: 'backend', items: ['csharp', 'aspnetcore', 'efcore', 'postgres', 'xunit'] },
    { group: 'infra', items: ['gcp', 'terraform', 'cloudrun', 'cloudsql', 'github-actions'] },
  ],

  development: {
    en: [
      'Evolved through numbered versions with a changelog kept in the README, v1.0.0 to v2.4.6. The pattern visible in the history: each version ships functionality, and the next version is almost always security hardening of what just shipped. v2.1.0 delivered auth; v2.1.1 fixed JWT signature verification, an open redirect, and avatar MIME handling. v2.4.0 delivered avatars; v2.4.1 replaced PBKDF2 with Argon2id at OWASP parameters: 19 MiB, two iterations, parallelism one.',
      'v2.4.2 was a full remediation following a cybersecurity and LGPD audit: an anti-pwn-request guard in the deployment pipeline, rate limiting by real client IP behind Cloud Run via forwarded headers, atomic refresh-token rotation with reuse detection that revokes the entire family, timing-based user-enumeration mitigation on login, CPF masked in responses, personal data removed from JWT claims, nonce-based CSP enforced, and non-root containers on base images pinned by digest.',
      'Security is a track of its own, with numbered issues traced through to a validated production apply. v2.4.4 closed the public exposure of the users API (invoker restricted to the frontend service account, service-to-service authentication by Google ID token) and migrated avatars from a public bucket to a private one served through an authenticated proxy.',
      'Infrastructure is Terraform end to end, with modules and per-environment configuration for DEV, HML and PROD: three applications on Cloud Run, Postgres on Cloud SQL, six secrets in Secret Manager, images in Artifact Registry, and three least-privilege service accounts. Continuous delivery runs on GitHub Actions with Workload Identity Federation, so no service-account key is ever committed.',
    ],
    pt: [
      'Evolução por versões numeradas com changelog mantido no README, da v1.0.0 à v2.4.6. O padrão visível no histórico: cada versão entrega funcionalidade, e a seguinte é quase sempre hardening de segurança do que acabou de entrar. A v2.1.0 entregou auth; a v2.1.1 corrigiu verificação de assinatura JWT, open redirect e MIME do avatar. A v2.4.0 entregou avatar; a v2.4.1 trocou PBKDF2 por Argon2id com parâmetros OWASP: 19 MiB, duas iterações, paralelismo um.',
      'A v2.4.2 foi uma remediação completa após auditoria de cybersecurity e LGPD: guard anti-pwn-request no CD, rate limiting pelo IP real do cliente atrás do Cloud Run via forwarded headers, rotação atômica de refresh token com detecção de reuso que revoga a família inteira, mitigação de enumeração de usuário por timing no login, CPF mascarado nas respostas, PII removida dos claims do JWT, CSP nonce-based enforced, e containers não-root com imagens base pinadas por digest.',
      'Segurança é trilha própria, com issues numeradas rastreadas até um apply validado em produção. A v2.4.4 fechou a exposição pública da users-api (invoker restrito à service account do frontend, autenticação service-to-service por ID token do Google) e migrou avatares de bucket público para bucket privado servido por proxy autenticado.',
      'Infraestrutura é Terraform de ponta a ponta, com módulos e configuração por ambiente para DEV, HML e PROD: três aplicações em Cloud Run, Postgres no Cloud SQL, seis segredos no Secret Manager, imagens no Artifact Registry e três service accounts least-privilege. O CD roda em GitHub Actions com Workload Identity Federation, então nenhuma chave de service account é versionada.',
    ],
  },

  limitations: {
    en: [
      'Allowed-hosts validation is deferred, and the README says why: pinning the wrong list takes the Cloud Run deployment down, and the gain is marginal behind the existing setup.',
      'The HS256 signing secret is shared between the users API and the BFF. Migrating to RS256 is recorded as low priority rather than as an oversight.',
      'E-mail verification on traditional signup is still pending. Google login already arrives with a verified address, so the gap only affects one of the two signup paths.',
    ],
    pt: [
      'A validação de AllowedHosts está adiada, e o README diz o motivo: fixar a lista errada derruba o deploy no Cloud Run, e o ganho é marginal diante do que já existe.',
      'O segredo de assinatura HS256 é compartilhado entre a users-api e o BFF. A migração para RS256 está registrada como baixa prioridade, não como descuido.',
      'A verificação de e-mail no cadastro tradicional continua pendente. O login Google já chega com endereço verificado, então a lacuna afeta só um dos dois caminhos de cadastro.',
    ],
  },

  roadmap: {
    en: [
      'v2.5: lead CRM panel',
      'v2.6: contact validation by token',
      'v2.7: AI/RAG chatbot qualifying leads against the catalogue',
      'v2.8: payments and marketplace',
      'Migration to GKE as traffic requires it',
    ],
    pt: [
      'v2.5: painel CRM de leads',
      'v2.6: validação de contato por token',
      'v2.7: chatbot IA/RAG qualificando leads sobre o catálogo',
      'v2.8: pagamentos e marketplace',
      'Migração para GKE conforme o tráfego exigir',
    ],
  },

  metrics: [
    {
      label: { en: 'Commits', pt: 'Commits' },
      value: '368',
      source: { en: 'git history, 2026-03-24 to 2026-06-28', pt: 'histórico git, 24/03/2026 a 28/06/2026' },
    },
    {
      label: { en: 'Shipped version', pt: 'Versão em produção' },
      value: 'v2.4.6',
      source: { en: 'README changelog', pt: 'changelog do README' },
    },
    {
      label: { en: 'Environments provisioned by Terraform', pt: 'Ambientes provisionados por Terraform' },
      value: '3',
      source: { en: 'envs/ holds DEV, HML, PROD', pt: 'envs/ contém DEV, HML, PROD' },
    },
  ],
}
