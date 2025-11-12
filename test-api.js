async function testAPI() {
  try {
    const response = await fetch('https://data.gov.sg/datasets/d_f1404e08587ce555b9ea3f565e2eb9a3/view');
    const data = await response.json();
    
    console.log('Full API Response:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
