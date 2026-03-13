# Beyond the Pass/Fail: Re-evaluating the Bechdel Test

**Author:** Ruth Shimelis
**Live Story Link:** [Insert your GitHub Pages link here once deployed]

## 1. Story and Data Sources
* **Original Story:** ["The Dollar-And-Cents Case Against Hollywood’s Exclusion of Women"](https://fivethirtyeight.com/features/the-dollar-and-cents-case-against-hollywoods-exclusion-of-women/) by FiveThirtyEight.
* **Data Source:** The raw dataset was provided via the [FiveThirtyEight public GitHub repository](https://github.com/fivethirtyeight/data/tree/master/bechdel). 

## 2. Design Process and "Making Of"
The original FiveThirtyEight article argued that movies passing the Bechdel test see a higher return on investment. For my remix, I decided to take a **Multiple Views** approach. I wanted to show that the Bechdel Test is actually an incredibly low bar, and simply looking at "Pass/Fail" obscures how the industry still marginalizes women, particularly in big-budget films. 

To support this narrative, I made these visualizations:
 
* **Visualization 1 (Interactive D3 Scatterplot):** I chose a scatterplot comparing budget to international gross to establish the baseline. Coloring the dots by Pass/Fail allows the reader to instantly see the density of failures, particularly at the higher end of the budget spectrum. 
* **Visualization 2 (Interactive D3 Bar Chart):** Rather than just looking at genre, I visualized *how* movies fail the test (e.g., "no women," "men"). A descending bar chart was the most effective way to show the sheer volume of movies that fail simply because two named women never speak to each other.
* **Visualization 3 (D3 Trend Line):** I used a line chart to map the historical pass rate percentage. This concludes the narrative by answering the natural next question: "Is it getting better?" The line chart clearly shows the volatility and slow progress over the decades.

## 3. Extra Credit Implementations
* **New Techniques (Scrollytelling):** I moved away from the traditional magazine-style layout (where charts are just paper figures inline with text) and implemented a custom CSS scrollytelling experience. Using Flexbox and `position: sticky`, the narrative text scrolls dynamically on the left side of the screen while the visualizations remain anchored on the right. This approach allows the reader to continuously engage with the data without losing their place in the story, broken into specific "scenes."
* **View Coordination:** To help clarify the arguments and connect the visualizations, I designed the bar chart (Viz 2) and the scatterplot (Viz 1) to interact with one another. When a user clicks on a specific failure category in the bar chart, the scatterplot dynamically filters, physically removing the unrelated dots and isolating only the movies that failed for that specific reason. Clicking the bar again resets the dashboard.

## 4. AI Acknowledgement
*I utilized AI (Gemini) to support the creation of this project. It was used specifically as a pair-programming assistant to debug D3.js rendering issues (such as NaN data points crashing the SVG, and overlapping SVGs blocking hover states) and to assist with writing CSS to override default styling in dark mode.*