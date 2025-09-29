# Claude AI Integration Setup

This document explains how to set up and use the Claude AI integration for schedule analysis in the Graafik application.

## Overview

The Claude AI integration provides intelligent analysis of Schedule objects, offering feedback on:
- Work distribution among employees
- Schedule balance and optimization
- Score assessment and suggestions
- Workload recommendations

## Setup Instructions

### 1. Get Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key

### 2. Configure Backend

Set your Claude API key as an environment variable:

```bash
# Windows
set CLAUDE_API_KEY=your_claude_api_key_here

# Linux/macOS
export CLAUDE_API_KEY=your_claude_api_key_here

# Or add to your .env file
echo "CLAUDE_API_KEY=your_claude_api_key_here" >> .env
```

### 3. Build and Run

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd web-app
npm install
npm run dev
```

## Usage

### Frontend Integration

1. Navigate to any schedule view in your web application
2. Look for the "AI Schedule Analysis" panel at the top of the schedule
3. Click "Get AI Analysis" button
4. Wait for Claude to analyze the schedule and provide feedback

### API Endpoints

**Analyze Schedule**
```
POST /api/schedules/{id}/analyze
```

Response:
```json
{
  "analysis": "Claude's detailed feedback about the schedule..."
}
```

### Code Structure

**Backend Components:**
- `ClaudeAnalysisService.java` - Main service for Claude API integration
- `ScheduleController.java` - REST endpoints (added analysis endpoint)
- `application.properties` - Configuration for Claude API

**Frontend Components:**
- `ai-analysis-panel.tsx` - UI component for displaying AI analysis
- `schedule-grid-view.tsx` - Updated to include AI analysis panel
- `ScheduleResponse.ts` - Updated interface to include schedule ID

## Analysis Features

Claude analyzes schedules based on:
- **Worker hour distribution** - Checks for balanced workload
- **Schedule efficiency** - Identifies optimization opportunities
- **Score validation** - Assesses if the current score is reasonable
- **Improvement suggestions** - Actionable recommendations

## Troubleshooting

**No Analysis Button:**
- Ensure schedule has a valid ID
- Check that the schedule is loaded correctly

**Analysis Fails:**
- Verify CLAUDE_API_KEY environment variable is set
- Check backend logs for API errors
- Ensure you have Claude API credits

**Empty Analysis:**
- Check network connectivity
- Verify Claude API key has proper permissions
- Check backend service logs

## Security Notes

- Never commit API keys to version control
- Use environment variables for API keys
- Consider using a secrets management system in production
- Monitor API usage and costs

## Cost Considerations

- Claude API charges per token (input + output)
- Schedule analysis typically uses 500-1000 tokens
- Monitor usage through Anthropic Console
- Consider caching analysis results to reduce API calls