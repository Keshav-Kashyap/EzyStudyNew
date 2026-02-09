# 🤖 AI Assistant Setup Guide

## Free AI Model Integration

Your AI Assistant is now ready to use with **FREE AI models**! Choose one of these providers:

---

## 🚀 Recommended: Groq API (Fastest & Easiest)

### Why Groq?
- ⚡ **Super Fast** - 10x faster than other providers
- 💰 **100% Free** - Generous free tier
- 🎯 **Easy Setup** - Just 2 steps
- 🧠 **Powerful Models** - Llama 3.3 70B, Mixtral 8x7B

### Setup Steps:

1. **Get Free API Key**
   - Visit: https://console.groq.com
   - Sign up (it's free!)
   - Go to API Keys section
   - Create new key

2. **Add to Your Project**
   - Create/edit `.env.local` file in project root:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_your_key_here
   ```

3. **Restart Dev Server**
   ```bash
   npm run dev
   ```

✅ Done! Your AI Assistant is now powered by Groq!

---

## 🌟 Alternative: Google Gemini (Google's Free AI)

### Why Gemini?
- 🎁 **Free Forever** - Google's generous free tier
- 🧠 **Latest AI** - Gemini 1.5 Flash
- 📚 **Great for Education** - Excellent at explaining concepts

### Setup Steps:

1. **Get Free API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Get API Key"
   - Create new project or use existing
   - Copy your key

2. **Configure**
   ```env
   AI_PROVIDER=gemini
   GOOGLE_AI_API_KEY=AIza_your_key_here
   ```

3. **Restart**
   ```bash
   npm run dev
   ```

---

## 🤗 Alternative: Hugging Face (Open Source)

### Setup Steps:

1. **Get Token**
   - Visit: https://huggingface.co/settings/tokens
   - Create new token (read access)

2. **Configure**
   ```env
   AI_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

---

## 📝 Complete .env.local Example

Create this file in your project root:

```env
# Choose one provider (groq, gemini, or huggingface)
AI_PROVIDER=groq

# Groq API (Recommended)
GROQ_API_KEY=gsk_your_groq_key_here

# Google Gemini (Alternative)
# GOOGLE_AI_API_KEY=AIza_your_gemini_key_here

# Hugging Face (Alternative)
# HUGGINGFACE_API_KEY=hf_your_token_here
```

---

## 🎯 Quick Start (No API Key)

The AI Assistant works immediately in **demo mode**. It will show a mock response and guide you to set up a real AI model.

To enable real AI:
1. Choose a provider above
2. Get free API key
3. Add to `.env.local`
4. Restart server

---

## 💡 Available Models by Provider

### Groq Models:
- `llama-3.3-70b-versatile` (Default - Best balance)
- `llama-3.1-8b-instant` (Faster, lighter)
- `mixtral-8x7b-32768` (Long context)

### Gemini Models:
- `gemini-1.5-flash` (Default - Fast & free)
- `gemini-pro` (More capable)

### Hugging Face Models:
- `Mistral-7B-Instruct-v0.2` (Default)
- Many others available!

---

## 🔧 Troubleshooting

### "API Key not configured"
- Make sure `.env.local` exists in project root
- Check variable names match exactly
- Restart your dev server

### "API Error"
- Verify your API key is valid
- Check your internet connection
- Try the fallback provider

### Still not working?
- The app will fallback to demo mode
- Check browser console for detailed errors
- Verify API provider status

---

## 📊 Rate Limits (Free Tier)

### Groq:
- 30 requests per minute
- 14,400 requests per day

### Google Gemini:
- 60 requests per minute
- 1500 requests per day

### Hugging Face:
- 1000 requests per day

---

## ✨ Features of New AI Sidebar

- 💬 **Beautiful Chat Interface** - Modern, professional design
- 🎨 **Context-Aware** - Different modes for different subjects
- 📋 **Copy Messages** - One-click copy
- 🗑️ **Clear Chat** - Start fresh anytime
- 📱 **Responsive** - Works on all screen sizes
- 🎭 **User Avatars** - Visual distinction between you and AI
- ⚡ **Typing Indicator** - See when AI is thinking
- 🔄 **Auto-scroll** - Always see the latest message
- 💾 **Conversation History** - Context maintained across messages

---

## 🎓 Perfect for Students!

The AI Assistant can help with:
- ✅ Homework questions
- ✅ Concept explanations
- ✅ Study tips
- ✅ Practice problems
- ✅ Research assistance
- ✅ Code help
- ✅ Essay feedback

---

## 📞 Need Help?

The AI is now production-ready! Just add your free API key and you're good to go.

**Recommended:** Start with Groq - it's the fastest and easiest to set up!
