import type { Album, AlbumId, Song } from './types';

type Language = 'pt-BR' | 'en';
type AlbumCopy = Pick<Album, 'estetica' | 'descricao' | 'destaque' | 'edicao'>;
type SongCopy = Pick<Song, 'justificativa' | 'contexto'>;

const albumsEn: Record<AlbumId, AlbumCopy> = {
  evermore: {
    estetica: 'Indie folk · autumn · interwoven stories',
    edicao: 'Deluxe',
    descricao:
      'Love ends and memories linger. Flawed characters, acoustic textures and feelings ' +
      'that change with each listen give these stories room to grow.',
    destaque: 'The piano in champagne problems turns a farewell into a miniature film.',
  },
  folklore: {
    estetica: 'Indie folk · mist · memory and fiction',
    edicao: 'Deluxe',
    descricao:
      'Every detail tells a story in this quiet retreat. Narrators cross paths, summer ' +
      'recedes into memory and intimacy takes center stage.',
    destaque: 'The instrumental expansion of august makes a vanished summer feel close again.',
  },
  reputation: {
    estetica: 'Electropop · nighttime · vulnerability and reinvention',
    edicao: 'Standard',
    descricao:
      'The beats are bold and the romance guarded. Theatrical gestures meet tenderness ' +
      'in a record full of contrasts and expansive choruses.',
    destaque: 'Getaway Car brings flight and guilt together in a chorus that invites another lap.',
  },
};

