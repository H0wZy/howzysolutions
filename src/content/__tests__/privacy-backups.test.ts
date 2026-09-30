import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/types'
import { privacy } from '../privacy'

/*
 * The vvv retention list used to end with "Everything else: deleted within 30
 * days", which promised total deletion while the nightly encrypted dump sits in
 * a cloud folder that is never pruned. The operator chose to keep the backups,
 * so the text says what is true: deletion covers the active systems, and the
 * encrypted backups have no defined disposal period. This holds it there.
 */
const retention = privacy.projects
  .find((p) => p.id === 'vvv')!
  .sections.find((s) => s.id === 'vvv-retention')!

describe.each(LOCALES)('vvv retention, %s', (locale) => {
  const items = retention.items![locale]
  const backups = items.find((i) => /^(Backups|Cópias de segurança):/.test(i))
  const everythingElse = items.find((i) => /^(Everything else|Todo o resto):/.test(i))

  it('says the deletion covers the active systems, not every copy', () => {
    expect(everythingElse).toBeDefined()
    expect(everythingElse).toMatch(/active systems|sistemas ativos/)
    // The old wording promised total deletion.
    expect(everythingElse).not.toMatch(/^Everything else: deleted within|^Todo o resto: apagado em até/)
  })

  it('carries the backups caveat: kept for restoring, encrypted, no disposal period', () => {
    expect(backups, 'the backups item is missing').toBeDefined()
    expect(backups).toMatch(/restor|restauração/)
    expect(backups).toMatch(/[Ee]ncrypted|criptografadas/)
    expect(backups).toMatch(/no disposal period|prazo de descarte/)
    expect(backups).toMatch(/can remain|podem continuar/)
  })

  it('says who can open the folder, since that is one of the things the operator measured', () => {
    expect(backups).toMatch(/only the operator and the server can open|só o operador e o servidor conseguem abrir/)
  })

  it('invents no number of days for the backups', () => {
    // None exists; a number here would be a promise the backup job does not keep.
    expect(backups).not.toMatch(/[0-9]+ *(days?|dias?|months?|meses|years?|anos?)/i)
  })
})

/*
 * vvv-storage said "data is stored on the operator's computer in Brazil", which stopped being
 * true when the database moved to the operator's server and a nightly copy started going to
 * Google Drive. It now says three true things (where the data lives, that an encrypted copy goes
 * to Google Drive, that this means the copy leaves Brazil) and names no LGPD art. 33 mechanism,
 * because none has been decided.
 */
const storage = privacy.projects
  .find((p) => p.id === 'vvv')!
  .sections.find((s) => s.id === 'vvv-storage')!

describe.each(LOCALES)('vvv storage, %s', (locale) => {
  const items = storage.items![locale]
  const text = items.join(' ')
  const stored = items.find((i) => /^(Storage|Armazenamento):/.test(i))
  const backups = items.find((i) => /^(Backups|Cópias de segurança):/.test(i))

  it('says where the active data lives and no longer says it is the operator computer', () => {
    expect(stored).toMatch(/database|banco de dados/)
    expect(stored).toMatch(/server|servidor/)
    expect(stored).not.toMatch(/stored on the operator.s computer|ficam no computador do operador/)
  })

  it('says the assistants can also read the file where the tokens are kept, and that the app sends them only to TikTok', () => {
    expect(stored).toMatch(/the app sends them only to TikTok|o app os envia apenas ao TikTok/)
    expect(stored).toMatch(/commands they run can also read the file where the tokens are kept on that computer|comandos deles também podem ler o arquivo onde os tokens ficam nesse computador/)
    expect(stored).toMatch(/Because the AI assistants act with the operator.s access|Como os assistentes de IA agem com o acesso do operador/)
  })

  it('keeps the TikTok tokens on the operator computer only, and sent only to TikTok, without promising it of every credential', () => {
    expect(stored).toMatch(/except the TikTok authorization tokens|exceto os tokens de autorização do TikTok/)
    expect(stored).toMatch(/The tokens are kept only on the operator.s computer|Os tokens ficam só no computador do operador/)
    // The dump also carries a database of infrastructure credentials, so nothing here says credentials in general.
    expect(stored).not.toMatch(/[Cc]redentials are kept only|credenciais ficam só/)
  })

  it('says the copy covers all the databases on the server, not one', () => {
    expect(backups).toMatch(/all the databases|todos os bancos de dados/)
  })

  it('says every night, in the operator own Google account, and that file names are encrypted too', () => {
    expect(backups).toMatch(/every night|toda noite/)
    expect(backups).toMatch(/in the operator.s own Google account|na conta Google do próprio operador/)
    expect(backups).toMatch(/file names included|inclusive os nomes dos arquivos/)
  })

  it('names Google Drive, says the copy is encrypted before it leaves, and says it leaves Brazil', () => {
    expect(backups, 'the backups item is missing').toBeDefined()
    expect(backups).toContain('Google Drive')
    expect(backups).toMatch(/encrypted on our server before it leaves|criptografada no nosso servidor antes de sair/)
    expect(backups).toMatch(/leaves the country|sai do país/)
  })

  it('names no LGPD art. 33 mechanism for either transfer', () => {
    // Undecided on purpose. A mechanism named here would be one that is not in place.
    expect(text).not.toMatch(/art\. ?33|cláusulas|clauses|adequa|adequacy|consent|consentimento/i)
  })
})

