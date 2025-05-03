package com.tcc.chatbot.service;

import com.tcc.chatbot.model.ChatMessage;
import com.tcc.chatbot.repository.ChatMessageRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import java.util.Map;
import java.util.HashMap;

@Service
public class GemmaService {

    private static final Logger log = LoggerFactory.getLogger(GemmaService.class);

    @Value("${spring.ai.ollama.model}")
    private String model;

    @Value("${spring.ai.ollama.base-url}")
    private String url;

    private final RestTemplate restTemplate;
    private final ChatMessageRepository chatMessageRepository;

    public GemmaService(RestTemplate restTemplate,
                        ChatMessageRepository chatMessageRepository) {
        this.restTemplate = restTemplate;
        this.chatMessageRepository = chatMessageRepository;
    }

    public String generateText(String prompt) {
        log.info("Iniciando processamento da pergunta: '{}'", prompt);

        try {
            Map<String, Object> req = new HashMap<>();
            req.put("model", model);
            req.put("prompt", prompt);
            req.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String,Object>> requestEntity = new HttpEntity<>(req, headers);

            log.debug("Enviando requisição para URL: {}", url + "/generate");
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url + "/api/generate", requestEntity, Map.class);

            log.debug("Resposta recebida com status HTTP: {}", response.getStatusCode());

            if (response.getBody() != null && response.getBody().containsKey("response")) {
                String resposta = response.getBody().get("response").toString();
                log.info("Resposta obtida com sucesso para a pergunta: '{}'", prompt);
                chatMessageRepository.save(new ChatMessage(prompt, resposta));
                return resposta;
            }

            log.warn("Resposta obtida sem o campo 'response': {}", response.getBody());
            return "Erro ao obter resposta do chatbot.";

        } catch (HttpClientErrorException e) {
            log.error("Erro de cliente HTTP: {} - {}", e.getStatusCode(), e.getMessage());
            return "Erro ao comunicar com o modelo: " + e.getMessage();
        } catch (HttpServerErrorException e) {
            log.error("Erro do servidor Ollama: {} - {}", e.getStatusCode(), e.getMessage());
            return "Serviço do chatbot indisponível no momento. Tente novamente mais tarde.";
        } catch (ResourceAccessException e) {
            log.error("Erro de conexão ou timeout: {}", e.getMessage());
            return "Não foi possível conectar ao serviço do chatbot. Verifique a conexão.";
        } catch (Exception e) {
            log.error("Erro inesperado ao processar a requisição: ", e);
            return "Erro ao obter resposta do chatbot.";
        }
    }
}
