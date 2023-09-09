export const fetchResult = async (url, body) => {
  const res = await fetch(url, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  return await res.json();
};
export const fetchPostSummary = async (searchQuery) => {
  const description = searchQuery && searchQuery.description;
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    frequency_penalty: 0.0,
    max_tokens: 256,
    messages: [
      {
        content:
          "Summarize post content you are provided with for a second-grade student in 5 bullet points ",
        role: "system",
      },
      {
        content: `${description}\n\nTl;dr`,
        role: "user",
      },
    ],
    model: "gpt-3.5-turbo",
    presence_penalty: 0.0,
    temperature: 0,
    top_p: 1.0,
  };
  return await fetchResult(url, body);
};
