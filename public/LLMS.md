# Public AI Gateway - API Documentation for LLM Agents

This document provides static, text-based API documentation for AI agents and automated systems.

**Interactive documentation**: https://platform.publicai.co  
**Base API URL**: `https://api.publicai.co`

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Available Models](#available-models)
4. [API Endpoints](#api-endpoints)
5. [Request Examples](#request-examples)
6. [Rate Limits](#rate-limits)
7. [Error Handling](#error-handling)

## Quick Start

### Get an API Key

1. Sign up at https://platform.publicai.co
2. Navigate to Account → Billing
3. Go to API Keys and create a new key
4. Store your API key securely

New accounts receive $2 of free starter credit.

### Make Your First Request

```bash
curl -X POST https://api.publicai.co/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0" \
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Authentication

All API requests require two headers:

1. **Authorization Header** (required):
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **User-Agent Header** (required):
   ```
   User-Agent: YourApp/1.0
   ```

The User-Agent header helps prevent bot spamming and is required for all requests.

## Available Models

The Public AI Gateway provides OpenAI-compatible access to multiple open-source models from public inference providers.

### Model ID Format

Model IDs use the format: `provider/model-name`

### Current Models

- **swiss-ai/apertus-v1.5-8b** - Swiss AI's Apertus model (128K context)
- **allenai/Olmo-3-7B-Instruct** - Allen AI's Olmo 3 (128K context)
- **aisingapore/Gemma-SEA-LION-v4-27B-IT** - AISingapore's SEA-LION model
- **speakleash/Bielik-11B-v2.3-Instruct** - Polish language model
- And more...

### List Available Models Programmatically

```bash
curl -X GET https://api.publicai.co/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0"
```

**Response Format**:
```json
{
  "object": "list",
  "data": [
    {
      "id": "swiss-ai/apertus-v1.5-8b",
      "object": "model",
      "created": 1677610602,
      "owned_by": "swiss-ai",
      "pricing": {
        "input": 0.1,
        "output": 0.2
      },
      "context_length": 128000
    }
  ]
}
```

Each model entry includes:
- `id`: Model identifier
- `owned_by`: Organization providing the model
- `pricing`: Cost per million tokens (input/output) in USD
- `context_length`: Maximum context window in tokens

## API Endpoints

### 1. List Models

**Endpoint**: `GET /v1/models`

**Description**: Returns a list of all available models with pricing and context length information.

**Required Headers**:
- `Authorization: Bearer YOUR_API_KEY`
- `User-Agent: YourApp/1.0`

**Response**: Array of model objects with id, pricing, and context_length.

### 2. Chat Completions

**Endpoint**: `POST /v1/chat/completions`

**Description**: Creates a model response for the given chat conversation. This is the primary endpoint for text generation.

**Required Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_API_KEY`
- `User-Agent: YourApp/1.0`

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g., "swiss-ai/apertus-v1.5-8b") |
| `messages` | array | Yes | Array of message objects with `role` and `content` |
| `temperature` | number | No | Sampling temperature (0-2), default varies by model |
| `top_p` | number | No | Nucleus sampling parameter (0-1) |
| `max_tokens` | integer | No | Maximum tokens to generate |
| `stream` | boolean | No | Stream partial message deltas (default: false) |
| `stop` | string/array | No | Up to 4 stop sequences |
| `presence_penalty` | number | No | Penalty for token presence (-2.0 to 2.0) |
| `frequency_penalty` | number | No | Penalty for token frequency (-2.0 to 2.0) |
| `tools` | array | No | List of available tools/functions |
| `tool_choice` | string/object | No | Tool selection strategy |
| `n` | integer | No | Number of completions to generate |
| `user` | string | No | Unique end-user identifier |

**Message Object Format**:
```json
{
  "role": "user|assistant|system|tool",
  "content": "message text"
}
```

For vision models, `content` can be an array:
```json
{
  "role": "user",
  "content": [
    {"type": "text", "text": "What's in this image?"},
    {"type": "image_url", "image_url": {"url": "https://..."}}
  ]
}
```

**Response Format**:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1757652946,
  "model": "swiss-ai/apertus-v1.5-8b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response text here"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 63,
    "completion_tokens": 19,
    "total_tokens": 82
  }
}
```

**Finish Reasons**:
- `stop`: Natural completion
- `length`: Max tokens reached
- `tool_calls`: Model called a tool
- `content_filter`: Content filtered
- `function_call`: Deprecated function call

### 3. Text Completions

**Endpoint**: `POST /v1/completions`

**Description**: Creates a completion for the provided prompt (non-chat format).

**Headers**: Same as chat completions

**Request Parameters**: Similar to chat completions but uses `prompt` instead of `messages`.

## Request Examples

### Basic Chat Request

```bash
curl -X POST https://api.publicai.co/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0" \
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in simple terms"}
    ]
  }'
