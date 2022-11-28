function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample)
{
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) =>
  {
    // 3. Create a variable that holds the samples array. 

    var sampleArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var selectedSample = filterArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuId = selectedSample.otu_ids;
    var otulabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;
    console.log(otuId, otulabels, sampleValues);
    // 7. Create the yticks for the bar chart.
     
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedSampleValues = filterArray.sort((a, b) =>
      b.sampleValues - a.sampleValues);
    // console.log(sortedOTU); 

    var sortedSampleValues = sampleValues.slice(0, 10);
    var sortedOTUIDs = otuId.slice(0, 10);
    var sortedLabels = otulabels.slice(0, 10);
    console.log(sortedSampleValues, sortedOTUIDs, sortedLabels);

    var yticks = sortedOTUIDs.map(x => `OTU ${x}`);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sortedSampleValues,
      y: yticks,
      type: "bar",
      orientation: 'h',
      text: otulabels,// this creates the hovertext
      marker: { color: "light blue" }
    }];
  

  
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: { autorange: 'reversed' }
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    var bubbleData = [{
      x: otuId,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuId,

      },
      text: otulabels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU IDs" },
      showlegend: false,
      height: 600,
      width: 600
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)


  });
  
  // D3: 3. Use Plotly to plot the data with the layout.
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Create a variable that converts the washing frequency to a floating point number.
    var washFre = parseFloat(result.wfreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: d3.select(optionChanged),
      value: washFre,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Wash Frequency</b><br> Number of Scrubs per Week" },
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
        threshold: {
          line: { color: "lime", width: 6 },
          thickness: 1.0,
          value: 10
        }
      }

    }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}; 


  