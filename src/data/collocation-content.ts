export type CollocationPattern =
  | "adjective_preposition"
  | "verb_preposition"
  | "noun_preposition"
  | "phrasal_verb"
  | "prepositional_phrase";

export type PartOfSpeech = "adjective" | "verb" | "noun" | "phrase";
export type Difficulty = "Core" | "Medium" | "Advanced";
export type ExamRelevance = "High" | "Medium" | "Supporting";
export type SourceType = "dictionary" | "grammar_reference" | "tutor_review";
export type Status = "published" | "draft" | "archived";
export type OptionKey = "A" | "B" | "C" | "D";
export type QuestionType =
  | "missing_preposition"
  | "sentence_completion"
  | "natural_pair"
  | "meaning_contrast";

export type CollocationEntry = {
  id: string;
  order: number;
  headword: string;
  partner: string;
  fullPhrase: string;
  partOfSpeech: PartOfSpeech;
  pattern: CollocationPattern;
  indonesianMeaning: string;
  usageNote: string;
  commonMistake: string;
  exampleSentence: string;
  exampleTranslation: string;
  topic: string;
  difficulty: Difficulty;
  examRelevance: ExamRelevance;
  sourceType: SourceType;
  sourceName: string;
  urlOrCitation: string;
  accessedAt: string;
  claimAllowed: boolean;
  sourceNote: string;
  status: Status;
};

export type QuizOption = {
  key: OptionKey;
  text: string;
};

export type QuizQuestion = {
  id: string;
  entryId: string;
  packageId: string;
  questionType: QuestionType;
  prompt: string;
  options: QuizOption[];
  correctKey: OptionKey;
  explanation: string;
};

export type LearningPackage = {
  id: string;
  title: string;
  order: number;
  description: string;
  entries: CollocationEntry[];
  questions: QuizQuestion[];
};

type SeedEntry = {
  phrase: string;
  pattern: CollocationPattern;
  meaning: string;
  example: string;
  translation: string;
  topic: string;
  difficulty?: Difficulty;
  examRelevance?: ExamRelevance;
};

const EXPECTED_ENTRY_TOTAL = 100;
const QUESTIONS_PER_PACKAGE = 10;
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

