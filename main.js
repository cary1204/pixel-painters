document.addEventListener("DOMContentLoaded", () => {
    const brewBtn = document.getElementById("brewBtn");
    brewBtn.addEventListener("click", generatePotion);
  });
  
  async function generatePotion() {
    const ingredients = document.getElementById('ingredients').value.trim();
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = "✨ Brewing your potion...";
  
    const prompt = `Create a funny fantasy potion description using these ingredients: ${ingredients}. Make it whimsical and short.`;
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.9
        })
      });
  
      const data = await response.json();
      const potionText = data.choices?.[0]?.message?.content || "Something went wrong.";
      outputDiv.innerHTML = `<strong>Your Potion:</strong><br>${potionText}`;
    } catch (err) {
      outputDiv.innerHTML = "⚠️ Failed to brew the potion.";
      console.error(err);
    }
  }
  