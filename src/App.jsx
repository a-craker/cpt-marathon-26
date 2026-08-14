// PAGE
import Masthead from "./components/Masthead";
import StatStrip from "./components/StatStrip";
import Section from "./components/Section";
import Figure from "./components/Figure";
import HeroSpaghetti from "./charts/HeroSpaghetti";
// SECTION 1
import FinishHistogram from "./charts/FinishHistogram";
import CategoryPyramid from "./charts/CategoryPyramid";
import CountryFlagBars from "./charts/CountryFlagBars";
// SECTION 2
import PercentileCurve from "./charts/PercentileCurve";
// SECTION 3
import SegmentByBand from "./charts/SegmentByBand";
// SECTION 4
import PaceHeatmap from "./charts/PaceHeatmap";
// SECTION 5
import CostOfFastStart from "./charts/CostOfFastStart";
// SECTION 6
import PositiveSplitByBand from "./charts/PositiveSplitByBand";
import SplitDifferential from "./charts/SplitDifferential";
import NegSplitRate from "./charts/NegSplitRate";
// SECTION 7
import BarrierBunching from "./charts/BarrierBunching";
// NAVIGATION
import SectionNav from "./components/SectionNav";

const SECTIONS = [
  { id: "turnout", num: "01", title: "Who actually turned up" },
  { id: "placing", num: "02", title: "Where your time would have placed you" },
  { id: "pacing", num: "03", title: "How the race was actually run" },
  { id: "wall", num: "04", title: "Finding the wall" },
  { id: "faststart", num: "05", title: "What a fast start costs" },
  { id: "splits", num: "06", title: "Most runners positive-split" },
  { id: "barriers", num: "07", title: "Chasing round numbers" },
  { id: "method", num: "08", title: "Method & caveats" },
];

export default function App() {
  return (
    <div className="bg-paper text-ink font-serif min-h-screen text-[17.5px] leading-[1.62]">
      <SectionNav sections={SECTIONS} />
      <Masthead />
      <main className="max-w-[1060px] mx-auto px-6 pb-24">
        <h1 className="font-display font-extrabold text-[clamp(38px,7.2vw,74px)] leading-[.97] tracking-[-.022em] mb-6 max-w-[15ch]">
          <em className="not-italic text-flare">Race Analysis:</em> 2026 Cape Town Marathon
        </h1>
        <p className="font-mono text-[11.5px] tracking-[.2em] uppercase text-flare mb-5">
          Written By Aidan Craker
        </p>
        <p className="text-[clamp(18px,2.1vw,21px)] leading-normal text-graphite max-w-[56ch] mb-10">
          Placeholder 
        </p>

        <Figure
          title="Pace per segment, % of own average"
          meta="500 finishers sampled"
          caption="Each line is one runner's pace in each segment, as a percentage of their own average. Above the centre line is slower than their own average; below is faster."
        >
          <HeroSpaghetti />
        </Figure>

        <StatStrip />

        <Section id="turnout"   num="01" title="Who actually turned up">
          <p className="max-w-[646px]">Placeholder copy.</p>

          <Figure
            title="Finishers by country"
            meta="138 countries"
            caption="Share of the full field, including South Africa. Search by IOC code, or exclude South Africa to rescale the bars."
            className="col-span-full"
          >
            <CountryFlagBars />
          </Figure>

          <Figure
            title="Finish times, 5-minute bins"
            meta="18,523 finishers"
            caption="Distribution of all finish times. The dashed line marks the median."
          >
            <FinishHistogram />
          </Figure>

          <Figure
            title="Finishers by age category and gender"
            caption="Categories ordered youngest to oldest."
          >
            <CategoryPyramid />
          </Figure>

        </Section>

        <Section id="placing" num="02" title="Where your time would have placed you">
          {/* finder, percentile curve */}
          <Figure
            title="Finish time by percentile"
            caption="Read vertically: pick a finish time, see what share of the field beat it. Dots mark the classic barriers on the overall curve."
          >
            <PercentileCurve />
          </Figure>
        </Section>

        <Section id="pacing" num="03" title="How the race was actually run">
          <p className="max-w-[646px]">Placeholder copy.</p>
          <Figure
            title="Segment pace by finishing band"
            meta={/* mode-aware meta lives in the toggle chart's axis label instead */ "six bands"}
            caption="Switch to actual pace and the bands separate vertically but the shapes become hard to compare — which is why the normalised view is the one worth publishing."
          >
            <SegmentByBand />
          </Figure>
        </Section>

        <Section id="wall" num="04" title="Finding the wall">
          <p className="max-w-[646px]">Placeholder copy.</p>
          <Figure
            title="Pace deviation by band and segment"
            meta="Blue faster · red slower"
            caption="Values are percentage deviation from each runner's own average pace, averaged within band. Read down any column to see who is already in trouble at that point in the course."
          >
            <PaceHeatmap />
          </Figure>
        </Section>

        <Section id="faststart" num="05" title="What a fast start costs -- THIS CHART IS WRONG - AXES">
          <p className="max-w-[646px]">Placeholder copy.</p>
          <Figure
            title="First 5 km pace vs. second-half penalty"
            meta="Binned means, IQR shaded"
            caption="How hard runners attacked the first 5 km against how much slower their second half was than their first. The shaded band is the middle 50% of outcomes."
          >
            <CostOfFastStart />
          </Figure>
        </Section>

        <Section id="splits" num="06" title="Most runners positive-split">
          <p className="max-w-[646px]">Placeholder copy.</p>

          <Figure full
            title="Second half minus first half, by finishing band"
            meta="1-minute bins"
            caption="Everything right of the vertical line is a positive split. The distribution both widens and shifts right as the bands slow."
          >
            <PositiveSplitByBand />
          </Figure>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 max-w-[900px] my-8">
          <Figure
            title="Second half minus first"
            meta="2.5-min bins"
            caption="Blue ran the second half faster. Note how little blue there is."
          >
            <SplitDifferential />
          </Figure>
          <Figure
            title="Negative-split rate"
            meta="By band and gender"
            caption="The faster the band, the better the discipline — in both genders."
          >
            <NegSplitRate />
          </Figure>
        </div>
        </Section>

        <Section id="barriers" num="07" title="Chasing round numbers">
          <p className="max-w-[646px]">Placeholder copy.</p>
          <Figure
            title="Finish times, 1-minute bins"
            meta="Red = 2 min before a barrier"
            caption="Dashed lines mark the classic barriers. The red bars are the runners who found something in the last two minutes."
          >
            <BarrierBunching />
          </Figure>
        </Section>
        <Section id="method" num="08" title="Methods & Caveats">
        </Section>
      </main>
    </div>
  );
}