const seeds: SeedEntry[] = [
  { phrase: "afraid of", pattern: "adjective_preposition", meaning: "takut pada", example: "She is afraid of spiders.", translation: "Dia takut pada laba-laba.", topic: "emotion", difficulty: "Core", examRelevance: "High" },
  { phrase: "aware of", pattern: "adjective_preposition", meaning: "sadar akan", example: "Students are aware of the deadline.", translation: "Siswa sadar akan tenggat waktu.", topic: "study", difficulty: "Core", examRelevance: "High" },
  { phrase: "capable of", pattern: "adjective_preposition", meaning: "mampu melakukan", example: "The device is capable of storing large files.", translation: "Perangkat itu mampu menyimpan file besar.", topic: "technology", examRelevance: "High" },
  { phrase: "full of", pattern: "adjective_preposition", meaning: "penuh dengan", example: "The article is full of useful examples.", translation: "Artikel itu penuh dengan contoh berguna.", topic: "academic" },
  { phrase: "proud of", pattern: "adjective_preposition", meaning: "bangga pada", example: "Parents are proud of their children's progress.", translation: "Orang tua bangga pada kemajuan anak-anak mereka.", topic: "daily-life" },
  { phrase: "tired of", pattern: "adjective_preposition", meaning: "bosan atau lelah dengan", example: "Many workers are tired of repeated delays.", translation: "Banyak pekerja bosan dengan penundaan berulang.", topic: "work" },
  { phrase: "similar to", pattern: "adjective_preposition", meaning: "mirip dengan", example: "This method is similar to the previous one.", translation: "Metode ini mirip dengan metode sebelumnya.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "married to", pattern: "adjective_preposition", meaning: "menikah dengan", example: "He is married to a teacher.", translation: "Dia menikah dengan seorang guru.", topic: "daily-life" },
  { phrase: "committed to", pattern: "adjective_preposition", meaning: "berkomitmen pada", example: "The team is committed to improving service.", translation: "Tim itu berkomitmen untuk meningkatkan layanan.", topic: "work", difficulty: "Core", examRelevance: "High" },
  { phrase: "addicted to", pattern: "adjective_preposition", meaning: "kecanduan pada", example: "Some users are addicted to short videos.", translation: "Sebagian pengguna kecanduan video pendek.", topic: "media" },
  { phrase: "opposed to", pattern: "adjective_preposition", meaning: "menentang", example: "Several members are opposed to the proposal.", translation: "Beberapa anggota menentang usulan itu.", topic: "policy", examRelevance: "High" },
  { phrase: "responsible for", pattern: "adjective_preposition", meaning: "bertanggung jawab atas", example: "She is responsible for managing the schedule.", translation: "Dia bertanggung jawab mengelola jadwal.", topic: "work", difficulty: "Core", examRelevance: "High" },
  { phrase: "famous for", pattern: "adjective_preposition", meaning: "terkenal karena", example: "The city is famous for its old bridges.", translation: "Kota itu terkenal karena jembatan-jembatan tuanya.", topic: "travel" },
  { phrase: "suitable for", pattern: "adjective_preposition", meaning: "cocok untuk", example: "This course is suitable for beginners.", translation: "Kursus ini cocok untuk pemula.", topic: "study", examRelevance: "High" },
  { phrase: "ready for", pattern: "adjective_preposition", meaning: "siap untuk", example: "The class is ready for the final review.", translation: "Kelas itu siap untuk review akhir.", topic: "study" },
  { phrase: "interested in", pattern: "adjective_preposition", meaning: "tertarik pada", example: "Many students are interested in public policy.", translation: "Banyak siswa tertarik pada kebijakan publik.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "involved in", pattern: "adjective_preposition", meaning: "terlibat dalam", example: "The researcher is involved in a climate project.", translation: "Peneliti itu terlibat dalam proyek iklim.", topic: "research", examRelevance: "High" },
  { phrase: "good at", pattern: "adjective_preposition", meaning: "bagus dalam", example: "She is good at solving logic problems.", translation: "Dia bagus dalam memecahkan soal logika.", topic: "skill" },
  { phrase: "bad at", pattern: "adjective_preposition", meaning: "kurang baik dalam", example: "He is bad at estimating travel time.", translation: "Dia kurang baik dalam memperkirakan waktu perjalanan.", topic: "skill" },
  { phrase: "angry with", pattern: "adjective_preposition", meaning: "marah kepada", example: "The manager was angry with the supplier.", translation: "Manajer itu marah kepada pemasok.", topic: "work" },
  { phrase: "different from", pattern: "adjective_preposition", meaning: "berbeda dari", example: "The result is different from our prediction.", translation: "Hasilnya berbeda dari prediksi kami.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "dependent on", pattern: "adjective_preposition", meaning: "bergantung pada", example: "The schedule is dependent on weather conditions.", translation: "Jadwal itu bergantung pada kondisi cuaca.", topic: "planning", examRelevance: "High" },
  { phrase: "keen on", pattern: "adjective_preposition", meaning: "sangat tertarik pada", example: "The children are keen on science activities.", translation: "Anak-anak sangat tertarik pada kegiatan sains.", topic: "study" },
  { phrase: "close to", pattern: "adjective_preposition", meaning: "dekat dengan", example: "The school is close to the station.", translation: "Sekolah itu dekat dengan stasiun.", topic: "place" },
  { phrase: "absent from", pattern: "adjective_preposition", meaning: "tidak hadir dari", example: "The student was absent from class yesterday.", translation: "Siswa itu tidak hadir dari kelas kemarin.", topic: "school" },
  { phrase: "apply for", pattern: "verb_preposition", meaning: "melamar atau mendaftar untuk", example: "Many graduates apply for government jobs.", translation: "Banyak lulusan melamar pekerjaan pemerintah.", topic: "work", difficulty: "Core", examRelevance: "High" },
  { phrase: "belong to", pattern: "verb_preposition", meaning: "milik atau termasuk dalam", example: "These documents belong to the finance division.", translation: "Dokumen ini milik divisi keuangan.", topic: "administration" },
  { phrase: "consist of", pattern: "verb_preposition", meaning: "terdiri dari", example: "The modules consist of short lessons.", translation: "Modul-modul itu terdiri dari pelajaran singkat.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "depend on", pattern: "verb_preposition", meaning: "bergantung pada", example: "Final results depend on accurate data.", translation: "Hasil akhir bergantung pada data yang akurat.", topic: "research", difficulty: "Core", examRelevance: "High" },
  { phrase: "listen to", pattern: "verb_preposition", meaning: "mendengarkan", example: "Students listen to instructions carefully.", translation: "Siswa mendengarkan instruksi dengan cermat.", topic: "school" },
  { phrase: "look at", pattern: "verb_preposition", meaning: "melihat ke atau memperhatikan", example: "Please look at the chart before answering.", translation: "Silakan lihat grafik sebelum menjawab.", topic: "test" },
  { phrase: "look for", pattern: "phrasal_verb", meaning: "mencari", example: "Researchers look for patterns in the data.", translation: "Peneliti mencari pola dalam data.", topic: "research" },
  { phrase: "look after", pattern: "phrasal_verb", meaning: "merawat atau menjaga", example: "Nurses look after patients in the ward.", translation: "Perawat merawat pasien di bangsal.", topic: "health" },
  { phrase: "look forward to", pattern: "phrasal_verb", meaning: "menantikan", example: "We look forward to meeting you next week.", translation: "Kami menantikan bertemu Anda minggu depan.", topic: "communication", difficulty: "Core", examRelevance: "High" },
  { phrase: "agree with", pattern: "verb_preposition", meaning: "setuju dengan orang/pendapat", example: "I agree with your explanation.", translation: "Saya setuju dengan penjelasan Anda.", topic: "communication", examRelevance: "High" },
  { phrase: "agree on", pattern: "verb_preposition", meaning: "sepakat tentang topik/keputusan", example: "The committee agreed on a new schedule.", translation: "Komite sepakat tentang jadwal baru.", topic: "meeting", examRelevance: "High" },
  { phrase: "apologize for", pattern: "verb_preposition", meaning: "meminta maaf atas", example: "They apologize for the delay.", translation: "Mereka meminta maaf atas keterlambatan.", topic: "communication" },
  { phrase: "believe in", pattern: "verb_preposition", meaning: "percaya pada", example: "Good leaders believe in transparent decisions.", translation: "Pemimpin yang baik percaya pada keputusan yang transparan.", topic: "leadership" },
  { phrase: "care about", pattern: "verb_preposition", meaning: "peduli tentang", example: "The organization cares about public safety.", translation: "Organisasi itu peduli tentang keselamatan publik.", topic: "society" },
  { phrase: "deal with", pattern: "verb_preposition", meaning: "menangani", example: "The unit deals with student complaints.", translation: "Unit itu menangani keluhan siswa.", topic: "administration", examRelevance: "High" },
  { phrase: "focus on", pattern: "verb_preposition", meaning: "fokus pada", example: "This chapter focuses on sentence structure.", translation: "Bab ini fokus pada struktur kalimat.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "wait for", pattern: "verb_preposition", meaning: "menunggu", example: "Passengers wait for the next train.", translation: "Penumpang menunggu kereta berikutnya.", topic: "travel" },
  { phrase: "suffer from", pattern: "verb_preposition", meaning: "menderita karena", example: "Some residents suffer from air pollution.", translation: "Sebagian warga menderita karena polusi udara.", topic: "health", examRelevance: "High" },
  { phrase: "refer to", pattern: "verb_preposition", meaning: "merujuk pada", example: "The note refers to the previous regulation.", translation: "Catatan itu merujuk pada peraturan sebelumnya.", topic: "academic", difficulty: "Core", examRelevance: "High" },
  { phrase: "rely on", pattern: "verb_preposition", meaning: "mengandalkan", example: "Small businesses rely on local customers.", translation: "Usaha kecil mengandalkan pelanggan lokal.", topic: "business" },
  { phrase: "remind of", pattern: "verb_preposition", meaning: "mengingatkan pada", example: "These photos remind me of home.", translation: "Foto-foto ini mengingatkan saya pada rumah.", topic: "daily-life" },
  { phrase: "spend on", pattern: "verb_preposition", meaning: "menghabiskan untuk", example: "Families spend money on education.", translation: "Keluarga menghabiskan uang untuk pendidikan.", topic: "finance" },
  { phrase: "advantage of", pattern: "noun_preposition", meaning: "keuntungan dari", example: "One advantage of online learning is flexibility.", translation: "Salah satu keuntungan dari pembelajaran online adalah fleksibilitas.", topic: "education" },
  { phrase: "reason for", pattern: "noun_preposition", meaning: "alasan untuk", example: "The reason for the change was unclear.", translation: "Alasan untuk perubahan itu tidak jelas.", topic: "administration", examRelevance: "High" },
  { phrase: "next to", pattern: "prepositional_phrase", meaning: "di sebelah", example: "The library is next to the main office.", translation: "Perpustakaan berada di sebelah kantor utama.", topic: "place" },
  { phrase: "access to", pattern: "noun_preposition", meaning: "akses ke", example: "Students need access to reliable materials.", translation: "Siswa membutuhkan akses ke materi yang dapat dipercaya.", topic: "education", examRelevance: "High" },
  { phrase: "attitude toward", pattern: "noun_preposition", meaning: "sikap terhadap", example: "Her attitude toward feedback is positive.", translation: "Sikapnya terhadap umpan balik positif.", topic: "behavior" },
  { phrase: "demand for", pattern: "noun_preposition", meaning: "permintaan atas", example: "Demand for skilled workers is increasing.", translation: "Permintaan atas pekerja terampil meningkat.", topic: "economy" },
  { phrase: "increase in", pattern: "noun_preposition", meaning: "peningkatan dalam", example: "There was an increase in student participation.", translation: "Ada peningkatan dalam partisipasi siswa.", topic: "statistics", examRelevance: "High" },
  { phrase: "solution to", pattern: "noun_preposition", meaning: "solusi untuk", example: "The solution to the problem is simple.", translation: "Solusi untuk masalah itu sederhana.", topic: "problem-solving", examRelevance: "High" },
  { phrase: "contribution to", pattern: "noun_preposition", meaning: "kontribusi terhadap", example: "Her contribution to the project was significant.", translation: "Kontribusinya terhadap proyek itu signifikan.", topic: "work" },
  { phrase: "effect on", pattern: "noun_preposition", meaning: "pengaruh pada", example: "Noise has an effect on concentration.", translation: "Kebisingan memiliki pengaruh pada konsentrasi.", topic: "research", examRelevance: "High" },
  { phrase: "impact on", pattern: "noun_preposition", meaning: "dampak pada", example: "Technology has an impact on communication.", translation: "Teknologi memiliki dampak pada komunikasi.", topic: "technology", examRelevance: "High" },
  { phrase: "preference for", pattern: "noun_preposition", meaning: "preferensi terhadap", example: "She has a preference for visual explanations.", translation: "Dia memiliki preferensi terhadap penjelasan visual.", topic: "study" },
  { phrase: "relationship with", pattern: "noun_preposition", meaning: "hubungan dengan", example: "The school maintains a relationship with alumni.", translation: "Sekolah menjaga hubungan dengan alumni.", topic: "institution" },
  { phrase: "relevant to", pattern: "adjective_preposition", meaning: "relevan dengan", example: "The evidence is relevant to the case.", translation: "Bukti itu relevan dengan kasus tersebut.", topic: "law", examRelevance: "High" },
  { phrase: "related to", pattern: "adjective_preposition", meaning: "berhubungan dengan", example: "This issue is related to data quality.", translation: "Isu ini berhubungan dengan kualitas data.", topic: "research", examRelevance: "High" },
  { phrase: "accustomed to", pattern: "adjective_preposition", meaning: "terbiasa dengan", example: "Students are accustomed to online quizzes.", translation: "Siswa terbiasa dengan kuis online.", topic: "education" },
  { phrase: "eligible for", pattern: "adjective_preposition", meaning: "memenuhi syarat untuk", example: "Applicants are eligible for the scholarship.", translation: "Pelamar memenuhi syarat untuk beasiswa.", topic: "administration" },
  { phrase: "familiar with", pattern: "adjective_preposition", meaning: "akrab dengan", example: "The team is familiar with the software.", translation: "Tim itu akrab dengan perangkat lunak tersebut.", topic: "technology" },
  { phrase: "concerned about", pattern: "adjective_preposition", meaning: "khawatir tentang", example: "Parents are concerned about screen time.", translation: "Orang tua khawatir tentang waktu layar.", topic: "family" },
  { phrase: "confused about", pattern: "adjective_preposition", meaning: "bingung tentang", example: "Some learners are confused about prepositions.", translation: "Sebagian pembelajar bingung tentang preposisi.", topic: "grammar" },
  { phrase: "known for", pattern: "adjective_preposition", meaning: "dikenal karena", example: "The town is known for its traditional market.", translation: "Kota itu dikenal karena pasar tradisionalnya.", topic: "travel" },
  { phrase: "late for", pattern: "adjective_preposition", meaning: "terlambat untuk", example: "He was late for the interview.", translation: "Dia terlambat untuk wawancara.", topic: "work" },
  { phrase: "short of", pattern: "adjective_preposition", meaning: "kekurangan", example: "The clinic is short of medical supplies.", translation: "Klinik itu kekurangan persediaan medis.", topic: "health" },
  { phrase: "rich in", pattern: "adjective_preposition", meaning: "kaya akan", example: "The soil is rich in minerals.", translation: "Tanah itu kaya akan mineral.", topic: "science" },
  { phrase: "based on", pattern: "adjective_preposition", meaning: "berdasarkan pada", example: "The decision is based on recent evidence.", translation: "Keputusan itu berdasarkan bukti terbaru.", topic: "research", difficulty: "Core", examRelevance: "High" },
  { phrase: "exposed to", pattern: "adjective_preposition", meaning: "terpapar pada", example: "Workers were exposed to loud noise.", translation: "Pekerja terpapar pada kebisingan keras.", topic: "health" },
  { phrase: "filled with", pattern: "adjective_preposition", meaning: "dipenuhi dengan", example: "The room was filled with nervous applicants.", translation: "Ruangan itu dipenuhi dengan pelamar yang gugup.", topic: "work" },
  { phrase: "satisfied with", pattern: "adjective_preposition", meaning: "puas dengan", example: "Most users are satisfied with the service.", translation: "Sebagian besar pengguna puas dengan layanan tersebut.", topic: "service" },
  { phrase: "succeed in", pattern: "verb_preposition", meaning: "berhasil dalam", example: "The group succeeded in reducing waste.", translation: "Kelompok itu berhasil dalam mengurangi limbah.", topic: "environment" },
  { phrase: "specialize in", pattern: "verb_preposition", meaning: "mengkhususkan diri dalam", example: "The clinic specializes in eye care.", translation: "Klinik itu mengkhususkan diri dalam perawatan mata.", topic: "health" },
  { phrase: "participate in", pattern: "verb_preposition", meaning: "berpartisipasi dalam", example: "Students participate in weekly discussions.", translation: "Siswa berpartisipasi dalam diskusi mingguan.", topic: "education", examRelevance: "High" },
  { phrase: "object to", pattern: "verb_preposition", meaning: "keberatan terhadap", example: "Some residents object to the new rule.", translation: "Sebagian warga keberatan terhadap aturan baru.", topic: "policy" },
  { phrase: "respond to", pattern: "verb_preposition", meaning: "merespons terhadap", example: "The office responds to complaints quickly.", translation: "Kantor itu merespons keluhan dengan cepat.", topic: "administration" },
  { phrase: "contribute to", pattern: "verb_preposition", meaning: "berkontribusi pada", example: "Regular practice contributes to better accuracy.", translation: "Latihan rutin berkontribusi pada akurasi yang lebih baik.", topic: "study", examRelevance: "High" },
  { phrase: "lead to", pattern: "verb_preposition", meaning: "menyebabkan atau mengarah pada", example: "Poor planning can lead to costly mistakes.", translation: "Perencanaan buruk dapat menyebabkan kesalahan mahal.", topic: "planning", examRelevance: "High" },
  { phrase: "result in", pattern: "verb_preposition", meaning: "menghasilkan atau menyebabkan", example: "Heavy rain resulted in traffic delays.", translation: "Hujan lebat menyebabkan keterlambatan lalu lintas.", topic: "cause-effect", examRelevance: "High" },
  { phrase: "result from", pattern: "verb_preposition", meaning: "diakibatkan oleh", example: "The error resulted from unclear instructions.", translation: "Kesalahan itu diakibatkan oleh instruksi yang tidak jelas.", topic: "cause-effect", examRelevance: "High" },
  { phrase: "prevent from", pattern: "verb_preposition", meaning: "mencegah dari", example: "Clear rules prevent students from guessing blindly.", translation: "Aturan jelas mencegah siswa menebak sembarangan.", topic: "test" },
  { phrase: "protect from", pattern: "verb_preposition", meaning: "melindungi dari", example: "Sunscreen protects skin from ultraviolet light.", translation: "Tabir surya melindungi kulit dari sinar ultraviolet.", topic: "health" },
  { phrase: "provide with", pattern: "verb_preposition", meaning: "menyediakan untuk seseorang", example: "The school provides students with tablets.", translation: "Sekolah menyediakan tablet untuk siswa.", topic: "education" },
  { phrase: "accuse of", pattern: "verb_preposition", meaning: "menuduh atas", example: "The report accused the company of negligence.", translation: "Laporan itu menuduh perusahaan atas kelalaian.", topic: "law" },
  { phrase: "approve of", pattern: "verb_preposition", meaning: "menyetujui", example: "The board approved of the new policy.", translation: "Dewan menyetujui kebijakan baru.", topic: "policy" },
  { phrase: "dream of", pattern: "verb_preposition", meaning: "bermimpi tentang", example: "Many students dream of studying abroad.", translation: "Banyak siswa bermimpi belajar di luar negeri.", topic: "study" },
  { phrase: "insist on", pattern: "verb_preposition", meaning: "bersikeras pada", example: "The teacher insists on clear explanations.", translation: "Guru itu bersikeras pada penjelasan yang jelas.", topic: "school" },
  { phrase: "concentrate on", pattern: "verb_preposition", meaning: "berkonsentrasi pada", example: "Learners concentrate on the main idea.", translation: "Pembelajar berkonsentrasi pada ide utama.", topic: "study", examRelevance: "High" },
  { phrase: "complain about", pattern: "verb_preposition", meaning: "mengeluh tentang", example: "Customers complain about slow service.", translation: "Pelanggan mengeluh tentang layanan lambat.", topic: "service" },
  { phrase: "recover from", pattern: "verb_preposition", meaning: "pulih dari", example: "The city recovered from the flood.", translation: "Kota itu pulih dari banjir.", topic: "disaster" },
  { phrase: "benefit from", pattern: "verb_preposition", meaning: "mendapat manfaat dari", example: "Students benefit from regular feedback.", translation: "Siswa mendapat manfaat dari umpan balik rutin.", topic: "education", examRelevance: "High" },
  { phrase: "search for", pattern: "verb_preposition", meaning: "mencari", example: "The team searched for reliable evidence.", translation: "Tim itu mencari bukti yang dapat dipercaya.", topic: "research" },
  { phrase: "arrive at", pattern: "verb_preposition", meaning: "tiba di atau mencapai", example: "The committee arrived at a decision.", translation: "Komite itu mencapai sebuah keputusan.", topic: "meeting" },
  { phrase: "ask for", pattern: "verb_preposition", meaning: "meminta", example: "Students ask for additional examples.", translation: "Siswa meminta contoh tambahan.", topic: "school" },
  { phrase: "choose between", pattern: "verb_preposition", meaning: "memilih antara", example: "Candidates choose between two test dates.", translation: "Kandidat memilih antara dua tanggal tes.", topic: "test" },
  { phrase: "distinguish between", pattern: "verb_preposition", meaning: "membedakan antara", example: "Learners distinguish between similar prepositions.", translation: "Pembelajar membedakan antara preposisi yang mirip.", topic: "grammar", difficulty: "Advanced", examRelevance: "High" },
];

function getPartOfSpeech(pattern: CollocationPattern): PartOfSpeech {
  if (pattern === "adjective_preposition") return "adjective";
  if (pattern === "noun_preposition") return "noun";
  if (pattern === "prepositional_phrase") return "phrase";
  return "verb";
}

function splitPhrase(phrase: string) {
  const parts = phrase.split(" ");
  const partner = parts.at(-1) ?? "";
  return {
    headword: parts.slice(0, -1).join(" "),
    partner,
  };
}

function createUsageNote(entry: SeedEntry) {
  if (entry.pattern === "phrasal_verb") {
    return `Pelajari "${entry.phrase}" sebagai satu unit makna; preposisi/partikelnya tidak bisa ditebak langsung dari terjemahan kata per kata.`;
  }

  if (entry.pattern === "prepositional_phrase") {
    return `"${entry.phrase}" adalah frasa preposisional tetap yang menunjukkan hubungan posisi atau konteks.`;
  }

  return `Pasangan "${entry.phrase}" adalah dependent preposition: kata utamanya lazim diikuti "${splitPhrase(entry.phrase).partner}" dalam konteks ini.`;
}

function createCommonMistake(entry: SeedEntry) {
  const { headword, partner } = splitPhrase(entry.phrase);
  return `Jangan mengganti "${partner}" secara otomatis setelah "${headword}"; cek konteks karena preposisi lain bisa mengubah makna atau terdengar tidak natural.`;
}

export const collocationEntries: CollocationEntry[] = seeds.map((seed, index) => {
  const { headword, partner } = splitPhrase(seed.phrase);
  const slug = seed.phrase.replaceAll(" ", "-");

  return {
    id: `col-${String(index + 1).padStart(3, "0")}-${slug}`,
    order: index + 1,
    headword,
    partner,
    fullPhrase: seed.phrase,
    partOfSpeech: getPartOfSpeech(seed.pattern),
    pattern: seed.pattern,
    indonesianMeaning: seed.meaning,
    usageNote: createUsageNote(seed),
    commonMistake: createCommonMistake(seed),
    exampleSentence: seed.example,
    exampleTranslation: seed.translation,
    topic: seed.topic,
    difficulty: seed.difficulty ?? "Medium",
    examRelevance: seed.examRelevance ?? "Medium",
    sourceType: "tutor_review",
    sourceName: "Persiapantubel tutor review",
    urlOrCitation: "internal-collocations-curation-2026-05",
    accessedAt: "2026-05-09",
    claimAllowed: false,
    sourceNote:
      "Tutor-curated English usage item for TBI practice; no exact TOEFL, TOEIC, or IELTS exam-appearance claim is made.",
    status: "published",
  };
});

const distractorPool: Record<string, string[]> = {
  about: ["of", "on", "with"],
  after: ["for", "at", "to"],
  at: ["in", "on", "to"],
  between: ["among", "with", "from"],
  for: ["to", "of", "on"],
  from: ["of", "with", "in"],
  in: ["on", "at", "to"],
  of: ["on", "for", "in"],
  on: ["in", "to", "with"],
  to: ["for", "with", "of"],
  toward: ["to", "with", "about"],
  with: ["to", "of", "for"],
};

function buildOptions(entry: CollocationEntry, answerIndex: number): QuizOption[] {
  const distractors = distractorPool[entry.partner] ?? ["of", "to", "on"];
  const values = [...distractors.slice(0, 3)];
  values.splice(answerIndex, 0, entry.partner);

  return OPTION_KEYS.map((key, index) => ({
    key,
    text: values[index],
  }));
}

function createQuestionPrompt(entry: CollocationEntry) {
  const escaped = entry.partner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blanked = entry.exampleSentence.replace(new RegExp(`\\b${escaped}\\b`, "i"), "___");

  return `${blanked} Pilih preposisi/pelengkap yang paling tepat.`;
}

function buildQuestion(entry: CollocationEntry, packageId: string, index: number): QuizQuestion {
  const answerIndex = index % OPTION_KEYS.length;
  const options = buildOptions(entry, answerIndex);
  const correctKey = options.find((option) => option.text === entry.partner)?.key;

  if (!correctKey) {
    throw new Error(`Missing answer key for ${entry.fullPhrase}`);
  }

  return {
    id: `${packageId}-q${String((index % QUESTIONS_PER_PACKAGE) + 1).padStart(2, "0")}`,
    entryId: entry.id,
    packageId,
    questionType: index % 5 === 0 ? "sentence_completion" : "missing_preposition",
    prompt: createQuestionPrompt(entry),
    options,
    correctKey,
    explanation: `${entry.fullPhrase} berarti "${entry.indonesianMeaning}". Dalam contoh "${entry.exampleSentence}", pasangan yang natural adalah "${entry.fullPhrase}". Jawaban yang tepat adalah ${correctKey} (${entry.partner}). ${entry.usageNote}`,
  };
}

function chunkEntries(entries: CollocationEntry[]) {
  const packages: LearningPackage[] = [];

  for (let index = 0; index < entries.length; index += QUESTIONS_PER_PACKAGE) {
    const packageEntries = entries.slice(index, index + QUESTIONS_PER_PACKAGE);
    const order = packages.length + 1;
    const id = `collocation-practice-${String(order).padStart(2, "0")}`;

    packages.push({
      id,
      title: `Collocation Practice ${String(order).padStart(2, "0")}`,
      order,
      description:
        "Paket campuran English collocations dengan fokus dependent prepositions, makna, dan contoh penggunaan.",
      entries: packageEntries,
      questions: packageEntries.map((entry, entryIndex) =>
        buildQuestion(entry, id, index + entryIndex),
      ),
    });
  }

  return packages;
}

export const learningPackages = chunkEntries(collocationEntries);
export const testPackages = learningPackages;

export const contentStats = {
  totalEntries: collocationEntries.length,
  totalPackages: learningPackages.length,
  totalQuestions: learningPackages.reduce((total, item) => total + item.questions.length, 0),
  patternCounts: collocationEntries.reduce<Record<CollocationPattern, number>>(
    (counts, entry) => ({
      ...counts,
      [entry.pattern]: counts[entry.pattern] + 1,
    }),
    {
      adjective_preposition: 0,
      verb_preposition: 0,
      noun_preposition: 0,
      phrasal_verb: 0,
      prepositional_phrase: 0,
    },
  ),
};

export function getCollocationById(id: string) {
  return collocationEntries.find((entry) => entry.id === id);
}

const duplicateIds = collocationEntries.filter(
  (entry, index) => collocationEntries.findIndex((item) => item.id === entry.id) !== index,
);
const duplicatePhrases = collocationEntries.filter(
  (entry, index) =>
    collocationEntries.findIndex((item) => item.fullPhrase === entry.fullPhrase) !== index,
);
const incompletePackages = learningPackages.filter(
  (item) => item.entries.length !== QUESTIONS_PER_PACKAGE || item.questions.length !== QUESTIONS_PER_PACKAGE,
);
const invalidQuestions = learningPackages.flatMap((item) =>
  item.questions.filter((question) => {
    const keys = question.options.map((option) => option.key).join("");
    const values = new Set(question.options.map((option) => option.text));
    return (
      keys !== "ABCD" ||
      values.size !== 4 ||
      !question.options.some((option) => option.key === question.correctKey) ||
      !question.explanation.includes("Jawaban yang tepat")
    );
  }),
);

if (
  contentStats.totalEntries !== EXPECTED_ENTRY_TOTAL ||
  contentStats.totalPackages !== EXPECTED_ENTRY_TOTAL / QUESTIONS_PER_PACKAGE ||
  contentStats.totalQuestions !== EXPECTED_ENTRY_TOTAL ||
  duplicateIds.length > 0 ||
  duplicatePhrases.length > 0 ||
  incompletePackages.length > 0 ||
  invalidQuestions.length > 0
) {
  throw new Error(
    `TBI collocation content must contain ${EXPECTED_ENTRY_TOTAL} unique entries, ${EXPECTED_ENTRY_TOTAL / QUESTIONS_PER_PACKAGE} complete packages, and valid A-D questions. Actual entries=${contentStats.totalEntries}, packages=${contentStats.totalPackages}, questions=${contentStats.totalQuestions}, duplicateIds=${duplicateIds.length}, duplicatePhrases=${duplicatePhrases.length}, incompletePackages=${incompletePackages.length}, invalidQuestions=${invalidQuestions.length}.`,
  );
}
