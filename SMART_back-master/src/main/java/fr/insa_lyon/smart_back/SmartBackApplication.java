package fr.insa_lyon.smart_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@SpringBootApplication
public class SmartBackApplication {

    public static void main(String[] args) {
        //String p = "monsuperpassword";
        SpringApplication.run(SmartBackApplication.class, args);
    }

}