```

### Chat with System Prompt

```bash
curl -X POST https://api.publicai.co/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0" \
  -d '{
    "model": "allenai/Olmo-3-7B-Instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Write a Python function to calculate fibonacci"}
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }'
```

### Streaming Request

```bash
curl -X POST https://api.publicai.co/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0" \
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'
```

### Multi-turn Conversation

```bash
curl -X POST https://api.publicai.co/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "User-Agent: YourApp/1.0" \
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
      {"role": "user", "content": "What is machine learning?"},
      {"role": "assistant", "content": "Machine learning is a subset of AI..."},
      {"role": "user", "content": "Can you give me an example?"}
    ]
  }'
```

### Python Example

```python
import requests

url = "https://api.publicai.co/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY",
    "User-Agent": "MyPythonApp/1.0"
}
data = {
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### Node.js Example

```javascript
const fetch = require('node-fetch');

async function chat() {
  const response = await fetch('https://api.publicai.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY',
      'User-Agent': 'MyNodeApp/1.0'
    },
    body: JSON.stringify({
      model: 'swiss-ai/apertus-v1.5-8b',
      messages: [
        {role: 'user', content: 'Hello!'}
      ]
    })
  });
  
  const data = await response.json();
  console.log(data);
}

chat();
```

## Rate Limits

Rate limits depend on your plan tier:

### Free Tier
- $2 starter credit
- Basic rate limits
- Best for testing and small projects

### Plus Tier
- $10/month via OpenCollective
- Increased rate limits
- Priority support

### Pro Tier
- $100/month
- Higher rate limits
- Advanced features

### Enterprise Tier
- Custom pricing
- Custom rate limits
- Dedicated support
- SLA guarantees

Check your current usage and remaining balance at: https://platform.publicai.co/account/billing

## Error Handling

### Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid or missing API key
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error
- `503`: Service Unavailable - Model temporarily unavailable

### Error Response Format

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### Common Errors

1. **Missing User-Agent**: Ensure you always include a User-Agent header
2. **Invalid API Key**: Check that your API key is correct and not expired
3. **Model Not Found**: Verify the model ID with `GET /v1/models`
4. **Rate Limit**: Upgrade your plan or wait for rate limit reset
5. **Context Length Exceeded**: Reduce message history or max_tokens

## OpenAI Compatibility

The Public AI Gateway is designed to be OpenAI-compatible, meaning you can use it as a drop-in replacement:

```python
# Using OpenAI Python SDK
from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_API_KEY",
    default_headers={"User-Agent": "MyApp/1.0"}
)

response = client.chat.completions.create(
    model="swiss-ai/apertus-v1.5-8b",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Model Selection Guide

- **General Purpose**: `swiss-ai/apertus-v1.5-8b` - Fast, efficient, multilingual
- **Research/Academic**: `allenai/Olmo-3-7B-Instruct` - Open research model
- **Southeast Asian Languages**: `aisingapore/Gemma-SEA-LION-v4-27B-IT` - Optimized for regional languages
- **Polish Language**: `speakleash/Bielik-11B-v2.3-Instruct` - Specialized for Polish

Always check the latest models and pricing with `GET /v1/models`.

## Best Practices

1. **Always include User-Agent**: Required to prevent abuse
2. **Handle rate limits**: Implement exponential backoff
3. **Use appropriate temperature**: Lower (0.1-0.3) for factual, higher (0.7-1.0) for creative
4. **Set max_tokens**: Prevent runaway costs
5. **Store API keys securely**: Never commit to version control
6. **Monitor usage**: Check billing dashboard regularly
7. **Use streaming for long responses**: Better user experience
8. **Implement error handling**: Gracefully handle API errors

## Support and Resources

- **Interactive Docs**: https://platform.publicai.co
- **API Reference**: https://platform.publicai.co/api
- **Chat Interface**: https://chat.publicai.co
- **GitHub**: https://github.com/forpublicai
- **Website**: https://publicai.co
- **Support**: Create an issue on GitHub

## About Public AI

Public AI is a global compute platform that provides free and low-cost access to state-of-the-art AI models. Built on principles of openness, accessibility, and democratic governance, the Public AI Inference Utility serves as critical infrastructure for the AI ecosystem.

Unlike commercial AI APIs that prioritize profit maximization, the Utility is designed to serve the public interest with transparent pricing, open governance, and equitable access.

## Terms and Privacy

View our terms of service and privacy policy at: https://publicai.co/tc

---

*Last updated: October 2026*
*This is a static version of the API documentation for AI agents and automated systems.*
*For the interactive version, visit https://platform.publicai.co*
