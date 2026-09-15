/**
 * KNOWLEDGE BASE — OSINT Policial
 * -------------------------------------------------------------
 * Fonte de dados centralizada. Baseado em:
 *   - osint_knowledge_base_v3.md (fontes/ferramentas)
 *   - OSINT Investigator Forense v2.0 (SKILL.md — regras/metodologia)
 *
 * Cada categoria representa um tipo de identificador (§ = seção
 * correspondente na Knowledge Base original).
 *
 * Cada fonte (tool) tem:
 *   - name: nome da ferramenta
 *   - mode: "auto" | "manual"
 *       auto   -> existe um padrão de URL de pesquisa direta; o
 *                 sistema monta a URL com o identificador informado
 *                 e abre a pesquisa automaticamente.
 *       manual -> a fonte exige login, CAPTCHA, upload de arquivo,
 *                 colagem de cabeçalho ou não tem padrão de busca
 *                 estável/confiável por URL. O sistema apenas
 *                 direciona o investigador até a página correta.
 *   - url:   URL base (mode=manual) ou template com {q} (mode=auto)
 *   - note:  observação curta da KB original
 *
 * Para adicionar/editar fontes: edite apenas este arquivo.
 * {q} é substituído pelo identificador informado (URL-encoded).
 * {qraw} é substituído sem encoding (uso raro, ex: já é uma URL).
 */

