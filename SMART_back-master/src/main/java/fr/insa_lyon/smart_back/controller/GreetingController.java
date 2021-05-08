package fr.insa_lyon.smart_back.controller;

import fr.insa_lyon.smart_back.model.Greeting;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class GreetingController { //Controller de Greeting qui va gérer les requêtes GET
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @GetMapping("/greeting") //Requête sur /greeting sont mappée sur la méthode greeting
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World")String name) { //RequestParam pour gérer les params de la requête --> dans le name de la méthode
        return new Greeting(counter.incrementAndGet(), String.format(template, name)); // remplacement du %s et directement transformer en format JSON pour la réponse grace a Jackson 2
    }
}
