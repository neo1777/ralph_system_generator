# API Technical Specifications (Jan 2026)

## 1. Google Gemini 3 API
**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-pro:generateContent`
**Auth**: Header `x-goog-api-key: ${GEMINI_API_KEY}`

### JSON Payload
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your prompt here..." }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 8192,
    "responseMimeType": "text/plain" 
  }
}
```
*Note: Use `responseMimeType: "application/json"` for JSON mode.*

## 2. Anthropic Messages API
**Endpoint**: `https://api.anthropic.com/v1/messages`
**Auth**: Header `x-api-key: ${ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`

### JSON Payload
```json
{
  "model": "claude-4-5-opus-20251201",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here..."
    }
  ]
}
```

## 3. OpenAI Chat Completions API
**Endpoint**: `https://api.openai.com/v1/chat/completions`
**Auth**: Header `Authorization: Bearer ${OPENAI_API_KEY}`

### JSON Payload
```json
{
  "model": "gpt-5.2-codex-preview",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful coding assistant."
    },
    {
      "role": "user",
      "content": "Your prompt here..."
    }
  ],
  "temperature": 0.7,
  "stream": false,
  "response_format": { "type": "json_object" }
}
```

## 4. DeepSeek API (OpenAI Compatible)
**Endpoint**: `https://api.deepseek.com/v1/chat/completions`
**Auth**: Header `Authorization: Bearer ${DEEPSEEK_API_KEY}`

### JSON Payload
*Same as OpenAI above.*
```json
{
  "model": "deepseek-chat-v3",
  "messages": [...]
}
```
