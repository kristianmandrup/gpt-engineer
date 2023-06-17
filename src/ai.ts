import { Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessage, CreateChatCompletionResponse } from "openai";
import 'dotenv/config'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export class AI {
  private client: any;
  private kwargs: Record<string, any>;

  constructor(kwargs: Record<string, any>) {
    console.log('configure OpenAIAPI with', configuration)
    this.client = new OpenAIApi(configuration);
    this.kwargs = kwargs;
  }

  public start(system: string, user: string): Promise<ChatCompletionRequestMessage[]> {
    const messages: ChatCompletionRequestMessage[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    return this.next(messages);
  }

  public fsystem(msg: string): ChatCompletionRequestMessage {
    return { role: "system", content: msg };
  }

  public fuser(msg: string): ChatCompletionRequestMessage {
    return { role: "user", content: msg };
  }

  public async next(messages: ChatCompletionRequestMessage[], prompt?: string): Promise<ChatCompletionRequestMessage[]> {
    if (prompt) {
      messages = messages.concat([{ role: "user", content: prompt }]);
    }
    console.log('next', {messages, prompt})
    console.log('call OpenAIAPI');
    let response: CreateChatCompletionResponse
    try {
      const chatRequest: CreateChatCompletionRequest = {
        messages: messages,
        model: this.kwargs.model,
        ...this.kwargs,
      }

       response = await this.client.createChatCompletion(chatRequest);  
    } catch (ex) {
      console.error(ex);
      throw ex;
    }

    const chat: string[] = [];
    for (const chunk of response.choices) {
      const delta = chunk?.message?.content ?? "";
      console.log(delta);
      chat.push(delta);
    }

    return messages.concat([{ role: "assistant", content: chat.join("") }]);
  }
}
