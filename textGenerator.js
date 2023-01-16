import got from 'got';

export async function generate(prompt) {
  const url = 'https://api.openai.com/v1/engines/davinci/completions';
  const params = {
    'prompt': `Human: ${prompt}`,
    'max_tokens': 150,
    'temperature': 0.9,
    'frequency_penalty': 0,
    'presence_penalty': 0.6,
    'temperature': 0.9,
    'stop': '\nHuman'
  };
  const headers = {
    'Authorization': `Bearer <your API key>`, //https://beta.openai.com/account/api-keys
  };

  const response = await got.post(url, { json: params, headers: headers }).json();
  return `${prompt}${response.choices[0].text}`;
  
}