// PAGE
import Masthead from "./components/Masthead";
import StatStrip from "./components/StatStrip";
import Section from "./components/Section";
import Figure from "./components/Figure";
import CensusGrid from "./charts/CensusGrid";
// SECTION 1
import StatusBar from "./charts/StatusBar";
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
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-[clamp(18px,2.1vw,21px)] leading-normal text-black max-w-[72ch] mb-10">
          The 2026 Cape Town Marathon was a weekend full of notable results. Mohammed Esa ran the fastest marathon ever recorded on African soil, more than 18,500 runners finished the marathon, and Cape Town was named the eighth Abbott World Marathon Major. The depth of the men’s race was equally significant, with the first ten finishers all running faster than the previous course record. With so much happening in a single edition of the race, I wanted to go beyond the headline performances and look more closely at what the results reveal about the field as a whole.
        </p>
        <Figure
          title="Every dot represents one of the 18,523 finishers"
          meta="18,523* finishers"
          caption="Each dot represents one single runner, starting from the fastest marathon run on African soil through to the 18,523rd finisher"
        >
          <CensusGrid />
        </Figure>

        <p className="text-[clamp(18px,2.1vw,21px)] leading-normal text-black max-w-[72ch] mb-6">
          Using data scraped from the official timekeeping website, SportSplits, I break down:
        </p>

        <ol className="max-w-[72ch] mb-10 space-y-3 list-decimal pl-12 text-[clamp(17px,2vw,20px)] leading-normal text-neutral-900">
          <li>
            who turned up on race day, including the demographics of the field and the distribution of finishing times
          </li>
          <li>
            where a given finishing time would have placed you relative to the rest of the field
          </li>
          <li>
            how runners actually paced the race across different finishing segments
          </li>
          <li>
            where the marathon wall begins to show up in the data, and what an aggressive start tends to cost later
          </li>
          <li>
            which runners paced their races particularly well
          </li>
        </ol>

        <p className="text-[clamp(18px,2.1vw,21px)] leading-normal text-black max-w-[72ch]">
          I finish with a brief discussion of the methods used, along with the main limitations and caveats in the data. What follows is a more detailed look at these questions through the results themselves, supported by comparisons and visualisations.
        </p>
      </section>

        <StatStrip />

        <Section id="turnout"   num="01" title="Who actually turned up">
          <p className="max-w-[646px]">Placeholder copy.</p>

          <Figure
            full
            title="Who was on the results page"
            meta={`${/* total */ ""} listed`}
            caption="Everyone the results page lists, by what actually happened on the day. Unregistered are entries with no finishing position recorded at all."
          >
            <StatusBar />
          </Figure>          

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