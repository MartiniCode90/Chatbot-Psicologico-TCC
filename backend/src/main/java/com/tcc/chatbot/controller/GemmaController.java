package com.tcc.chatbot.controller;


import com.tcc.chatbot.dto.ChatRequest;
import com.tcc.chatbot.dto.ChatResponse;
import com.tcc.chatbot.service.GemmaService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "*")
public class GemmaController {

    private final GemmaService gemmaService;

    public GemmaController(GemmaService gemmaService) {
        this.gemmaService = gemmaService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ChatResponse> generateText(@RequestBody ChatRequest request) {
        String resposta = gemmaService.generateText(request.prompt());
        return ResponseEntity.ok(new ChatResponse(resposta));
    }
}