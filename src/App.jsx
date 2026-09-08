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
import GenderParticipation from "./charts/GenderParticipation";
import Sub3ByYear from "./charts/Sub3ByYear";
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
  { id: "splits", num: "05", title: "Most runners positive-split" },
  { id: "method", num: "06", title: "Method & caveats" },
];

export default function App() {
  return (
    <div className="bg-paper text-ink font-serif min-h-screen text-[17.5px] leading-[1.62]">
      <SectionNav sections={SECTIONS} />
      <Masthead />
      <main className="max-w-[1060px] mx-auto px-6 pb-24">
        <h1 className="font-display font-extrabold text-[clamp(34px,6.2vw,64px)] leading-[.97] tracking-[-.022em] mb-6 max-w-[15ch]">
          <span className="text-[#000028]">The 2026 Cape Town Marathon</span>{" "}
          <span className="text-[#00c8ff]">by the Numbers</span>
        </h1>        
        <p className="font-mono text-[11.5px] tracking-[.2em] uppercase text-flare mb-5">
          Written By Aidan Craker
        </p>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <StatStrip />
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
            Who turned up on race day? A look at starters, non starters and DNFs, alongside the demographic profile of the finishing field, the distribution of finishing times and how participation has shifted over past editions of the marathon.
          </li>
          <li>
            How a given finishing time would have placed you relative to the field, and the goal times runners were chasing.
          </li>
          <li>
            How the race was actually run across different finishing time groups, breaking down the paces across finishing bands.
          </li>
          <li>
            A quick look into where the marathon wall begins to show up in the data, and what an aggressive start tends to cost later.
          </li>
          <li>
            Which runners paced their races particularly well.
          </li>
        </ol>

        <p className="text-[18px] leading-normal text-black max-w-none">
          I finish with a brief discussion of the methods used, along with the main limitations and caveats in the data. What follows is a more detailed look at these questions through the results themselves, supported by comparisons and visualisations.
        </p>
      </section>


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
            One runner was even registered in Antarctica. With Cape Town securing it's status as the 8th Abbott World Marathon Major, we can expect those non-South African numbers to climb sharply by next year's edition of the race.
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
            most of us chase as marathon goals, with the sharpest jump at the 4 hour mark (we'll look into this in a bit more in the next section). The median finish time across all those that finished the race was <strong>4:33:09</strong>, just
            20 seconds off the <strong>4:32:49</strong> average time to run a marathon that <a href="https://www.brooksrunning.com/en_es/blog/advice-tips/average-marathon-time.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">RunRepeat</a> compiled from 107.9 million race results.
          </p>

          <Figure
            title="Finish times, 5-minute bins"
            meta="18,523 finishers"
            caption="Distribution of all finish times. The dashed line marks the median."
          >
            <FinishHistogram />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          Breaking down the finisher distribution by gender and age category, we can clearly see that the field is predominantly male, accounting for 63% of all finishers. The largest single group is men under the age of 40, 
          classified in the Senior category, who represent just under a quarter of the field at 24%.
          </p>

          <Figure
            title="Finishers by age category and gender"
            caption="Categories ordered youngest to oldest."
          >
            <CategoryPyramid />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          Across the available Cape Town Marathon finisher data from 2012 through to 2026, the gender composition has remained fairly stable, with men accounting for around 62% to 70% of finishers. 
          Participation itself has changed more significantly, growing strongly over the period despite a decline from 2018 to 2021, before rising again from 2022 onwards.
          </p>

          <Figure
            title="Line chart of gender participation across yeares"
            caption="There is currently no available finish data for 2019; with the marathon not taking place in 2020, and 2025"
          >
            <GenderParticipation />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          Given the blistering paces and records set at this year’s race, I wanted to see how fast this year's field compared with previous editions. To do that, I looked at the proportion of male and female 
          finishers in each year who ran under three hours, which you can see by the size of each bar below. 
          </p>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          Among men, the share finishing under three hours is typically between 4% and 6.5%, 
          compared with roughly 0.4% to 1.2% among women. Remarkably in 2021, 9.2% of male finishers broke three hours, well above any previous year. Given the smaller field that year, this points to 
          a notably stronger concentration of faster male runners (that may have been doing some extensive training over COVID). 
          </p>

          <Figure
            title="The proportion of each year's finishing genders that ran a sub 3"
            caption="There is currently no available finish data for 2019; with the marathon not taking place in 2020, and 2025"
          >
            <Sub3ByYear />
          </Figure>

        </Section>

        <Section id="placing" num="02" title="Where your time would have placed you">
          <p className="text-[18px] leading-normal max-w-none mb-6">
          A pretty neat way to visualise the field is by plotting the cumulative distribution of finish times. Reading the chart vertically, the black line shows the overall field, 
          while the blue and red lines show the male and female distributions respectively. Drag the yellow dot along the black line, or enter an expected finish time, to see what 
          percentile and approximate finishing position that time would have produced in this year's race.
          </p>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          The chart also makes the gaps between the distributions quite clear. Around the middle of the field, a 4:30 finish sits close to the 48th percentile overall, while 4:00 
          is around the 31st and 5:00 around the 67th. The separation between the male and female curves is largest through much of the middle of the distribution, before narrowing 
          again towards the slower end of the field.
          </p>
          {/* finder, percentile curve */}
          <Figure
            title="Finish time by percentile"
            caption="Read vertically: pick a finish time, see what share of the field beat it. Dots mark the classic barriers on the overall curve."
          >
            <PercentileCurve />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
            Breaking the finishers down into one minute bins makes the pull of the round number targets much more clear. The biggest spikes appear just before the 3:00, 3:30, 4:00, 
            4:30 and 5:00 barriers, with the final two minutes before each cutoff highlighted in red.
          </p>


          <Figure
            title="Finish times, 1-minute bins"
            meta="Red = 2 min before a barrier"
            caption="Dashed lines our finishing bands. The red bars are the runners who found something in the last two minutes."
          >
            <BarrierBunching />
          </Figure>
          <p className="text-[18px] leading-normal max-w-none mb-6">
            Across those barriers, 6.6% of all finishers crossed the line in the final two minutes before a cutoff. Widen that window to three minutes and the share rises to 9.9%, 
            which gives a good sense of how many runners were squeezing out just enough in the closing stages to get under a target time.
          </p>

        </Section>

        <Section id="pacing" num="03" title="How the race was actually run">
          <p className="text-[18px] leading-normal max-w-none mb-6">
            Across all 18,523 finishers, 17,671 had every split recorded across the entire race. The <strong>actual pace</strong> chart shows the average segment pace for each 
            finishing band in minutes per kilometre, while the <strong>normalised</strong> chart shows how each segment compares with each runner's own average race pace, averaged within the finishing band. 
            This makes it easier to compare pacing patterns across groups with very different finishing times.
          </p>
          <Figure
            title="Segment pace by finishing band"
            meta={/* mode-aware meta lives in the toggle chart's axis label instead */ "six bands"}
            caption="Switch between actual and normalised pace using the button above"
          >
            <SegmentByBand />
          </Figure>
          <p className="text-[18px] leading-normal max-w-none mb-6">
            Across every finishing band, the first 20km was run quicker than average, followed by a gradual decline in pace that becomes much sharper after 25km. This 
            is visible among slower groups, with the 5:00+ runners moving from around 87% of their average pace in the opening 5km to roughly 112% between 
            30 and 35km.
          </p>
          <p className="text-[18px] leading-normal max-w-none mb-6">
            The faster groups were more consistent, but on average, no finishing segment escaped that late slowdown. By the final segment, all six bands had converged to roughly 107% to 109% 
            of their own average pace, suggesting that the final few kilometre segments imposed a similar relative cost across the field.
          </p>
        </Section>

        <Section id="wall" num="04" title="Finding the wall">
          <p className="text-[18px] leading-normal max-w-none mb-6">
            Every marathon runner has heard of the infamous wall, the point where maintaining that original goal pace suddenly becomes much harder or even goes straight out the window. To see where that shows up here, I compared each runner's pace across different 
            sections of the course with their own average pace for the race - a more telling way to see the wall than the previous normalised chart.
          </p>
          <p className="text-[18px] leading-normal max-w-none mb-6">
            This chart compares how each finishing time band moves through the race relative to its own average pace. Each cell shows the average percentage deviation from a runner’s overall race pace for that segment, averaged across all runners in the finishing band. 
            Negative (seen in blue) values indicate sections run faster than average, while positive (seen in red) values show where runners begin to slow. For example, runners finishing between 4:30 and 5:00 are around 8% faster than their average pace between 10 and 15 km, 
            but <strong>12% slower</strong> between 30 and 35 km.
          </p>

          <Figure
            title="Pace deviation by band and segment"
            meta="Blue faster · red slower"
            caption="Values are percentage deviation from each runner's own average pace, averaged within band. Read down any column to compare how each finishing band paced the segment."
          >
            <PaceHeatmap />
          </Figure>
          <p className="text-[18px] leading-normal max-w-none mb-6">
            Like we saw earlier, the pattern becomes more pronounced as finishing time increases. Slower runners tend to bank more time early in the race, then experience a sharper slowdown 
            from around 25 to 30 km onwards. Even the fastest runners slow late in the course, but the change is much less severe. The relationship between finishing time and pacing consistency is pretty obvious, 
            with stronger performances generally associated with a more even distribution of effort across the race.

          </p>
        </Section>

        <Section id="splits" num="05" title="Most runners positive-split">
          <p className="text-[18px] leading-normal max-w-none mb-6">
          A negative split means running the second half of the marathon faster than the first, and is generally a useful measure of pacing control - generally translating to finishing strong. At this year’s Cape Town Marathon, 
          just <strong>5.4%</strong> of finishers managed it, equivalent to 992 runners.
          </p>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          Breaking those runners down by finishing band shows a clear relationship between pace and negative split rate. Around <strong>13.5%</strong> of sub 3 finishers ran a negative split, compared with 
          just <strong>1.3%</strong> of those finishing in more than five hours. Women also recorded a higher negative split rate than men in almost every finishing band, with the largest gap among sub 3 runners, 
          where 24% of women achieved one compared with 13% of men. This suggests that, particularly among the fastest runners, women were more likely to distribute their effort evenly and leave 
          enough in reserve for the second half.
          </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 max-w-[900px] my-8">

          <Figure
            title="Second half minus first"
            meta="2.5-min bins"
            caption="The distribution of runners based on the difference between their second half and first half marathon times."
          >
            <SplitDifferential />
          </Figure>
          <Figure
            title="Negative-split rate"
            meta="By band and gender"
            caption="Each bar shows the share of men or women within a finishing time category who completed the race with a negative split."
          >
            <NegSplitRate />
          </Figure>
        </div>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          The same pattern becomes visible when we look at the full distribution of second half versus first half times by finishing band. Faster runners are clustered much closer to zero, 
          while the distributions shift progressively to the right as finishing times increase.
          </p>

          <Figure full
            title="Second half minus first half, by finishing band"
            meta="1-minute bins"
            caption="Everything right of the vertical line is a positive split. The distribution both widens and shifts right as the bands slow."
          >
            <PositiveSplitByBand />
          </Figure>

          <p className="text-[18px] leading-normal max-w-none mb-6">
          The difference is easiest to see in how each group reaches the finish. Sub 3 runners tend to stay close to their first half pace, with only a modest slowdown for most of them. However, when we look further down the field, by the 5:00+ band
          many runners are giving away 20 to 30 minutes in the second half, and the spread is far wider. Faster finishing groups lose less time, while the slower groups experience a much more varied second half.
          </p>

        </Section>

        <Section id="method" num="06" title="Methods & Caveats">
        </Section>
      </main>
    </div>
  );
}