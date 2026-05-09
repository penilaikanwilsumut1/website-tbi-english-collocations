"use client";

import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  ClipboardCheck,
  Eye,
  Layers,
  Lock,
  Menu,
  PanelLeftClose,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  collocationEntries,
  contentStats,
  getCollocationById,
  learningPackages,
  testPackages,
  type CollocationEntry,
  type CollocationPattern,
  type LearningPackage,
  type OptionKey,
  type QuizQuestion,
} from "@/data/collocation-content";

type View = "dashboard" | "search" | "materi" | "flipcard" | "tes" | "superadmin";
type PackageStatus = "ready" | "draft" | "submitted";
type PatternFilter = CollocationPattern | "all";

type DraftAttempt = {
  answers: Partial<Record<string, OptionKey>>;
  updatedAt: string;
};

type SubmittedAttempt = DraftAttempt & {
  score: number;
  submittedAt: string;
};

type StoredProgress = {
  viewedCards: string[];
  drafts: Record<string, DraftAttempt>;
  submitted: Record<string, SubmittedAttempt>;
};

type RailItem = {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  status: PackageStatus;
};

const STORAGE_KEY = "tbi-english-collocations-progress-v1";
const PACKAGE_PAGE_SIZE = 10;

const emptyProgress: StoredProgress = {
  viewedCards: [],
  drafts: {},
  submitted: {},
};

const navigation: Array<{ id: View; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", icon: ChartNoAxesColumnIncreasing },
  { id: "search", label: "Pencarian", icon: Search },
  { id: "materi", label: "Materi", icon: BookOpen },
  { id: "flipcard", label: "Flipcard", icon: Layers },
  { id: "tes", label: "Tes", icon: ClipboardCheck },
  { id: "superadmin", label: "SuperAdmin", icon: ShieldCheck },
];

const patternFilters: PatternFilter[] = [
  "all",
  "adjective_preposition",
  "verb_preposition",
  "noun_preposition",
  "phrasal_verb",
  "prepositional_phrase",
];

function isOptionKey(value: unknown): value is OptionKey {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sanitizeAnswers(value: unknown): Partial<Record<string, OptionKey>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<Partial<Record<string, OptionKey>>>(
    (answers, [questionId, answer]) => {
      if (isOptionKey(answer)) {
        answers[questionId] = answer;
      }

      return answers;
    },
    {},
  );
}

function loadStoredProgress(): StoredProgress {
  if (typeof window === "undefined") {
    return emptyProgress;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptyProgress;
    }

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    const drafts = Object.entries(parsed.drafts ?? {}).reduce<Record<string, DraftAttempt>>(
      (safeDrafts, [packageId, value]) => {
        if (!value || typeof value !== "object") {
          return safeDrafts;
        }

        const draft = value as Partial<DraftAttempt>;
        safeDrafts[packageId] = {
          answers: sanitizeAnswers(draft.answers),
          updatedAt:
            typeof draft.updatedAt === "string" ? draft.updatedAt : new Date().toISOString(),
        };

        return safeDrafts;
      },
      {},
    );

    const submitted = Object.entries(parsed.submitted ?? {}).reduce<
      Record<string, SubmittedAttempt>
    >((safeSubmitted, [packageId, value]) => {
      if (!value || typeof value !== "object") {
        return safeSubmitted;
      }

      const attempt = value as Partial<SubmittedAttempt>;
      safeSubmitted[packageId] = {
        answers: sanitizeAnswers(attempt.answers),
        updatedAt:
          typeof attempt.updatedAt === "string" ? attempt.updatedAt : new Date().toISOString(),
        score: typeof attempt.score === "number" ? attempt.score : 0,
        submittedAt:
          typeof attempt.submittedAt === "string"
            ? attempt.submittedAt
            : new Date().toISOString(),
      };

      return safeSubmitted;
    }, {});

    return {
      viewedCards: Array.isArray(parsed.viewedCards)
        ? parsed.viewedCards.filter((value) => typeof value === "string")
        : [],
      drafts,
      submitted,
    };
  } catch {
    return emptyProgress;
  }
}

