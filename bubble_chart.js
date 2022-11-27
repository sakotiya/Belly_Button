// Bar and Bubble charts
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
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

    ot("bar", barData, barLayout)
  });
 
  var bubbleData = [{
    x: otuIDs,
    y: sampleValues,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIDs,

    },
    text: otuLabels
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




};