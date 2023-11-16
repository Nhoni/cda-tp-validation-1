import { useState } from "react";
import * as OpenAI from "openai";

const ChatbotApp = () => {
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Assurez-vous que la clé d'API est configurée côté client
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setApiResponse("API key not provided.");
      setLoading(false);
      try {
        const result = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 4000,
        });
        setApiResponse(result.data.choices[0].text);
      } catch (e) {
        setApiResponse("Something is going wrong, Please try again.");
      }
      setLoading(false);
      console.log('Après la soumission', prompt); 
      return
    };

    


    const configuration = new OpenAI.Configuration({
      apiKey: apiKey,
    });

    const openai = new OpenAI.OpenAIApi(configuration);

    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 4000,
      });
      setApiResponse(result.data.choices[0].text);
    } catch (e) {
      setApiResponse("Something is going wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: '100vh',
        }}
      >
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={prompt}
            placeholder="Please ask to OpenAI"
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            disabled={loading || prompt.length === 0}
            type="submit"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>
      {apiResponse && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <pre>
            <strong>API response:</strong>
            {apiResponse}
          </pre>
        </div>
      )}
    </>
  );
};

export default ChatbotApp;
