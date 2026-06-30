import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { MatchResult, ScoredSolution } from "./match";

const COLORS = {
  ink: "#1a1714",
  muted: "#6b6258",
  accent: "#e1542a",
  easy: "#2f7d57",
  structure: "#1f3a5f",
  line: "#e4ddd2",
  paper: "#f7f3ec",
};

const s = StyleSheet.create({
  page: { paddingVertical: 44, paddingHorizontal: 48, fontSize: 10.5, color: COLORS.ink, lineHeight: 1.5, fontFamily: "Helvetica" },
  kicker: { fontSize: 9, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "Helvetica-Bold" },
  h1: { fontSize: 24, marginTop: 6, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 9, color: COLORS.muted, marginTop: 4 },

  scoreBox: { marginTop: 18, padding: 14, borderRadius: 6, backgroundColor: COLORS.paper, borderWidth: 1, borderColor: COLORS.line },
  scoreTop: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  scoreNum: { fontSize: 22, fontFamily: "Helvetica-Bold", color: COLORS.accent },
  scoreLabel: { fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 },
  archetype: { marginTop: 6, fontSize: 12, fontFamily: "Helvetica-Bold" },
  profileLine: { marginTop: 2, color: COLORS.muted },

  summary: { marginTop: 16, fontSize: 11.5 },

  sectionHead: { marginTop: 22, marginBottom: 8, fontSize: 14, fontFamily: "Helvetica-Bold" },
  sectionSub: { fontSize: 10, color: COLORS.muted, fontFamily: "Helvetica" },

  card: { marginBottom: 14, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: COLORS.line },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  name: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  tag: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  what: { marginTop: 2 },
  reason: { marginTop: 5, fontSize: 9.5, color: COLORS.accent },

  metaRow: { flexDirection: "row", marginTop: 8, gap: 16 },
  metaItem: { flexDirection: "column" },
  metaKey: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 },

  subhead: { marginTop: 10, fontSize: 9.5, fontFamily: "Helvetica-Bold", color: COLORS.structure },
  body: { marginTop: 2 },
  li: { marginTop: 2, paddingLeft: 8 },

  twoCol: { flexDirection: "row", gap: 10, marginTop: 8 },
  half: { flex: 1, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.line },

  footer: { position: "absolute", bottom: 24, left: 48, right: 48, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 6, fontSize: 8, color: COLORS.muted, flexDirection: "row", justifyContent: "space-between" },
});

const DIFFICULTY: Record<string, string> = {
  diy: "Do it yourself · today",
  weekend: "A weekend project",
  build: "Worth getting built right",
};
const SEVERITY: Record<number, string> = { 1: "Minor pain", 2: "Hurts a lot", 3: "Major drain" };

function Card({ sol }: { sol: ScoredSolution }) {
  const pb = sol.playbook;
  return (
    <View style={s.card} wrap={false}>
      <View style={s.cardTop}>
        <Text style={s.name}>{sol.name}</Text>
        <Text style={s.tag}>{sol.category}</Text>
      </View>
      <Text style={s.tag}>
        {SEVERITY[sol.severity]} · {DIFFICULTY[sol.difficulty]}
      </Text>
      <Text style={s.what}>{sol.what}</Text>
      <Text style={s.reason}>For you: {sol.reason}</Text>

      <View style={s.metaRow}>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Setup</Text>
          <Text>{sol.setupTime}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Typical cost</Text>
          <Text>{sol.cost}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Time to value</Text>
          <Text>{pb.timeToValue}</Text>
        </View>
      </View>

      {sol.tools.length > 0 && (
        <>
          <Text style={s.subhead}>Tools to start with</Text>
          <Text style={s.body}>{sol.tools.map((t) => `${t.name} (${t.tier})`).join("  ·  ")}</Text>
        </>
      )}

      <Text style={s.subhead}>How it works</Text>
      <Text style={s.body}>{pb.howItWorks}</Text>

      <Text style={s.subhead}>How to roll it out</Text>
      {pb.phases.map((p, i) => (
        <Text key={i} style={s.li}>
          {i + 1}. {p.title} — {p.detail}
        </Text>
      ))}

      <Text style={s.subhead}>Watch out for</Text>
      {pb.watchOuts.map((w, i) => (
        <Text key={i} style={s.li}>
          • {w}
        </Text>
      ))}

      <View style={s.twoCol}>
        <View style={s.half}>
          <Text style={[s.metaKey, { color: COLORS.easy }]}>Worth it when</Text>
          <Text style={s.body}>{pb.worthItWhen}</Text>
        </View>
        <View style={s.half}>
          <Text style={s.metaKey}>Skip it if</Text>
          <Text style={s.body}>{pb.skipIf}</Text>
        </View>
      </View>

      <Text style={[s.body, { marginTop: 8 }]}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>Track this: </Text>
        {pb.metric}
      </Text>

      {sol.honestNote && (
        <Text style={[s.body, { marginTop: 6, color: COLORS.muted }]}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Honest take: </Text>
          {sol.honestNote}
        </Text>
      )}
    </View>
  );
}

function Section({ title, sub, items }: { title: string; sub: string; items: ScoredSolution[] }) {
  if (items.length === 0) return null;
  return (
    <View>
      <Text style={s.sectionHead}>
        {title} <Text style={s.sectionSub}>— {sub}</Text>
      </Text>
      {items.map((sol) => (
        <Card key={sol.id} sol={sol} />
      ))}
    </View>
  );
}

function PlanDocument({ result, planUrl }: { result: MatchResult; planUrl: string }) {
  const date = new Date().toISOString().slice(0, 10);
  return (
    <Document
      title={`AI Plan — ${result.industryLabel}`}
      author="Netsol AI"
      subject="Your personalized AI use-case plan"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.kicker}>AI Use-Case Finder</Text>
        <Text style={s.h1}>Your AI Plan</Text>
        <Text style={s.meta}>
          {result.industryLabel} · Generated {date} · netsolai.cz
        </Text>

        <View style={s.scoreBox}>
          <View style={s.scoreTop}>
            <Text style={s.scoreLabel}>AI Opportunity Score</Text>
            <Text style={s.scoreNum}>
              {result.opportunityScore}/100 · {result.opportunityBand}
            </Text>
          </View>
          <Text style={s.archetype}>{result.profile.archetype}</Text>
          <Text style={s.profileLine}>{result.profile.line}</Text>
        </View>

        <Text style={s.summary}>{result.summary}</Text>

        <Section title="Before you build anything" sub="you might not even need AI" items={result.noAiFirst} />
        <Section title="Quick wins" sub="do these yourself" items={result.quickWins} />
        <Section title="Bigger projects" sub="worth getting built right" items={result.projects} />

        <View style={s.footer} fixed>
          <Text>Built by Hamza Ali · Netsol AI · netsolai.cz</Text>
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

export async function renderPlanPdf(result: MatchResult, planUrl: string): Promise<Buffer> {
  return renderToBuffer(<PlanDocument result={result} planUrl={planUrl} />);
}
