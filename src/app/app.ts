import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AP Latin Homepage');
  private examDate = new Date('2026-05-04T08:00:00');
  private now = signal(new Date());

  // tick every second
  private _intervalId = setInterval(() => this.now.set(new Date()), 1000);

  // derived values
  monthsLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    const nowDate = this.now();
    let months = (this.examDate.getFullYear() - nowDate.getFullYear()) * 12 + (this.examDate.getMonth() - nowDate.getMonth());
    // adjust if current day is past the exam day-of-month
    const dayAdjust = this.examDate.getDate() < nowDate.getDate() ? 1 : 0;
    months = Math.max(0, months - dayAdjust);
    return months;
  });

  weeksLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  });

  daysLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  });

  hoursLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    return Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  });

  minutesLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    return Math.floor((diffMs / (1000 * 60)) % 60);
  });

  secondsLeft = computed(() => {
    const diffMs = this.examDate.getTime() - this.now().getTime();
    if (diffMs <= 0) return 0;
    return Math.floor((diffMs / 1000) % 60);
  });

  isUrgent = computed(() => this.daysLeft() <= 7);

  constructor() {
    effect(() => {
      // noop to subscribe to signals to keep them hot
      void this.now();
    });
  }

  ngOnDestroy() {
    clearInterval(this._intervalId);
  }

  onSearch(event: Event, rawQuery: string) {
    event.preventDefault();
    const query = (rawQuery || '').trim().toLowerCase();
    if (!query) return;

    const idCandidates = [
      { id: 'hero', terms: ['home', 'intro', 'ap latin', 'hero'] },
      { id: 'course-overview', terms: ['course overview', 'overview', 'prose', 'poetry', 'grammar'] },
      { id: 'curriculum', terms: ['curriculum', 'pliny', 'letters', 'aeneid', 'virgil', 'book'] },
      { id: 'skills', terms: ['skills', 'cheatsheet', 'word list', 'dictionary', 'scansion', 'culture', 'history'] },
      { id: 'countdown', terms: ['countdown', 'exam', 'timer', 'may 4'] },
      { id: 'resources', terms: ['resources', 'textbooks', 'commentaries', 'online tools', 'practice tests'] }
    ];

    // Try to match by keywords
    for (const section of idCandidates) {
      if (section.terms.some(t => query.includes(t))) {
        const el = document.getElementById(section.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
    }

    // Try to find text match on the page for more granular queries
    const allTextNodesSelector = 'h1,h2,h3,h4,h5,h6,p,li,div,span';
    const nodes = Array.from(document.querySelectorAll(allTextNodesSelector));
    const match = nodes.find(n => (n.textContent || '').toLowerCase().includes(query));
    if (match) {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Fallback: open Google search in a new tab
    const url = `https://www.google.com/search?q=${encodeURIComponent('AP Latin ' + query)}`;
    window.open(url, '_blank');
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Image popup functionality
  showImagePopup = false;
  popupImageSrc = '';
  popupImageAlt = '';
  popupImageDescription = '';

  // Page navigation
  currentPage = 'home';

  openImagePopup(imageSrc: string, description: string) {
    this.popupImageSrc = imageSrc;
    this.popupImageAlt = 'Artwork';
    this.popupImageDescription = description;
    this.showImagePopup = true;
  }

  closeImagePopup() {
    this.showImagePopup = false;
  }

  // Navigation methods
  navigateToProse() {
    this.currentPage = 'prose';
  }

  navigateToPoetry() {
    this.currentPage = 'poetry';
  }

  navigateToGrammar() {
    this.currentPage = 'grammar';
  }


  navigateToWordList() {
    this.currentPage = 'wordlist';
  }

  navigateToDictionary() {
    window.open('https://latin-words.com/', '_blank');
  }

  navigateToScansion() {
    this.currentPage = 'scansion';
  }

  navigateToCulture() {
    this.currentPage = 'culture';
  }

  navigateToOnlineTools() {
    this.currentPage = 'online-tools';
  }

  navigateToPracticeTests() {
    this.currentPage = 'practice-tests';
  }

  goBack() {
    this.currentPage = 'home';
  }

  navigateToPliny() {
    this.currentPage = 'pliny-detail';
  }

  navigateToOthers() {
    this.currentPage = 'others-detail';
  }

  navigateToAeneid() {
    this.currentPage = 'aeneid-detail';
  }

  navigateToHexameter() {
    window.open('https://hexameter.co/', '_blank');
  }

  // Word List functionality
  selectedFilter = 'all';

  // Raw vocabulary text data - each line contains: latin word, part of speech, definition, section
  vocabularyText = `a, ab, abs	preposition	(with abl.) from, away from, out of, by	1.1
abeo, -ire, -ii, -itum	verb	to go from, go away, go off, go forth, go, depart	1.1
absum, abesse, afui	verb	to be away from, be absent	5.3
accedo (adc-), -ere, -cessi, -cessum	verb	to go to, come to, come near, draw near, approach, enter	2.1
accendo (adc-), -ere, -cendi, -censum	verb	to kindle, set on fire, inflame	3.6
accido, -ere, -cidi	verb	to fall upon, fall to, reach by falling, happen	3.1
accipio (adc-), -ere, -cepi, -ceptum	verb	to take without effort, receive, get, accept, hear	1.3
accuso, -are, -avi, -atum	verb	to accuse, blame, find fault; reprimand; charge (w/ a crime)	3.6
acer, acris, acre	adjective	sharp, bitter, pointed, piercing, shrill; keen; severe	1.1
acies, -ei (f.)	noun	sharp edge, point; front of an army, battle line; army	5.3
ad	preposition	(with acc.) to, toward	1.1
addo, -ere, -didi, -ditum	verb	to put to, place upon, lay on, join, attach	1.4
adeo, -ire, -ii, -itum	verb	to go to, come to, come up to, approach, draw near	1.2
adhuc	adverb	until now, heretofore, as yet, still, to this point, to this place	1.3
adsum (assum), adesse, adfui	verb	to be at, be present, be at hand	2.4
adsurgo (ass-), -ere, -surrexi, -surrectum	verb	to rise up, rise, stand up	1.4
adversus, -a, -um	adjective	turned to, turned against, opposite, before, in front of; unfavorable	1.1
adversus, adversum	preposition/adverb	(with acc.) opposite to, against; toward, against, before	1.1
aedificium, -i (n.)	noun	building; structure	3.6
aedifico, -are, -avi, -atum	verb	to build, construct, make; create; establish; improve	3.6
aeger, -gra, -grum	adjective	sick, ill, injured; painful; corrupt; sad, sorrowful	1.2
Aeneas, -ae (m.)	noun (proper)	Aeneas, leader of the Trojans	4.4
aequo, -are, -avi, -atum	verb	to make equal, equalize	4.4
aequor, -oris (n.)	noun	even surface, level; sea, ocean	4.4
aequus, -a, -um	adjective	level, even, equal, like; just, kind, impartial, fair; patient	1.2
aestas, -atis (f.)	noun	summer; summer heat/weather; a year	4.1
aetas, -atis (f.)	noun	life of a man, age, lifetime, years	3.4
aether, -eris (acc. aethera) (m.)	noun	upper air, sky	4.4
affirmo (adf-), -are, -avi, -atum	verb	to strengthen; confirm, encourage; declare	3.1
ager, agri (m.)	noun	(productive) land, a field, farm, estate, pasture	5.4
agmen, -inis (n.)	noun	multitude, troop, crowd; battle line, army	2.3
ago, -ere, egi, actum	verb	to put in motion, do, act, move, lead, drive	1.2
agricola, -ae (m.)	noun	farmer, countryman, peasant	1.1
aio (defective verb, ais, ait, aiunt)	verb	to assert, affirm, say, tell, relate	2.3
albus, -a, -um	adjective	white, pale, fair, gray; bright, clear; favorable, auspicious	3.1
Alexandrinus, -a, -um	adjective	Alexandrian, pertaining to Alexandria (a city in Egypt)	3.4
alienus, -a, -um	adjective	of another, belonging to another, not one's own, foreign, alien, strange	2.3
aliqui (aliquis), aliqua, aliquod	adjective	some, any	3.1
aliquis, aliquid	pronoun/adjective	someone, anyone, anybody, one or another; neut., something, anything	3.1
alius, -a, -ud	adjective	another, other, different; one...the other (alius...alius). some...others (alii...alii)	1.1
alter, -tera, -terum	adjective	one, another, the one, the other (of two)	2.3
altum, -i (n.)	noun	height; high sky; deep sea	2.1
altus, -a, -um	adjective	high, lofty, elevated, great; deep, profound	1.2
ambulo, -are, -avi, -atum	verb	to walk, take a walk; travel, march	1.2
amicitia, -ae (f.)	noun	friendship; alliance, association; friendly relations	1.3
amicus, -a, -um	adjective	loving, friendly, kind, favorable	1.3
amicus, -i (m.)	noun	loved one, loving one, friend	1.3
amitto, -ere, -isi, -issum	verb	to send away, dismiss, part with, let go, lose	5.4
amnis, -is (m.)	noun	river	5.4
amo, -are, -avi, -atum	verb	to love	5.1
amor, -oris (m.)	noun	love, affection, strong friendly feeling	5.1
amplector, -i, amplexus sum	verb	to twine around, encircle, encompass, embrace	2.4
an	conjunction	or, or whether	1.3
ancilla, -ae (f.)	noun	enslaved woman	1.3
angustus, -a, -um	adjective	narrow, steep, close, confined; scanty, poor; narrowminded, petty	1.3
anima, -ae (f.)	noun	air, a current of air, breeze, wind; breath, life, soul	1.4
animal, -is (n.)	noun	animal, living thing	1.4
animus, -i (m.)	noun	soul, intelligence, reason, intellect, mind; courage	1.1
annus, -i (m.)	noun	year	2.3
ante	preposition/adverb	(with acc.) (of space) before, in front, forwards; (of time) before, previously	3.4
antea	adverb	before, before this; formerly, previously, in the past	4.1
antiquus, -a, -um	adjective	ancient, former, old, of old times	4.4
anxius, -a, -um	adjective	anxious, uneasy, disturbed; concerned; careful	3.6
aperio, -ire, -ui, -tum	verb	to uncover, open, disclose; explain, recount; reveal; establish	1.4
appareo (adp-), -ere, -ui, -itum	verb	to appear, come in sight, make an appearance	2.1
appello (adp-), -are, -avi, -atum	verb	to call, address, name; request, implore, demand	3.4
Appia, -ae (f.)	noun (proper)	a Roman female name (nomen - name of a Roman gens)	1.1
appropinquo (adp-), -are, -avi, -atum	verb	(with dat. or ad + acc.) to approach; come near to, draw near (space/time)	1.3
apud	preposition	(with acc.) with, among, at, by, near, at the house of	1.1
aqua, -ae (f.)	noun	water	1.2
ara, -ae (f.)	noun	structure for sacrifice, altar	4.6
arbor (arbos), -oris (f.)	noun	tree	1.4
architectus, -i (m.)	noun	architect; inventor, designer	3.4
arcus, -us (m.)	noun	bow, arc, arch; rainbow; anything arched or curved	3.4
ardens, -entis	adjective	glowing, fiery, hot, ablaze, burning, eager	4.6
ardeo, -ere, arsi, arsum	verb	to be on fire, burn, blaze, be burned, glow	1.3
area, -ae (f.)	noun	ground, dry land, open space	2.1
arena (harena), -ae (f.)	noun	sand, grains of sand; sandy land or desert; seashore; arena	2.3
arma, -orum (n. pl.)	noun	implements, outfit, instruments, tools; implements of war, arms, weapons	1.3
ars, artis (f.)	noun	practical skill, art	5.3
arvum, -i (n.)	noun	field, cultivated land, plowed land	4.6
arx, arcis (f.)	noun	castle, citadel, fortress, stronghold	4.4
ascendo (ads-), -ere, -cendi, -censum	verb	to climb, go/climb up; mount, scale; embark; rise, ascend, move upward	1.4
aspicio (ads-), -ere, -exi, -ectum	verb	to look at, look upon, behold, look	1.4
at, ast	conjunction	but (introducing a contrast to what precedes)	1.2
ater, atra, atrum	adjective	black, coal-black, gloomy, dark	2.3
Athenae, -arum (f. pl).	noun (proper)	Athens (city in Greece)	3.1
athleta, -ae (m.)	noun	wrestler, boxer, athlete, one who is in public games; expert	1.3
atque, ac	conjunction	and; than (correl. with alius); as (correl. with idem)	1.1
atrium, -i (n.)	noun	atrium, reception hall in a Roman house	1.2
attonitus, -a, -um	adjective	astonished, fascinated; stupefied, dazed; inspired	2.3
audacia, -ae (f.)	noun	boldness, courage, confidence; recklessness	1.4
audax, -acis	adjective	bold; courageous; reckless, rash; presumptuous	1.4
audeo, -ere, ausus sum	verb	to venture, dare, be bold, dare to do, risk	3.6
audio, -ire, -ivi (or-ii), -itum	verb	to hear, listen (to)	1.1
aura, -ae (f.)	noun	air (in motion), a breeze, breath of air, wind, blast	5.1
Aurelius, -i (m.)	noun (proper)	a Roman male name (nomen - name of a Roman gens)	1.2
aureus, -a, -um	adjective	of gold, golden; gilded; gleaming like gold; splendid	5.3
auris, -is (f.)	noun	ear	3.1
aurum, -i (n.)	noun	gold	5.3
aut	conjunction	or (introducing an antithesis to what precedes); either...or (aut...aut)	1.1
autem	conjunction	but, on the other hand, on the contrary, however	3.4
auxilium, -i (n.)	noun	help, assistance; remedy; supporting resource, force; (pl.) auxiliary troops	4.6
avunculus, -i (m.)	noun	maternal uncle, mother's brother	2.1
beatus, -a, -um	adjective	happy, prosperous, blessed, fortunate	1.4
bellum, -i (n.)	noun	war	1.2
bene	adverb	well	2.4
beneficium, -i (n.)	noun	favor, benefit, service, kindness	3.4
benignus, -a, -um	adjective	kind, favorable; kindly, mild, affable	3.6
bibo, -ere, bibi	verb	to drink	4.1
bonus, -a, -um	adjective	good	1.2
brevis, -e	adjective	short, small, shallow, brief	1.2
cado, -ere, cecidi, casum	verb	to fall, fall down, descend, die	5.1
caedes, -is (f.)	noun	cuttingdown-, killing, slaughter, carnage, massacre	5.1
Caelius, -i (m.)	noun (proper)	a Roman male name (nomen - name of a Roman gens)	1.1
caelum, -i (n.)	noun	sky, heaven, heavens, vault of heaven	2.1
caligo, -inis (f.)	noun	thick air, mist, vapor, fog	1.2
Camilla, -ae (f.)	noun (proper)	Camilla, warrior and leader of the Volsci	5.4
campus, -i (m.)	noun	plain, field, open country, level place	2.3
candidus, -a, -um	adjective	bright, clear, transparent; clean, spotless; innocent, pure, unaffected, honest; white, pale	4.1
canis, -is (m. or f.)	noun	dog	1.1
cano, -ere, cecini, cantum	verb	to make music; sing (of), sound; prophesize	4.4
capillus, -i (m.)	noun	hair of the head, hair	3.1
capio, -ere, cepi, captum	verb	to take in hand, take hold of, lay hold of, take, seize, grasp	5.1
caput, -itis (n.)	noun	head	1.3
carmen, -inis (n.)	noun	song, poem, verse, prophecy, note, sound (vocal or instrumental)	3.6
Carthago (Karthago), -inis (f.)	noun (proper)	Carthage, a city in north Africa	3.1
carus, -a, -um	adjective	dear, precious, valued, esteemed, beloved	4.4
castra, -orum (n. pl.)	noun	military camp, encampment, fort	3.6
castrum, -i (n.)	noun	fortified place, fort, fortress	3.6
casus, -us (m.)	noun	falling, falling down, fall; misfortune, mishap, calamity	1.4
catena, -ae (f.)	noun	chain, shackle	3.1
caterva, -ae (f.)	noun	crowd, troop, throng, band, mob	4.4
causa, -ae (f.)	noun	cause, reason, motive, occasion, opportunity; (in the ablative) for the sake of	2.4
caveo, -ere, cavi, cautum	verb	to beware, avoid, be on guard; guarantee; take care of, decree	1.1
cedo, -ere, cessi, cessum	verb	to go from, give place, withdraw, go away, depart, yield, move	5.3
celebro, -are, -avi, -atum	verb	to celebrate, perform; frequent; honor; publicize; discuss	2.1
celer, -eris, -ere	adjective	swift, fleet, quick, speedy	5.1
celeritas, -atis (f.)	noun	speed, quickness; speed of action; haste	4.1
celo, -are, -avi, -atum	verb	to hide something from one, keep secret, conceal	4.1
cena, -ae (f.)	noun	dinner, principal Roman meal (evening); course, meal	1.3
ceno, -are, -avi, -atum	verb	to dine (on), eat, have dinner with	1.3
certamen, certaminis (n.)	noun	contest, competition; battle, combat, struggle; rivalry, dispute	1.4
certus, -a, -um	adjective	determined, resolved, fixed, settled, purposed, certain	1.4
ceterus, -a, -um	adjective	the other, remainder, rest	1.4
cibus, -i (m.)	noun	food; eating, a meal	1.2
cingo, -ere, -xi, -nctum	verb	to go around, surround, encompass, gird, wreathe, crown	2.4
cinis, -eris (m.)	noun	ashes	2.1
circum	preposition	(with acc.) around, about, all around	4.4
civis, -is (m. or f.)	noun	citizen	4.6
civitas, -atis (f.)	noun	city, state; citizenship	3.4
clam	adverb	secretly; without knowledge of, unknown to	4.6
clamo, -are, -avi, -atum	verb	to call, cry out, shout aloud; complain loudly	5.3
clamor, -is (m.)	noun	shout, cry; loud shouting; applause; a loud noise, roar; a battle-cry	2.4
clarus, -a, -um	adjective	clear, bright, shining, brilliant	5.1
classis, -is (f.)	noun	class, great division; (fig.) army, a fleet	1.4
Claudia, -ae (f.)	noun (proper)	a Roman female name (nomen - name of a Roman gens)	1.2
claudo, -ere, -si, -sum	verb	to shut, close, shut up	1.3
cliens, -entis	noun	client, dependent (of a patron); client state or its citizens, allies	5.3
clipeus, -i (m.)	noun	round shield of metal	4.6
coepio, -ere, coepi, coeptum	verb	to begin, commence	2.3
cognosco, -ere, cognovi, cognitum	verb	to become acquainted with, acquire knowledge of, learn, understand, recognize	1.4
cogo, -ere, coegi, coactum	verb	to drive together, bring together, convene, compel, force	2.4
colo, -ere, colui, cultum	verb	to till, tend, care for, cultivate	4.4
coma, -ae (f.)	noun	hair of the head, hair	5.1
comes, -itis (m.)	noun	companion, associate, comrade, partner	3.1
committo, -ere, -misi, -missum	verb	to bring together, join, combine, put together, connect, unite	2.3
commodus, -a, -um	adjective	suitable, convenient; timely; favorable, lucky; desirable, agreeable	5.3
commoveo, -ere, -movi, -motum	verb	to shake, stir up; start, provoke; displace, trouble, upset; jolt awake	5.6
comparo, -are, -avi, -atum	verb	to place together, join; compare, consider; prepare, acquire; arrange, establish	5.6
compono, -ere, -posui, -positum	verb	to bring together, place together, join, connect	5.1
condo, -ere, -didi, -ditum	verb	to put together, found, establish, build, settle	1.4
coniunx, -iugis (m. or f.)	noun	married person, spouse, husband, wife	2.4
consido, -ere, -sedi, -sessum	verb	to sit down, be seated; sit (judge); sink, stop, settle; take up a position	2.4
consilium, -i (n.)	noun	council, body of counsellors; a plan, purpose, intention	1.3
conspicio, -ere, -spexi, -spectum	verb	to look at (closely), contemplate, perceive, observe	1.1
constituo, -ere, -ui, -utum	verb	to set up; place, locate; stop; decide, appoint; station (troops); establish, create; arrange	5.6
consul, -is (m.)	noun	consul	5.1
consulo, -ere, -ui, -tum	verb	to meet and consider, reflect, consult, look out, be mindful	2.3
consumo, -ere, -sumpsi, -sumptum	verb	to burn up, destroy; reduce, wear away; extinguish, exhaust; devour, consume; spend, squander	6.1
contendo, -ere, -tendi, -tentum	verb	to stretch, draw tight; to draw, bend; to tune; to stretch out for, rush to, travel; be in a hurry; direct	6.2
contingo, -ere, -tigi, -tactum	verb	to touch, reach, take hold of, seize	4.4
contra	adjective/adverb	in opposition, opposite, face to face; in turn, in return, back, on the other hand, likewise (with acc.)	2.4
conubium, -i (n.)	noun	marriage	5.1
copia, -ae (f.)	noun	abundance, ample supply, plenty; (in plural) troops, forces	1.4
coquo, -ere, coxi, coctum	verb	to cook; burn, parch; consider, plan	5.4
Cornelia, -ae (f.)	noun (proper)	a Roman female name (nomen - name of a Roman gens)	1.1
cornu, -us (n).	noun	horn; hoof; beak, claw; bow; horn, trumpet; end, wing of an army	5.4
corpus, -oris (n.)	noun	body (living or lifeless)	1.2
corripio, -ere, -ripui, -reptum	verb	to seize, snatch up, grasp, collect, take hold of, arrest	2.3
cotidie	adverb	daily, every day; day by day; usually, ordinarily, commonly	3.6
cras	adverb	tomorrow; after today; hereafter, in the future	3.6
credo, -ere, -didi, -ditum	verb	(with dat.) to believe, trust; to confide in, have confidence in	1.3
cresco, -ere, crevi, cretum	verb	to come into being, spring up, arise, be born, grow	2.1
crimen, -inis (n.)	noun	judgment, charge, crime, accusation, reproach	5.4
crudelis, -e	adjective	rude, unfeeling, hard, hard-hearted, cruel, severe, fierce	5.1
cubiculum, -i (n.)	noun	bedroom, room	1.1
culina, -ae (f.)	noun	kitchen	1.2
cum	conjunction	when, while, since, although	1.1
cum	preposition	(with abl) .with, together, along with	1.1
cunctor, -ari, -atus sum	verb	to delay, linger, loiter; hesitate, doubt	2.1
cunctus, -a, -um	adjective	all together, whole, all, entire	4.6
cupiditas, -atis (f.)	noun	desire, lust, greed, enthusiasm, eagerness, passion	4.1
cupio, -ere, -ivi, -itum	verb	to long for, desire, wish	2.3
cur	adverb	why? wherefore? for what reason?	5.1
cura, -ae (f.)	noun	trouble, care, concern, attention, pains, industry, diligence, exertion	3.6
curo, -are, -avi, -atum	verb	to care, provide for; be attentive to; take charge of; heal, cure	2.4
curro, -ere, cucurri, cursum	verb	to run, move quickly, travel quickly	1.3
currus, -us (m.)	noun	chariot, car, wagon	4.4
cursus, -us (m.)	noun	running, course, way, march, passage, voyage, journey	1.4
custodio, -ire, -ivi, -itum	verb	to guard, watch over, keep safe; to take heed, care, observe	4.1
custos, -odis (m.)	noun	guard, sentry, protector; doorkeeper, watchman	5.4
Danai, -orum (pl.)	noun (proper)	the Danaans, the Greeks	4.4
de	preposition	(with abl.from) , away from, down from, out of, about	1.2
dea, -ae (f.)	noun	goddess	1.1
debeo, -ere, -ui, -itum	verb	to owe, be in debt; ought, must, should	2.3
Decius, -i (m.)	noun (proper)	a Roman male name (nomen - name of a Roman gens)	1.1
defendo, -ere, -i, defensum	verb	to defend, guard, protect, look after; repel, ward off, prevent; support, preserve	3.4
defessus, -a, -um	adjective	worn out, weary, tired; weakened	4.1
deinde or dein	adverb	then, next, thereafter, afterward	1.3
delecto, -are, -avi, -atum	verb	to delight, please, amuse, fascinate; charm, lure, entice; enjoy	3.6
deleo, -ere, -evi, -etum	verb	to erase, remove, delete; abolish	3.6
demonstro, -are, -avi, -atum	verb	to point out/at/to, draw attention to; to explain, describe; reveal, mention, refer to; prove, demonstrate	4.1
denique	adverb	finally, in the end; and then	5.6
densus, -a, -um	adjective	thick, close, compact, dense, crowded	2.1
descendo, -ere, -i, descensum	verb	to descend, go down; to dismount; to penetrate, sink	2.3
desero, -ere, -ui, -tum	verb	to leave, forsake, abandon, desert, give up	1.2
desum, -esse, -fui	verb	to be away, be absent, fail, be wanting, be missing	2.4
detineo, -ere, -ui, -tentum	verb	to hold off, keep back, detain, check	2.3
deus, -i (m.)	noun	god, deity	1.1
devoro, -are, -avi, -atum	verb	to devour, swallow up, overwhelm, destroy; to use up, consume	6.1
dexter, -tera, -terum, (or -tra, -trum)	adjective	to the right, on the right side, right	3.6
dextra (dextera), -ae (f.)	noun	right hand	4.4
Diana, -ae (f.)	noun (proper)	Diana, the goddess of the moon, daughter of Jupiter and Latona and twin sister of Apollo	4.4
dico, -ere, dixi, dictum	verb	to say, speak, utter, tell, mention, relate, affirm, declare, state, assert	1.1
Dido, -onis (f.)	noun (proper)	Dido, queen of Carthage	4.4
dies, -ei (m. or f.)	noun	day, daylight	1.2
difficilis, -e	adjective	difficult, troublesome; hard to please or deal with	4.1
digitus, -i (m.)	noun	finger; toe; finger's breadth	3.1
dignus, -a, -um	adjective	worthy, deserving, deserved, suitable, fitting, proper	2.4
diligens, -entis	adjective	careful; diligent; accurate; industrious	4.1
diligentia, -ae (f.)	noun	diligence, care, attentiveness; frugality; efficiency	4.1
discedo, -ere, -cessi, -cessum	verb	to go off, depart, withdraw; scatter, abandon	2.4
discipulus, -i (m.)	noun	student, follower	4.1
disco, -ere, didici	verb	to learn, learn to know, acquire, become acquainted with	3.1
dissimilis, -e	adjective	unlike, different, dissimilar	4.6
diu	adverb	a long time, long while, long, for a long time	3.1
diva, -ae (f.)	noun	goddess	4.4
dives, -itis	adjective	rich; costly; productive (land); talented	5.1
divus, -i (m.)	noun	god, a deity	4.6
do, dare, dedi, datum	verb	to give, hand over, deliver, give up, pay, surrender, grant	1.1
doceo, -ere-ui, , -ctum	verb	to teach, instruct, inform, show, prove, convince, tell	3.1
doleo, -ere, -ui-itum,	verb	to hurt, feel pain; grieve; be pained, sorry; cause pain (to)	4.4
dolor, -oris (m.)	noun	pain, ache, suffering, anguish	4.4
domina, -ae (f.)	noun	mistress, lady, she who rules; a female slave-owner	3.6
dominus, -i (m).	noun	master, possessor, ruler, lord, owner; a male slave-owner	3.4
domus, -us or -i (f.)	noun	house, home, dwelling-house, building, mansion, palace	1.2
donum, -i (n.)	noun	gift, present	4.6
dormio, -ire, -ivi, -itum	verb	to sleep, rest; do nothing	3.1
dubius, -a, -um	adjective	moving two ways, doubting, doubtful, dubious, uncertain	2.3
duco, -ere, -xi-ctum,	verb	to lead, conduct, guide, direct, draw, bring, fetch, escort	3.1
dulcis, -e	adjective	sweet	5.1
dum	conjunction	while, a while, now, yet so long as, provided that, if only; until, until that	2.4
duo, -ae, -o	adjective	two	1.1
durus, -a, -um	adjective	hard (to the touch); harsh, rough, stern, unyielding, unfeeling	5.3
dux, ducis (m.)	noun	leader, conductor, guide	5.1
ecce	interjection	lo! see! behold! there! look!	2.3
effundo, -ere, -fudi, -fusum	verb	to pour out, pour forth, shed, spread abroad	2.4
ego, mei, mihi, me, me	pronoun	I, me	1.1
egredior, -gredi, -gressus sum	verb	to go out, come forth, march out, go away	2.1
emo, -ere, emi, emptum	verb	to buy; gain, acquire, take, purchase	1.3
enim	conjunction	for, for instance, namely; in fact, indeed, to be sure	2.1
eo, ire, ivi or ii, itum	verb	to go, walk, ride, sail, fly, move, pass	1.3
epistula, -ae (f.)	noun	written communication, letter	1.4
eques, -itis (m.)	noun	horseman, rider; cavalryman, horse-soldier, trooper, member of the Equestrian social class	5.4
equidem	adverb	truly, indeed, certainly, by all means, of course, to be sure	2.1
equus, -i (m.)	noun	horse	4.6
ergo	conjunction	consequently; therefore, then, so then; because of (with gen.)	1.1
eripio, -ere, -ipui, -eptum	verb	to tear out, snatch away, pluck, tear, take away	1.4
erro, -are, -avi, -atum	verb	to wander, stray, roam; be in error, err, mistake, go wrong, go astray	4.4
et	conjunction	and; also, too, besides, likewise, as well, even; both...and (et...et)	1.1
etiam	conjunction	now too, yet, as yet, even yet, still, even now	1.2
ex, e	preposition	(with abl.) out of, from	1.1
excipio, -ere, -сері, -ceptum	verb	to take out, withdraw; except, make an exception. stipulate, reserve	5.1
excito, -are, -avi, -atum	verb	to call out, summon forth, bring out, wake, rouse	1.2
exemplum, -i (n.)	noun	example, sample; instance; precedent, case; warning, deterrent	5.3
exerceo, -ere, -ui, -itum	verb	to exercise, practice; enforce, administer; cultivate	4.4
exercitus, -us (m.)	noun	disciplined body of men, army	3.4
exigo, -ere, -egi, -actum	verb	to drive out, push forth, thrust out, take out, expel; spend (time); demand; inquire; complete, spend	2.3
exitus, -us (m.)	noun	going out, exit, departure; end, conclusion, death	2.1
explico, -are, -avi, atum (or -ui, -itum)	verb	to unfold, extend; to set forth, explain	5.6
exspecto or expecto, -are, -avi, -atum	verb	to look out for, await, wait for	2.4
exstinguo or extinguo, -ere, -nxi, -nctum	verb	to put out, quench, extinguish, destroy	2.4
extra	adverb	outside of, beyond, without, beside; except	5.6
extremus, -a, -um	adjective	outermost, farthest, most distant, last, hindmost	5.1
fabula, -ae (f.)	noun	story, account, tale; fable, narrative; play, drama; theatrical performance	1.1
facio, -ere, feci, factum	verb	to make, construct, fashion, build; do, perform, accomplish, act	1.1
falsus, -a, -um	adjective	deceptive, false, untrue, lying, feigned, counterfeit	5.4
familia, -ae (f.)	noun	household; a household, the slaves of a household	2.3
fama, -ae (f.)	noun	report, rumor; fame, renown, reputation	2.3
femina, -ae (f.)	noun	female, woman	2.4
fero, ferre, tuli, latum	verb	to bear, carry, support, lift, hold, take up; report	1.2
ferox, -ocis	adjective	wild, bold; warlike; cruel; defiant, arrogant	5.3
ferrum, -i (n.)	noun	iron	3.1
ferus, -a, -um	adjective	wild, untamed, uncultivated	3.6
festino, -are, -avi, -atum	verb	to hurry	6.1
fides, -ei (f.)	noun	trust, faith, confidence, reliance, credence, belief	3.1
figura, -ae (f.)	noun	form, shape, figure	2.1
filia, -ae (f.)	noun	daughter	5.4
filius, -i (m.)	noun	son	5.4
fingo, -ere, finxi, fictum	verb	to touch, form, shape, fashion, make	3.1
finis, -is (m. or f.)	noun	that which divides, boundary, limit, border, end	1.3
fio, fieri, factus sum	verb	to happen, be done; become	4.6
flamma, -ae (f.)	noun	blazing fire, blaze, flame	1.4
flecto, -ere, flexi, flexum	verb	to bend, bow, curve, turn, turn round	2.1
fleo, ere, flevi, fletum	verb	to weep, cry, shed tears, lament, wail	5.4
flos, -oris (m.)	noun	flower, blossom; youthful prime	6.2
fluctus, -us (m.)	noun	wave, flow, tide, surge	4.4
flumen, -inis (n.)	noun	a flowing, flood, stream, running water, river	3.4
fluo, -ere, fluxi, fluxum	verb	to flow; proceed from	3.6
for, fari, fatus sum	verb	to speak, say	4.6
forma, -ae (f.)	noun	form, contour, figure, shape, appearance, looks	1.4
formido, -inis (f.)	noun	fearfulness, fear, terror, dread, awe	1.2
fortasse	adverb	perhaps, possibly; it may be	3.4
forte	adverb	by chance, by accident	2.1
fortis, -e	adjective	strong, firm, stout, courageous, brave, valiant, resolute	1.1
fortuna, -ae (f.)	noun	luck, chance, fate, destiny, lot; fortune	1.2
Forum, -i (n.)	noun (proper)	Forum, market place in Roman cities	1.2
frater, -tris (m.)	noun	brother	1.3
fugio, -ere, fugi, fugitum	verb	to flee, fly, take flight; escape; avoid, shun	1.4
fugitivus, -i (m.)	noun	fugitive, runaway	3.1
fulgeo, -ere, fulsi	verb	to flash, shine, glitter, gleam, glisten	4.4
fundus, -i (m.)	noun	farm; country-seat, estate	1.1
furo, -ere, furui	verb	to rage, be mad, rave; be wild	5.1
furor, -oris (m.)	noun	rage, fury; madness, passion	5.1
gemitus, -us (m.)	noun	a sighing, sigh, groan, lamentation, complaint	2.4
gens, gentis (f.)	noun	race, clan, house	4.4
genus, -eris (n.)	noun	race, family, birth, descent, origin, sort, kind	3.4
gero, -ere, gessi, gestum	verb	to bear about, bear, carry, wear, have, hold, sustain	3.1
gladiator, -oris (m.)	noun	gladiator	1.4
gladius, -i (m.)	noun	sword	1.4
gloria, -ae (f.)	noun	glory, fame, renown, praise, honor	1.4
gradus, -us (m.)	noun	step, pace, gait, walk	2.4
gratia, -ae (f.)	noun	favor, regard, liking, love, friendship; charm, beauty, loveliness	1.4
gratus, -a, -um	adjective	beloved, dear, acceptable, pleasing, agreeable	3.6
gravis, -e	adjective	heavy, weighty, ponderous, burdensome, loaded, laden, burdened	1.1
habeo, -ere, -ui, -itum	verb	to have, hold, support, carry, wear	1.1
habito, -are, -avi, -atum	verb	to inhabit, dwell; to live, stay	1.3
haereo, -ere, haesi, haesum	verb	to stick, adhere, cling to; to hesitate; to be in difficulties	3.1
Harpocras, -tis (m.)	noun (proper)	a Greek male name	3.4
hasta, -ae (f.)	noun	staff, rod, pole; spear, javelin	4.6
haud or haut	adverb	not, not at all, by no means	5.4
haurio, -ire, hausi, haustum	verb	to draw up, draw out, draw; to drink, swallow, devour, consume	4.6
Hector, -oris (m.)	noun (proper)	Hector, Trojan warrior, son of Priam	4.4
Hecuba, -ae (f.)	noun (proper)	Hecuba, queen of Troy, wife of Priam	5.4
Hectoreus, -a, -um	adjective	Hectorean, pertaining to Hector	5.4
herba, -ae (f.)	noun	herb, grass	5.4
Herculeus, -a, -um	adjective	Herculean	3.4
heu	interjection	oh! alas! ah!	4.4
hic, haec, hoc	adjective	this	1.1
hic	adverb	here, in this place	1.4
hinc	adverb	from here, hence	5.4
hiems, -is (f.)	noun	winter; a storm, stormy weather, rainy season	1.4
hodie	adverb	today, this day, at the present day	1.3
homo, -inis (m.)	noun	man, human being, person, fellow	1.3
honor (honos), -oris (m.)	noun	honor, repute, esteem, respect, reputation; public office, rank	4.4
hora, -ae (f.)	noun	hour, season, time	1.3
hortor, -ari, -atus sum	verb	to encourage, urge, incite, exhort	1.3
hortus, -i (m.)	noun	garden	1.1
hospes, -itis (m. or f.)	noun	host, guest, stranger, foreigner	4.1
hostis, -is (m. or f.)	noun	stranger, foreigner; enemy, public enemy	1.1
iacio, -ere, ieci, iactum	verb	to throw, cast, hurl	1.4
iam	adverb	at this time, now, already, at length	1.1
ianua, -ae (f.)	noun	door, entrance	1.4
ibi	adverb	in that place, there	1.2
idem, eadem, idem	pronoun/adjective	same, the same one	1.1
idoneus, -a, -um	adjective	fit, suitable, proper, appropriate, convenient, deserving	3.4
igitur	adverb	accordingly, therefore, consequently, then, so then	1.3
ignis, -is (m.)	noun	fire	1.2
ille, illa, illud	pronoun/adjective	that, that one, the former	1.1
illic	adverb	there, in that place	5.4
imago, -inis (f.)	noun	image, likeness, copy, statue, bust, portrait	2.1
immanis, -e	adjective	huge, vast, monstrous, immense, large, enormous, powerful; dreadful, savage, fierce, wild	4.4
imminentia, -ae (f.)	noun	a hanging over; danger, a threat	3.6
immortalitas, -atis (f.)	noun	immortality	3.6
impedio, -ire, -ivi, -itum	verb	to entangle, shackle, hinder, obstruct, impede, prevent	3.6
imperator, -oris (m.)	noun	commander-in-chief, general; emperor	3.4
imperium, -i (n.)	noun	authority, command, power, dominion, empire	1.4
impero, -are, -avi, -atum	verb	(with dat.) to command, order, bid	1.4
impetus, -us (m.)	noun	attack, assault; impetus, dash, impulse	3.4
implico, -are, -avi, -atum or -ui, -itum	verb	to enfold, involve; entangle, embroil, confuse	3.1
impono, -ere, -posui, -positum	verb	(with dat. or in + acc.) to place upon, put on, impose, set on	2.1
in	preposition	(with acc.) into, to, against; (with abl.) in, on	1.1
incendo, -ere, -cendi, -censum	verb	to set fire to, set on fire, burn; inflame, arouse, excite	3.6
incertus, -a, -um	adjective	not fixed, uncertain, undetermined, doubtful	1.2
incito, -are, -avi, -atum	verb	to put in motion, set in rapid motion, hasten, urge forward, spur on, incite	1.2
incola, -ae (m. or f.)	noun	inhabitant, resident	1.2
inde	adverb	from that place, thence, from there, from that time, thereafter, thereupon	1.2
induo, -ere, -ui, -utum	verb	to put on, assume; dress, clothe; cover	5.4
ineo, -ire, -ivi, -itum	verb	to go into, enter, begin, start	3.4
inferus, -a, -um	adjective	low, below, underneath, below the earth, infernal	4.6
infestus, -a, -um	adjective	unsafe, hostile, aggressive, threatening	4.6
infundo, -ere, -fudi, -fusum	verb	to pour in, pour out, pour upon, shed; sprinkle	4.6
ingens, -entis	adjective	not natural, vast, huge, enormous, great, remarkable	2.3
inimicus, -a, -um	adjective	unfriendly, hostile, inimical; (as a noun) enemy	5.3
initium, -i (n.)	noun	beginning; entrance	3.1
iniuria, -ae (f.)	noun	injustice, wrong, outrage, injury, insult	4.4
inquam (defective verb, inquis, inquit, inquimus, inquiunt)	verb	to say	1.3
insanus, -a, -um	adjective	insane, unhealthy in mind	5.3
inspicio, -ere, -spexi, -spectum	verb	to examine, inspect; to consider, look into	4.6
insula, -ae (f.)	noun	island; apartment building	5.1
intellego, -ere, -exi, -ectum	verb	to understand, discern, perceive	1.2
inter	preposition	(with acc.) between, among	1.2
interficio, -ere, -feci, -fectum	verb	to make away with, kill, destroy	1.4
interim	adverb	in the meantime, meanwhile	1.2
intro, -are, -avi, -atum	verb	to enter, go into, penetrate	1.1
invenio, -ire, -veni, -ventum	verb	to come upon, find, discover, invent, devise, meet with	1.3
ipse, ipsa, ipsum	pronoun/adjective	himself, herself, itself, themselves; very, the very one	1.2
ira, -ae (f.)	noun	anger, wrath, rage, passion, indignation	5.1
is, ea, id	pronoun/adjective	that, that one, this one, he, she, it	1.1
ita	adverb	in this manner, in this way, so, thus	1.1
Italia, -ae (f.)	noun (proper)	Italy	1.4
itaque	adverb	and so, accordingly, therefore	1.2
iter, itineris (n.)	noun	road, way, journey, march	1.2
iterum	adverb	a second time, again, once more, anew	1.3
iubeo, -ere, iussi, iussum	verb	to order, command, bid, enjoin	1.3
Iudaea, -ae (f.)	noun (proper)	Judea, province in Roman Palestine	3.6
iudex, -icis (m.)	noun	judge, juror	2.3
iudicium, -i (n.)	noun	trial, legal investigation; judgment, opinion, decision	3.1
iungo, -ere, iunxi, iunctum	verb	to join, unite, connect, fasten	5.1
Iuno, -onis (f.)	noun (proper)	Juno, the queen of the gods	4.4
Iuppiter, Iovis (m.)	noun (proper)	Jupiter, the king of the gods	4.4
ius, iuris (n.)	noun	justice, law, right	3.6
iuvenis, -is (m.)	noun	young man	1.2
labor, -oris (m.)	noun	toil, exertion, work, effort, labor	1.4
laboro, -are, -avi, -atum	verb	to work, toil, labor, exert oneself; be in distress	1.2
lacrima, -ae (f.)	noun	tear, teardrop	4.4
lacrimo, -are, -avi, -atum	verb	to shed tears, weep, cry	3.1
laetus, -a, -um	adjective	joyful, happy; cheerful, glad, merry	1.2
laudo, -are, -avi, -atum	verb	to praise, laud, approve, commend	1.2
lego, -ere, legi, lectum	verb	to gather, collect; pick, choose, select; read, read aloud	1.2
leo, leonis (m.)	noun	lion	1.2
levo, -are, -avi, -atum	verb	to lift, raise, elevate; lighten, relieve; soothe, console	5.6
lex, legis (f.)	noun	law, bill, statute; rule, principle	5.3
liber, libri (m.)	noun	book, document, writing, book of a work	3.1
liber, -era, -erum	adjective	free, unrestricted, unimpeded	3.1
liberi, -orum (m. pl.)	noun	children	3.6
libero, -are, -avi, -atum	verb	to free; acquit, absolve; liberate, release	4.1
liberta, -ae (f.)	noun	freedwoman, freed person, formerly enslaved woman	3.4
libertas, -atis (f.)	noun	freedom, liberty, absence of restraint, permission	5.4
libertus, -i (m.)	noun	freedman, freed person, formerly enslaved man	3.1
licet, -ere, licuit and licitum est	verb	it is lawful, is allowed, is permitted; even if, although, notwithstanding	3.1
limen, -inis (n.)	noun	threshold, sill	1.4
lingua, -ae (f.)	noun	tongue; speech, language	4.6
littera, -ae (f.)	noun	letter (of the alphabet); (pl.) letter, epistle; literature, books, learning	1.1
litus, -oris (n.)	noun	seashore, coast, beach	4.4
locus, -i (m.)	noun	place, spot, site	1.1
longe	adverb	a long way off, far, at a distance	1.2
longus, -a, -um	adjective	long, lengthy; wide; protracted	1.2
loquor, -i, locutus sum	verb	to speak, talk, tell, say, mention, narrate	2.3
lucus, -i (m.)	noun	grove, sacred grove, wood	4.6
ludo, -ere, lusi, lusum	verb	to play, frolic, romp; amuse oneself; make a fool of, delude	1.1
ludus, -i (m.)	noun	game, play, pastime, sport; school, elementary school	1.1
lux, lucis (f.)	noun	light, brightness, day, daylight	4.6
magis	adverb	to a greater extent, more, rather	2.3
magister, -tri (m.)	noun	master, chief, head, director, teacher, instructor	1.2
magnopere	adverb	greatly, very much, especially	1.4
magnus, -a, -um	adjective	great, large, vast, big, high, tall; great, powerful, important	1.1
maior, maius	adjective	larger, greater	1.2
male	adverb	badly, ill, poorly; wrongly	1.2
Maleficus, -i (m.)	noun (proper)	Malfoy, a wizard family name	3.1
Malefica, -ae (f.)	noun (proper)	Malfoy, a wizard family name	3.1
malo, malle, malui	verb	to wish more, prefer	3.6
malus, -a, -um	adjective	bad, evil, wicked	1.2
maneo, -ere, mansi, mansum	verb	to stay, remain, abide, tarry, wait, last, endure	1.4
manus, -us (f.)	noun	hand; handful, band of men, troop, crowd	1.3
mare, maris (n.)	noun	sea, seawater, lake, ocean	1.4
maritus, -i (m.)	noun	husband	2.4
mater, matris (f.)	noun	mother	1.2
medicus, -i (m.)	noun	physician, doctor	3.1
medius, -a, -um	adjective	in the middle, midst, middle, central; the middle of, half-way through	1.2
membrum, -i (n.)	noun	member, limb, part of the body	3.4
memoria, -ae (f.)	noun	memory, recollection, power of memory, remembrance	4.1
mens, mentis (f.)	noun	mind, disposition, feelings, will; intellect, reason; courage	2.1
mereo, -ere, -ui, -itum	verb	to deserve, merit; serve, earn; to be a soldier, serve in the army	5.3
metuo, -ere, metui	verb	to fear, be afraid of, be afraid	1.4
metus, -us (m.)	noun	fear, dread, apprehension	1.4
meus, -a, -um	adjective	my, mine	1.1
miser, -era, -erum	adjective	unfortunate, wretched, miserable, deplorable, sad, pitiable	1.4
mitto, -ere, misi, missum	verb	to send, let go, release	1.1
mobilis, -e	adjective	movable, flexible; nimble, rapid; changeable, fickle	5.6
modo	adverb	by a measure, with a limit; only, merely, but, just now	2.1
modus, -i (m.)	noun	measure, quantity, size; limit, bound; manner, method, way	1.1
moneo, -ere, -ui, -itum	verb	to remind, warn, advise, instruct, teach	1.2
mons, montis (m.)	noun	mountain, mount, great rock	1.4
monstro, -are, -avi, -atum	verb	to show, point out, indicate, inform	1.2
mora, -ae (f.)	noun	delay, postponement; hindrance, obstacle; pause	1.4
morior, -i, mortuus sum	verb	to die	1.2
mors, mortis (f.)	noun	death	1.2
mortuus, -a, -um	adjective	dead, deceased, lifeless	1.2
mos, moris (m.)	noun	will, way, whim; habit, custom, practice; (pl.) character, morals	1.3
moveo, -ere, movi, motum	verb	to move, stir, set in motion	1.4
mox	adverb	soon, soon after, presently, by and by	1.3
multus, -a, -um	adjective	much, many	1.1
murus, -i (m.)	noun	wall, city wall	1.4
muto, -are, -avi, -atum	verb	to move, move away, remove, change	2.4
nam or namque	conjunction	for, you see	1.2
narro, -are, -avi, -atum	verb	to make known, tell, relate, narrate, report, recount, set forth	3.1
nascor, -i, natus sum	verb	to be born, begin life, be produced, proceed, be begotten	3.6
natura, -ae (f.)	noun	nature, natural constitution, property, quality	1.1
natus (gnatus), -i (m.)	noun	son	4.6
nauta, -ae (m.)	noun	sailor	1.1
navigo, -are, -avi, -atum	verb	to sail; navigate	5.3
navis, -is (f.)	noun	ship	1.4
ne	adverb/conjunction	no, not, (+ quidem) not even, that not, lest, so that not	1.2
nec or neque	conjunction	and not, nor, neither	1.1
neco, -are, -avi, -atum	verb	to kill, slay, put to death	1.3
necesse	adjective	necessary, unavoidable, indispensable, inevitable	1.4
nefas	noun	that which is contrary to divine law, a forbidden thing, impiety, sacrilege, wrong	5.1
nego, -are, -avi, -atum	verb	to say no, deny, refuse; say that...not	2.3
nemo, neminis	pronoun	no one, nobody	2.3
nequeo, -ire, -ii or -ivi, -itum	verb	to be unable, cannot	5.4
nescio, -ire, -ivi or -ii, -itum	verb	to not know, be ignorant, not know how to	2.3
niger, -gra, -grum	adjective	black, dark, dusky, gloomy	5.1
nihil or nil	noun	nothing	1.1
nimis	adverb	beyond measure, too much, excessively	2.1
nisi	conjunction	if not, unless, except	1.4
nobilis, -e	adjective	well-known, notable, noted, famous, renowned, noble	3.6
noceo, -ere, -ui, -itum	verb	(with dat.) to harm, injure, hurt, damage	1.1
nolo, nolle, nolui	verb	to not wish, be unwilling, refuse	1.2
nomen, -inis (n.)	noun	name	1.1
non	adverb	not, no	1.1
nonne	adverb	(introduces a question expecting a "yes" answer)	1.2
nos, nostri/nostrum, nobis, nos, nobis	pronoun	we, us	1.1
noster, -tra, -trum	adjective	our, ours	1.1
novem	adjective	nine	1.1
novus, -a, -um	adjective	new, recent, fresh, young, novel, unusual	1.2
nox, noctis (f.)	noun	night	2.1
nullus, -a, -um	adjective	not any, no, none	1.2
num	adverb	(introduces a question expecting a "no" answer)	1.2
numen, -inis (n.)	noun	nod, consent; divine will; divine power, divinity, deity	5.1
numquam	adverb	at no time, never	3.6
nunc	adverb	now, at present, at this time	1.2
nuntio, -are, -avi, -atum	verb	to announce, report, give warning; convey, deliver	2.4
nuntius, -i (m.)	noun	announcement, message; messenger	2.4
nympha, -ae (f.)	noun	nymph (a demi-goddess who inhabits the sea, rivers, fountains, woods, trees, and mountains)	5.1
o	interjection	O! oh!	4.4
ob	preposition	(with acc.) on account of, for, because of, by reason of, for the sake of	2.1
obscurus, -a, -um	adjective	dark, dusky, shady, obscure	3.1
occido, -ere, -cidi, -casum	verb	to fall, fall down, go down, set; be ruined, perish, die, be slain	3.6
occupo, -are, -avi, -atum	verb	to take possession of, seize, occupy	3.6
octo	adjective	eight	1.1
oculus, -i (m.)	noun	eye	2.1
olim	adverb	at that time, once, formerly; at some time, hereafter, one day	4.4
omnis, -e	adjective	all, every	1.1
onus, -eris (n.)	noun	load, burden, weight, freight, cargo	5.6
opacus, -a, -um	adjective	in the shade, shady, shaded	5.4
ops, opis (f.)	noun	aid, help, assistance, support, succor; (pl.) power, might, influence, resources, wealth	5.3
optimus, -a, -um	adjective	best	2.3
opus, -eris (n.)	noun	work, labor, toil; work, work of art, book	2.3
oro, -are, -avi, -atum	verb	to speak, plead, beg, pray, entreat	1.4
os, oris (n.)	noun	mouth, opening, entrance; face, countenance	1.2
os, ossis (n.)	noun	bone	4.6
ostendo, -ere, -tendi, -tensum	verb	to expose to view, show, exhibit, display	1.3
otium, -i (n.)	noun	leisure, idleness, ease	3.6
palaestra, -ae (f.)	noun	palaestra, wrestling school, exercise ground	3.4
Palatinus, -a, -um	adjective	Palatine	3.6
pando, -ere, pandi, pansum or passum	verb	to spread out, extend, unfold	5.3
parco, -ere, peperci, parsum	verb	(with dat.) to act sparingly, be sparing, spare, refrain from, use moderately	5.3
parens, -entis (m. or f.)	noun	procreator, father, mother, parent	2.4
pariter	adverb	equally, in an equal degree, in like manner, as well, as much, alike	4.6
paro, -are, -avi, -atum	verb	to prepare, make ready, furnish, provide; arrange, order, design	5.1
pars, partis (f.)	noun	part, piece, portion, share, division, section	1.2
parum	adverb	too little, not enough, insufficiently	2.4
parvus, -a, -um	adjective	little, small, petty, puny, inconsiderable	4.6
pater, -tris (m.)	noun	father	1.2
patior, -i, passus sum	verb	to bear, support, undergo, suffer, endure, allow	5.4
patria, -ae (f.)	noun	fatherland, native land, native city, country	4.4
pauci, -ae, -a	adjective	few, little	5.4
pauper, -eris	adjective	poor, not wealthy, needy, indigent	5.1
pax, pacis (f.)	noun	peace, quiet, tranquility, rest	1.4
pecunia, -ae (f.)	noun	money	1.1
penates, -ium (m. pl.)	noun	the Penates, household gods	4.4
pereo, -ire, -ii or -ivi, -itum	verb	to pass away, come to nothing, vanish, disappear; be destroyed, perish, die	2.3
pes, pedis (m.)	noun	foot	2.1
peto, -ere, -ivi or -ii, -itum	verb	to seek, aim at, try to obtain, ask, request, beg	1.4
pictor, -oris (m.)	noun	painter	3.1
pila, -ae (f.)	noun	ball	1.2
placeo, -ere, -ui, -itum	verb	to please, be pleasing, be agreeable, satisfy	1.3
planus, -a, -um	adjective	even, flat, level, smooth	5.6
poeta, -ae (m.)	noun	poet	2.4
pono, -ere, posui, positum	verb	to put, place, set, lay	1.1
porta, -ae (f.)	noun	gate, city gate, door	1.2
porto, -are, -avi, -atum	verb	to carry, bear, convey, bring	1.1
possum, posse, potui	verb	to be able, have power, can	1.1
post	adverb/preposition	(of space) behind, at the back, backward; (of time) after, afterward, later	1.1
postea	adverb	after this, afterward, subsequently	2.1
postquam	conjunction	after, after that, when	1.3
praebeo, -ere, -ui, -itum	verb	to hold forth, present, offer, give, supply, furnish	2.1
praemium, -i (n.)	noun	reward, recompense, prize, public honor	1.2
primum	adverb	at first, at the beginning, first, for the first time	1.3
primus, -a, -um	adjective	first, the first, foremost	1.3
procedo, -ere, -cessi, -cessum	verb	to go forth, go forward, advance, proceed	2.1
procul	adverb	at a distance, far, far off, away	4.4
proelium, -i (n.)	noun	battle, combat, contest, action, engagement	2.4
proficiscor, -i, -fectus sum	verb	to set out, start, depart, go, march	1.2
promitto, -ere, -misi, -missum	verb	to send forth, let go, promise, guarantee	5.1
prope	adverb/preposition	near, nigh, at hand, close by	2.1
propero, -are, -avi, -atum	verb	to make haste, hasten, be quick, speed	2.1
protinus	adverb	forward, onward; continuously; forthwith, immediately, at once	2.4
puer, pueri (m.)	noun	boy, lad, child, male child	1.1
puella, -ae (f.)	noun	girl, lass, female child	1.1
pugno, -are, -avi, -atum	verb	to fight, combat, contend	1.2
pulcher, -chra, -chrum	adjective	beautiful, handsome, pretty, fair, fine	1.1
punio, -ire, -ivi, -itum	verb	to punish, chastise, correct, avenge, get revenge	3.1
puto, -are, -avi, -atum	verb	to think, believe, suppose, imagine	1.2
quaero, -ere, quaesivi, quaesitum	verb	to seek, look for; ask, ask for, demand	1.4
qualis, -e	adjective	of what kind? of what nature? what a! what kind of!	4.1
quam	adverb/conjunction	in what manner, how, how much; than	1.2
quamquam	conjunction	though, although, albeit	4.1
quando	adverb/conjunction	when? at what time? at some time or other; since, seeing that	3.6
quantus, -a, -um	adjective	how great, how much, how large	4.4
quasi	adverb/conjunction	as if, as it were; almost, nearly	5.4
-que	enclitic conjunction	and	1.1
qui, quae, quod	relative pronoun	who, which, that	1.1
quia	conjunction	because	2.4
quidam, quaedam, quiddam (or quoddam)	pronoun/adjective	a certain one, somebody, a certain thing	2.4
quidem	adverb	indeed, in fact, at least, certainly	1.3
quies, quietis (f.)	noun	rest, repose, quiet, tranquility, inaction, peace	5.4
quin	conjunction	but that; indeed, in fact; (with imperatives) nay, even	5.3
qui...	quae..., quod...	relative pronoun	who, which, that	1.1
quis, qua, quid	pronoun/adjective	anyone, anything, someone, something (often with si, ne, num, or nisi)	3.1
quis, quid	pronoun/adjective	who, what	2.3
quisquam, quaequam, quicquam (or quidquam)	pronoun/adjective	any, anyone	1.1
quisque, quaeque, quidque (or quodque or quicque)	pronoun/adjective	whoever it be, whatever, each, each one, every, everybody, everyone	3.6
quisquis, quaeque, quodquod (or quidquid or quicquid)	pronoun/adjective	whoever, whosoever, whatever, whatsoever, everyone who, each, every, all	2.4
quo	adverb	to where, in where, where; for which reason, to what end, why, in order that, so that	1.4
quod	conjunction	in that, in respect that, because, since	1.2
quomodo	adverb	in what manner, in what way, how; as, just as	4.1
quoque	adverb	also, too, likewise	1.1
quotannis	adverb	every year, yearly	3.4
radix, -icis (f.)	noun	root	1.4
rapio, -ere, rapui, raptum	verb	to seize, snatch, tear away, carry off, plunder	2.1
ratio, -onis (f.)	noun	reckoning, account, calculation; business, affair; reason, judgment, understanding, motive	3.1
recipio, -ere, -cepi, -ceptum	verb	to take, receive, accept; admit, let in; recover, regain	1.4
recito, -are, -avi, -atum	verb	to read aloud, recite	1.4
reddo, -ere, -didi, -ditum	verb	to give back, return, restore; render, make, cause to be	1.4
rediens, -euntis	adjective	returning	1.4
redigo, -ere, -egi, -actum	verb	to bring back, bring down, collect, gather; reduce	5.4
redeo, -ire, -ii, -itum	verb	to go back, come back, return	1.2
redimo, -ere, -emi, -emptum	verb	to buy back, repurchase; buy up, purchase; redeem, ransom	5.3
refero, referre, retuli, relatum	verb	to bring back, carry back, lead back, return; restore	3.1
regina, -ae (f.)	noun	queen	1.2
regnum, -i (n.)	noun	kingly government, royal power; sovereignty; rule, dominion, realm, kingdom	1.4
rego, -ere, rexi, rectum	verb	to rule, govern, manage, direct, guide	3.1
relinquo, -ere, -liqui, -lictum	verb	to leave behind, leave, abandon, relinquish	1.4
remaneo, -ere, -mansi, -mansum	verb	to stay behind, remain, continue, endure, last	4.6
remus, -i (m.)	noun	oar	4.6
repello, -ere, reppuli, repulsum	verb	to drive back, thrust back, force back, repel, repulse	5.6
reperio, -ire, repperi, repertum	verb	to find again, find, discover, find out	4.1
res, rei (f.)	noun	thing, object, matter, affair, business, circumstance	1.1
res publica, rei publicae (f.)	noun	republic, state, commonwealth	1.4
respondeo, -ere, -spondi, -sponsum	verb	to answer, reply, respond	1.4
retineo, -ere, -tinui, -tentum	verb	to hold back, hold fast, restrain, detain	1.2
rex, regis (m.)	noun	king	1.2
Roma, -ae (f.)	noun (proper)	Rome	1.1
Romanus, -a, -um	adjective	Roman	1.2
rursus or rursum	adverb/adjective	back, backwards; on the contrary, on the other hand; again	1.4
saepe	adverb	often, frequently	1.1
saevus, -a, -um	adjective	furious, raging, savage, fierce, cruel, severe	5.1
salveo, -ere	verb	to be in good health, be well	3.4
salvus, -a, -um	adjective	safe, well, sound, unharmed	3.4
sane	adverb	reasonably, sensibly, with good sense; indeed, to be sure	2.3
sapiens, -entis	adjective	wise, knowing, judicious, discreet	5.3
sapienter	adverb	wisely, judiciously	5.3
satis	adverb	enough, sufficiently	1.2
scientia, -ae (f.)	noun	knowledge, knowing, skill, art, science	5.3
scio, -ire, -ivi or -ii, -itum	verb	to know, understand, have knowledge of	1.2
scribo, -ere, scripsi, scriptum	verb	to scratch, engrave; write, compose	1.1
se, sui, sibi, se, se	reflexive pronoun	himself, herself, itself, themselves	1.1
secundus, -a, -um	adjective	following, next, second; favorable, fortunate	2.1
sed	conjunction	but, on the contrary, on the other hand, however, nevertheless	1.1
semper	adverb	always, ever, at all times, continually, forever	1.2
senex, senis (m.)	noun	old man	1.2
sententia, -ae (f.)	noun	way of thinking, opinion, judgment, view, sentiment	1.4
sentio, -ire, sensi, sensum	verb	to perceive, feel, hear, see, discern, think, believe	2.1
sequor, -i, secutus sum	verb	to follow, come after; pursue, chase	1.4
servus, -i (m.)	noun	slave, servant	1.1
si	conjunction	if, if in fact, granted that, if by chance	1.1
sic	adverb	in this manner, in this way, so, thus, in such a way	1.2
silva, -ae (f.)	noun	forest, woods, woodland, grove	1.4
similis, -e	adjective	like, similar, resembling	1.3
sine	preposition	(with abl.) without	1.3
socius, -i (m.)	noun	companion, partner, ally, comrade	5.4
sol, solis (m.)	noun	the sun, sunlight	4.4
soleo, -ere, solitus sum	verb	to be accustomed, be in the habit of, be wont	3.4
solum, -i (n.)	noun	bottom, ground, floor, soil	4.6
solus, -a, -um	adjective	alone, only, sole	1.3
solvo, -ere, solvi, solutum	verb	to loosen, unbind, release, set free; pay	4.4
sonitus, -us (m.)	noun	sound, noise, din	5.4
specto, -are, -avi, -atum	verb	to look at, watch, behold, see, gaze at	1.1
spes, spei (f.)	noun	hope	1.4
statuo, -ere, -ui, -utum	verb	to cause to stand, set up, station, establish, determine, decide, arrange	4.6
sto, stare, steti, statum	verb	to stand, stand still, stand firm	1.4
studium, -i (n.)	noun	zeal, eagerness, application, interest, devotion, study, pursuit	3.4
sub	preposition	(with abl.) under, below, beneath, at the foot of; (with acc.) up to, toward, under, close to	1.2
subito	adverb	suddenly, unexpectedly	2.1
sum, esse, fui, futurum	verb	to be, exist	1.1
summus, -a, -um	adjective	highest, topmost, uppermost, greatest, chief	1.2
supero, -are, -avi, -atum	verb	to overcome, conquer, defeat, surpass, outdo	3.1
superus, -a, -um	adjective	upper, higher, above, celestial, divine	4.4
surgo, -ere, surrexi, surrectum	verb	to rise, arise, get up, stand up	1.2
suscipio, -ere, -cepi, -ceptum	verb	to take up, catch, receive, undertake, begin, acknowledge	5.6
suus, -a, -um	adjective	his, her, its, their (own)	1.1
tacitus, -a, -um	adjective	silent, not speaking, quiet, still	4.4
talis, -e	adjective	such, of such a kind, such as	2.3
tam	adverb	so, so much, to such a degree	1.2
tamen	adverb	for all that, notwithstanding, nevertheless, yet, still	1.2
tandem	adverb	at length, at last, finally	1.3
tango, -ere, tetigi, tactum	verb	to touch, take hold of, handle	1.2
tantus, -a, -um	adjective	so great, so large, so much, so important	1.4
tego, -ere, texi, tectum	verb	to cover, conceal, hide	4.4
tempestas, -atis (f.)	noun	a time, period, season; weather, bad weather, storm	3.6
templum, -i (n.)	noun	sacred precinct, temple, sanctuary	4.6
tempus, -oris (n.)	noun	time, season, period	1.1
teneo, -ere, -ui, tentum	verb	to hold, have, hold fast, grasp, keep, possess, occupy	1.1
tergum, -i (n.)	noun	back; (as abl. of direction) on the back; behind, in the rear	2.3
terra, -ae (f.)	noun	earth, land, ground	1.2
terreo, -ere, -ui, -itum	verb	to frighten, terrify, alarm	1.4
tertius, -a, -um	adjective	third	1.2
timeo, -ere, -ui	verb	to fear, be afraid, be afraid of, dread	1.2
torus, -i (m.)	noun	bulge, knot; cushion, couch, bed; muscle, brawn	5.4
tot	adjective	so many	2.3
totus, -a, -um	adjective	whole, entire, all of	1.4
trabs, trabis (f.)	noun	tree trunk, log; beam, timber	5.4
trado, -ere, -didi, -ditum	verb	to give over, hand over, deliver, surrender, transmit	3.6
traho, -ere, traxi, tractum	verb	to drag, draw, pull, haul	5.3
trans	preposition	(with acc.) across, over, beyond	5.6
tristis, -e	adjective	sad, sorrowful, dejected, grim, solemn	2.4
tu, tui, tibi, te, te	pronoun	you (s.)	1.1
tum	adverb	at that time, then, thereupon, in the next place	1.1
turba, -ae (f.)	noun	turmoil, uproar; crowd, throng, mob	2.3
turpis, -e	adjective	ugly, unsightly; shameful, disgraceful, base, vile	5.3
tuus, -a, -um	adjective	your, yours (s.)	1.1
ubi	adverb/conjunction	in which place, where; when, as soon as	1.1
ullus, -a, -um	adjective	any, any one	1.4
umquam	adverb	ever, at any time	2.4
unda, -ae (f.)	noun	wave, billow, sea, water	4.4
unde	adverb	from which place, whence, from where	1.3
unus, -a, -um	adjective	one, a single, only	1.1
urbs, urbis (f.)	noun	city	1.1
ut	conjunction/adverb	as, so as, just as; when; in order that, so that; how!	1.1
uxor, -oris (f.)	noun	wife	2.4
validus, -a, -um	adjective	strong, powerful, effective, energetic	3.4
veho, -ere, vexi, vectum	verb	to carry, bear, convey	2.1
vel	conjunction/adverb	or, or even, or possibly	3.4
venio, -ire, veni, ventum	verb	to come	1.1
ventus, -i (m.)	noun	wind, breeze, blast	1.4
verbum, -i (n.)	noun	word	1.1
vero	adverb	in truth, in fact, certainly, indeed	1.4
versus, -us (m.)	noun	a turn, change; line, verse	2.4
vester, -tra, -trum	adjective	your, yours (pl.)	2.4
vestis, -is (f.)	noun	clothing, garment, clothes, robe, dress	2.1
vetus, veteris	adjective	old, aged, ancient	5.3
via, -ae (f.)	noun	way, road, path, street	1.1
video, -ere, vidi, visum	verb	to see, behold, look at	1.1
vir, viri (m.)	noun	man, male person; husband	1.1
virgo, -inis (f.)	noun	maiden, young woman, girl	5.4
virtus, -utis (f.)	noun	manliness, manhood, strength, vigor, bravery, courage, excellence	5.6
vis, vis (f.)	noun	strength, force, vigor, power, energy, virtue	3.6
visito, -are, -avi, -atum	verb	to visit, go to see; look at	5.4
vita, -ae (f.)	noun	life	1.2
vitium, -i (n.)	noun	fault, defect, blemish, imperfection, vice	5.1
vitupero, -are, -avi, -atum	verb	to find fault with, blame, reproach, disparage, scold, censure	5.6
vivo, -ere, vixi, victum	verb	to live, be alive, have life	1.3
vivus, -a, -um	adjective	alive, fresh; living	5.6
vix	adverb	with difficulty, with much ado, hardly, scarcely, barely	2.4
voco, -are, -avi, -atum	verb	to call, summon, invoke, call together, convoke	2.3
volo, -are, -avi, -atum	verb	to fly	5.1
volo, velle, volui	verb	to will, wish, want, purpose, be minded, determine	1.2
voluptas, -atis (f.)	noun	satisfaction, enjoyment, pleasure, delight	3.6
volvo, -ere, volvi, volutum	verb	to cause to revolve, roll, turn about, turn round	4.4
vos, vestrum/vestri, vobis, vos, vobis	pronoun	you (pl.)	2.3
votum, -i (n.)	noun	vow, promise to a god; wish, desire; offering, votive offering	5.4
vox, vocis (f.)	noun	voice, tone, cry, call, sound	2.3
vulgus, -i (n.)	noun	the common people, the multitude, the mass, the public, the mob	5.4
vulnus, -eris (n.)	noun	wound	5.1
vultus, -us (m.)	noun	expression, face, look, countenance	5.1`;

  // Computed signal for filtered vocabulary lines
  filteredWords = computed(() => {
    const lines = this.vocabularyText.split('\n');
    if (this.selectedFilter === 'all') {
      return lines;
    }
    return lines.filter(line => line.includes('\t' + this.selectedFilter + '\t') || line.endsWith('\t' + this.selectedFilter));
  });

  // Method to filter words
  filterWords(filter: string) {
    this.selectedFilter = filter;
  }

  // Method to get section title
  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      'all': 'Complete Word List (Alphabetical Order)',
      '1.1': 'Teacher\'s Choice Prose',
      '1.2': 'Teacher\'s Choice Prose',
      '1.3': 'Teacher\'s Choice Prose',
      '1.4': 'Teacher\'s Choice Prose',
      '2.5': 'Teacher\'s Choice Prose',
      '3.3': 'Teacher\'s Choice Prose',
      '3.6': 'Pliny Book 6; Letters 4 and 7: Letters to Calpurnia',
      '2.1': 'Pliny Book 6; Letter 16: Eruption of Mt. Vesuvius and Pliny the Elder',
      '2.2': 'Pliny Book 6; Letter 16: Eruption of Mt. Vesuvius and Pliny the Elder',
      '2.3': 'Pliny Book 6; Letter 20: Eruption of Mt. Vesuvius and Pliny the Younger',
      '2.4': 'Pliny Book 6; Letter 20: Eruption of Mt. Vesuvius and Pliny the Younger',
      '3.1': 'Pliny Book 7; Letter 27: Ghosts and Apparitions',
      '3.2': 'Pliny Book 7; Letter 27: Ghosts and Apparitions',
      '3.5': 'Pliny Book 10; Letters 5, 6, and 7: Letters to Emperor Trajan, Citizenship for Pliny\'s Doctor',
      '3.4': 'Pliny Book 10; Letters 37 and 90: Letters to Emperor Trajan, Aqueducts',
      '4.1': 'Teacher\'s Choice Poetry',
      '4.2': 'Teacher\'s Choice Poetry',
      '4.3': 'Teacher\'s Choice Poetry',
      '6.1': 'Teacher\'s Choice Poetry',
      '6.2': 'Teacher\'s Choice Poetry',
      '4.4': 'Virgil, Aeneid, Book 1; Lines 1–33: The Epic Begins',
      '4.5': 'Virgil, Aeneid, Book 1; Lines 88–107: The Storm & Lines 496–508: Queen Dido',
      '4.6': 'Virgil, Aeneid, Book 2; Lines 40–56 and 201–249: Laocoön and the Trojan Horse',
      '5.1': 'Virgil, Aeneid, Book 4; Lines 74–89: Dido Feels the Effect of Cupid & Lines 165–197: Rumor Reaches Jupiter',
      '5.2': 'Virgil, Aeneid, Book 4; Lines 305–361: Aeneas Leaves Dido',
      '5.3': 'Virgil, Aeneid, Book 6; Lines 450–476: The Shade of Dido & Lines 788–800 and 847–853: Meeting Anchises',
      '5.4': 'Virgil, Aeneid, Book 7; Lines 45–58: King Latinus & Lines 783–792 and 803–817: Turnus Prepares for War',
      '5.5': 'Virgil, Aeneid, Book 11; Lines 532–594: The Story of Camilla',
      '5.6': 'Virgil, Aeneid, Book 12; Lines 791–796, 803–812, and 818–828: The Fate of the Trojans Is Decided',
      '5.7': 'Virgil, Aeneid, Book 12; Lines 919–952: The Final Battle of Aeneas and Turnus'
    };
    return titles[this.selectedFilter] || 'Vocabulary List';
  }
}
