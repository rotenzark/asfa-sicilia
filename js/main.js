/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'asfa-sicilia',             // usato per localStorage lang
    whatsapp: {
      number: '',                     // nessun numero WhatsApp confermato: niente wiring
      message: '',
      ids: [],
    },
    /* Finestre in cui in sede C'È QUALCUNO — unione di distribuzione e
       sportello, perché è a questa domanda che risponde lo stato in hero.
       Lunedì:    15:00–18:00 distribuzione + 17:30–19:00 sportello  -> 15–19
       Martedì:   15:00–18:00 distribuzione (diversamente abili)
       Mercoledì: 17:30–19:00 sportello
       Venerdì:   17:30–19:00 sportello
       ⚠️ DA RICONFERMARE CON L'ASSOCIAZIONE: il calendario viene dalla
       locandina del 1/8/2026 e dalle informazioni del gruppo Facebook. */
    hours: {
      0: [],
      1: [['15:00', '19:00']],
      2: [['15:00', '18:00']],
      3: [['17:30', '19:00']],
      4: [],
      5: [['17:30', '19:00']],
      6: [],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1080,             // = il @media del menu in styles.css (28/9/2026: otto voci)
    EN: {},
    /* ⚠️ L'ARABO È UNA TRADUZIONE DA FAR RILEGGERE A UN MADRELINGUA prima
       della pubblicazione. Il sito si rivolge anche a chi l'arabo lo legge
       davvero ("e agli Immigrati" è nel marchio): un errore qui si vede
       subito e costa credibilità. */
    LANGS: {
      en: {
        'skip': 'Skip to content',
        'brand.sub': 'Family Support Association',
        'brand.alt': 'A.S.FA. Sicilia emblem: a mother holding her child, inside the association’s red frame',
        'ftr.logo.alt': 'Full mark of A.S.FA. Sicilia ODV — Palermo',
        'nav.open': 'Open menu', 'nav.main': 'Main navigation', 'lang.group': 'Site language',
        'nav.settimana': 'The week', 'nav.cosa': 'What we bring', 'nav.bene': 'The seized property',
        'nav.sedi': 'Locations', 'nav.5x1000': '5×1000', 'nav.aiutare': 'How to help',
        'nav.notizie': 'News', 'nav.contatti': 'Contact', 'nav.dona': 'Donate',
        'urg.l': 'For urgent matters, call any time on', 'urg.s': 'Urgent, any time:',
        'hero.alt': 'The road climbing to our Monreale premises on distribution day, with the queue of cars and the hills behind',
        'hero.kicker': 'Palermo and Monreale · since 2012',
        'hero.h1a': 'We are here.', 'hero.h1b': 'Every week, in the same place.',
        'hero.p': 'We are a volunteer organisation supporting families in hardship in Palermo and Monreale: <strong>food, clothing, free medical visits and someone who listens</strong>. Our Monreale premises are a villa seized from the mafia.',
        'hero.cta1': 'Give us your 5×1000', 'hero.cta2': 'When to find us',
        'hero.firma': '“Small concrete gestures. Deeds, not words.”<span><a href="#presidente">Cav. Diego Mannisi</a>, president</span>',
        'sett.occhiello': 'The board', 'sett.h2': 'Every day has its own name',
        'sett.sub': 'We do not run one queue for everybody. The week is split, so that someone in a wheelchair does not have to stand behind fifty people. Today is lit up.',
        'd.lun': 'Monday', 'd.lun.chi': 'Able-bodied brothers and sisters',
        'd.lun.nota': 'Roll call of families at 17:00 · the desk stays open until 19:00',
        'd.mar': 'Tuesday', 'd.mar.chi': 'Brothers and sisters with disabilities',
        'd.mar.nota': 'Roll call of families at 17:00',
        'd.mer': 'Wednesday', 'd.mer.chi': 'Listening desk', 'd.mer.nota': 'Information, paperwork, registration',
        'd.gio': 'Thursday', 'd.chiuso': 'Closed',
        'd.ven': 'Friday', 'd.ven.chi': 'Listening desk', 'd.ven.nota': 'Information, paperwork, registration',
        'd.sab': 'Saturday', 'd.chiuso2': 'Closed', 'd.dom': 'Sunday', 'd.chiuso3': 'Closed',
        'sett.news': 'In Palermo, at Via Marinuzzi, distribution takes place on the days we announce: you will find them in the <a href="#notizie">latest news</a>.',
        'portare.h3': 'What to bring the first time',
        'portare.1': 'Photocopy of your ID card, <strong>both sides</strong>',
        'portare.2': 'Photocopy of your health card, <strong>both sides</strong>',
        'portare.3': 'If you cannot come in person you may <strong>send someone</strong>: they bring the written authorisation, a photocopy of your documents and of their own',
        'portare.nota': 'It is only to keep the files up to date. Nothing else.',
        'cq.occhiello': 'The simplest way to help us',
        'cq.h2': 'The 5×1000 costs you nothing. It changes our year.',
        'cq.p1': 'On your tax return, in the box marked <strong>“Support for third-sector bodies registered with RUNTS”</strong>, add your signature and write our tax code. It is not an extra tax: it is a share the State assigns to someone anyway. You can decide it goes to us.',
        'cq.p2': 'In 2025 <strong>1,274 people</strong> wrote this number on their return. It became <strong>€26,727</strong> — the largest single line in our budget.',
        'cq.cflab': 'Tax code', 'cq.copia': 'Copy the code',
        'cq.cfnote': 'A.S.FA. Sicilia ODV · RUNTS register no. 125129',
        'st.occhiello': 'The line on our banner',
        'st.h2': 'We are here, we think about <em>what comes after us</em> with concrete actions.',
        'st.p': '“What comes after us” is the question that keeps a parent of a fragile child awake: <em>who will be there when I am gone?</em> We have no easy answer. We have an address, fixed days and fourteen volunteers who will be there next week too.',
        'cosa.occhiello': 'Four things', 'cosa.h2': 'What we actually bring',
        'cosa.1.h': 'The food parcel',
        'cosa.1.p': 'Pasta, milk, oil, pulses, tuna, tinned meat, rice. Most of it comes from the <strong>Banco delle Opere di Carità of Western Sicily</strong>, which supplies us free of charge, and from collections and donations.',
        'cosa.2.h': 'Clothing and essentials',
        'cosa.2.p': 'We collect and redistribute good-condition second-hand clothing and basic necessities. It is the least talked-about part of our work and one of the most requested.',
        'cosa.3.h': 'Free medical visits',
        'cosa.3.p': 'Cardiology, diabetology, internal medicine, ophthalmology, dermatology, dentistry. With the <strong>Palermo health authority</strong>, within the National Health Equity Programme 2021-2027 against health poverty. For those with a household income indicator up to €10,000.',
        'cosa.4.h': 'The listening desk',
        'cosa.4.p': 'Our banner says “listening desk”. It is not a figure of speech: on Wednesday and Friday someone sits there to understand what you need and how the paperwork is done.',
        'grazie.lab': 'Thank you',
        'grazie.txt': 'Special thanks to the <strong>Banco delle Opere di Carità of Western Sicily</strong> and to its head, <strong>Dr Nelly Palazzo</strong>, for the attention she gives to our associations.',
        'bene.occhiello': 'Via Favara 6, Monreale',
        'bene.h2': 'It was a mobster’s villa. Now it is where the bread is handed out.',
        'bene.sub': 'We do not keep it quiet: it is written on our banner and on a council plaque by the entrance.',
        'tl.1': 'The national agency for seized assets hands the municipality of Monreale two villas formerly belonging to <strong>Giuseppe Caramazza</strong>, on condition they serve social purposes.',
        'tl.2': 'The municipality publishes the <strong>public call</strong> for associations, social cooperatives and volunteer bodies.',
        'tl.3': 'On 30 March the property is <strong>assigned to A.S.FA.</strong> On 8 September the site is blessed by the archbishop of Monreale <strong>Michele Pennisi</strong> and by <strong>Mgr Santo Marcianò</strong>, Military Ordinary for Italy: the bishop who leads the chaplains of the Army, Navy, Air Force, Carabinieri and Guardia di Finanza.',
        'tl.4': 'On 29 February the premises are <strong>named after the lawyer Enzo Fragalà</strong>, killed in Palermo in 2010 after a mafia-related beating. His wife, Professor <strong>Silvana Friscia</strong>, from the family of a Carabiniere who fell in the line of duty, and his daughter, the lawyer <strong>Marzia Fragalà</strong>, attend the ceremony.',
        'tl.5': 'The <strong>refurbishment works</strong> begin, funded by GAL Terre Normanne with European rural development funds: the villa becomes a <strong>cultural and social centre</strong>.',
        'tl.oggi': 'Today',
        'tl.6': 'The cultural and social centre and the tourist information point are <strong>built and active</strong>. The hall named after Fragalà hosts <strong>conferences</strong> and talks on legality. Outside, on Monday and Tuesday, there is the queue.',
        'cam.occhiello': 'On the way',
        'cam.p': 'The villa lies on the route of the <strong>Magna Via Francigena</strong> and the <strong>Itinerarium Rosaliae</strong>, the two pilgrim ways that climb together from Palermo to Monreale. Walkers will also find the tourist information point here.',
        'bene.foto1.alt': 'The plaques at the entrance: the municipality of Monreale declaring the property seized from the mafia, the association’s plaque and the one dedicated to the lawyer Enzo Fragalà',
        'bene.foto1.cap': 'At the entrance: “Property seized from the mafia, part of the municipal estate of Monreale”.',
        'bene.foto2.alt': 'The main room inside the premises, with tables, workstations and a view over the hills of Monreale',
        'bene.foto2.cap': 'The hall dedicated to Enzo Fragalà, where conferences are held.',
        'bene.foto3.alt': 'The GAL Terre Normanne project plaque declaring the cultural and recreational centre built and active',
        'bene.foto3.cap': 'The project plaque: “built and active”.',
        'bene.foto4.alt': 'The front of the premises with the association’s banner, during a ceremony with civil, military and religious authorities',
        'bene.foto4.cap': 'The front, with the banner that says it all: the addresses, the motto and the tax code.',
        'zoom.1': 'Enlarge the photo of the plaques', 'zoom.2': 'Enlarge the photo of the inner hall',
        'zoom.3': 'Enlarge the project plaque', 'zoom.4': 'Enlarge the photo of the building front',
        'zoom.5': 'Enlarge the photo of the wall',
        'sedi.occhiello': 'Two addresses', 'sedi.h2': 'Where to find us',
        'sedi.1.h': 'Monreale — operating premises', 'sedi.1.tag': 'Property seized from the mafia',
        'sedi.1.p': 'This is where distribution happens, on Monday and Tuesday, and where the desk is.',
        'sedi.apri': 'Open in Google Maps', 'sedi.apri2': 'Open in Google Maps',
        'sedi.2.h': 'Palermo — distribution and medical visits', 'sedi.2.tag': 'On announced days',
        'sedi.2.p': 'This is where the Palermo distributions and the medical visit bookings take place, on the days we announce on Facebook. The registered office, under which the association is entered in the RUNTS, is at Via Filippo Corazza 20/B.',
        'mappa.title': 'Map of the Monreale premises, Via Favara 6',
        'dona.occhiello': 'Support us', 'dona.h2': 'What your gift becomes',
        'dona.sub': 'We have no employees: none of us draws a salary. What comes in becomes food, fuel for collections and the running costs of the premises.',
        'tier.10': '<span class="t-eur">€10</span><span class="t-lab">Basic groceries for one family for a week</span>',
        'tier.25': '<span class="t-eur">€25</span><span class="t-lab">One complete food parcel</span>',
        'tier.50': '<span class="t-eur">€50</span><span class="t-lab">Fuel to go and collect the supplies</span>',
        'tier.100': '<span class="t-eur">€100</span><span class="t-lab">A day of premises: power, heating, cleaning</span>',
        'modo.1.h': 'Bank transfer', 'modo.1.p': 'Reference: “Erogazione liberale” (charitable donation). Payable to A.S.FA. Sicilia ODV – Associazione di Sostegno alle Famiglie.',
        'modo.1.copia': 'Copy the IBAN',
        'modo.2.h': '5×1000', 'modo.2.p': 'It costs nothing. Box “Support for third-sector bodies registered with RUNTS”.',
        'modo.3.h': 'Donating goods', 'modo.3.p': 'Non-perishable food and good-condition clothing can be delivered directly to the Monreale premises during opening hours.',
        'modo.4.h': 'Tax relief', 'modo.4.p': 'Donations to volunteer organisations are deductible at 35% or from taxable income, under art. 83 of the Third Sector Code (Legislative Decree 117/2017).',
        'num.occhiello': 'In the open', 'num.h2': 'There are fourteen of us',
        'num.sub': 'We are not a large foundation and we do not like to look like one. These are the real figures, with the year they refer to.',
        'num.1.t': 'Registered volunteers', 'num.1.n': 'declared to RUNTS',
        'num.2.t': 'Employees', 'num.2.n': 'nobody draws a salary',
        'num.3.t': 'Families in Monreale', 'num.3.n': '2026 figure',
        'num.4.t': 'Families in Palermo', 'num.4.n': '2026 figure',
        'serie.h3': 'The 5×1000, year by year',
        'serie.p': 'Amounts assigned by the Italian Revenue Agency. They are public data and anyone can check them.',
        'serie.nota': 'The 2025 jump is all here: from 226 to <strong>1,274 signatures</strong>.',
        'carte.h3': 'Who we are, on paper',
        'carte.1': '<strong>A.S.FA. Sicilia ODV</strong> — Family Support Association. Established on 16 January 2012.',
        'carte.2': 'Entered in the <strong>national register of the third sector</strong>, volunteer organisations section, no. 125129.',
        'carte.3': 'Tax code <strong>97270000827</strong>. No VAT number: we carry out no commercial activity.',
        'carte.4': 'President <strong>Diego Mannisi</strong>, vice-president <strong>Leonardo Spena</strong>. A board of four.',
        'carte.5': 'Affiliated to <strong>ANAS</strong> — National Association for Social Action, “Avv. Enzo Fragalà” branch.',
        'wiki.kicker': 'Who leads the association',
        'wiki.h': 'Diego Mannisi',
        'wiki.sub': 'The president’s biographical profile · updated September 2026',
        'wb.aria': 'Key facts', 'wb.h': 'Diego Mannisi',
        'wb.motto': '“Small concrete gestures. Deeds, not words.”',
        'wb.nascita.t': 'Born', 'wb.nascita': 'Palermo',
        'wb.ruolo.t': 'Role', 'wb.ruolo': 'Founder and president of A.S.FA. Sicilia ODV',
        'wb.attivo.t': 'Active in', 'wb.attivo': 'Palermo since 2012 · Monreale since 2018',
        'wb.altri.t': 'Other roles', 'wb.altri': 'President of ANAS “Zonale Policlinico”, named after the lawyer Enzo Fragalà',
        'wb.onor.t': 'Honours', 'wb.onor': 'Knight of the Order of Merit of the Italian Republic (2000)',
        'wb.fb': 'Diego Mannisi’s profile',
        'wiki.lead': '<strong>Diego Mannisi</strong>, born in Palermo, is the founder and president of <strong>A.S.FA. Sicilia ODV</strong>, the volunteer association that has supported families in hardship and immigrants in Palermo and Monreale since 2012. He is a Knight of the Order of Merit of the Italian Republic.<sup class="ref"><a href="#nota-1">[1]</a></sup>',
        'wiki.s1.h': 'The association',
        'wiki.s1.p1': 'In 2012 he founded in Palermo the Association for the Support of Families and Immigrants, now entered in the national third-sector register as A.S.FA. Sicilia ODV. In 2018, through a public call by the municipality of Monreale, he obtained for the association a villa seized from the mafia, which has been its operating premises ever since.<sup class="ref"><a href="#nota-2">[2]</a></sup>',
        'wiki.s1.p2': 'He leads fourteen volunteers, none of whom draws a salary. With them he runs the food parcel distribution, which today reaches 936 families in Monreale and 920 in Palermo, and the listening desk. He writes every distribution notice himself and signs it “Cav. Diego Mannisi”.',
        'wiki.s2.h': 'Health',
        'wiki.s2.p': 'He hosts staff of the Palermo health authority at the association’s premises for the National Programme for Health Equity: bookings and free medical visits for people with a household income indicator up to €10,000, Italians and foreigners alike. “Helping those in need is in everyone’s interest,” he wrote in September 2026.<sup class="ref"><a href="#nota-3">[3]</a></sup>',
        'wiki.s3.h': 'Legality',
        'wiki.s3.p': 'He chairs the branch of ANAS, the National Association for Social Action, named after the lawyer Enzo Fragalà, a victim of the mafia: a section founded in 2016 in agreement with his family.<sup class="ref"><a href="#nota-4">[4]</a></sup> In 2020 the Monreale premises were named after Fragalà. For fifteen years he and his associations have taken part in the Salvo D’Acquisto Memorial, which brings together legality and sport, and the associations he leads belong to COV Sicilia, the volunteers’ coordination network.<sup class="ref"><a href="#nota-3">[3]</a></sup>',
        'wiki.s4.h': 'Recognition',
        'wiki.r1': 'Knight of the Order of Merit of the Italian Republic, by decree of 27 December 2000.<sup class="ref"><a href="#nota-1">[1]</a></sup>',
        'wiki.r2': 'Award from the City of Palermo to the presidents of volunteer associations, “for his commitment both to immigrant families and to families in hardship in the municipalities of Palermo and Monreale”. Collecting it, he said: “the award recognises the work done by all the volunteers of ASFA, not by one person alone”.<sup class="ref"><a href="#nota-5">[5]</a></sup>',
        'wiki.s5.h': 'Quotes',
        'wiki.q1': '“Small concrete gestures. Deeds, not words.”',
        'wiki.q2': '“Humility, simplicity, patience and tenacity come first. Only for the Common Good.”',
        'wiki.q3': '“United we grow, divided we lose.”',
        'wiki.s6.h': 'Notes',
        'wiki.n1': 'Presidency of the Italian Republic, honours database: “Mannisi Diego”',
        'wiki.n2': 'MonrealeNews, 8 September 2018: the blessing of the seized property',
        'wiki.n3': 'Facebook group “ASFA Palermo e Monreale – Diego Mannisi”, posts of 20 September 2026',
        'wiki.n4': 'ANAS Italia, 4 March 2020: the Enzo Fragalà section and the seized property',
        'wiki.n5': 'ANAS Italia, 25 January 2026: the City of Palermo award',
        'aiut.occhiello': 'Lending a hand', 'aiut.h2': 'Time is needed even more than money',
        'aiut.p1': 'On Monday and Tuesday things have to be unloaded, sorted, names called, forms filled in. There are fourteen of us and more than 1,800 families: two hours of your afternoon genuinely show.',
        'aiut.p2': 'No particular skill is required, and there is no need to commit every week. Just come by the desk or write to us.',
        'aiut.cta': 'Write to us',
        'aiut.foto.alt': 'The wall of the premises with framed photographs, certificates and press cuttings from years of activity',
        'aiut.foto.cap': 'The wall of the premises: twelve years, framed.',
        'not.occhiello': 'News', 'not.h2': 'Notices, as soon as they are out',
        'not.p': 'Distribution dates, medical visit bookings, initiatives: we post them on our Facebook page, and you can see them here as soon as they are out. Posts are in Italian.',
        'not.gruppo': 'Join the group', 'not.pagina': 'Follow the page',
        'not.mini': 'There are more than 900 of us in the group “ASFA Palermo e Monreale – Diego Mannisi”.',
        'fb.t': 'The latest posts from our Facebook page',
        'fb.p': 'To show them here, your browser connects to Facebook, which may use its cookies. We only load them if you agree.',
        'fb.btn': 'Show the posts', 'fb.ricorda': 'Remember my choice on this device',
        'fb.apri': 'Or open them directly on Facebook', 'fb.dimentica': 'Stop loading them automatically',
        'cont.occhiello': 'Talk to us', 'cont.h2': 'You can genuinely reach us',
        'cont.tel': 'Phone', 'cont.tel.n': 'Desk on Monday, Wednesday and Friday, 17:30–19:00',
        'cont.urg': 'Urgent', 'cont.urg.n': 'For urgent matters, any time',
        'cont.mail': 'Email', 'cont.mail.n': 'Address to be confirmed',
        'cont.fb': 'Our group', 'cont.fb.n': 'More than 900 members · this is where we post every distribution notice',
        'cont.pag': 'Our page', 'cont.pag.n': 'The latest news, also here on the site',
        'cont.pec': 'Certified email', 'cont.pec.n': 'For formal communications only',
        'ftr.claim': 'We are here, we think about what comes after us with concrete actions.',
        'ftr.since': 'Palermo and Monreale, since 2012.',
        'ftr.c1': 'The site', 'ftr.l1': 'The week', 'ftr.l2': 'What we bring',
        'ftr.l3': 'The seized property', 'ftr.l4': 'Figures and transparency',
        'ftr.l8': 'The president', 'ftr.l9': 'News',
        'ftr.c2': 'Support us', 'ftr.l5': '5×1000', 'ftr.l6': 'Donations', 'ftr.l7': 'Volunteering',
        'ftr.c3': 'Organisation details',
        'ftr.legal': 'A.S.FA. Sicilia ODV<br>Family Support Association<br>Registered office: Via Filippo Corazza 20/B — 90127 Palermo<br>Operating premises: Via Favara 6 — 90046 Monreale (PA)<br>Palermo premises: Via Antonio Marinuzzi 61 — 90127 Palermo<br>Tax code 97270000827 · RUNTS no. 125129',
        'ftr.cf': 'Give your 5×1000 · Tax code <strong>97270000827</strong>',
        'ab.tel': 'Call', 'ab.orari': 'When', 'ab.dona': '5×1000',
        'lb.aria': 'Enlarged image', 'lb.close': 'Close',
      },
      ar: {
        'skip': 'انتقل إلى المحتوى',
        'brand.sub': 'جمعية دعم الأسر',
        'brand.alt': 'شعار A.S.FA. Sicilia: أمّ تحتضن طفلها داخل الإطار الأحمر للجمعية',
        'ftr.logo.alt': 'الشعار الكامل لجمعية A.S.FA. Sicilia ODV — باليرمو',
        'nav.open': 'افتح القائمة', 'nav.main': 'التنقل الرئيسي', 'lang.group': 'لغة الموقع',
        /* ⚠️ «5×1000» va isolato con dir="ltr": il bidi arabo lo ribalta in
           «1000×5», che è un dato SBAGLIATO. Vale ovunque compaia. */
        'nav.settimana': 'الأسبوع', 'nav.cosa': 'ما نقدّمه', 'nav.bene': 'الملك المصادَر',
        'nav.sedi': 'المقرّات', 'nav.5x1000': '<span dir="ltr">5×1000</span>', 'nav.aiutare': 'كيف تساعد',
        'nav.notizie': 'الأخبار', 'nav.contatti': 'اتصل بنا', 'nav.dona': 'تبرّع الآن',
        'urg.l': 'للأمور العاجلة اتّصلوا بنا في أيّ وقت على الرقم', 'urg.s': 'للطوارئ، في أيّ وقت:',
        'hero.alt': 'الطريق الصاعد إلى مقرّنا في مونريالي في يوم التوزيع، مع صفّ السيارات والتلال في الخلفية',
        'hero.kicker': 'باليرمو ومونريالي · منذ 2012',
        'hero.h1a': 'نحن هنا.', 'hero.h1b': 'كلّ أسبوع، في المكان نفسه.',
        'hero.p': 'نحن منظمة تطوّعية تدعم الأسر المحتاجة في باليرمو ومونريالي: <strong>طعام، ملابس، فحوص طبية مجانية، ومن يُصغي إليك</strong>. مقرّنا في مونريالي فيلا مصادَرة من المافيا.',
        'hero.cta1': 'خصّص لنا <span dir="ltr">5×1000</span>', 'hero.cta2': 'متى تجدنا',
        'hero.firma': '«أفعال صغيرة ملموسة. أفعال لا أقوال.»<span><a href="#presidente">الفارس دييغو مانّيزي</a>، الرئيس</span>',
        'sett.occhiello': 'اللوحة', 'sett.h2': 'لكلّ يوم اسمه',
        'sett.sub': 'لا نُنظّم صفًّا واحدًا للجميع. الأسبوع مقسّم، حتى لا يضطر من هو على كرسيّ متحرّك إلى الانتظار واقفًا خلف خمسين شخصًا. يوم اليوم مُضاء.',
        'd.lun': 'الاثنين', 'd.lun.chi': 'الإخوة الأصحّاء',
        'd.lun.nota': 'نداء أسماء الأسر الساعة 17:00 · يبقى المكتب مفتوحًا حتى 19:00',
        'd.mar': 'الثلاثاء', 'd.mar.chi': 'الإخوة ذوو الإعاقة',
        'd.mar.nota': 'نداء أسماء الأسر الساعة 17:00',
        'd.mer': 'الأربعاء', 'd.mer.chi': 'مكتب الإصغاء', 'd.mer.nota': 'معلومات، معاملات، تسجيل',
        'd.gio': 'الخميس', 'd.chiuso': 'مغلق',
        'd.ven': 'الجمعة', 'd.ven.chi': 'مكتب الإصغاء', 'd.ven.nota': 'معلومات، معاملات، تسجيل',
        'd.sab': 'السبت', 'd.chiuso2': 'مغلق', 'd.dom': 'الأحد', 'd.chiuso3': 'مغلق',
        'sett.news': 'في باليرمو، في شارع مارينوتسي، يجري التوزيع في الأيام التي نُعلن عنها: تجدها في <a href="#notizie">آخر الأخبار</a>.',
        'portare.h3': 'ما تُحضره في المرّة الأولى',
        'portare.1': 'نسخة من بطاقة الهوية، <strong>الوجهان</strong>',
        'portare.2': 'نسخة من البطاقة الصحّية، <strong>الوجهان</strong>',
        'portare.3': 'إذا تعذّر عليك الحضور شخصيًّا يمكنك <strong>توكيل شخص آخر</strong>: يُحضر التوكيل ونسخة من وثائقك ومن وثائقه',
        'portare.nota': 'الغرض تحديث الملفّات فقط. لا شيء غير ذلك.',
        'cq.occhiello': 'أبسط طريقة لمساعدتنا',
        'cq.h2': 'الـ<span dir="ltr">5×1000</span> لا يكلّفك شيئًا. وهو يُغيّر عامنا كلّه.',
        'cq.p1': 'في الإقرار الضريبي، في الخانة المخصّصة لـ<strong>«دعم هيئات القطاع الثالث المسجّلة في RUNTS»</strong>، ضَع توقيعك واكتب رقمنا الضريبي. ليست ضريبة إضافية: إنها حصّة تخصّصها الدولة لجهة ما على أي حال. ويمكنك أن تقرّر أن تكون لنا.',
        'cq.p2': 'في 2025 كتب <strong>1,274 شخصًا</strong> هذا الرقم في إقرارهم. فصار <strong>26,727 يورو</strong> — أكبر بند في ميزانيتنا.',
        'cq.cflab': 'الرقم الضريبي', 'cq.copia': 'انسخ الرقم',
        'cq.cfnote': 'A.S.FA. Sicilia ODV · مسجّلة في RUNTS برقم 125129',
        'st.occhiello': 'العبارة المكتوبة على لافتتنا',
        'st.h2': 'نحن هنا، ونفكّر في <em>ما بعدنا</em> بأفعال ملموسة.',
        'st.p': '«ما بعدنا» هو السؤال الذي يُقلق نوم كلّ والد لديه ابن هشّ: <em>من سيكون هناك حين لا أكون؟</em> ليس لدينا جواب سهل. لدينا عنوان، وأيام ثابتة، وأربعة عشر متطوّعًا سيكونون هنا الأسبوع المقبل أيضًا.',
        'cosa.occhiello': 'أربعة أشياء', 'cosa.h2': 'ما نقدّمه فعلًا',
        'cosa.1.h': 'الطرد الغذائي',
        'cosa.1.p': 'معكرونة، حليب، زيت، بقوليات، تونة، لحم معلّب، أرزّ. معظمه يأتي من <strong>مصرف أعمال الخير لصقلية الغربية</strong> الذي يزوّدنا مجّانًا، ومن الحملات والتبرّعات.',
        'cosa.2.h': 'ملابس وحاجيات أساسية',
        'cosa.2.p': 'نجمع ونوزّع ملابس مستعملة بحالة جيّدة وحاجيات أساسية. هذا أقلّ جوانب عملنا حديثًا عنه، وأكثرها طلبًا.',
        'cosa.3.h': 'فحوص طبّية مجّانية',
        'cosa.3.p': 'أمراض القلب، السكّري، الباطنية، العيون، الجلدية، الأسنان. بالتعاون مع <strong>هيئة الصحّة في باليرمو</strong>، ضمن البرنامج الوطني للإنصاف الصحّي 2021-2027 لمواجهة الفقر الصحّي. لمن لا يتجاوز مؤشّر دخله 10,000 يورو.',
        'cosa.4.h': 'مكتب الإصغاء',
        'cosa.4.p': 'على لافتتنا مكتوب «مكتب إصغاء». وليست عبارة مجازية: يوم الأربعاء والجمعة يجلس هناك من يفهم ما تحتاج إليه وكيف تُنجَز المعاملة.',
        'grazie.lab': 'شكرًا',
        'grazie.txt': 'شكر خاص لـ<strong>مصرف أعمال الخير لصقلية الغربية</strong> ولمسؤولته <strong>الدكتورة نيلي بالاتسو</strong>، على اهتمامها بجمعياتنا.',
        'bene.occhiello': 'شارع فافارا 6، مونريالي',
        'bene.h2': 'كانت فيلا رجل مافيا. واليوم فيها يُوزَّع الخبز.',
        'bene.sub': 'لا نُخفي ذلك: مكتوب على لافتتنا وعلى لوحة للبلدية عند المدخل.',
        'tl.1': 'الوكالة الوطنية للأملاك المصادَرة تُسلّم بلدية مونريالي فيلّتين كانتا لـ<strong>جوزيبّي كاراماتزا</strong>، بشرط تخصيصهما لأغراض اجتماعية.',
        'tl.2': 'البلدية تنشر <strong>الإعلان العام</strong> الموجّه إلى الجمعيات والتعاونيات الاجتماعية وهيئات التطوّع.',
        'tl.3': 'في 30 مارس يُخصَّص الملك <strong>لجمعية <span dir="ltr">A.S.FA.</span></strong> وفي 8 سبتمبر يُبارك الموقعَ رئيسُ أساقفة مونريالي <strong>ميكيلي بينّيزي</strong> والمطران <strong>سانتو مارتشانو</strong>، الأسقف العسكري لإيطاليا: وهو الأسقف الذي يرعى الكهنة العسكريين في الجيش والبحرية والقوات الجوية والكارابينييري والحرس المالي.',
        'tl.4': 'في 29 فبراير يُسمّى المقرّ <strong>باسم المحامي إنتزو فراغالا</strong>، الذي قُتل في باليرمو عام 2010 إثر اعتداء ذي طابع مافيوي. حضرت المراسم زوجته الأستاذة <strong>سيلفانا فريشا</strong>، من عائلة أحد شهداء الواجب في سلاح الكارابينييري، وابنته المحامية <strong>مارتسيا فراغالا</strong>.',
        'tl.5': 'تبدأ <strong>أعمال إعادة التأهيل</strong> بتمويل من GAL Terre Normanne عبر صناديق أوروبية للتنمية الريفية: وتصبح الفيلا <strong>مركزًا ثقافيًا واجتماعيًا</strong>.',
        'tl.oggi': 'اليوم',
        'tl.6': 'المركز الثقافي والاجتماعي ونقطة المعلومات السياحية <strong>مُنجزان وفاعلان</strong>. في القاعة التي تحمل اسم فراغالا تُعقد <strong>المؤتمرات</strong> ويُناقَش موضوع الشرعية. وفي الخارج، يومَي الاثنين والثلاثاء، يقف الصفّ.',
        'cam.occhiello': 'على الطريق',
        'cam.p': 'تقع الفيلا على مسار <strong>Magna Via Francigena</strong> و<strong>Itinerarium Rosaliae</strong>، طريقَي الحجّاج اللذين يصعدان معًا من باليرمو إلى مونريالي. ويجد السائرون عليهما هنا أيضًا نقطة المعلومات السياحية.',
        'bene.foto1.alt': 'اللوحات عند المدخل: لوحة بلدية مونريالي التي تُعلن أنّ الملك مصادَر من المافيا، ولوحة الجمعية، واللوحة المهداة إلى المحامي إنتزو فراغالا',
        'bene.foto1.cap': 'عند المدخل: «ملك مصادَر من المافيا، ضمن أملاك بلدية مونريالي».',
        'bene.foto2.alt': 'القاعة الداخلية للمقرّ، بطاولاتها ومحطّات العمل وإطلالتها على تلال مونريالي',
        'bene.foto2.cap': 'القاعة المهداة إلى إنتزو فراغالا، حيث تُعقد المؤتمرات.',
        'bene.foto3.alt': 'لوحة مشروع GAL Terre Normanne التي تُعلن أنّ المركز الثقافي والترفيهي مُنجز وفاعل',
        'bene.foto3.cap': 'لوحة المشروع: «مُنجزان وفاعلان».',
        'bene.foto4.alt': 'واجهة المقرّ مع لافتة الجمعية، خلال مراسم بحضور سلطات مدنية وعسكرية ودينية',
        'bene.foto4.cap': 'الواجهة، وعليها اللافتة التي تقول كلّ شيء: العناوين والشعار والرقم الضريبي.',
        'zoom.1': 'تكبير صورة اللوحات', 'zoom.2': 'تكبير صورة القاعة الداخلية',
        'zoom.3': 'تكبير لوحة المشروع', 'zoom.4': 'تكبير صورة الواجهة',
        'zoom.5': 'تكبير صورة الجدار',
        'sedi.occhiello': 'عنوانان', 'sedi.h2': 'أين تجدنا',
        'sedi.1.h': 'مونريالي — المقرّ التشغيلي', 'sedi.1.tag': 'ملك مصادَر من المافيا',
        'sedi.1.p': 'هنا يجري التوزيع يومَي الاثنين والثلاثاء، وهنا مكتب الإصغاء.',
        'sedi.apri': 'افتح في خرائط جوجل', 'sedi.apri2': 'افتح في خرائط جوجل',
        'sedi.2.h': 'باليرمو — التوزيع والفحوص الطبية', 'sedi.2.tag': 'في الأيام المُعلنة',
        'sedi.2.p': 'هنا يجري التوزيع في باليرمو وحجز الفحوص الطبية، في الأيام التي نُعلن عنها على فيسبوك. أمّا المقرّ القانوني، المسجّلة به الجمعية في RUNTS، ففي شارع فيليبّو كورادزا <span dir="ltr">20/B</span>.',
        'mappa.title': 'خريطة مقرّ مونريالي، شارع فافارا 6',
        'dona.occhiello': 'ادعمنا', 'dona.h2': 'إلى ماذا يتحوّل ما تُعطيه',
        'dona.sub': 'ليس لدينا موظّفون: لا أحد منّا يتقاضى راتبًا. ما يصلنا يتحوّل إلى طعام، ووقود لجمع المؤن، ومصاريف تشغيل المقرّ.',
        'tier.10': '<span class="t-eur">10 €</span><span class="t-lab">مؤن أساسية لأسرة واحدة لمدّة أسبوع</span>',
        'tier.25': '<span class="t-eur">25 €</span><span class="t-lab">طرد غذائي كامل</span>',
        'tier.50': '<span class="t-eur">50 €</span><span class="t-lab">وقود الذهاب لجمع المؤن</span>',
        'tier.100': '<span class="t-eur">100 €</span><span class="t-lab">يوم تشغيل للمقرّ: كهرباء، تدفئة، نظافة</span>',
        'modo.1.h': 'حوالة مصرفية', 'modo.1.p': 'البيان: «<span dir="ltr">Erogazione liberale</span>» (تبرّع خيري). باسم <span dir="ltr">A.S.FA. Sicilia ODV – Associazione di Sostegno alle Famiglie</span>.',
        'modo.1.copia': 'انسخ رقم IBAN',
        'modo.2.h': '<span dir="ltr">5×1000</span>', 'modo.2.p': 'لا يكلّف شيئًا. الخانة: «دعم هيئات القطاع الثالث المسجّلة في RUNTS».',
        'modo.3.h': 'التبرّع بالمواد', 'modo.3.p': 'المواد الغذائية غير القابلة للتلف والملابس بحالة جيّدة تُسلَّم مباشرة في مقرّ مونريالي خلال ساعات العمل.',
        'modo.4.h': 'المزايا الضريبية', 'modo.4.p': 'التبرّعات لمنظّمات التطوّع قابلة للخصم بنسبة 35% أو للاقتطاع من الدخل، وفق المادة 83 من قانون القطاع الثالث (المرسوم التشريعي 117/2017).',
        'num.occhiello': 'بشفافية', 'num.h2': 'نحن أربعة عشر',
        'num.sub': 'لسنا مؤسّسة كبيرة ولا يعجبنا أن نبدو كذلك. هذه أرقامنا الحقيقية، مع السنة التي تعود إليها.',
        'num.1.t': 'المتطوّعون المسجّلون', 'num.1.n': 'وفق ما أُعلن لـ RUNTS',
        'num.2.t': 'الموظّفون', 'num.2.n': 'لا أحد يتقاضى راتبًا',
        'num.3.t': 'الأسر في مونريالي', 'num.3.n': 'رقم 2026',
        'num.4.t': 'الأسر في باليرمو', 'num.4.n': 'رقم 2026',
        'serie.h3': 'الـ<span dir="ltr">5×1000</span>، سنةً بسنة',
        'serie.p': 'مبالغ خصّصتها مصلحة الضرائب الإيطالية. بيانات علنية يمكن لأيّ شخص التحقّق منها.',
        'serie.nota': 'قفزة 2025 كلّها هنا: من 226 إلى <strong>1,274 توقيعًا</strong>.',
        'carte.h3': 'من نحن، على الورق',
        'carte.1': '<strong>A.S.FA. Sicilia ODV</strong> — جمعية دعم الأسر. تأسّست في 16 يناير 2012.',
        'carte.2': 'مسجّلة في <strong>السجلّ الوطني للقطاع الثالث</strong>، قسم منظّمات التطوّع، برقم 125129.',
        'carte.3': 'الرقم الضريبي <strong>97270000827</strong>. لا رقم ضريبة قيمة مضافة: لا نمارس أيّ نشاط تجاري.',
        'carte.4': 'الرئيس <strong>دييغو مانّيزي</strong>، نائب الرئيس <strong>ليوناردو سبينا</strong>. مجلس من أربعة أعضاء.',
        'carte.5': 'منتسبة إلى <strong>ANAS</strong> — الجمعية الوطنية للعمل الاجتماعي، فرع «المحامي إنتزو فراغالا».',
        'wiki.kicker': 'من يقود الجمعية',
        'wiki.h': 'دييغو مانّيزي',
        'wiki.sub': 'نبذة عن سيرة الرئيس · مُحدَّثة في سبتمبر 2026',
        'wb.aria': 'معلومات موجزة', 'wb.h': 'دييغو مانّيزي',
        'wb.motto': '«أفعال صغيرة ملموسة. أفعال لا أقوال.»',
        'wb.nascita.t': 'مكان الولادة', 'wb.nascita': 'باليرمو',
        /* ⚠️ i nomi latini col punto («A.S.FA.», «Cav.») vanno isolati con
           dir="ltr": a fine riga il bidi arabo stacca il punto e scrive
           «.A.S.FA» (visto a schermo il 28/9/2026). */
        'wb.ruolo.t': 'الدور', 'wb.ruolo': 'مؤسّس جمعية <span dir="ltr">A.S.FA. Sicilia ODV</span> ورئيسها',
        'wb.attivo.t': 'النشاط', 'wb.attivo': 'باليرمو منذ 2012 · مونريالي منذ 2018',
        'wb.altri.t': 'مهامّ أخرى', 'wb.altri': 'رئيس فرع ANAS «Zonale Policlinico» الذي يحمل اسم المحامي إنتزو فراغالا',
        'wb.onor.t': 'الأوسمة', 'wb.onor': 'فارس في وسام الاستحقاق للجمهورية الإيطالية (2000)',
        'wb.fb': 'حساب دييغو مانّيزي',
        'wiki.lead': '<strong>دييغو مانّيزي</strong>، المولود في باليرمو، هو مؤسّس جمعية <strong><span dir="ltr">A.S.FA. Sicilia ODV</span></strong> ورئيسها، وهي جمعية تطوّعية تدعم منذ 2012 الأسر المحتاجة والمهاجرين في باليرمو ومونريالي. وهو فارس في وسام الاستحقاق للجمهورية الإيطالية.<sup class="ref"><a href="#nota-1">[1]</a></sup>',
        'wiki.s1.h': 'الجمعية',
        'wiki.s1.p1': 'في 2012 أسّس في باليرمو جمعية دعم الأسر والمهاجرين، المسجّلة اليوم في السجلّ الوطني للقطاع الثالث باسم <span dir="ltr">A.S.FA. Sicilia ODV</span>. وفي 2018، عبر إعلان عام من بلدية مونريالي، حصل للجمعية على فيلا مصادَرة من المافيا صارت منذ ذلك الحين مقرّها التشغيلي.<sup class="ref"><a href="#nota-2">[2]</a></sup>',
        'wiki.s1.p2': 'يقود أربعة عشر متطوّعًا لا يتقاضى أيٌّ منهم راتبًا. ومعهم يُنظّم توزيع الطرود الغذائية، الذي يصل اليوم إلى 936 أسرة في مونريالي و920 في باليرمو، ومكتبَ الإصغاء. ويكتب بنفسه إعلان كلّ توزيع ويوقّعه «<span dir="ltr">Cav. Diego Mannisi</span>».',
        'wiki.s2.h': 'الصحّة',
        'wiki.s2.p': 'يستضيف في مقرّات الجمعية موظّفي هيئة الصحّة في باليرمو ضمن البرنامج الوطني للإنصاف في الصحّة: حجوزات وفحوص طبية مجانية لمن لا يتجاوز مؤشّر دخله 10,000 يورو، من الإيطاليين والأجانب. وكتب في سبتمبر 2026: «مساعدة المحتاجين مصلحة للجميع».<sup class="ref"><a href="#nota-3">[3]</a></sup>',
        'wiki.s3.h': 'الشرعية',
        'wiki.s3.p': 'يرأس فرع ANAS، الجمعية الوطنية للعمل الاجتماعي، الذي يحمل اسم المحامي إنتزو فراغالا ضحية المافيا، وهو فرع تأسّس عام 2016 بالاتفاق مع عائلته.<sup class="ref"><a href="#nota-4">[4]</a></sup> وفي 2020 سُمّي مقرّ مونريالي باسم فراغالا. ومنذ خمسة عشر عامًا يشارك مع جمعياته في «ذكرى سالفو داكويستو» التي تجمع بين الشرعية والرياضة، والجمعيات التي يقودها أعضاء في COV Sicilia، شبكة تنسيق المتطوّعين.<sup class="ref"><a href="#nota-3">[3]</a></sup>',
        'wiki.s4.h': 'التكريمات',
        'wiki.r1': 'فارس في وسام الاستحقاق للجمهورية الإيطالية، بمرسوم مؤرّخ في 27 ديسمبر 2000.<sup class="ref"><a href="#nota-1">[1]</a></sup>',
        'wiki.r2': 'جائزة بلدية باليرمو لرؤساء جمعيات التطوّع، «تقديرًا لالتزامه تجاه الأسر المهاجرة والأسر المحتاجة في بلديتَي باليرمو ومونريالي». وقال عند تسلّمها: «الجائزة اعتراف بعمل جميع متطوّعي ASFA، لا بعمل شخص واحد».<sup class="ref"><a href="#nota-5">[5]</a></sup>',
        'wiki.s5.h': 'أقوال',
        'wiki.q1': '«أفعال صغيرة ملموسة. أفعال لا أقوال.»',
        'wiki.q2': '«التواضع والبساطة والصبر والعزيمة أولًا. من أجل الخير العام وحده.»',
        'wiki.q3': '«متّحدين ننمو، ومتفرّقين نخسر.»',
        'wiki.s6.h': 'المراجع',
        'wiki.n1': 'رئاسة الجمهورية، قاعدة بيانات الأوسمة: «Mannisi Diego»',
        'wiki.n2': 'MonrealeNews، 8 سبتمبر 2018: مباركة الملك المصادَر',
        'wiki.n3': 'مجموعة فيسبوك «ASFA Palermo e Monreale – Diego Mannisi»، منشورات 20 سبتمبر 2026',
        'wiki.n4': 'ANAS Italia، 4 مارس 2020: فرع إنتزو فراغالا والملك المصادَر',
        'wiki.n5': 'ANAS Italia، 25 يناير 2026: جائزة بلدية باليرمو',
        'aiut.occhiello': 'مدّ يد العون', 'aiut.h2': 'الوقت مطلوب أكثر من المال',
        'aiut.p1': 'يومَي الاثنين والثلاثاء يجب التفريغ والفرز ونداء الأسماء وتعبئة الاستمارات. نحن أربعة عشر والأسر أكثر من 1,800: ساعتان من بعد ظهرك يظهر أثرهما حقًّا.',
        'aiut.p2': 'لا تُشترط أيّ مهارة خاصّة، ولا يلزم الالتزام كلّ أسبوع. يكفي أن تمرّ على المكتب أو أن تكتب إلينا.',
        'aiut.cta': 'اكتب إلينا',
        'aiut.foto.alt': 'جدار المقرّ بالصور المؤطّرة والشهادات وقصاصات الصحف من سنوات النشاط',
        'aiut.foto.cap': 'جدار المقرّ: اثنتا عشرة سنة، في إطارات.',
        'not.occhiello': 'الأخبار', 'not.h2': 'الإعلانات، فور صدورها',
        'not.p': 'مواعيد التوزيع، وحجوزات الفحوص الطبية، والمبادرات: ننشرها على صفحتنا في فيسبوك، وتراها هنا فور صدورها. المنشورات باللغة الإيطالية.',
        'not.gruppo': 'انضمّ إلى المجموعة', 'not.pagina': 'تابع الصفحة',
        'not.mini': 'نحن أكثر من 900 في مجموعة «ASFA Palermo e Monreale – Diego Mannisi».',
        'fb.t': 'أحدث منشورات صفحتنا على فيسبوك',
        'fb.p': 'لعرضها هنا يتّصل متصفّحك بفيسبوك، الذي قد يستخدم ملفّات تعريف الارتباط الخاصة به. لا نحمّلها إلا بموافقتك.',
        'fb.btn': 'اعرض المنشورات', 'fb.ricorda': 'تذكّر اختياري على هذا الجهاز',
        'fb.apri': 'أو افتحها مباشرة على فيسبوك', 'fb.dimentica': 'أوقف التحميل التلقائي',
        'cont.occhiello': 'كلّمنا', 'cont.h2': 'يمكن الوصول إلينا فعلًا',
        'cont.tel': 'الهاتف', 'cont.tel.n': 'المكتب أيام الاثنين والأربعاء والجمعة، 17:30–19:00',
        'cont.urg': 'للطوارئ', 'cont.urg.n': 'للأمور العاجلة، في أيّ وقت',
        'cont.mail': 'البريد الإلكتروني', 'cont.mail.n': 'عنوان بانتظار التأكيد',
        'cont.fb': 'مجموعتنا', 'cont.fb.n': 'أكثر من 900 عضو · هنا ننشر كلّ إعلانات التوزيع',
        'cont.pag': 'صفحتنا', 'cont.pag.n': 'آخر الأخبار، هنا في الموقع أيضًا',
        'cont.pec': 'البريد المعتمد', 'cont.pec.n': 'للمراسلات الرسمية فقط',
        'ftr.claim': 'نحن هنا، ونفكّر في ما بعدنا بأفعال ملموسة.',
        'ftr.since': 'باليرمو ومونريالي، منذ 2012.',
        'ftr.c1': 'الموقع', 'ftr.l1': 'الأسبوع', 'ftr.l2': 'ما نقدّمه',
        'ftr.l3': 'الملك المصادَر', 'ftr.l4': 'الأرقام والشفافية',
        'ftr.l8': 'الرئيس', 'ftr.l9': 'الأخبار',
        'ftr.c2': 'ادعمنا', 'ftr.l5': '<span dir="ltr">5×1000</span>', 'ftr.l6': 'التبرّعات', 'ftr.l7': 'التطوّع معنا',
        'ftr.c3': 'بيانات الجمعية',
        'ftr.legal': 'A.S.FA. Sicilia ODV<br>جمعية دعم الأسر<br>المقرّ القانوني: شارع فيليبّو كورادزا <span dir="ltr">20/B</span> — 90127 باليرمو<br>المقرّ التشغيلي: شارع فافارا 6 — 90046 مونريالي<br>مقرّ باليرمو: شارع أنطونيو مارينوتسي 61 — 90127 باليرمو<br>الرقم الضريبي 97270000827 · RUNTS رقم 125129',
        'ftr.cf': 'خصّص الـ<span dir="ltr">5×1000</span> · الرقم الضريبي <strong>97270000827</strong>',
        'ab.tel': 'اتّصل', 'ab.orari': 'متى', 'ab.dona': '<span dir="ltr">5×1000</span>',
        'lb.aria': 'صورة مكبّرة', 'lb.close': 'إغلاق',
      },
    },
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: {
      ar: {
        open: 'مفتوح الآن', closesAt: 'يُغلق الساعة ', opensToday: 'مغلق · يفتح اليوم الساعة ',
        opensOn: 'مغلق · يفتح يوم {day} الساعة ', closed: 'مغلق',
        days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      },
    },
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ---------- anno nel footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- copia del codice fiscale ----------
     È il gesto più importante della pagina: il 5×1000 è la voce più
     grande del bilancio dell'associazione. Fallback su execCommand per
     i browser senza clipboard API o serviti su http. */
  /* 28/9/2026: lo stesso gesto serve anche all'IBAN del bonifico, quindi il
     codice di copia è uno solo per tutti e due i bottoni. */
  var copiaSulClic = function (btn, leggi) {
    btn.addEventListener('click', function () {
      var code = leggi();
      var done = function () {
        var before = btn.textContent;
        btn.classList.add('is-done');
        btn.textContent = root.lang === 'ar' ? 'تمّ النسخ ✓'
                        : root.lang === 'en' ? 'Copied ✓' : 'Copiato ✓';
        setTimeout(function () {
          btn.classList.remove('is-done');
          btn.textContent = before;
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, function () {});
        return;
      }
      try {
        var ta = document.createElement('textarea');
        ta.value = code; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      } catch (e) {}
    });
  };
  var cfCopy = document.getElementById('cfCopy');
  var cfNum = document.getElementById('cfNum');
  if (cfCopy && cfNum) copiaSulClic(cfCopy, function () { return cfNum.textContent.trim(); });
  /* l'IBAN si copia nella forma compatta (data-iban): a video è a gruppi di 4 */
  var ibanCopy = document.getElementById('ibanCopy');
  var ibanNum = document.getElementById('ibanNum');
  if (ibanCopy && ibanNum) copiaSulClic(ibanCopy, function () { return ibanNum.getAttribute('data-iban'); });

  /* ---------- GESTO-FIRMA: il tabellone che si accende ----------
     I giorni entrano uno dopo l'altro come le righe di un tabellone, e
     il giorno di oggi (marcato .is-today dal motore orari del plumbing)
     resta acceso. Registrato SUBITO allo script load, mai dentro l'intro
     né dentro setTimeout: è la race che ha rotto APF il 16/7. */
  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    var days = document.querySelectorAll('.board .day');
    if (days.length) {
      gsap.fromTo(days,
        { opacity: 0, x: -18 },
        {
          opacity: 1, x: 0, duration: .5, ease: 'power2.out', stagger: .07,
          immediateRender: false,
          scrollTrigger: { trigger: '.board', start: 'top 82%', once: true },
        });
    }

    /* le barre del 5×1000 crescono da terra */
    var bars = document.querySelectorAll('.bars .b-bar');
    if (bars.length) {
      gsap.fromTo(bars,
        { scaleY: 0, transformOrigin: 'bottom center' },
        {
          scaleY: 1, duration: .7, ease: 'power2.out', stagger: .06,
          immediateRender: false,
          scrollTrigger: { trigger: '.bars', start: 'top 86%', once: true },
        });
    }
  }

  /* ---------- NOTIZIE: la Pagina Facebook, solo col consenso ----------
     Il riquadro ufficiale (Page Plugin) è un iframe di facebook.com: manda a
     Facebook la visita e può scrivere cookie, quindi parte SOLO dopo il clic
     (Garante privacy, linee guida cookie del 10/6/2021). «Ricorda la mia
     scelta» salva il sì in localStorage; «Non caricarli più» lo toglie. */
  var fbBox = document.getElementById('fbBox');
  var fbConsent = document.getElementById('fbConsent');
  if (fbBox && fbConsent) {
    var FB_KEY = SITE.slug + '-fb';
    var fbLoad = document.getElementById('fbLoad');
    var fbRemember = document.getElementById('fbRemember');
    var fbForget = document.getElementById('fbForget');
    var FB_LOCALE = { it: 'it_IT', en: 'en_GB', ar: 'ar_AR' };
    var FB_TITLE = {
      it: 'Gli ultimi post della pagina Facebook di A.S.FA.',
      en: 'The latest posts from the A.S.FA. Facebook page',
      ar: 'أحدث منشورات صفحتنا على فيسبوك',
    };
    var fbRicordato = function () {
      try { return localStorage.getItem(FB_KEY) === 'si'; } catch (e) { return false; }
    };
    var fbSrc = function (w, h) {
      return 'https://www.facebook.com/plugins/page.php?href=' +
        encodeURIComponent(fbBox.getAttribute('data-page')) +
        '&tabs=timeline&width=' + w + '&height=' + h +
        '&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false' +
        '&locale=' + (FB_LOCALE[root.lang] || 'it_IT');
    };
    var mostraFb = function () {
      if (fbBox.querySelector('iframe')) return;
      /* il plugin non si adatta da solo: la larghezza si misura qui, dentro
         i suoi limiti (da 180 a 500 px) */
      var w = Math.max(180, Math.min(500, Math.floor(fbBox.clientWidth)));
      var h = 640;
      var fr = document.createElement('iframe');
      fr.className = 'fb-frame';
      fr.src = fbSrc(w, h);
      fr.width = String(w);
      fr.height = String(h);
      fr.title = FB_TITLE[root.lang] || FB_TITLE.it;
      fr.setAttribute('loading', 'eager');
      fr.setAttribute('allow', 'encrypted-media');
      fbConsent.hidden = true;
      fbBox.insertBefore(fr, fbConsent);
      if (fbForget) fbForget.hidden = !fbRicordato();
    };
    if (fbLoad) {
      fbLoad.addEventListener('click', function () {
        if (fbRemember && fbRemember.checked) {
          try { localStorage.setItem(FB_KEY, 'si'); } catch (e) {}
        }
        mostraFb();
      });
    }
    if (fbForget) {
      fbForget.addEventListener('click', function () {
        try { localStorage.removeItem(FB_KEY); } catch (e) {}
        var fr = fbBox.querySelector('iframe');
        if (fr) fr.remove();
        fbForget.hidden = true;
        fbConsent.hidden = false;
        if (fbRemember) fbRemember.checked = false;
        if (fbLoad) fbLoad.focus();
      });
    }
    /* cambio lingua a riquadro aperto: Facebook ridisegna i suoi testi nella
       lingua nuova (i post restano quelli, in italiano) */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        var fr = fbBox.querySelector('iframe');
        if (!fr) return;
        fr.src = fr.src.replace(/locale=[A-Za-z_]+/, 'locale=' + (FB_LOCALE[root.lang] || 'it_IT'));
        fr.title = FB_TITLE[root.lang] || FB_TITLE.it;
      });
    });
    if (fbRicordato()) mostraFb();
  }

  /* ---------- entrata dell'hero (hook chiamato a fine intro) ---------- */
  window.bespokeHeroEntrance = function () {
    if (!window.gsap || reducedMotion) return;
    gsap.from('.hero .kicker, .hero-h1 .hh-1, .hero-h1 .hh-2, .hero-p, .hero-cta, .hero-firma', {
      opacity: 0, y: 22, duration: .7, ease: 'power2.out', stagger: .09,
    });
  };
})();
