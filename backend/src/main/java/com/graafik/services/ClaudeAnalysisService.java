package com.graafik.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.Schedule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class ClaudeAnalysisService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${claude.api.key:}")
    private String apiKey;

    @Value("${claude.api.url:https://api.anthropic.com/v1/messages}")
    private String apiUrl;

    public ClaudeAnalysisService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public Mono<String> analyzeSchedule(Schedule schedule) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return Mono.just("Claude API key not configured. Please set claude.api.key in application.properties");
        }

        String prompt = buildScheduleAnalysisPrompt(schedule);

        Map<String, Object> requestBody = Map.of(
            "model", "claude-3-5-sonnet-20241022",
            "max_tokens", 1000,
            "messages", new Object[]{
                Map.of("role", "user", "content", prompt)
            }
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractContentFromResponse)
                .onErrorReturn("Failed to analyze schedule. Please check your Claude API configuration.");
    }

    private String buildScheduleAnalysisPrompt(Schedule schedule) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Please analyze this work schedule and provide constructive feedback:\n\n");
        prompt.append("**Schedule Details:**\n");
        prompt.append("- Month/Year: ").append(schedule.getMonth()).append("/").append(schedule.getYear()).append("\n");
        prompt.append("- Overall Score: ").append(schedule.getScore()).append("\n");
        prompt.append("- Number of Days: ").append(schedule.getDaySchedules() != null ? schedule.getDaySchedules().size() : 0).append("\n");

        if (schedule.getWorkerHours() != null && !schedule.getWorkerHours().isEmpty()) {
            prompt.append("- Worker Hours Distribution:\n");
            schedule.getWorkerHours().forEach((workerId, hours) ->
                prompt.append("  - Worker ").append(workerId).append(": ").append(hours).append(" hours\n"));
        }

        prompt.append("\n**Please provide analysis on:**\n");
        prompt.append("1. **Work Distribution**: How evenly are hours distributed among workers?\n");
        prompt.append("2. **Schedule Balance**: Are there any potential issues with workload balance?\n");
        prompt.append("3. **Optimization Suggestions**: What improvements could be made?\n");
        prompt.append("4. **Score Assessment**: Is the current score of ").append(schedule.getScore()).append(" reasonable?\n");
        prompt.append("\nKeep the response concise and actionable (max 3 paragraphs).");

        return prompt.toString();
    }

    private String extractContentFromResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode content = jsonNode.path("content");
            if (content.isArray() && content.size() > 0) {
                return content.get(0).path("text").asText();
            }
            return "Unable to parse Claude response";
        } catch (Exception e) {
            return "Error parsing Claude response: " + e.getMessage();
        }
    }
}