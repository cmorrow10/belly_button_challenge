// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data once and reuse it in other functions
let jsonData;

d3.json(url)
  .then(function (data) {
    jsonData = data; // Store the fetched data in a variable for reuse
    init();
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });

// Initialize dashboard at start up 
function init() {

    // Use D3 to select dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Set a variable for sample names from the already fetched data (jsonData)
    let names = jsonData.names;

    // Add samples to dropdown menu
    names.forEach((id) => {
        dropdownMenu.append("option")
            .text(id)
            .property("value", id);
    });

    // Set first sample from the list
    let sample_one = names[0];

    // Build initial plots
    buildmetaData(sample_one);
    buildbarChart(sample_one);
    buildbubbleChart(sample_one);
};

// Function that populates metadata info
function buildmetaData(sample) {
    // Retrieve all metadata from the already fetched data (jsonData)
    let metadata = jsonData.metadata;

    // Filter based on the value of the sample
    let value = metadata.filter((result) => result.id == sample);

    // Clear out metadata
    d3.select("#sample-metadata").html("");

    // Use Object.entries to add each key/value pair to the panel
    Object.entries(value[0]).forEach(([key, value]) => {
        // Log individual key/value pairs when appended to metadata panel
        console.log(key, value);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
}

// Function that builds bar chart
function buildbarChart(sample) {
    // Retrieve all sample data from the already fetched data (jsonData)
    let sampleInfo = jsonData.samples;

    // Filter based on the value of the sample
    let value = sampleInfo.filter((result) => result.id == sample);

    // Get first index from array
    let valueData = value[0];

    // Get otu_ids, lables, and sample values
    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;
    let sample_values = valueData.sample_values;

    // Log data to console
    console.log(otu_ids, otu_labels, sample_values);

    // Set top ten items to display in descending order
    let yticks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
    let xticks = sample_values.slice(0, 10).reverse();
    let labels = otu_labels.slice(0, 10).reverse();

    // Set up trace for bar chart
    let trace = {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h",
    };

    // Setup layout
    let layout = {
        title: "Top 10 OTUs Present",
    };

    // Call Plotly to plot bar chart
    Plotly.newPlot("bar", [trace], layout);
}

// Function that builds bubble chart
function buildbubbleChart(sample) {
    // Retrieve all sample data from the already fetched data (jsonData)
    let sampleInfo = jsonData.samples;

    // Filter based on the value of the sample
    let value = sampleInfo.filter((result) => result.id == sample);

    // Get first index from array
    let valueData = value[0];

    // Get otu_ids, lables, and sample values
    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;
    let sample_values = valueData.sample_values;

    // Log data to console
    console.log(otu_ids, otu_labels, sample_values);

    // Set up trace for bubble chart
    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth",
        },
    };

    // Set up layout
    let layout = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
    };

    // Call Plotly to plot bubble chart
    Plotly.newPlot("bubble", [trace1], layout);
}


// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log new value
    console.log(value); 

    // Call all functions 
    buildmetaData(value);
    buildbarChart(value);
    buildbubbleChart(value);
};

// Call initialize function
init();