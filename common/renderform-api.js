export async function renderImage(externalImageUrl, externalText) {
  const url = `https://api.renderform.io/api/v2/render`;
  const requestBody = {
    template: 'bad-sparrows-sit-briefly-1374',
    data: {
      'my-text-container.text': externalText,
      'my-image-container.src': externalImageUrl,
    }
  };


  const requestBodyJson = JSON.stringify(requestBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.RENDER_FORM_API_KEY,
      },
      body: requestBodyJson,
    });

    if (!response.ok) {
      console.error('Ugh, renderImage got not ok status. Result:', await response.json());
      throw new Error(`Network response was not ok - status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Ups, some error occurred during sendAnswer: ${error.message}`);
  }
}
