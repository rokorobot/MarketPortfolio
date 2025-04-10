import OpenAI from "openai";
import { createReadStream } from "fs";
import { log } from "./vite";
import path from "path";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTagsFromImage(imagePath: string, title: string, description: string): Promise<string[]> {
  try {
    const absolutePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.join(process.cwd(), imagePath.replace(/^\//, ''));

    // Read the image file
    const imageBuffer = await fs.promises.readFile(absolutePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a tag generator for a portfolio website. Analyze the image and related text to generate relevant, specific tags. 
          Return exactly 5-8 tags that best describe the content. Focus on artistic style, medium, mood, subject matter, and technical aspects.
          Return only a JSON array of strings.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text", 
              text: `Please generate tags for this portfolio item.
              Title: ${title}
              Description: ${description}
              Please analyze the image and provide relevant, specific tags.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse JSON response
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Check if result.tags exists and is an array
    if (Array.isArray(result.tags)) {
      return result.tags;
    } else {
      // If OpenAI didn't return the exact format we expected, try to find any array in the response
      const firstArray = Object.values(result).find(value => Array.isArray(value));
      if (firstArray) return firstArray as string[];
      
      // Fallback in case there are no arrays in the response
      log("OpenAI did not return tags in expected format", "openai");
      return [];
    }
  } catch (error) {
    log(`Error generating tags: ${error}`, "openai");
    return [];
  }
}

export async function generateTagsFromText(title: string, description: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a tag generator for a portfolio website. Generate relevant, specific tags based on the provided title and description.
          Return exactly 5-8 tags that best describe the content. Focus on artistic style, medium, mood, subject matter, and technical aspects if applicable.
          Return the tags as a JSON array of strings.`,
        },
        {
          role: "user",
          content: `Please generate tags for this portfolio item.
          Title: ${title}
          Description: ${description}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse JSON response
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Check if result.tags exists and is an array
    if (Array.isArray(result.tags)) {
      return result.tags;
    } else {
      // If OpenAI didn't return the exact format we expected, try to find any array in the response
      const firstArray = Object.values(result).find(value => Array.isArray(value));
      if (firstArray) return firstArray as string[];
      
      // Fallback in case there are no arrays in the response
      log("OpenAI did not return tags in expected format", "openai");
      return [];
    }
  } catch (error) {
    log(`Error generating tags: ${error}`, "openai");
    return [];
  }
}