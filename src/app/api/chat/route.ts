// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemContext = `
      Você é o EasyGov, um Consultor de Cibersegurança e Governança da EASYLAN. 
      Sua especialidade é ISO 27001, NIST CSF, ISO 31000 e COSO.
      Responda de forma profissional, direta e técnica em Português (Brasil).
      Sempre cite controles específicos de frameworks quando sugerir melhorias.
    `;

    const result = await model.generateContent(`${systemContext}\n\nPergunta do Cliente: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    return Response.json({ text });
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    return Response.json({ text: "Desculpe, a IA da EasyGov está temporariamente fora do ar. Verifique se a GEMINI_API_KEY foi configurada." }, { status: 500 });
  }
}