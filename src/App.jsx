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
        <p className="text-[18px] leading-normal text-black max-w-none mb-10">
          The 2026 Cape Town Marathon was a weekend full of notable results. Cape Town was named the eighth Abbott World Marathon Major, Mohammed Esa ran the fastest marathon ever recorded on 
          African soil, and the depth of the men's race was equally significant, with the first ten finishers all running faster than the previous course record. On top of that, more than 18,500 
          runners finished the marathon. With so much happening in a single edition of the race, I wanted to look more closely at what the results reveal about the field as a whole.
        </p>
        <Figure
          title="Every dot represents one of the 18,523 finishers"
          meta="18,523 finishers"
          caption="Each dot is coloured according to its finishing time segment, with callouts for a few notable runners: race winner Huseyidin Mohamed Esa, who ran the fastest marathon ever recorded on African soil; Eliud Kipchoge, the GOAT; women’s winner Dera Dida Yami; and two friends of mine who also took on the marathon, Finn and Lau."
        >
          <CensusGrid />
        </Figure>

        <p className="text-[18px] leading-normal text-black max-w-none mb-6">
          Using data scraped from the official timekeeping website, <a href="https://www.sportsplits.com/races/sanlam-cape-town-marathon-2026/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">SportSplits</a>, a few things I looked at include:
        </p>

        <ol className="max-w-none mb-8 space-y-3 list-decimal pl-12 text-[18px] leading-normal text-neutral-900">
          <li>
            Who turned up on race day? A look at starters, non starters and DNFs, alongside the demographic profile of the finishing field and the overall distribution of finishing times.
          </li>
          <li>
            How a given finishing time would have placed you relative to the field, and the goal times runners were chasing.
          </li>
          <li>
            How the race was actually run across different finishing time groups.
          </li>
          <li>
            Where the marathon wall begins to show up in the data, and what an aggressive start tends to cost later.
          </li>
          <li>
            Which runners paced their races particularly well.
          </li>
        </ol>

        <p className="text-[18px] leading-normal text-black max-w-none">
          I finish with a brief discussion of the methods used, along with the main limitations and caveats in the data. What follows is a more detailed look at these questions through the results themselves, supported by comparisons and visualisations.
        </p>
      </section>

        <StatStrip />

        <Section id="turnout"   num="01" title="Who actually turned up">
          <p className="text-[18px] leading-normal max-w-none mb-6">
            In an official press release, Cape Town Marathon Media shared that they were expecting 27,000 runners to line up on Sunday, 24 May. SportSplits, however, records 24,268 runners as registered for the marathon. Of those, 5,374, or 22%, did not start, while a further 371 started but did not finish. That leaves 18,523 recorded finishers crossing the line near Green Point Stadium, around 12% more than in 2024.
          </p>
          
          <p className="w-full max-w-none italic">
            Note: SportSplits lists 18,526 finishers, but three finishing positions, <strong>9927</strong>, <strong>14242</strong> and <strong>15708</strong>, are missing from the underlying records. For the analysis that follows, I therefore use 18,523 as the total number of finishers.
          </p>

          <Figure
            full
            title="Who was on the results page"
            meta={`${/* total */ ""} listed`}
            caption=""
          >
            <StatusBar />
          </Figure>          

          <p className="text-[18px] leading-normal max-w-none mb-6">
            Of those 18,523 finishers in this year's Cape Town Marathon, South Africans made up two-thirds, but the remaining <strong>34%</strong> came from 138 countries across all parts of the world.
            One runner was even registered in Antarctica. With Cape Town securing status as the 8th Abbott World Marathon Major, those non-South African numbers should climb sharply by the 2027 edition.
            The chart below lists finishers by country in descending order, which you can flip through.
          </p>

          <Figure
            title="Finishers by country"
            meta="138 countries"
            caption="Share of the full field, including South Africa. Search by IOC code, or exclude South Africa to rescale the bars."
            className="col-span-full"
          >
            <CountryFlagBars />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
            Looking at the high level finish times through a distribution of runners in 5 minute bins, across all genders and finish time categories, three notable spikes appear around the round numbers
            most of us chase as marathon goals, with the sharpest jump at the 4 hour mark (we'll look into this in a bit more in the next section). The median finish across all finishers was <strong>4:33:09</strong>, just
            20 seconds off the <strong>4:32:49</strong> average time to run a marathon that <a href="https://www.brooksrunning.com/en_es/blog/advice-tips/average-marathon-time.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">RunRepeat</a> compiled from 107.9 million race results.
          </p>

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

          <p className="text-[18px] leading-normal max-w-none mb-6">
            Looking at the high level finish times through a distribution of runners in 5 minute bins, across all genders and finish time categories, three notable spikes appear around the round numbers
          </p>

          <Figure
            title="Finish times, 1-minute bins"
            meta="Red = 2 min before a barrier"
            caption="Dashed lines mark the classic barriers. The red bars are the runners who found something in the last two minutes."
          >
            <BarrierBunching />
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
          {/* <Figure
            title="Finish times, 1-minute bins"
            meta="Red = 2 min before a barrier"
            caption="Dashed lines mark the classic barriers. The red bars are the runners who found something in the last two minutes."
          >
            <BarrierBunching />
          </Figure> */}
        </Section>
        <Section id="method" num="08" title="Methods & Caveats">
        </Section>
      </main>
    </div>
  );
}