const OSINT_KB = {
  meta: {
    version: "3.0",
    updated: "2026",
    disclaimer:
      "Conteúdo destinado exclusivamente a profissionais de segurança pública, investigação criminal, perícia digital, Ministério Público, Poder Judiciário, advocacia, pesquisa acadêmica e cibersegurança corporativa. O uso sem autorização legal pertinente pode configurar crime (LGPD, Marco Civil da Internet, Código Penal, Lei 12.850/2013, Lei 13.709/2018).",
  },

  categories: [
    {
      id: "email",
      label: "E-mail",
      section: "§1",
      placeholder: "exemplo@dominio.com",
      sources: [
        { name: "MXToolbox Email Headers", mode: "manual", url: "https://mxtoolbox.com/EmailHeaders.aspx", note: "Análise de cabeçalho (colar manualmente)" },
        { name: "Google Apps Toolbox", mode: "manual", url: "https://toolbox.googleapps.com/apps/messageheader/", note: "Oficial do Google — colar cabeçalho" },
        { name: "HaveIBeenPwned", mode: "auto", url: "https://haveibeenpwned.com/account/{q}", note: "Verificação de vazamentos" },
        { name: "Firefox Monitor", mode: "manual", url: "https://monitor.firefox.com/", note: "Verificação de vazamentos" },
        { name: "EmailRep", mode: "auto", url: "https://emailrep.io/{q}", note: "Reputação + histórico" },
        { name: "Epieos", mode: "manual", url: "https://epieos.com/", note: "Cruza dados vinculados ao e-mail" },
        { name: "Hunter.io Verifier", mode: "manual", url: "https://hunter.io/email-verifier", note: "Valida endereço" },
        { name: "Gravatar", mode: "auto", url: "https://en.gravatar.com/site/check/{q}", note: "Avatar universal vinculado" },
        { name: "Whoxy Reverse WHOIS", mode: "manual", url: "https://www.whoxy.com/", note: "WHOIS reverso por e-mail" },
        { name: "ViewDNS Reverse WHOIS", mode: "manual", url: "https://viewdns.info/reversewhois/", note: "Domínios registrados com o e-mail" },
        { name: "Google Dork (pastebin)", mode: "auto", url: "https://www.google.com/search?q=site:pastebin.com+%22{q}%22", note: "Menções em pastes públicos" },
        { name: "GitHub code search", mode: "auto", url: "https://github.com/search?q=%22{q}%22&type=code", note: "Menções em repositórios públicos" },
        { name: "IntelX", mode: "manual", url: "https://intelx.io/", note: "Paga — inclui dark web" },
        { name: "Google (busca geral)", mode: "auto", url: "https://www.google.com/search?q=%22{q}%22", note: "Busca aberta pelo termo exato" },
      ],
    },
    {
      id: "phone",
      label: "Telefone",
      section: "§2.1",
      placeholder: "+55 11 91234-5678",
      sources: [
        { name: "ABRTELECOM (portabilidade/operadora)", mode: "manual", url: "https://consultanumero.abrtelecom.com.br", note: "Operadora oficial (Anatel)" },
        { name: "NumVerify", mode: "manual", url: "https://numverify.com/", note: "Valida + tipo (VOIP/fixo/móvel) — requer API key" },
        { name: "TrueCaller", mode: "manual", url: "https://www.truecaller.com/", note: "Nome + operadora" },
        { name: "Sync.me", mode: "manual", url: "https://sync.me/", note: "Identificador de chamadas" },
        { name: "WhatsApp (link direto)", mode: "auto", url: "https://wa.me/{q}", note: "Verifica existência de conta / foto pública" },
        { name: "Epieos", mode: "manual", url: "https://epieos.com/", note: "Cruza com outros dados" },
        { name: "Google (busca geral)", mode: "auto", url: "https://www.google.com/search?q=%22{q}%22", note: "Busca aberta pelo número" },
      ],
    },
    {
      id: "cpf_cnpj",
      label: "CPF / CNPJ",
      section: "§2.2–2.3",
      placeholder: "000.000.000-00 ou 00.000.000/0001-00",
      sources: [
        { name: "Receita Federal — Consulta CPF", mode: "manual", url: "https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp", note: "Requer CAPTCHA — consulta manual" },
        { name: "Receita Federal — Consulta CNPJ", mode: "manual", url: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp", note: "Requer CAPTCHA — consulta manual" },
        { name: "RedeCNPJ", mode: "manual", url: "https://www.redecnpj.com.br/", note: "Rede societária (QSA)" },
        { name: "CNPJ.biz", mode: "auto", url: "https://cnpj.biz/{q}", note: "Consulta pública de CNPJ (somente números)" },
        { name: "Brasil.io", mode: "manual", url: "https://brasil.io/", note: "Base de dados públicos" },
        { name: "Jusbrasil", mode: "auto", url: "https://www.jusbrasil.com.br/busca?q={q}", note: "Processos e menções judiciais" },
        { name: "Google (busca geral)", mode: "auto", url: "https://www.google.com/search?q=%22{q}%22", note: "Busca aberta pelo número" },
      ],
    },
    {
      id: "ip",
      label: "Endereço IP",
      section: "§3",
      placeholder: "203.0.113.7",
      sources: [
        { name: "IPinfo", mode: "auto", url: "https://ipinfo.io/{q}", note: "Geolocalização + ASN" },
        { name: "Shodan", mode: "auto", url: "https://www.shodan.io/host/{q}", note: "Serviços/portas expostos" },
        { name: "Censys", mode: "auto", url: "https://search.censys.io/hosts/{q}", note: "Attack surface" },
        { name: "AbuseIPDB", mode: "auto", url: "https://www.abuseipdb.com/check/{q}", note: "Histórico de abuso" },
        { name: "GreyNoise", mode: "auto", url: "https://viz.greynoise.io/ip/{q}", note: "Ruído de internet / scanners" },
        { name: "VirusTotal", mode: "auto", url: "https://www.virustotal.com/gui/ip-address/{q}", note: "Reputação multi-engine" },
        { name: "Registro.br WHOIS", mode: "auto", url: "https://registro.br/tecnologia/ferramentas/whois/?busca={q}", note: "WHOIS de blocos .br" },
        { name: "BGPView", mode: "auto", url: "https://bgpview.io/ip/{q}", note: "ASN / rota BGP" },
        { name: "Hurricane Electric BGP", mode: "auto", url: "https://bgp.he.net/ip/{q}", note: "Explorador BGP" },
        { name: "SecurityTrails", mode: "manual", url: "https://securitytrails.com/", note: "Passive DNS histórico" },
        { name: "MXToolbox Blacklist", mode: "auto", url: "https://mxtoolbox.com/SuperTool.aspx?action=blacklist%3a{q}", note: "Checagem em DNSBLs" },
      ],
    },
    {
      id: "domain",
      label: "Domínio / URL",
      section: "§4",
      placeholder: "exemplo.com.br",
      sources: [
        { name: "Registro.br WHOIS", mode: "auto", url: "https://registro.br/tecnologia/ferramentas/whois/?busca={q}", note: "Domínios .br" },
        { name: "ICANN Lookup", mode: "auto", url: "https://lookup.icann.org/en/lookup?q={q}", note: "WHOIS global" },
        { name: "who.is", mode: "auto", url: "https://who.is/whois/{q}", note: "Interface amigável" },
        { name: "DNSDumpster", mode: "manual", url: "https://dnsdumpster.com/", note: "Mapa DNS visual" },
        { name: "crt.sh", mode: "auto", url: "https://crt.sh/?q={q}", note: "Certificados SSL como pivô" },
        { name: "Wayback Machine", mode: "auto", url: "https://web.archive.org/web/*/{q}", note: "Histórico de páginas" },
        { name: "BuiltWith", mode: "auto", url: "https://builtwith.com/{q}", note: "Stack tecnológico" },
        { name: "Wappalyzer", mode: "auto", url: "https://www.wappalyzer.com/lookup/{q}/", note: "Tecnologias do site" },
        { name: "VirusTotal", mode: "auto", url: "https://www.virustotal.com/gui/domain/{q}", note: "Reputação multi-engine" },
        { name: "urlscan.io", mode: "auto", url: "https://urlscan.io/search/#{q}", note: "Sandbox de páginas (não acessar diretamente)" },
        { name: "DNSTwist (typosquatting)", mode: "manual", url: "https://dnstwist.it/", note: "Domínios semelhantes (phishing)" },
        { name: "Netcraft Site Report", mode: "auto", url: "https://sitereport.netcraft.com/?url={q}", note: "Hospedagem + reputação" },
      ],
    },
    {
      id: "username",
      label: "Username / Identidade digital",
      section: "§5",
      placeholder: "nomedeusuario",
      sources: [
        { name: "GitHub", mode: "auto", url: "https://github.com/{q}", note: "Perfil direto" },
        { name: "Instagram", mode: "auto", url: "https://www.instagram.com/{q}/", note: "Perfil direto" },
        { name: "X / Twitter", mode: "auto", url: "https://x.com/{q}", note: "Perfil direto" },
        { name: "TikTok", mode: "auto", url: "https://www.tiktok.com/@{q}", note: "Perfil direto" },
        { name: "Reddit", mode: "auto", url: "https://www.reddit.com/user/{q}", note: "Perfil direto" },
        { name: "Telegram", mode: "auto", url: "https://t.me/{q}", note: "Perfil/canal direto (se público)" },
        { name: "Steam (vanity URL)", mode: "auto", url: "https://steamcommunity.com/id/{q}", note: "Perfil direto" },
        { name: "Twitch", mode: "auto", url: "https://www.twitch.tv/{q}", note: "Perfil direto" },
        { name: "NameMC (Minecraft)", mode: "auto", url: "https://namemc.com/search?q={q}", note: "Busca por username" },
        { name: "Discord ID lookup", mode: "manual", url: "https://discord.id/", note: "Requer ID numérico" },
        { name: "WhatsMyName-like check", mode: "manual", url: "https://whatsmyname.app/", note: "Checagem em centenas de plataformas" },
        { name: "Google (busca geral)", mode: "auto", url: "https://www.google.com/search?q=%22{q}%22", note: "Busca aberta pelo username" },
      ],
    },
    {
      id: "image",
      label: "Imagem (URL da imagem)",
      section: "§6",
      placeholder: "https://exemplo.com/foto.jpg",
      sources: [
        { name: "Google Lens / Reverse", mode: "auto", url: "https://lens.google.com/uploadbyurl?url={qraw}", note: "Busca reversa" },
        { name: "Yandex Images", mode: "auto", url: "https://yandex.com/images/search?rpt=imageview&url={qraw}", note: "Melhor para rostos" },
        { name: "TinEye", mode: "auto", url: "https://tineye.com/search?url={qraw}", note: "Correspondência exata" },
        { name: "Bing Visual Search", mode: "auto", url: "https://www.bing.com/images/search?q=imgurl:{qraw}&view=detailv2&iss=sbi", note: "Alternativo" },
        { name: "FotoForensics (ELA)", mode: "manual", url: "https://fotoforensics.com/", note: "Análise forense — requer upload" },
        { name: "Jimpl (EXIF)", mode: "manual", url: "https://jimpl.com/", note: "Metadados — requer upload" },
        { name: "PimEyes", mode: "manual", url: "https://pimeyes.com/", note: "Reconhecimento facial — 🟡 exige autorização legal, ver §6.2/§26 da KB" },
      ],
    },
    {
      id: "vehicle",
      label: "Veículo / Placa",
      section: "§13",
      placeholder: "ABC1D23",
      sources: [
        { name: "Google (busca geral)", mode: "auto", url: "https://www.google.com/search?q=%22{q}%22+placa", note: "Busca aberta pela placa" },
        { name: "Consulta oficial DETRAN (estadual)", mode: "manual", url: "https://www.gov.br/pt-br/servicos/consultar-multas-e-pontuacao-na-cnh", note: "Consulta oficial — varia por UF, requer dados adicionais/CAPTCHA" },
        { name: "Base SINESP Cidadão", mode: "manual", url: "https://www.sinesp.gov.br/sinesp-cidadao", note: "Roubo/furto — app oficial" },
      ],
    },
    {
      id: "crypto",
      label: "Criptoativos (endereço de carteira)",
      section: "§9",
      placeholder: "endereço da carteira (BTC/ETH/...)",
      sources: [
        { name: "Blockchain.com Explorer", mode: "auto", url: "https://www.blockchain.com/explorer/search?search={q}", note: "BTC/ETH — histórico de transações" },
        { name: "Etherscan", mode: "auto", url: "https://etherscan.io/address/{q}", note: "Endereços ETH/ERC-20" },
        { name: "Blockchair", mode: "auto", url: "https://blockchair.com/search?q={q}", note: "Multi-chain" },
        { name: "OXT.me (BTC)", mode: "auto", url: "https://oxt.me/address/{q}", note: "Análise de cluster BTC" },
        { name: "Chainabuse", mode: "auto", url: "https://www.chainabuse.com/address/{q}", note: "Reports de fraude associados" },
      ],
    },
  ],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = OSINT_KB;
}
