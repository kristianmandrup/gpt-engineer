import OpenAI from 'openai';

interface Message {
  role: string;
  content: string;
}

class AI {
  private client: any;
  private kwargs: Record<string, any>;

  constructor(kwargs: Record<string, any>) {
    this.client = new OpenAI({ /* API credentials and options */ });
    this.kwargs = kwargs;
  }

  public start(system: string, user: string): Promise<Message[]> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    return this.next(messages);
  }

  private fsystem(msg: string): Message {
    return { role: "system", content: msg };
  }

  private fuser(msg: string): Message {
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