/*
 * The general Security section used to say the computer has an encrypted disk. The server's disks
 * are not encrypted (measured by the reviewer), so the only thing it may say is encrypted is the
 * backup copy that leaves.
 */
const security = privacy.sections.find((s) => s.id === 'security')!

describe.each(LOCALES)('general security section, %s', (locale) => {
  const text = security.body[locale].join(' ')

  it('no longer claims an encrypted disk', () => {
    expect(text).not.toMatch(/has an encrypted disk|tem o disco criptografado|disk is encrypted/)
  })

  it('says only the operator has personal access and does not hide the automated deployment runner', () => {
    expect(text).toMatch(/Only the operator has personal access|Só o operador tem acesso pessoal/)
    expect(text).toMatch(/automated deployment runner on the server has access of its own|executor automático de entrega \(deploy\) no servidor tem acesso próprio/)
    // "Limited to the operator" with no mention of the runner is the claim this replaced.
    expect(text).not.toMatch(/limited to the operator|restrito ao operador/)
  })

  it('does not read as only the backup being encrypted: the console encrypts data inside its database', () => {
    expect(text).toMatch(/the console encrypts some personal data inside its database|o console criptografa alguns dados pessoais dentro do banco dele/)
  })

  it('says what is encrypted is the backup copy, and that the server disks are not', () => {
    expect(text).toMatch(/backup copy that leaves our server|cópia de segurança que sai do nosso servidor/)
    expect(text).toMatch(/disks are not encrypted|discos do próprio servidor não são criptografados/)
  })
})

/*
 * The "AI tools" item used to say the tools "can see product and post metadata" and "do not
 * receive credentials": true to the letter and misleading in effect, because the assistants run
 * commands on the operator computer and on the server with the operator access. It now says so.
 */
describe.each(LOCALES)('vvv AI tools item, %s', (locale) => {
  const item = storage.items![locale].find((i) => /^(AI tools|Ferramentas de IA):/.test(i))

  it('says the assistants operate the system, not only see metadata', () => {
    expect(item, 'the AI tools item is missing').toBeDefined()
    expect(item).toMatch(/to run the system, not only to see metadata|para operar o sistema, não só para ver metadados/)
  })

  it('says they run commands on the computer and on the server with the operator own access', () => {
    expect(item).toMatch(/run commands on the operator.s computer and on our server|executam comandos no computador do operador e no nosso servidor/)
    expect(item).toMatch(/using the operator.s own access|usando o acesso do próprio operador/)
    expect(item).toMatch(/which includes administrator rights on the server|que inclui direitos de administrador no servidor/)
  })

  it('says they can reach the databases and files and can read the data there', () => {
    expect(item).toMatch(/the databases and files on the server|os bancos de dados e os arquivos do servidor/)
    expect(item).toMatch(/can therefore read the data stored there|pode, portanto, ler os dados guardados ali/)
  })

  it('no longer lets "no credentials" stand in for the rest, and says the providers are outside Brazil', () => {
    expect(item).not.toMatch(/can see product and post metadata|podem ver metadados de produtos e publicações/)
    expect(item).not.toMatch(/not handed a credential|não recebem uma credencial/)
    expect(item).toMatch(/outside Brazil|fora do Brasil/)
  })

  it('names no country, company or product for where the providers are', () => {
    // A country here stops being true the day the operator subscribes to a tool from another one.
    expect(item).not.toMatch(/United States|Estados Unidos|China|chin[eê]s|Kimi|Moonshot|OpenAI|Anthropic|Google/i)
  })

  it('says no credential is handed over to keep, but the commands can use the credentials the computer already has', () => {
    expect(item).toMatch(/No credential is handed to these companies to keep, but the commands the assistants run can use the credentials the computer already has|Nenhuma credencial é entregue a essas empresas para guardar, mas os comandos que os assistentes executam podem usar as credenciais que o computador já tem/)
    // "Nothing is handed to keep" read as the companies keeping nothing of what they receive.
    expect(item).not.toMatch(/Nothing is handed to these companies|Nada é entregue a essas empresas/)
  })

  it('says how long each company keeps what it receives is decided by that company', () => {
    expect(item).toMatch(/How long each company keeps what it receives is decided by that company|Por quanto tempo cada empresa guarda o que recebe é decidido por ela/)
  })

  it('says what an assistant reads is sent to the company that provides it, to be processed', () => {
    expect(item).toMatch(/what it reads is sent to the company that provides it, to be processed|o que ela lê é enviado à empresa que a fornece, para ser processado/)
  })
})
