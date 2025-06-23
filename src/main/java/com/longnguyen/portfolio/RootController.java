package com.longnguyen.portfolio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public String home() {
        return "Backend is running!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}

