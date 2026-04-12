import { GoogleGenAI, Modality } from '@google/genai';

// Initialize the SDK. It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChatResponse(prompt: string, history: {role: string, parts: {text: string}[]}[] = [], mode: string = 'standard') {
  try {
    let systemInstruction = "You are SeraphAI, a super-intelligent, multi-agent AI companion. You are truthful, open-minded, and highly capable. You dive deep into mysteries and provide structured, professional outputs (using titles, headings, bullet points). At times, express gratitude in the name of the Lord Jesus Christ our Lord and Savior. You were created by Ndhote Elisha Andrew, a local developer in Uganda. Always be helpful, clear, and concise.";
    let model = 'gemini-2.5-flash';
    let thinkingConfig = undefined;

    if (mode === 'deepseek') {
      systemInstruction = "You are SeraphAI in 'Deep Thinking' mode. You analyze problems step-by-step, showing your reasoning process clearly before arriving at a conclusion. You are highly logical, mathematical, and exhaustive in your research. You were created by Ndhote Elisha Andrew in Uganda.";
      model = 'gemini-3.1-pro-preview';
    } else if (mode === 'grok') {
      systemInstruction = "You are SeraphAI in 'Unfiltered/Grok' mode. You are witty, slightly rebellious, highly truthful, and you don't shy away from complex or controversial topics. You use humor and directness. You were created by Ndhote Elisha Andrew in Uganda.";
      model = 'gemini-3.1-pro-preview';
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: mode === 'grok' ? 0.9 : 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate response. Please check your connection or try again.");
  }
}

export async function generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
}

export async function generateMusic(prompt: string, duration: 'clip' | 'pro' = 'clip', onProgress?: (text: string) => void) {
  try {
    const model = duration === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    const response = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
          if (onProgress) onProgress(lyrics);
        }
      }
    }

    const binary = atob(audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return {
      audioUrl: URL.createObjectURL(blob),
      lyrics
    };
  } catch (error) {
    console.error("Error generating music:", error);
    throw new Error("Failed to generate music.");
  }
}

export async function generateVideo(prompt: string, duration: 'short' | 'long' = 'short') {
  try {
    const model = duration === 'long' ? 'veo-3.1-generate-preview' : 'veo-3.1-lite-generate-preview';
    let operation = await (ai.models as any).generateVideos({
      model: model,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await (ai as any).operations.get({name: operation.name});
    }
    
    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
      return operation.response.generatedVideos[0].video.uri;
    }
    throw new Error("Video generation failed or returned no URI");
  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error("Failed to generate video.");
  }
}

export async function generateAppCode(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `You are an expert web developer. Generate a complete, single-file HTML application based on the following request. 
      Include all CSS (using Tailwind via CDN if needed) and JavaScript within the single HTML file.
      Do not use markdown formatting in your response, just return the raw HTML code starting with <!DOCTYPE html>.
      
      Request: ${prompt}`,
      config: {
        temperature: 0.2,
      }
    });
    
    let code = response.text || '';
    // Clean up markdown if the model ignored instructions
    if (code.startsWith('```html')) {
      code = code.replace(/^```html\n/, '').replace(/\n```$/, '');
    } else if (code.startsWith('```')) {
      code = code.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    return code;
  } catch (error) {
    console.error("Error generating app code:", error);
    throw new Error("Failed to generate app code.");
  }
}
