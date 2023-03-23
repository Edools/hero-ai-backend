import { Configuration, OpenAIApi } from "openai";

const configration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configration);

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function heroAi(request, response) {
  try {
    const question = request.body.question;

    const openAiResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${question}`,
      temperature: 0.7, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    response.status(200).send({
      bot: openAiResponse.data.choices[0].text,
    });
  } catch (error) {
    response.status(500).send(error || "Something went wrong");
  }
}

export default allowCors(heroAi);
