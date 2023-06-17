# GPT Engineer
**Specify what you want it to build, the AI asks for clarification, and then builds it.**

GPT Engineer is made to be easy to adapt, extend, and make your agent learn how you want your code to look. It generates an entire codebase based on a prompt. 

## Project philosophy
- Simple to get value
- Flexible and easy to add new own "AI steps". See `steps.py`.
- Incrementally build towards a user experience of:
  1. high level prompting
  2. giving feedback to the AI that it will remember over time
- Fast handovers back and forth between AI and human
- Simplicity, all computation is "resumable" and persisted to the filesystem



![output](https://github.com/AntonOsika/gpt-engineer/assets/4467025/a6938d43-2ac1-4cf1-98d1-93eea1bdfce4)

## Usage NodeJS/TypeScript (WIP)

### Configuration

Set environment variable `OPENAI_API_KEY` to your OpenAI API Key. 
This can f.ex be done simply by supplying it in a `.env` file.
A sample `.env.example` file is included in the repo which just needs to be renamed.

Please make sure that the `.env` file is in `.gitignore` so it is not copied to any git repo. 

### Run CLI command

Run CLI via tsnode:

`npx ts-node src/main.ts chat --help` 

Currently the error is:

```bash
npx ts-node src/main.ts chat --help
Need to install the following packages:
  ts-node@10.9.1
Ok to proceed? (y) y
Error: ENOENT: no such file or directory, mkdir '/path/to/memory'
    at Object.mkdirSync (node:fs:1395:3)
    at new DB (/Users/kristian/repos/personal/ai-projects/gpt-engineer/src/db.ts:9:8)
    at Object.<anonymous> (/Users/kristian/repos/personal/ai-projects/gpt-engineer/src/db.ts:32:11)
```

## Usage Python

**Setup**:
- `pip install -r requirements.txt`
- `export OPENAI_API_KEY=[your api key]` with a key that has GPT4 access

**Run**:
- Create a new empty folder with a `main_prompt` file (or copy the example folder `cp -r example/ my-new-project`)
- Fill in the `main_prompt` in your new folder
- Run `python -m gpt_engineer.main my-new-project`

**Results**:
- Check the generated files in my-new-project/workspace

### Limitations
Implementing additional chain of thought prompting, e.g. [Reflexion](https://github.com/noahshinn024/reflexion), should be able to make it more reliable and not miss requested functionality in the main prompt.

Contributors welcome! If you are unsure what to add, check out the ideas listed in the Projects tab in the GitHub repo.


## Features
You can specify the "identity" of the AI agent by editing the files in the `identity` folder.

Editing the identity, and evolving the main_prompt, is currently how you make the agent remember things between projects.

Each step in steps.py will have its communication history with GPT4 stored in the logs folder, and can be rerun with scripts/rerun_edited_message_logs.py.


## High resolution example

https://github.com/AntonOsika/gpt-engineer/assets/4467025/6e362e45-4a94-4b0d-973d-393a31d92d9b