function saveStoredProgress(progress: StoredProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function scrollToTop() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function percentage(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

function getPatternLabel(pattern: CollocationPattern | "mixed") {
  const labels: Record<CollocationPattern | "mixed", string> = {
    adjective_preposition: "Adj + Prep",
    verb_preposition: "Verb + Prep",
    noun_preposition: "Noun + Prep",
    phrasal_verb: "Phrasal/Prep Verb",
    prepositional_phrase: "Prep Phrase",
    mixed: "Mixed",
  };

  return labels[pattern];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function filterCollocations(entries: CollocationEntry[], query: string) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return entries;
  }

  return entries.filter((entry) => {
    const searchable = normalizeText(
      [
        entry.headword,
        entry.partner,
        entry.fullPhrase,
        entry.indonesianMeaning,
        entry.usageNote,
        entry.commonMistake,
        entry.exampleSentence,
        entry.topic,
        entry.pattern,
      ].join(" "),
    );

    return terms.every((term) => searchable.includes(term));
  });
}

function getStudyPackageStatus(
  learningPackage: LearningPackage,
  progress: StoredProgress,
): PackageStatus {
  const viewed = learningPackage.entries.filter((entry) =>
    progress.viewedCards.includes(entry.id),
  ).length;

  if (viewed === learningPackage.entries.length && learningPackage.entries.length > 0) {
    return "submitted";
  }

  return viewed > 0 ? "draft" : "ready";
}

function getTestPackageStatus(
  testPackage: LearningPackage,
  progress: StoredProgress,
): PackageStatus {
  if (progress.submitted[testPackage.id]) {
    return "submitted";
  }

  const answerCount = Object.keys(progress.drafts[testPackage.id]?.answers ?? {}).length;

  return answerCount > 0 ? "draft" : "ready";
}

function scoreQuestions(
  questions: QuizQuestion[],
  answers: Partial<Record<string, OptionKey>>,
) {
  return questions.filter((question) => answers[question.id] === question.correctKey).length;
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function DashboardMetricCard({
  label,
  value,
  total,
  tone = "teal",
}: {
  label: string;
  value: number;
  total: number;
  tone?: "teal" | "ink" | "amber";
}) {
  const progress = percentage(value, total);

  return (
    <article className={`stat-card dashboard-metric-card is-${tone}`}>
      <div className="stat-card-head">
        <span>{label}</span>
        <small>{progress}%</small>
      </div>
      <strong>
        {value}
        <small>/{total}</small>
      </strong>
      <div
        aria-label={`${label}: ${value}/${total} atau ${progress}%`}
        className="metric-track"
        role="img"
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

function PackageStatusIcon({ status }: { status: PackageStatus }) {
  if (status === "submitted") {
    return <CheckCircle2 aria-label="Selesai" size={18} />;
  }

  if (status === "draft") {
    return <Eye aria-label="Berjalan" size={18} />;
  }

  return <Circle aria-label="Tersedia" size={18} />;
}

function PackageRail({
  title,
  items,
  activeId,
  collapsed,
  onToggleCollapsed,
  onSelect,
}: {
  title: string;
  items: RailItem[];
  activeId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSelect: (id: string) => void;
}) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const [page, setPage] = useState(Math.floor(activeIndex / PACKAGE_PAGE_SIZE));
  const pageCount = Math.max(1, Math.ceil(items.length / PACKAGE_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const firstIndex = safePage * PACKAGE_PAGE_SIZE;
  const visibleItems = items.slice(firstIndex, firstIndex + PACKAGE_PAGE_SIZE);

  return (
    <aside
      aria-label={`Daftar paket ${title}`}
      className={`package-rail ${collapsed ? "is-collapsed" : ""}`}
    >
      <div className="package-rail-header">
        <div>
          <span className="eyebrow">Paket</span>
          <strong>{title}</strong>
        </div>
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? `Buka daftar paket ${title}` : `Tutup daftar paket ${title}`}
          className="rail-toggle"
          onClick={onToggleCollapsed}
          type="button"
        >
          {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="package-page-controls">
        <button
          aria-label="Paket sebelumnya"
          disabled={safePage === 0}
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          type="button"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>
        <span>
          {firstIndex + 1}-{Math.min(firstIndex + PACKAGE_PAGE_SIZE, items.length)} /{" "}
          {items.length}
        </span>
        <button
          aria-label="Paket berikutnya"
          disabled={safePage >= pageCount - 1}
          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          type="button"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="package-list">
        {visibleItems.map((item) => (
          <button
            aria-label={`${item.title}: ${item.subtitle}`}
            aria-current={item.id === activeId ? "page" : undefined}
            className={item.id === activeId ? "active" : ""}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <span className="package-compact-number">
              {String(item.order).padStart(2, "0")}
            </span>
            <span className="package-copy">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
            <PackageStatusIcon status={item.status} />
          </button>
        ))}
      </div>
    </aside>
  );
}

export function LearningApp() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [materialFilter, setMaterialFilter] = useState<PatternFilter>("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [activeStudyPackageId, setActiveStudyPackageId] = useState(
    learningPackages[0]?.id ?? "",
  );
  const [activeTestPackageId, setActiveTestPackageId] = useState(testPackages[0]?.id ?? "");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  const [progress, setProgress] = useState<StoredProgress>(emptyProgress);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(loadStoredProgress());
      setProgressReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (progressReady) {
      saveStoredProgress(progress);
    }
  }, [progress, progressReady]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const viewedCount = progress.viewedCards.length;
  const submittedCount = Object.keys(progress.submitted).length;
  const draftCount = testPackages.filter(
    (testPackage) => getTestPackageStatus(testPackage, progress) === "draft",
  ).length;
  const filteredEntries = useMemo(
    () => filterCollocations(collocationEntries, query),
    [query],
  );
  const activeStudyPackage =
    learningPackages.find((item) => item.id === activeStudyPackageId) ?? learningPackages[0];
  const activeTestPackage =
    testPackages.find((item) => item.id === activeTestPackageId) ?? testPackages[0];
  const activeEntries = activeStudyPackage?.entries ?? [];
  const materialEntries = activeEntries.filter((entry) =>
    materialFilter === "all" ? true : entry.pattern === materialFilter,
  );
  const currentCard = activeEntries[cardIndex] ?? collocationEntries[0];
  const activeStudyPackageIndex = Math.max(
    0,
    learningPackages.findIndex((item) => item.id === activeStudyPackage?.id),
  );
  const nextStudyPackage =
    learningPackages[
      Math.min(activeStudyPackageIndex + 1, Math.max(learningPackages.length - 1, 0))
    ] ?? activeStudyPackage;
  const submittedAttempt = activeTestPackage
    ? progress.submitted[activeTestPackage.id]
    : undefined;
  const activeDraft = activeTestPackage ? progress.drafts[activeTestPackage.id] : undefined;
  const activeAnswers = submittedAttempt?.answers ?? activeDraft?.answers ?? {};
  const activeScore =
    submittedAttempt && activeTestPackage
      ? submittedAttempt.score
      : activeTestPackage
        ? scoreQuestions(activeTestPackage.questions, activeAnswers)
        : 0;

  const studyRailItems: RailItem[] = learningPackages.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: `${item.entries.length} collocations`,
    order: item.order,
    status: getStudyPackageStatus(item, progress),
  }));

  const testRailItems: RailItem[] = testPackages.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: `${item.questions.length} soal A-D`,
    order: item.order,
    status: getTestPackageStatus(item, progress),
  }));

  function navigateTo(view: View) {
    setActiveView(view);
    scrollToTop();
  }

  function selectStudyPackage(packageId: string) {
    setActiveStudyPackageId(packageId);
    setCardIndex(0);
    setIsFlipped(false);
  }

  function markCardViewed(entryId: string) {
    setProgress((current) => {
      if (current.viewedCards.includes(entryId)) {
        return current;
      }

      return {
        ...current,
        viewedCards: [...current.viewedCards, entryId],
      };
    });
  }

  function flipCard() {
    if (!currentCard) {
      return;
    }

    if (!isFlipped) {
      markCardViewed(currentCard.id);
    }

    setIsFlipped((current) => !current);
  }

  function moveCard(direction: -1 | 1) {
    if (activeEntries.length === 0) {
      return;
    }

    setIsFlipped(false);
    setCardIndex((current) => (current + direction + activeEntries.length) % activeEntries.length);
  }

  function selectAnswer(questionId: string, optionKey: OptionKey) {
    if (!activeTestPackage || submittedAttempt) {
      return;
    }

    setProgress((current) => {
      const existing = current.drafts[activeTestPackage.id]?.answers ?? {};
      const nextAnswers = { ...existing };

      if (nextAnswers[questionId] === optionKey) {
        delete nextAnswers[questionId];
      } else {
        nextAnswers[questionId] = optionKey;
      }

      return {
        ...current,
        drafts: {
          ...current.drafts,
          [activeTestPackage.id]: {
            answers: nextAnswers,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }

  function submitTest() {
    if (!activeTestPackage || submittedAttempt) {
      return;
    }

    const score = scoreQuestions(activeTestPackage.questions, activeAnswers);
    const now = new Date().toISOString();

    setProgress((current) => ({
      ...current,
      submitted: {
        ...current.submitted,
        [activeTestPackage.id]: {
          answers: activeAnswers,
          score,
          updatedAt: current.drafts[activeTestPackage.id]?.updatedAt ?? now,
          submittedAt: now,
        },
      },
    }));
  }

  function resetDemoProgress() {
    setProgress(emptyProgress);
    saveStoredProgress(emptyProgress);
  }

  return (
    <main className="app-shell">
      <aside className={`app-sidebar ${sidebarCollapsed ? "is-collapsed" : ""}`}>
        <div className="sidebar-head">
          <div className="brand-block">
            <div className="brand-logo-block">
              <Image
                alt="Persiapantubel"
                height={54}
                priority
                src="/persiapantubel-logo.png"
                width={176}
              />
            </div>
          </div>
          <button
            aria-expanded={!sidebarCollapsed}
            aria-label={sidebarCollapsed ? "Buka sidebar utama" : "Tutup sidebar utama"}
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed((current) => !current)}
            type="button"
          >
            {sidebarCollapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
          </button>
        </div>

        <nav aria-label="Navigasi utama">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                aria-label={item.label}
                aria-current={activeView === item.id ? "page" : undefined}
                className={activeView === item.id ? "active" : ""}
                key={item.id}
                onClick={() => navigateTo(item.id)}
                type="button"
              >
                <Icon aria-hidden="true" size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="main-content">
        {activeView === "dashboard" && (
          <section className="view-stack" aria-labelledby="dashboard-title">
            <div className="dashboard-hero">
              <div className="dashboard-copy">
                <span className="eyebrow">Persiapantubel TBI</span>
                <h1 id="dashboard-title">TBI - English Collocations</h1>
                <p>
                  Kuasai pasangan kata dan preposisi yang sering terasa menjebak
                  dalam TBI melalui Materi, Flipcard, dan Tes A-D dengan pembahasan
                  bahasa Indonesia.
                </p>
              </div>
              <div className="hero-mark">
                <Sparkles aria-hidden="true" size={36} />
                <span>{collocationEntries.length}</span>
                <small>Collocation Bank</small>
              </div>
            </div>

            <div className="stat-grid">
              <DashboardMetricCard
                label="Flipcard dibuka"
                total={collocationEntries.length}
                value={viewedCount}
              />
              <DashboardMetricCard
                label="Tes submit"
                tone="ink"
                total={testPackages.length}
                value={submittedCount}
              />
              <DashboardMetricCard
                label="Draft tes"
                tone="amber"
                total={testPackages.length}
                value={draftCount}
              />
            </div>

            <div className="action-stack">
              <button className="action-row" onClick={() => navigateTo("flipcard")} type="button">
                <span>
                  <span className="eyebrow">Kartu berikutnya</span>
                  <strong>{currentCard?.headword ?? "afraid"}</strong>
                </span>
                <ChevronRight aria-hidden="true" />
              </button>
              <button
                className="action-row"
                onClick={() => {
                  if (nextStudyPackage) {
                    setActiveStudyPackageId(nextStudyPackage.id);
                  }
                  navigateTo("materi");
                }}
                type="button"
              >
                <span>
                  <span className="eyebrow">Paket berikutnya</span>
                  <strong>{nextStudyPackage?.title ?? "Collocation Practice 02"}</strong>
                </span>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {activeView === "search" && (
          <section className="view-stack" aria-labelledby="search-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">Pencarian</span>
                <h2 id="search-title">Daftar Collocation</h2>
              </div>
              <label className="search-box">
                <Search aria-hidden="true" size={18} />
                <span className="sr-only">Cari collocation</span>
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari phrase, preposition, arti, contoh..."
                  type="search"
                  value={query}
                />
              </label>
            </div>

            <div aria-live="polite" className="search-result-meta">
              <span>{filteredEntries.length}</span>
              <p>hasil dari {collocationEntries.length} collocation aktif</p>
            </div>

            <div className="search-result-list">
              {filteredEntries.map((entry) => (
                <article className="search-result-row" key={entry.id}>
                  <div>
                    <span className="badge badge-teal">{getPatternLabel(entry.pattern)}</span>
                    <h3>{entry.fullPhrase}</h3>
                    <p>
                      {entry.indonesianMeaning} | {entry.exampleSentence}
                    </p>
                  </div>
                  <span className="badge">{entry.partner}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === "materi" && activeStudyPackage && (
          <section className="view-stack" aria-labelledby="materi-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">Materi</span>
                <h2 id="materi-title">Belajar English Collocations</h2>
              </div>
              <div className="segmented" aria-label="Filter pola collocation">
                {patternFilters.map((filter) => (
                  <button
                    aria-pressed={materialFilter === filter}
                    className={materialFilter === filter ? "active" : ""}
                    key={filter}
                    onClick={() => setMaterialFilter(filter)}
                    type="button"
                  >
                    {filter === "all" ? "Semua" : getPatternLabel(filter)}
                  </button>
                ))}
              </div>
            </div>

            <div className={`learning-layout ${railCollapsed ? "package-collapsed" : ""}`}>
              <PackageRail
                activeId={activeStudyPackageId}
                collapsed={railCollapsed}
                items={studyRailItems}
                onSelect={selectStudyPackage}
                onToggleCollapsed={() => setRailCollapsed((current) => !current)}
                title="Materi"
              />

              <div className="content-stack">
                <article className="panel package-summary">
                  <span className="eyebrow">Mixed practice</span>
                  <h3>{activeStudyPackage.title}</h3>
                  <p>{activeStudyPackage.description}</p>
                </article>

                <div className="verb-list">
                  {materialEntries.map((entry) => (
                    <CollocationRow entry={entry} key={entry.id} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "flipcard" && activeStudyPackage && currentCard && (
          <section className="view-stack" aria-labelledby="flipcard-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">Flipcard</span>
                <h2 id="flipcard-title">Active recall</h2>
              </div>
              <span className="badge">
                {cardIndex + 1}/{activeEntries.length}
              </span>
            </div>

            <div className={`learning-layout ${railCollapsed ? "package-collapsed" : ""}`}>
              <PackageRail
                activeId={activeStudyPackageId}
                collapsed={railCollapsed}
                items={studyRailItems}
                onSelect={selectStudyPackage}
                onToggleCollapsed={() => setRailCollapsed((current) => !current)}
                title="Flipcard"
              />

              <div className="content-stack">
                <button
                  aria-expanded={isFlipped}
                  aria-label={`Balik kartu ${currentCard.headword}`}
                  className={`flipcard ${isFlipped ? "is-flipped" : ""}`}
                  onClick={flipCard}
                  type="button"
                >
                  <span className="flip-face flip-front">
                    <span className="badge">{getPatternLabel(currentCard.pattern)}</span>
                    <strong>{currentCard.headword}</strong>
                    <small>Tap untuk lihat pasangan natural</small>
                  </span>
                  <span className="flip-face flip-back">
                    <span>
                      <span className="badge badge-teal">{currentCard.partner}</span>
                      <strong>{currentCard.fullPhrase}</strong>
                    </span>
                    <span>{currentCard.indonesianMeaning}</span>
                    <small>
                      {currentCard.exampleSentence} {currentCard.commonMistake}
                    </small>
                  </span>
                </button>

                <div className="control-row">
                  <button
                    aria-label="Flipcard sebelumnya"
                    className="icon-button"
                    onClick={() => moveCard(-1)}
                    type="button"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button className="primary-button" onClick={flipCard} type="button">
                    <RotateCcw aria-hidden="true" size={18} />
                    Reveal
                  </button>
                  <button
                    aria-label="Flipcard berikutnya"
                    className="icon-button"
                    onClick={() => moveCard(1)}
                    type="button"
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "tes" && activeTestPackage && (
          <section className="view-stack" aria-labelledby="tes-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">Tes</span>
                <h2 id="tes-title">Paket soal English Collocations</h2>
              </div>
              {submittedAttempt ? (
                <span className="result-pill">
                  <Lock aria-hidden="true" size={16} />
                  {activeScore}/{activeTestPackage.questions.length}
                </span>
              ) : null}
            </div>

            <div className={`learning-layout ${railCollapsed ? "package-collapsed" : ""}`}>
              <PackageRail
                activeId={activeTestPackageId}
                collapsed={railCollapsed}
                items={testRailItems}
                onSelect={setActiveTestPackageId}
                onToggleCollapsed={() => setRailCollapsed((current) => !current)}
                title="Tes"
              />

              <TestPanel
                activeAnswers={activeAnswers}
                activeScore={activeScore}
                onSelectAnswer={selectAnswer}
                onSubmit={submitTest}
                submittedAttempt={submittedAttempt}
                testPackage={activeTestPackage}
              />
            </div>
          </section>
        )}

        {activeView === "superadmin" && (
          <section className="view-stack" aria-labelledby="admin-title">
            <div className="section-header">
              <div>
                <span className="eyebrow">SuperAdmin</span>
                <h2 id="admin-title">Operational summary</h2>
              </div>
              <button className="primary-button" onClick={resetDemoProgress} type="button">
                <RotateCcw aria-hidden="true" size={18} />
                Reset local MVP
              </button>
            </div>

            <div className="stat-grid">
              <StatCard
                detail="Tutor-reviewed static MVP"
                label="Collocation aktif"
                value={`${contentStats.totalEntries}`}
              />
              <StatCard
                detail="Materi, Flipcard, dan Tes"
                label="Learning packages"
                value={`${contentStats.totalPackages}`}
              />
              <StatCard
                detail="A-D, draft, submit, lock"
                label="Questions"
                value={`${contentStats.totalQuestions}`}
              />
            </div>

            <article className="panel admin-note">
              <span className="eyebrow">Boundary</span>
              <h3>MVP ini memakai localStorage</h3>
              <p>
                SuperAdmin production tetap harus memakai auth, database, role check,
                attempt snapshot, content import/export, dan audit log sebelum dipakai
                untuk progres siswa nyata.
              </p>
            </article>
          </section>
        )}
      </div>

      <button
        aria-label="Kembali ke atas"
        className={`scroll-top-button ${showScrollTop ? "is-visible" : ""}`}
        onClick={scrollToTop}
        type="button"
      >
        <ChevronUp aria-hidden="true" />
      </button>
    </main>
  );
}

function CollocationRow({ entry }: { entry: CollocationEntry }) {
  return (
    <article className="verb-row">
      <div>
        <span className="badge badge-teal">{getPatternLabel(entry.pattern)}</span>
        <h3>{entry.fullPhrase}</h3>
        <p>{entry.usageNote}</p>
      </div>
      <div className="verb-detail-grid">
        <div className="verb-detail">
          <span>Headword</span>
          <strong>{entry.headword}</strong>
        </div>
        <div className="verb-detail">
          <span>Partner</span>
          <strong>{entry.partner}</strong>
        </div>
        <div className="verb-detail">
          <span>Artinya</span>
          <strong>{entry.indonesianMeaning}</strong>
        </div>
        <div className="verb-detail">
          <span>Topic</span>
          <strong>{entry.topic}</strong>
        </div>
      </div>
      <p className="usage-note">
        {entry.exampleSentence} ({entry.exampleTranslation}) {entry.commonMistake}
      </p>
    </article>
  );
}

function TestPanel({
  activeAnswers,
  activeScore,
  onSelectAnswer,
  onSubmit,
  submittedAttempt,
  testPackage,
}: {
  activeAnswers: Partial<Record<string, OptionKey>>;
  activeScore: number;
  onSelectAnswer: (questionId: string, optionKey: OptionKey) => void;
  onSubmit: () => void;
  submittedAttempt: SubmittedAttempt | undefined;
  testPackage: LearningPackage;
}) {
  const answered = testPackage.questions.filter((question) => activeAnswers[question.id]);
  const unanswered = testPackage.questions.filter((question) => !activeAnswers[question.id]);

  return (
    <div className="content-stack">
      <article className="panel package-summary">
        <span className="eyebrow">A-D practice</span>
        <h3>{testPackage.title}</h3>
        <p>{testPackage.description}</p>
        <small>
          Coverage: {testPackage.questions.length}/{collocationEntries.length} collocation bank
        </small>
        {submittedAttempt ? <small>Submitted: {formatDate(submittedAttempt.submittedAt)}</small> : null}
      </article>

      <div className="test-navigator">
        <div className="answer-progress-summary">
          <div className="answer-stats">
            <div>
              <span>Total</span>
              <strong>{testPackage.questions.length}</strong>
            </div>
            <div>
              <span>Terjawab</span>
              <strong>{answered.length}</strong>
            </div>
            <div>
              <span>Kosong</span>
              <strong>{unanswered.length}</strong>
            </div>
            <div className="answer-submit-slot">
              <button
                className="primary-button"
                disabled={Boolean(submittedAttempt)}
                onClick={onSubmit}
                type="button"
              >
                {submittedAttempt ? (
                  <>
                    <Lock aria-hidden="true" size={16} />
                    Locked
                  </>
                ) : (
                  <>
                    <CheckCircle2 aria-hidden="true" size={16} />
                    Submit final
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="answer-number-grid">
            <AnswerNumberGroup label="Terjawab" questions={answered} type="done" />
            <AnswerNumberGroup label="Belum dijawab" questions={unanswered} type="pending" />
          </div>
        </div>
      </div>

      <div className="test-surface">
        {submittedAttempt ? (
          <p className="result-pill">
            Skor: {activeScore}/{testPackage.questions.length}
          </p>
        ) : null}

        <div className="question-stack">
          {testPackage.questions.map((question, index) => {
            const selected = activeAnswers[question.id];
            const correct = selected === question.correctKey;
            const entry = getCollocationById(question.entryId);

            return (
              <article className="question-block" id={`question-${question.id}`} key={question.id}>
                <div className="question-title">
                  <span>{index + 1}</span>
                  <div>
                    <h3>{question.prompt}</h3>
                    {entry ? (
                      <small>
                        Fokus: {getPatternLabel(entry.pattern)} | {entry.difficulty}
                      </small>
                    ) : null}
                  </div>
                </div>

                <div className="option-grid">
                  {question.options.map((option) => {
                    const isSelected = selected === option.key;
                    const isCorrectOption = option.key === question.correctKey;
                    const submittedClass = submittedAttempt
                      ? isCorrectOption
                        ? "correct"
                        : isSelected && !correct
                          ? "wrong"
                          : ""
                      : "";

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={`option-button ${
                          isSelected && !submittedAttempt ? "selected" : ""
                        } ${submittedClass}`}
                        disabled={Boolean(submittedAttempt)}
                        key={option.key}
                        onClick={() => onSelectAnswer(question.id, option.key)}
                        type="button"
                      >
                        <span>{option.key}</span>
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                {submittedAttempt ? (
                  <div className="explanation">
                    <strong>
                      Jawaban benar: {question.correctKey}.{" "}
                      {correct ? "Benar." : "Perlu review."}
                    </strong>
                    <p>{question.explanation}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnswerNumberGroup({
  label,
  questions,
  type,
}: {
  label: string;
  questions: QuizQuestion[];
  type: "done" | "pending";
}) {
  return (
    <div className="answer-number-group">
      <span>{label}</span>
      <div>
        {questions.length === 0 ? (
          <small>-</small>
        ) : (
          questions.map((question) => (
            <a className={`answer-number ${type}`} href={`#question-${question.id}`} key={question.id}>
              {question.id.split("-").at(-1)?.toUpperCase() ?? "Q"}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
