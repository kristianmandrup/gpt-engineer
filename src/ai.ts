import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: string;
  content: string;
}

export class AI {
  private client: any;
  private kwargs: Record<string, any>;

  constructor(kwargs: Record<string, any>) {
    this.client = new OpenAIApi(configuration);
    this.kwargs = kwargs;
  }

  public start(system: string, user: string): Promise<Message[]> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    return this.next(messages);
  }

  public fsystem(msg: string): Message {
    return { role: "system", content: msg };
  }

  public fuser(msg: string): Message {
    return { role: "user", content: msg };
  }

  public async next(messages: Message[], prompt?: string): Promise<Message[]> {
    if (prompt) {
      messages = messages.concat([{ role: "user", content: prompt }]);
    }

    const response = await this.client.chatCompletion.create({
      messages: messages,
      ...this.kwargs,
    });

    const chat: string[] = [];
    for (const chunk of response.choices) {
      const delta = chunk?.message?.content ?? "";
      console.log(delta);
      chat.push(delta);
    }

    return messages.concat([{ role: "assistant", content: chat.join("") }]);
  }
}