const songsEn: Record<string, SongCopy> = {
  'evermore-01': {
    justificativa:
      'A circling guitar figure and a winding melody make the opening feel like an ' +
      'invitation. The story leaves a few threads loose, but that unbroken musical ' +
      'spell makes it easy to put the song on repeat.',
    contexto: 'The opener draws us into the acoustic, mysterious world of evermore.',
  },
  'evermore-02': {
    justificativa:
      'A rejected proposal comes into focus through small objects and the reactions ' +
      'of people around the couple. The spare piano leaves the bridge room to land. ' +
      'That shift from private doubt to public heartbreak earns the first spot in ' +
      'this collection.',
    contexto:
      'A piano ballad sets a couple’s private decision against an entire family’s ' +
      'expectations.',
  },
  'evermore-03': {
    justificativa:
      'The weightless opening gives way to a rush of glittering pop, about as fast as ' +
      'a daydream taking shape. Attraction and jealousy keep cutting into each other. ' +
      'The tightly built fantasy invites a replay even if the story ends where it ' +
      'began.',
    contexto: 'A bright pop interlude on a folk record, built around an imagined attraction.',
  },
  'evermore-04': {
    justificativa:
      'A repeating guitar line holds two kinds of homecoming in tension. Familiar ' +
      'places and everyday words give a temporary reunion real weight. Its restraint ' +
      'makes the encounter believable but keeps the song just below the album’s ' +
      'peaks.',
    contexto:
      'A visit to a hometown rekindles a relationship strained by distance and ' +
      'different choices.',
  },
  'evermore-05': {
    justificativa:
      'The piano’s uneven pulse makes an unequal relationship audible. Quiet devotion ' +
      'gradually gives way to the thought of leaving. Even on a familiar listen, that ' +
      'last shift holds its tension.',
    contexto:
      'One partner offers love and attention while the other seems merely to put up ' +
      'with them.',
  },
  'evermore-06': {
    justificativa:
      'The country arrangement makes room for a mystery with clues, reversals and a ' +
      'streak of dark humor. The first listen is especially gripping. Once the ending ' +
      'is familiar, it offers fewer surprises than the album’s more open stories.',
    contexto:
      'A fictional crime and revenge tale featuring HAIM, in the tradition of country ' +
      'story songs.',
  },
  'evermore-07': {
    justificativa:
      'A relationship can have held real happiness and still need to end. The ' +
      'slow-building arrangement lets gratitude and hurt coexist. The strength here ' +
      'is the emotional patience of the writing, which asks for closer listening than ' +
      'a big pop hook.',
    contexto: 'A breakup ballad in which gratitude does not erase pain.',
  },
  'evermore-08': {
    justificativa:
      'The loose piano and welcoming chorus make the imagined reunion feel familiar. ' +
      'There is affection and a little irony in the voice of the friend who stayed ' +
      'behind. The music takes a more predictable path than the album’s sharpest ' +
      'character studies.',
    contexto: 'Someone back home watches a friend become a distant public figure.',
  },
  'evermore-09': {
    justificativa:
      'The two voices turn regret into a conversation in which the speakers keep ' +
      'missing each other. The subdued backing and images of neglect reward ' +
      'attention, though the melody moves with less momentum than the album’s ' +
      'strongest duets.',
    contexto:
      'A duet with The National about the small omissions that can pull partners ' + 'apart.',
  },
  'evermore-10': {
    justificativa:
      'Plucked strings and a bright melody bring light into a dangerous love affair. ' +
      'The plant imagery grows through the song without becoming hard to follow. ' +
      'Musical details and a sense of risk give each return to the chorus a fresh ' +
      'charge.',
    contexto:
      'Nature imagery frames a forbidden romance as a question of belonging and ' + 'intrusion.',
  },
  'evermore-11': {
    justificativa:
      'The unhurried country arrangement gives two wary people time to recognize each ' +
      'other. The ending leaves love and self-interest hard to separate. Its ' +
      'strongest moments live in the delivery and the things the characters leave ' +
      'unsaid.',
    contexto: 'Two opportunists find an affinity that neither can quite explain.',
  },
  'evermore-12': {
    justificativa:
      'Quick percussion puts the record back in motion as the narrator looks back on ' +
      'surviving a conflict. The chorus holds up well on repeat. Some compressed ' +
      'references leave less room for the particular details that distinguish the ' +
      'album’s best stories.',
    contexto: 'A brisk pop account of conflict and rebuilding, told with a sense of humor.',
  },
  'evermore-13': {
    justificativa:
      'Advice, small regrets and a voice preserved in the recording give memory a ' +
      'physical presence. Each new layer adds to the sense of absence. Those concrete ' +
      'details make it one of the album’s most lasting songs.',
    contexto:
      'A tribute to Swift’s grandmother Marjorie Finlay, whose voice appears on the ' +
      'recording.',
  },
  'evermore-14': {
    justificativa:
      'A rough drum pattern rubs against uneven piano phrases as the narrator resists ' +
      'an easy reconciliation. That friction fits the subject precisely. It also ' +
      'makes this a tougher repeat listen than songs with a more expansive chorus.',
    contexto:
      'The narrator challenges the assumption that forgiveness or friendship must ' +
      'follow a hurt.',
  },
  'evermore-15': {
    justificativa:
      'A wintry piano figure loses its footing when Bon Iver joins, then finds its ' +
      'way back. Hope feels earned because the music changes with the narrator. Its ' +
      'unusual structure pays off most clearly when heard from beginning to end.',
    contexto:
      'The standard edition closes with the possibility of a future beyond seemingly ' +
      'permanent pain.',
  },
  'evermore-16': {
    justificativa:
      'A restaurant scene becomes the map of a life standing still. An insistent beat ' +
      'moves underneath a narrator who cannot move on. The sharply observed detail ' +
      'and gathering tension lift this bonus track into the top tier.',
    contexto:
      'Time keeps moving for everyone except the person left behind in this deluxe ' +
      'edition track.',
  },
  'evermore-17': {
    justificativa:
      'A spare arrangement supports a clear idea about knowing when to leave. It ' +
      'gives the deluxe edition a fitting close, though the familiar progression and ' +
      'direct explanation offer fewer surprises than the songs above it.',
    contexto: 'The final deluxe track reflects on boundaries and goodbyes.',
  },
  'folklore-01': {
    justificativa:
      'Light piano and quietly ticking drums leave nostalgia room to breathe. The ' +
      'narrator can imagine another life without turning it into a crisis. That ' +
      'balance makes the opener easy to revisit, if less dramatic than the album’s ' +
      'high points.',
    contexto:
      'An intimate opening that moves between acceptance and the pleasure of ' +
      'imagining an alternative.',
  },
  'folklore-02': {
    justificativa:
      'The close vocal, piano and understated percussion give a memory texture. ' +
      'Images return with new meaning as the melody unfolds. By the bridge, the song ' +
      'has earned both its narrative reach and the release of its chorus.',
    contexto: 'One perspective in the fictional triangle revisited in august and betty.',
  },
  'folklore-03': {
    justificativa:
      'Parties, social judgment and the changing ownership of a house move briskly ' +
      'through the verses. A late shift in perspective gives the story an excellent ' +
      'ending, while the arrangement stays more constant than the writing.',
    contexto:
      'Rebekah Harkness’s story links a woman from the house’s past to its present ' + 'narrator.',
  },
  'folklore-04': {
    justificativa:
      'The contrast between voices stages a conversation in which neither speaker ' +
      'feels heard. Piano leaves space for the overlapping replies to build. The ' +
      'musical shape of the argument makes the final passage hit especially hard.',
    contexto: 'Bon Iver and Swift give incompatible accounts of the same breakup.',
  },
  'folklore-05': {
    justificativa:
      'A funeral scene gives betrayal and grief room to mean several things at once. ' +
      'Ghostly voices and rising percussion put more weight on each return to the ' +
      'chorus. Concept, performance and climax make it the editorial favorite on ' +
      'folklore.',
    contexto:
      'A wounded narrator addresses a farewell that can be read in both personal and ' +
      'professional terms.',
  },
  'folklore-06': {
    justificativa:
      'Hazy guitars and a delicate vocal make the need for approval almost tangible. ' +
      'The central image stays vulnerable even at its shiniest. Details that seem ' +
      'slight at first grow more audible with each listen.',
    contexto: 'A portrait of adapting to an audience and trying to keep its attention.',
  },
  'folklore-07': {
    justificativa:
      'A high vocal line and a gentle arrangement preserve the partial understanding ' +
      'of childhood memory. Affection sits alongside signs of trouble that the ' +
      'narrator cannot quite explain. The unresolved details keep opening up on ' +
      'repeat listens.',
    contexto:
      'An adult remembers a childhood friendship with tenderness and an incomplete ' +
      'view of the past.',
  },
  'folklore-08': {
    justificativa:
      'An intimate recollection swells into waves of guitars and strings. The ' +
      'narrator finds dignity in a summer relationship that meant different things to ' +
      'the two people in it. The bridge and coda give longing a striking sense of ' +
      'motion.',
    contexto:
      'The summer affair in folklore’s triangle, told by the person who hoped it ' + 'would last.',
  },
  'folklore-09': {
    justificativa:
      'The misty production surrounds a confession that stops short of an easy ' +
      'victory. Simply showing up carries emotional weight. Its restrained delivery ' +
      'and layered backing reward quiet attention.',
    contexto:
      'Someone struggling with regret tries to reconnect and asks for that effort to ' + 'be seen.',
  },
  'folklore-10': {
    justificativa:
      'A quiet guitar arrangement gives way to a bridge that changes the scale of the ' +
      'hurt. The small rituals of secrecy show what the relationship costs. Its short ' +
      'form encourages a replay, even as the recording keeps the outburst contained.',
    contexto:
      'A hidden relationship seen through everyday exhaustion and unequal emotional ' + 'stakes.',
  },
  'folklore-11': {
    justificativa:
      'A recurring plucked figure threads together coincidences and turning points. ' +
      'The light melody offers a welcome pause. Its comforting sense of destiny ' +
      'leaves less room for tension than the album’s more ambivalent songs.',
    contexto:
      'Two apparently separate paths seem, in hindsight, to have led to the same ' + 'meeting.',
  },
  'folklore-12': {
    justificativa:
      'Dark piano and controlled phrasing sharpen the criticism of people who dismiss ' +
      'anger. The perspective is incisive. A steady progression and repeated ideas ' +
      'give it less musical reach than the tracks above it.',
    contexto:
      'A reflection on provocation, power and the use of a woman’s reaction against ' + 'her.',
  },
  'folklore-13': {
    justificativa:
      'Open vocal harmonies and suspended sounds create space for experiences of ' +
      'shock and care. The parallel scenes are affecting. Their slow pace and limited ' +
      'resolution make this a song that benefits from a particular mood.',
    contexto:
      'The song draws connections between wartime experience and frontline medical ' + 'work.',
  },
  'folklore-14': {
    justificativa:
      'Acoustic guitar and harmonica frame an adolescent apology in country ' +
      'storytelling. James mixes remorse with shaky excuses. The last chorus offers ' +
      'real melodic satisfaction while his contradictions linger.',
    contexto: 'James’s perspective completes the triangle introduced in cardigan and august.',
  },
  'folklore-15': {
    justificativa:
      'A steady pulse and lean backing leave one difficult question exposed: can love ' +
      'be enough when life stays unsettled? The vocal gives that uncertainty weight. ' +
      'The writing avoids a neat promise, even at the expense of an easy singalong.',
    contexto:
      'A declaration of commitment that also acknowledges the limits of what one ' +
      'person can offer another.',
  },
  'folklore-16': {
    justificativa:
      'Cold piano and an almost motionless vocal hold together a series of images of ' +
      'loss. Their ambiguity invites several readings, but the narrative makes little ' +
      'forward movement. It works especially well as a quiet closing track.',
    contexto: 'The standard edition ends with open questions about loss, loyalty and staying.',
  },
  'folklore-17': {
    justificativa:
      'Strings and literary imagery build a fantasy of retreat from public scrutiny. ' +
      'An elegant melody sustains the romantic atmosphere. Some of the more ornate ' +
      'images carry less immediate force than the album’s plainest lines.',
    contexto:
      'The deluxe bonus track evokes the Lake District and a desire for creative ' + 'privacy.',
  },
  'reputation-01': {
    justificativa:
      'Heavy bass and rhythmic verses open into a chorus that sounds like a romantic ' +
      'daydream. The collision introduces the album’s two sides with energy. Its ' +
      'sections feel less emotionally continuous than the romances near the top.',
    contexto:
      'The opener sets a public suit of armor against the intimacy of a new ' + 'attraction.',
  },
  'reputation-02': {
    justificativa:
      'An open beat and contrasting guest verses widen the conversation about desire ' +
      'and reputation. The hook is effective, but the switches between speakers ' +
      'diffuse the story and give the melody less room to develop.',
    contexto:
      'Future and Ed Sheeran join a pop collaboration about wanting to be someone’s ' +
      'lasting partner.',
  },
  'reputation-03': {
    justificativa:
      'Heavy production and chopped vocals turn provocation into a performance. The ' +
      'bridge pushes the drama higher without losing the beat. Its energy is a draw, ' +
      'though the larger-than-life character leaves fewer emotional shades.',
    contexto:
      'One of the record’s most confrontational songs, staged as a declaration of ' + 'control.',
  },
  'reputation-04': {
    justificativa:
      'Rising synths and gospel-inflected voices turn romantic obsession into a ' +
      'ceremony. The vocal climax delivers on the long buildup. Its melodic power ' +
      'makes it easy to revisit even with less emphasis on narrative detail.',
    contexto: 'An extreme declaration of passion builds toward one of the era’s vocal peaks.',
  },
  'reputation-05': {
    justificativa:
      'Processed vocals and a light beat make insecurity feel unusually close. Small ' +
      'gestures build the tension of a first attraction. Fragility, groove and a ' +
      'memorable chorus hold each other in balance throughout.',
    contexto:
      'The excitement of liking someone is complicated by worries about public ' + 'perception.',
  },
  'reputation-06': {
    justificativa:
      'A dry arrangement and a repeated chorus make revenge into pop theater. Its ' +
      'identity is instant and the bridge is playful. Repetition leaves less melodic ' +
      'development to discover on later listens.',
    contexto:
      'The lead single dramatizes a change of public persona and a struggle to ' +
      'control the story.',
  },
  'reputation-07': {
    justificativa:
      'Dark synths, low bass and a close vocal establish a consistent nighttime mood. ' +
      'The tension builds quietly and the chorus rewards the wait. Less specific ' +
      'writing places it below the album’s more sharply pictured encounters.',
    contexto: 'A relationship becomes a game of attraction, power and briefly lost control.',
  },
  'reputation-08': {
    justificativa:
      'Bright production and self-aware humor lighten an awkward crush. The catchy ' +
      'chorus embraces the narrator’s loss of composure. The playful simplicity gives ' +
      'it fewer layers than the era’s strongest love songs.',
    contexto: 'A colorful comic interlude within the darker sound of reputation.',
  },
  'reputation-09': {
    justificativa:
      'The escape metaphor organizes the romance into a chase scene. Racing synths, a ' +
      'sharply timed chorus and an explosive bridge all move the story forward. It is ' +
      'the album’s strongest pairing of narrative and pop momentum in this ranking.',
    contexto:
      'A relationship begins as an exit from another one, with the possibility of ' +
      'abandonment already in view.',
  },
  'reputation-10': {
    justificativa:
      'Broad percussion and electronic vocals give surrender a physical scale. The ' +
      'bridge introduces everyday details that bring the romance down to earth. A few ' +
      'transitions feel less fluid than on the album’s strongest tracks.',
    contexto:
      'An unexpected connection makes a once self-sufficient narrator reconsider what ' +
      'she wants.',
  },
  'reputation-11': {
    justificativa:
      'A fast pulse turns the fear of losing someone into movement. The melody keeps ' +
      'the urgency and the vulnerability together. The beat feels free even while the ' +
      'narrator senses limits closing in.',
    contexto:
      'The narrator experiences a relationship intensely while anticipating the ' +
      'pressures that could threaten it.',
  },
  'reputation-12': {
    justificativa:
      'Breathy vocals and an open arrangement make desire sound like a private ' +
      'conversation. The bridge adds memory and recognition to the attraction. Space ' +
      'in the production keeps the intimacy vivid on repeat listens.',
    contexto:
      'The narrator wants to cross an unspoken boundary and be known beyond outward ' +
      'appearances.',
  },
  'reputation-13': {
    justificativa:
      'Percussive piano and a party chorus turn a friendship breakup into a playful ' +
      'taunt. The scene is funny, but the repeated structure and broad caricature ' +
      'leave fewer emotional details to return to.',
    contexto:
      'A sarcastic farewell to relationships damaged by broken trust and public ' + 'attention.',
  },
  'reputation-14': {
    justificativa:
      'A soft beat and layers of vocals create a refuge within the louder record. ' +
      'Images of care and recovery give the romance texture. The unhurried chorus ' +
      'makes it one of the album’s most comforting tracks to revisit.',
    contexto: 'After a public fall, attention shifts to a connection lived in private.',
  },
  'reputation-15': {
    justificativa:
      'Unadorned piano brings the album from big gestures to the simple work that ' +
      'follows a party. An ordinary act of care makes the promise convincing. The ' +
      'ending carries its affection quietly and precisely.',
    contexto: 'An acoustic closer finds intimacy in staying for the next morning’s cleanup.',
  },
};

export function songText(song: Song, lang: Language): SongCopy {
  return lang === 'en' ? (songsEn[song.id] ?? song) : song;
}

export function albumText(album: Album, lang: Language): AlbumCopy {
  return lang === 'en' ? albumsEn[album.id] : album;
}
